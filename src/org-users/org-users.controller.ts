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
import { AuthResponse } from './dto/auth-response.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { SendForgotPasswordOTPDto } from './dto/send-forgot-password-otp.dto';
import { UpdateForgotPasswordDto } from './dto/update-forget-password.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UserSignInDto } from './dto/user-signin.dto';
import { OrgUserSignUpDto } from './dto/user-signup.dto';
import { VerifyForgotPasswordOTPDto } from './dto/verify-forgot-password-otp.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LocalAuthGuard } from './local-auth.guard';
import { OrgUsersService } from './org-users.service';

@ApiTags('Org Users')
@Controller('org-users')
export class OrgUsersController {
  constructor(private readonly orgUsersService: OrgUsersService) {}

  @Post('signup')
  create(@Body() orgUserSignUpDto: OrgUserSignUpDto) {
    return this.orgUsersService.userSignUp(orgUserSignUpDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Request() req,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Body() _userSignInDto: UserSignInDto,
  ): Promise<AuthResponse> {
    return this.orgUsersService.login(req.user);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ProfileInterceptor)
  @Get('profile')
  getProfile(@Request() req) {
    return this.orgUsersService.getProfile(req.user.id);
  }

  @Post('forget-password/send-otp')
  @HttpCode(HttpStatus.OK)
  async sendOtp(
    @Body() sendForgotPasswordOTPDto: SendForgotPasswordOTPDto,
  ): Promise<string> {
    return await this.orgUsersService.sendOtp(sendForgotPasswordOTPDto);
  }

  @Post('resend-otp')
  @HttpCode(HttpStatus.OK)
  async resendOTP(
    @Body() sendForgotPasswordOTPDto: SendForgotPasswordOTPDto,
  ): Promise<string> {
    return await this.orgUsersService.resendOTP(sendForgotPasswordOTPDto);
  }

  @Post('forget-password/verify-otp')
  @HttpCode(HttpStatus.OK)
  async verifyOtp(
    @Body() verifyForgotPasswordOTPDto: VerifyForgotPasswordOTPDto,
  ): Promise<{ success: boolean }> {
    await this.orgUsersService.verifyOtp(verifyForgotPasswordOTPDto);
    return { success: true };
  }

  @Post('forget-password/update-password')
  @HttpCode(HttpStatus.OK)
  async updatePassword(
    @Body() updateForgotPasswordDto: UpdateForgotPasswordDto,
  ): Promise<{ success: boolean }> {
    await this.orgUsersService.updatePassword(updateForgotPasswordDto);
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
    await this.orgUsersService.changePassword(changePasswordDto, req.user.id);
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
    await this.orgUsersService.updateProfile(updateProfileDto, req.user.id);
    return { success: true };
  }
}
