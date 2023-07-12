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
import { AthletesService } from 'src/athlets/athletes.service';
import { CoachsService } from 'src/coachs/coachs.service';
import { MimeType, S3Provider } from 'src/providers/s3.provider';
import { Password } from '../common/password';
import { AuthResponse } from './dto/auth-response.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { OrgSettingDto } from './dto/org-db-setting.dto';
import { SendForgotPasswordOTPDto } from './dto/send-forgot-password-otp.dto';
import { UpdateForgotPasswordDto } from './dto/update-forget-password.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UploadAthletesDto } from './dto/upload-athletes.dto';
import { OrgUserSignUpDto } from './dto/user-signup.dto';
import { VerifyForgotPasswordOTPDto } from './dto/verify-forgot-password-otp.dto';
import { OrgUser } from './entities/org-user.entity';
import { OrgSetting } from './entities/settings.entity';
import { Response } from 'express';
import { EmailProvider } from 'src/providers/email.provider';

@Injectable()
export class OrgUsersService {
  constructor(
    @InjectModel(OrgUser.name) private readonly orgUserModel: Model<OrgUser>,
    @InjectModel(OrgSetting.name) private readonly Setting: Model<OrgSetting>,
    private jwtService: JwtService,
    private readonly s3Provider: S3Provider,
    private athleteService: AthletesService,
    private coachService: CoachsService,
    private emailProvider: EmailProvider,
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

  async validateUser(
    email: string,
    pass: string,
  ): Promise<{ user?: OrgUser; passIsValid: boolean }> {
    const user = await this.orgUserModel.findOne({ email });

    if (!user) {
      return { user: undefined, passIsValid: false };
    }

    const isMatched = await Password.comparePassword(pass, user?.password);

    return { user, passIsValid: isMatched };
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
    user.otp = await Password.hashPassword(otp);
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
    const user = await this.orgUserModel
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
  ): Promise<Record<string, any>> {
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

    if (updateProfileDto.avatar) {
      updateProfileDto.avatar = await this.s3Provider.uploadFileToS3(
        updateProfileDto.avatar,
      );
    }

    const updatedUser = await this.orgUserModel.findByIdAndUpdate(
      user.id,
      updateProfileDto,
      { new: true },
    );

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, __v, otp, otpExpiration, ...result } =
      updatedUser.toJSON();

    return result;
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

  async assignCoach(
    athleteId: string,
    physician_coach,
    batting_coach,
    trainer_coach,
    pitching_coach,
  ) {
    await this.athleteService.assignCoach(
      athleteId,
      physician_coach,
      batting_coach,
      trainer_coach,
      pitching_coach,
    );
    await this.coachService.assignAthletes(
      athleteId,
      physician_coach,
      batting_coach,
      trainer_coach,
      pitching_coach,
    );
  }

  async addBulkAthletes(
    uploadAthletesDto: UploadAthletesDto,
  ): Promise<boolean> {
    if (!uploadAthletesDto.file) {
      throw new BadRequestException('file is required.');
    }

    let parseData: { status: boolean; data?: Record<string, any>[] };

    const { mimetype } = uploadAthletesDto.file;

    if (mimetype === MimeType.CSV) {
      parseData = await this.s3Provider.parseCsv(uploadAthletesDto.file);
    } else if (mimetype === MimeType.XLSX) {
      parseData = await this.s3Provider.parseXls(
        uploadAthletesDto.file,
        'SalesOrders',
      );
    } else {
      throw new BadRequestException('only csv/xlsx file are allowed.');
    }

    await this.athleteService.addAthletesByFile(parseData.data as any[]);

    return parseData.status;
  }

  async downloadAthletes(format: string, res: Response) {
    const { results } = await this.athleteService.findAll();

    if (format === 'csv') {
      this.s3Provider.downloadCsv(results, res);
    } else if (format === 'xlsx') {
      this.s3Provider.downloadXlsx(results, res);
    } else if (format === 'pdf') {
      this.s3Provider.downloadPDF(results, res);
    } else {
      throw new BadRequestException('invalid formate');
    }
  }
}
