import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import verifyAppleToken from 'verify-apple-id-token';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as moment from 'moment';
import { Model, ObjectId } from 'mongoose';
import * as otpGenerator from 'otp-generator';
import { Password } from '../common/password';
import { User } from '../users/entities/user.entity';
import { AuthResponse } from './dto/auth-response.dto';
import { SendForgotPasswordOTPDto } from './dto/send-forgot-password-otp.dto';
import { UpdateForgotPasswordDto } from './dto/update-forget-password.dto';
import { UserSignUpDto } from './dto/user-signup.dto';
import { VerifyForgotPasswordOTPDto } from './dto/verify-forgot-password-otp.dto';
import { OAuth2Client, TokenPayload } from 'google-auth-library';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  private getJwtToken(userId: string | ObjectId) {
    return this.jwtService.sign({ id: userId });
  }

  async getProfile(userId: string): Promise<User> {
    const user = await this.userModel.findById(userId).populate('sport');

    if (!user) {
      throw new NotFoundException('no user found');
    }

    return user;
  }

  async userSignUp(userSignUpDto: UserSignUpDto): Promise<AuthResponse> {
    const createdUser = new this.userModel({
      email: userSignUpDto.email,
      password: userSignUpDto.password,
      role: userSignUpDto.role,
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
    const user = await this.userModel.findOne({ email });

    if (!user) {
      return null;
    }

    const isMatched = await Password.comparePassword(pass, user?.password);

    if (isMatched) {
      return user;
    }

    return null;
  }

  async findUser(condition: Record<string, any>): Promise<User> {
    const user = await this.userModel.findOne(condition);
    if (user) return user;
    return null;
  }

  async login(user: any): Promise<AuthResponse> {
    const payload = { email: user.email, id: user._id };

    const existingUser = await this.userModel.findById(user._id);

    if (!existingUser) {
      throw new UnauthorizedException();
    }

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
    const user = await this.userModel
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
    const user = await this.userModel
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
    const user = await this.userModel
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
    const user = await this.userModel
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

  // google auth
  async handleGoogleLogin(idToken: string): Promise<any> {
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    let ticket;

    try {
      ticket = await client.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
    } catch (error) {
      throw new UnauthorizedException('invalid token');
    }

    const payload: TokenPayload = ticket.getPayload();

    const { name, picture, email, sub } = payload;

    let existingUser = await this.userModel.findOne({ sub, email });

    if (!existingUser) {
      existingUser = await this.userModel.create({
        name,
        nickname: name,
        avatar: picture,
        email,
        provider: 'google',
        sub,
      });
    }

    const { password, __v, otp, otpExpiration, ...result } =
      existingUser.toJSON();

    const jwtPayload = { email: existingUser.email, id: existingUser._id };

    return {
      ...result,
      token: this.jwtService.sign(jwtPayload),
    };
  }

  async handleAppleLogin(idToken: string): Promise<any> {
    // Handle the Google login logic, including user creation or authentication using the Google profile
    // You can generate and return JWT tokens or any other necessary response
    // For simplicity, we'll just return the user object
    let payload;

    try {
      payload = await verifyAppleToken({
        idToken: idToken,
        clientId: process.env.APP_BUNDLE_ID,
        // nonce: 'nonce', // optional
      });
    } catch (error) {
      console.error('Error validating Apple Sign-In:', error);
      throw new BadRequestException('Error validating Apple Sign-In.');
    }

    const {
      iss,
      aud,
      exp,
      iat,
      sub,
      c_hash,
      email,
      email_verified,
      auth_time,
      nonce_supported,
    } = payload;

    let existingUser = await this.userModel.findOne({ sub, email });

    if (!existingUser) {
      existingUser = await this.userModel.create({
        email,
        provider: 'apple',
        sub,
      });
    }

    const { password, __v, otp, otpExpiration, ...result } =
      existingUser.toJSON();

    const jwtPayload = { email: existingUser.email, id: existingUser._id };

    return {
      ...result,
      token: this.jwtService.sign(jwtPayload),
    };
  }

  async handleServerGoogleLogin(
    name: string,
    picture: string,
    email: string,
    provider: string,
    sub: string,
  ): Promise<any> {
    let existingUser = await this.userModel.findOne({ sub, email });

    if (!existingUser) {
      existingUser = await this.userModel.create({
        name,
        nickname: name,
        avatar: picture,
        email,
        provider,
        sub,
      });
    }

    const { password, __v, otp, otpExpiration, ...result } =
      existingUser.toJSON();

    const jwtPayload = { email: existingUser.email, id: existingUser._id };

    return {
      ...result,
      token: this.jwtService.sign(jwtPayload),
    };
  }

  async signOut(user: User): Promise<void> {
    // Handle the sign out logic, including invalidating the JWT token or any other necessary steps
    // You can use the user object to identify the user and perform any necessary actions
  }
}
