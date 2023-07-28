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
import { AdminsAuthService } from './admin-auth.service';
import { AuthResponse } from './dto/auth-response.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { SendForgotPasswordOTPDto } from './dto/send-forgot-password-otp.dto';
import { UpdateForgotPasswordDto } from './dto/update-forget-password.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { AdminSignInDto } from './dto/user-signin.dto';
import { AdminSignUpDto } from './dto/user-signup.dto';
import { VerifyForgotPasswordOTPDto } from './dto/verify-forgot-password-otp.dto';
import { JwtAuthGuardIsAdmin } from './jwt-auth.guard';
import { LocalAuthGuard } from './local-auth.guard';

@ApiTags("Admin's")
@Controller('admins')
export class AdminsAuthController {
  constructor(private readonly coachAuthService: AdminsAuthService) {}

  @Post('signup')
  create(@Body() adminSignUpDto: AdminSignUpDto) {
    return this.coachAuthService.userSignUp(adminSignUpDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Request() req,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Body() _userSignInDto: AdminSignInDto,
  ): Promise<AuthResponse> {
    return this.coachAuthService.login(req.user);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuardIsAdmin)
  @UseInterceptors(ProfileInterceptor)
  @Get('profile')
  getProfile(@Request() req) {
    return this.coachAuthService.getProfile(req.user.id);
  }

  @Post('forget-password/send-otp')
  @HttpCode(HttpStatus.OK)
  async sendOtp(
    @Body() sendForgotPasswordOTPDto: SendForgotPasswordOTPDto,
  ): Promise<void> {
    return await this.coachAuthService.sendOtp(sendForgotPasswordOTPDto);
  }

  @Post('resend-otp')
  @HttpCode(HttpStatus.OK)
  async resendOTP(
    @Body() sendForgotPasswordOTPDto: SendForgotPasswordOTPDto,
  ): Promise<void> {
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
  @UseGuards(JwtAuthGuardIsAdmin)
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
  @UseGuards(JwtAuthGuardIsAdmin) // Protect the route with JWT authentication
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('avatar'))
  @Post('update-profile')
  @HttpCode(HttpStatus.OK)
  async updateProfile(
    @UploadedFile(isValidAvatar)
    file: Express.Multer.File,
    @Body() updateProfileDto: UpdateProfileDto,
    @Request() req,
  ): Promise<Record<string, any>> {
    updateProfileDto.avatar = file;
    return await this.coachAuthService.updateProfile(
      updateProfileDto,
      req.user.id,
    );
  }
}
