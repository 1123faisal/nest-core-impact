import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as moment from 'moment';
import { Model, ObjectId } from 'mongoose';
import * as otpGenerator from 'otp-generator';
import { S3Provider } from 'src/providers/s3.provider';
import { Password } from '../common/password';
import { AuthResponse } from './dto/auth-response.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { OrgSettingDto } from './dto/org-db-setting.dto';
import { SendForgotPasswordOTPDto } from './dto/send-forgot-password-otp.dto';
import { UpdateForgotPasswordDto } from './dto/update-forget-password.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { OrgUserSignUpDto } from './dto/user-signup.dto';
import { VerifyForgotPasswordOTPDto } from './dto/verify-forgot-password-otp.dto';
import { OrgUser } from './entities/org-user.entity';
import { OrgSetting } from './entities/settings.entity';
import { AthletesService } from 'src/athlets/athletes.service';
import { CoachsService } from 'src/coachs/coachs.service';

@Injectable()
export class OrgUsersService {
  constructor(
    @InjectModel(OrgUser.name) private readonly orgUserModel: Model<OrgUser>,
    @InjectModel(OrgSetting.name) private readonly Setting: Model<OrgSetting>,
    private jwtService: JwtService,
    private readonly s3Provider: S3Provider,
    private athleteService: AthletesService,
    private coachService: CoachsService,
  ) {}

  private getJwtToken(userId: string | ObjectId) {
    return this.jwtService.sign({ id: userId });
  }

  async getProfile(userId: string): Promise<OrgUser> {
    const user = await this.orgUserModel.findById(userId).exec();

    if (!user) {
      throw new NotFoundException('no user found');
    }

    return user;
  }

  async userSignUp(userSignUpDto: OrgUserSignUpDto): Promise<AuthResponse> {
    const createdUser = new this.orgUserModel({
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

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.orgUserModel.findOne({ email });

    if (!user) {
      return null;
    }

    const isMatched = await Password.comparePassword(pass, user?.password);

    if (isMatched) {
      return user;
    }

    return null;
  }

  async findUser(condition: Record<string, any>): Promise<OrgUser> {
    const user = await this.orgUserModel.findOne(condition);
    if (user) return user;
    return null;
  }

  async login(user: any): Promise<AuthResponse> {
    const payload = { email: user.email, id: user.id };

    const existingUser = await this.orgUserModel.findById(user.id);

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
  ): Promise<string> {
    const user = await this.orgUserModel
      .findOne({ email: sendForgotPasswordOTPDto.email })
      .exec();

    if (!user) {
      throw new Error('User not found');
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
    await user.save();

    // TODO: Send the OTP to the user's email
    // You can use an email service like Nodemailer or SendGrid to send the OTP

    return otp;
  }

  async resendOTP(
    sendForgotPasswordOTPDto: SendForgotPasswordOTPDto,
  ): Promise<string> {
    const user = await this.orgUserModel
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
    user.otp = otp;
    user.otpExpiration = otpExpiration;
    await user.save();

    // Send the OTP to the user (implement your own logic here)
    // e.g., Send an email or SMS with the OTP code

    // You can also return the generated OTP if needed
    return otp;
  }

  async verifyOtp(
    verifyForgotPasswordOTPDto: VerifyForgotPasswordOTPDto,
  ): Promise<boolean> {
    const user = await this.orgUserModel
      .findOne({ email: verifyForgotPasswordOTPDto.email })
      .exec();

    if (!user) {
      throw new Error('User not found');
    }

    if (
      !(await Password.comparePassword(
        verifyForgotPasswordOTPDto.otp,
        user.otp,
      ))
    ) {
      throw new Error('Invalid OTP');
    }

    if (user.otpExpiration < new Date()) {
      throw new Error('OTP expired');
    }

    return true;
  }

  async updatePassword(
    updateForgotPasswordDto: UpdateForgotPasswordDto,
  ): Promise<void> {
    const user = await this.orgUserModel
      .findOne({ email: updateForgotPasswordDto.email })
      .exec();

    if (!user) {
      throw new Error('User not found');
    }

    if (
      !(await Password.comparePassword(updateForgotPasswordDto.otp, user.otp))
    ) {
      throw new Error('Invalid OTP');
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
    const user = await this.orgUserModel.findById(userId).exec();

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
  ): Promise<void> {
    const user = await this.orgUserModel.findOne({ _id: userId }).exec();

    if (!user) {
      throw new NotFoundException('no user found');
    }

    const isDuplicateEmail = await this.orgUserModel.findOne({
      email: updateProfileDto.email,
      _id: { $ne: user.id },
    });

    if (isDuplicateEmail) {
      throw new BadRequestException('This email already in use.');
    }

    if (!updateProfileDto.avatar) {
      throw new BadRequestException('avatar is required.');
    }

    updateProfileDto.avatar = await this.s3Provider.uploadFileToS3(
      updateProfileDto.avatar,
    );

    return await this.orgUserModel.findByIdAndUpdate(
      user.id,
      updateProfileDto,
      {
        new: true,
      },
    );
  }

  async getDashboardSetting(): Promise<OrgSetting> {
    let setting = await this.Setting.findOne();

    if (!setting) {
      setting = await this.Setting.create({});
    }

    return setting;
  }

  async updateDashboardSetting(
    orgSettingDto: OrgSettingDto,
  ): Promise<OrgSetting> {
    let setting = await this.Setting.findOne();

    if (!setting) {
      setting = await this.Setting.create({});
    }

    orgSettingDto.banner = await this.s3Provider.uploadFileToS3(
      orgSettingDto.banner,
    );
    orgSettingDto.logo = await this.s3Provider.uploadFileToS3(
      orgSettingDto.logo,
    );

    return await this.Setting.findOneAndUpdate({}, orgSettingDto, {
      new: true,
    });
  }

  async assignCoach(athleteId: string, coachId: string) {
    await this.athleteService.assignCoach(athleteId, coachId);
    await this.coachService.assignAthletes(coachId, [athleteId]);
  }
}
