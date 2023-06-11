import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Request,
  UnauthorizedException,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { OAuth2Client, TokenPayload } from 'google-auth-library';
import { ProfileInterceptor } from 'src/interceptors/profile-interceptor';
import { AuthService } from './auth.service';
import { AuthResponse } from './dto/auth-response.dto';
import { SendForgotPasswordOTPDto } from './dto/send-forgot-password-otp.dto';
import { UpdateForgotPasswordDto } from './dto/update-forget-password.dto';
import { UserSignInDto } from './dto/user-signin.dto';
import { UserSignUpDto } from './dto/user-signup.dto';
import { VerifyForgotPasswordOTPDto } from './dto/verify-forgot-password-otp.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LocalAuthGuard } from './local-auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  create(@Body() userSignUpDto: UserSignUpDto) {
    return this.authService.userSignUp(userSignUpDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Request() req,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Body() _userSignInDto: UserSignInDto,
  ): Promise<AuthResponse> {
    return this.authService.login(req.user);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ProfileInterceptor)
  @Get('profile')
  getProfile(@Request() req) {
    return this.authService.getProfile(req.user.id);
  }

  @Post('forget-password/send-otp')
  @HttpCode(HttpStatus.OK)
  async sendOtp(
    @Body() sendForgotPasswordOTPDto: SendForgotPasswordOTPDto,
  ): Promise<string> {
    return await this.authService.sendOtp(sendForgotPasswordOTPDto);
  }

  @Post('resend-otp')
  @HttpCode(HttpStatus.OK)
  async resendOTP(
    @Body() sendForgotPasswordOTPDto: SendForgotPasswordOTPDto,
  ): Promise<string> {
    return await this.authService.resendOTP(sendForgotPasswordOTPDto);
  }

  @Post('forget-password/verify-otp')
  @HttpCode(HttpStatus.OK)
  async verifyOtp(
    @Body() verifyForgotPasswordOTPDto: VerifyForgotPasswordOTPDto,
  ): Promise<{ success: boolean }> {
    await this.authService.verifyOtp(verifyForgotPasswordOTPDto);
    return { success: true };
  }

  @Post('forget-password/update-password')
  @HttpCode(HttpStatus.OK)
  async updatePassword(
    @Body() updateForgotPasswordDto: UpdateForgotPasswordDto,
  ): Promise<{ success: boolean }> {
    await this.authService.updatePassword(updateForgotPasswordDto);
    return { success: true };
  }

  // google auth
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleLogin() {
    // await this.validateToken();
    // return '';
    // The user will be redirected to the Google OAuth2 login page
    // for authentication. This route will be handled by the GoogleStrategy.
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(@Req() req) {
    // Handle the callback after successful authentication
    // The user information is available in req.user
    // You can create/update the user in your AuthService and return the necessary tokens or user data
    const profile = req.user;
    const { _json, provider } = profile;
    const { name, sub, picture, email } = _json;

    const result = await this.authService.handleGoogleLogin(
      name,
      picture,
      email,
      provider,
      sub,
    );
    return result;
  }

  @Post('signout')
  @UseGuards(JwtAuthGuard)
  async signOut(@Req() req) {
    // Handle sign out logic, including invalidating the JWT token or any other necessary steps
    await this.authService.signOut(req.user);
    // Return any necessary response
    return { message: 'Successfully signed out' };
  }

  @Post('google-sign-in')
  @HttpCode(HttpStatus.OK)
  @ApiBody({ schema: { properties: { idToken: { type: 'string' } } } })
  async googleSignIn(@Body('idToken') idToken: string): Promise<boolean> {
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

    const result = await this.authService.handleGoogleLogin(
      payload.name,
      payload.picture,
      payload.email,
      'google',
      payload.sub,
    );

    // Return true if the token is valid
    return result;
  }
}
