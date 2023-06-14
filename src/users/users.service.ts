import { Upload } from '@aws-sdk/lib-storage';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { S3Provider } from 'src/providers/s3.provider';
import { v4 as uuidv4 } from 'uuid';
import { UpdateProfilePicDto } from './dto/update-profile-pic-dto';
import { User } from './entities/user.entity';
import { UpdateUserProfileDto } from './dto/update-profile-dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly s3Provider: S3Provider,
  ) {}

  findUser(conditions: Record<string, any>) {
    return this.userModel.find(conditions);
  }

  async updateProfile(updateProfileDto: UpdateUserProfileDto, userId: string) {
    const existingUser = await this.userModel.findOne({ _id: userId }).exec();

    if (!existingUser) {
      throw new NotFoundException('no user found');
    }

    if (Object.keys(updateProfileDto).length > 1) {
      updateProfileDto.profileCompleted = true;
    }

    return await this.userModel.findByIdAndUpdate(
      existingUser.id,
      updateProfileDto,
    );
  }

  async updateProfilePic(
    updateProfilePic: UpdateProfilePicDto,
    userId: string,
  ) {
    const user = await this.userModel.findOne({ _id: userId }).exec();

    if (!user) {
      throw new NotFoundException('no user found');
    }

    if (!updateProfilePic.avatar) {
      throw new BadRequestException('avatar is required.');
    }

    updateProfilePic.avatar = await this.s3Provider.uploadFileToS3(
      updateProfilePic.avatar,
    );

    return await this.userModel.findByIdAndUpdate(user.id, updateProfilePic, {
      new: true,
    });
  }
}
