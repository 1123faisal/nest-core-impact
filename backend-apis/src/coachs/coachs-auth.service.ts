import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as moment from 'moment';
import { Model, ObjectId } from 'mongoose';
import * as otpGenerator from 'otp-generator';
import { Password } from 'src/common/password';
import { S3Provider } from 'src/providers/s3.provider';
import { AuthResponse } from './dto/auth-response.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { SendForgotPasswordOTPDto } from './dto/send-forgot-password-otp.dto';
import { UpdateForgotPasswordDto } from './dto/update-forget-password.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { CoachSignUpDto } from './dto/user-signup.dto';
import { VerifyForgotPasswordOTPDto } from './dto/verify-forgot-password-otp.dto';
import { Coach } from './entities/coach.entity';
import { EmailProvider } from 'src/providers/email.provider';

@Injectable()
export class CoachsAuthService {
  constructor(
    @InjectModel(Coach.name) private readonly coachModel: Model<Coach>,
    private jwtService: JwtService,
    private s3Provider: S3Provider,
    private emailProvider: EmailProvider,
  ) {}

  private getJwtToken(userId: string | ObjectId) {
    return this.jwtService.sign({ id: userId });
  }

  async getProfile(userId: string): Promise<Coach> {
    const user = await this.coachModel.findById(userId).exec();

    if (!user) {
      throw new NotFoundException('no user found');
    }

    return user;
  }

  async userSignUp(userSignUpDto: CoachSignUpDto): Promise<AuthResponse> {
    const createdUser = new this.coachModel({
      name: userSignUpDto.name,
      email: userSignUpDto.email,
      password: userSignUpDto.password,
    });

    const user = await createdUser.save();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, __v, otp, otpExpiration, ...result } = user.toJSON();

    return {
      ...result,
      token: this.getJwtToken(user.id),
    };
  }

  async validateUser(
    email: string,
    pass: string,
  ): Promise<{ user?: Coach; passIsValid: boolean }> {
    const user = await this.coachModel.findOne({ email });

    if (!user) {
      return { user: undefined, passIsValid: false };
    }

    const isMatched = await Password.comparePassword(pass, user?.password);

    return { user, passIsValid: isMatched };
  }

  async findUser(condition: Record<string, any>): Promise<Coach> {
    const user = await this.coachModel.findOne(condition);
    if (user) return user;
    return null;
  }

  async login(user: any): Promise<AuthResponse> {
    const payload = { email: user.email, id: user.id };

    const existingUser = await this.coachModel.findById(user.id);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, __v, otp, otpExpiration, ...result } =
      existingUser.toJSON();

    return {
      ...result,
      token: this.jwtService.sign(payload),
    };
  }

  async sendOtp(
    sendForgotPasswordOTPDto: SendForgotPasswordOTPDto,
  ): Promise<void> {
    const user = await this.coachModel
      .findOne({ email: sendForgotPasswordOTPDto.email })
      .exec();

    if (!user) {
      throw new NotFoundException('Email Id does not exist in our records');
    }

    // Generate OTP
    const otp = otpGenerator.generate(4, {
      digits: true,
      lowerCaseAlphabets: false,
      specialChars: false,
      upperCaseAlphabets: false,
    });
    const otpExpiration = new Date(Date.now() + 1 * 60 * 1000); // 1 minute from now

    user.otp = await Password.hashPassword(otp);
    user.otpExpiration = otpExpiration;

    const isSent = await this.emailProvider.sentForgotPasswordEmail(
      user.email,
      otp,
    );

    if (!isSent) {
      throw new ServiceUnavailableException('email service is temporary down');
    }

    await user.save();
  }

  async resendOTP(
    sendForgotPasswordOTPDto: SendForgotPasswordOTPDto,
  ): Promise<void> {
    const user = await this.coachModel
      .findOne({ email: sendForgotPasswordOTPDto.email })
      .exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if the previous OTP has expired
    if (user.otpExpiration && moment().isBefore(user.otpExpiration)) {
      throw new ConflictException('Previous OTP is still valid');
    }

    // Generate a new OTP and set the expiration time
    const otp = otpGenerator.generate(4, {
      digits: true,
      lowerCaseAlphabets: false,
      specialChars: false,
      upperCaseAlphabets: false,
    });
    const otpExpiration = moment().add(1, 'minute').toDate();

    // Update the user document with the new OTP and expiration time
    user.otp = await Password.hashPassword(otp);
    user.otpExpiration = otpExpiration;

    const isSent = await this.emailProvider.sentForgotPasswordEmail(
      user.email,
      otp,
    );

    if (!isSent) {
      throw new ServiceUnavailableException('email service is temporary down');
    }

    await user.save();
  }

  async verifyOtp(
    verifyForgotPasswordOTPDto: VerifyForgotPasswordOTPDto,
  ): Promise<boolean> {
    const user = await this.coachModel
      .findOne({ email: verifyForgotPasswordOTPDto.email })
      .exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (
      !(await Password.comparePassword(
        verifyForgotPasswordOTPDto.otp,
        user.otp,
      ))
    ) {
      throw new BadRequestException('Invalid OTP');
    }

    if (user.otpExpiration < new Date()) {
      throw new BadRequestException('OTP expired');
    }

    return true;
  }

  async updatePassword(
    updateForgotPasswordDto: UpdateForgotPasswordDto,
  ): Promise<void> {
    const user = await this.coachModel
      .findOne({ email: updateForgotPasswordDto.email })
      .exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (
      !(await Password.comparePassword(updateForgotPasswordDto.otp, user.otp))
    ) {
      throw new BadRequestException('Invalid OTP');
    }

    user.password = updateForgotPasswordDto.confirmPassword;
    user.otp = undefined;
    user.otpExpiration = undefined;
    await user.save();
  }

  async changePassword(
    changePasswordDto: ChangePasswordDto,
    userId: string,
  ): Promise<void> {
    const user = await this.coachModel.findById(userId).exec();

    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (
      !(await Password.comparePassword(
        changePasswordDto.oldPassword,
        user.password,
      ))
    ) {
      throw new BadRequestException('incorrect old password');
    }

    user.password = changePasswordDto.confirmPassword;
    await user.save();
  }

  async updateProfile(
    updateProfileDto: UpdateProfileDto,
    userId: string,
  ): Promise<Record<string, any>> {
    const user = await this.coachModel.findOne({ _id: userId }).exec();

    if (!user) {
      throw new NotFoundException('no user found');
    }

    if (updateProfileDto.avatar) {
      updateProfileDto.avatar = await this.s3Provider.uploadFileToS3(
        updateProfileDto.avatar,
      );
    }

    const updatedUser = await this.coachModel.findByIdAndUpdate(
      user.id,
      updateProfileDto,
      {
        new: true,
      },
    );

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, __v, otp, otpExpiration, ...result } =
      updatedUser.toJSON();

    return result;
  }
}
