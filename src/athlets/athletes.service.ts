import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { S3Provider } from 'src/providers/s3.provider';
import { User } from 'src/users/entities/user.entity';
import { CreateAthleteDto } from './dto/create-athlete.dto';
import { UpdateAthleteDto } from './dto/update-athlete.dto';

@Injectable()
export class AthletesService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly s3Provider: S3Provider,
  ) {}

  async create(createAthleteDto: CreateAthleteDto) {
    if (createAthleteDto.avatar) {
      createAthleteDto.avatar = await this.s3Provider.uploadFileToS3(
        createAthleteDto.avatar,
      );
    }

    return await this.userModel.create(createAthleteDto);
  }

  async findAll() {
    return await this.userModel.find();
  }

  async findOne(id: string) {
    const user = await this.userModel.findById(id);

    if (!user) {
      throw new NotFoundException('no user found.');
    }

    return user;
  }

  async update(id: string, updateAthleteDto: UpdateAthleteDto) {
    const user = await this.findOne(id);

    if (updateAthleteDto.avatar) {
      updateAthleteDto.avatar = await this.s3Provider.uploadFileToS3(
        updateAthleteDto.avatar,
      );
    }

    return await this.userModel.findByIdAndUpdate(user.id, updateAthleteDto, {
      new: true,
    });
  }

  async remove(id: string) {
    return await this.userModel.findByIdAndDelete(id);
  }
}
