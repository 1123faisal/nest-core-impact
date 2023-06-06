import {
  Body,
  Controller,
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
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { isValidAvatar } from 'src/common/pipes/is-avatar.pipe';
import { ProfileInterceptor } from 'src/interceptors/profile-interceptor';
import { UpdateUserProfileDto } from './dto/update-profile-dto';
import { UpdateProfilePicDto } from './dto/update-profile-pic-dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@ApiBearerAuth()
@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard) // Protect the route with JWT authentication
  @UseInterceptors(ProfileInterceptor)
  @Post('update-profile')
  @HttpCode(HttpStatus.OK)
  async updateProfile(
    @Body() updateProfileDto: UpdateUserProfileDto,
    @Request() request: any,
  ): Promise<User> {
    return this.usersService.updateProfile(updateProfileDto, request.user.id);
  }

  @UseGuards(JwtAuthGuard) // Protect the route with JWT authentication
  @UseInterceptors(ProfileInterceptor)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('avatar'))
  @Post('update-profile-pic')
  @HttpCode(HttpStatus.OK)
  async updateProfilePic(
    @UploadedFile(isValidAvatar)
    file: Express.Multer.File,
    @Body() updateProfilePicDto: UpdateProfilePicDto,
    @Request() request: any,
  ): Promise<User> {
    updateProfilePicDto.avatar = file;
    return this.usersService.updateProfilePic(
      updateProfilePicDto,
      request.user.id,
    );
  }
}
