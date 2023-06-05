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

  async updateProfile(updateProfileDto: UpdateUserProfileDto, userId: string) {
    const existingUser = await this.userModel.findOne({ _id: userId }).exec();

    if (!existingUser) {
      throw new NotFoundException('no user found');
    }

    updateProfileDto.profileCompleted = true;

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

    const s3 = this.s3Provider.getS3Instance();

    const uniqueFileName = `${uuidv4()}${updateProfilePic.avatar.originalname.substring(
      updateProfilePic.avatar.originalname.lastIndexOf('.'),
    )}`;

    const uploadParams = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: uniqueFileName,
      Body: updateProfilePic.avatar.buffer,
    };

    const upload = new Upload({
      client: s3,
      params: uploadParams,
    });

    await upload.done();

    (updateProfilePic as any).avatar =
      process.env.AWS_BUCKET_URL + uniqueFileName;

    return await this.userModel.findByIdAndUpdate(user.id, updateProfilePic, {
      new: true,
    });
  }
}
