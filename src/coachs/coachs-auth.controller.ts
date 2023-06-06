import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { isValidAvatar } from 'src/common/pipes/is-avatar.pipe';
import { ProfileInterceptor } from 'src/interceptors/profile-interceptor';
import { CoachsAuthService } from './coachs-auth.service';
import { AuthResponse } from './dto/auth-response.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { SendForgotPasswordOTPDto } from './dto/send-forgot-password-otp.dto';
import { UpdateForgotPasswordDto } from './dto/update-forget-password.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { CoachSignInDto } from './dto/user-signin.dto';
import { CoachSignUpDto } from './dto/user-signup.dto';
import { VerifyForgotPasswordOTPDto } from './dto/verify-forgot-password-otp.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LocalAuthGuard } from './local-auth.guard';

@ApiTags("Coach's")
@Controller('coachs')
export class CoachsAuthController {
  constructor(private readonly coachAuthService: CoachsAuthService) {}

  @Post('signup')
  create(@Body() coachSignUpDto: CoachSignUpDto) {
    return this.coachAuthService.userSignUp(coachSignUpDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Request() req,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Body() _userSignInDto: CoachSignInDto,
  ): Promise<AuthResponse> {
    return this.coachAuthService.login(req.user);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ProfileInterceptor)
  @Get('profile')
  getProfile(@Request() req) {
    return this.coachAuthService.getProfile(req.user.id);
  }

  @Post('forget-password/send-otp')
  @HttpCode(HttpStatus.OK)
  async sendOtp(
    @Body() sendForgotPasswordOTPDto: SendForgotPasswordOTPDto,
  ): Promise<string> {
    return await this.coachAuthService.sendOtp(sendForgotPasswordOTPDto);
  }

  @Post('resend-otp')
  @HttpCode(HttpStatus.OK)
  async resendOTP(
    @Body() sendForgotPasswordOTPDto: SendForgotPasswordOTPDto,
  ): Promise<string> {
    return await this.coachAuthService.resendOTP(sendForgotPasswordOTPDto);
  }

  @Post('forget-password/verify-otp')
  @HttpCode(HttpStatus.OK)
  async verifyOtp(
    @Body() verifyForgotPasswordOTPDto: VerifyForgotPasswordOTPDto,
  ): Promise<{ success: boolean }> {
    await this.coachAuthService.verifyOtp(verifyForgotPasswordOTPDto);
    return { success: true };
  }

  @Post('forget-password/update-password')
  @HttpCode(HttpStatus.OK)
  async updatePassword(
    @Body() updateForgotPasswordDto: UpdateForgotPasswordDto,
  ): Promise<{ success: boolean }> {
    await this.coachAuthService.updatePassword(updateForgotPasswordDto);
    return { success: true };
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  @HttpCode(HttpStatus.OK)
  async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @Request() req,
  ): Promise<{ success: boolean }> {
    await this.coachAuthService.changePassword(changePasswordDto, req.user.id);
    return { success: true };
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard) // Protect the route with JWT authentication
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('avatar'))
  @Post('update-profile')
  @HttpCode(HttpStatus.OK)
  async updateProfile(
    @UploadedFile(isValidAvatar)
    file: Express.Multer.File,
    @Body() updateProfileDto: UpdateProfileDto,
    @Request() req,
  ): Promise<{ success: boolean }> {
    updateProfileDto.avatar = file;
    await this.coachAuthService.updateProfile(updateProfileDto, req.user.id);
    return { success: true };
  }
}
