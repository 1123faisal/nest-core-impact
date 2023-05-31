import {
  Body,
  Controller,
  FileTypeValidator,
  HttpCode,
  HttpStatus,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ProfileInterceptor } from 'src/interceptors/profile-interceptor';
import { UpdateProfileDto } from './dto/update-profile-dto';
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
    @Body() updateProfileDto: UpdateProfileDto,
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
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 1000 * 1000 * 1 /** accept in byte , max size is 1mb*/,
          }),
          new FileTypeValidator({
            fileType: /^(image\/(jpg|jpeg|png))$/,
          }),
        ],
      }),
    )
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
