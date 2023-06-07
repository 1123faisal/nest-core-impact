import { Upload } from '@aws-sdk/lib-storage';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { S3Provider } from 'src/providers/s3.provider';
import { v4 as uuidv4 } from 'uuid';
import { CreateCoachDto } from './dto/create-coach.dto';
import { UpdateCoachDto } from './dto/update-coach.dto';
import { Coach } from './entities/coach.entity';

@Injectable()
export class CoachsService {
  constructor(
    @InjectModel(Coach.name) private readonly coachModel: Model<Coach>,
    private readonly s3Provider: S3Provider,
  ) {}

  private async uploadFile(file: Express.Multer.File | string) {
    if (typeof file === 'string') {
      return;
    }

    return await this.s3Provider.uploadFileToS3(file);
  }

  async create(createAthleteDto: CreateCoachDto) {
    if (createAthleteDto.avatar) {
      createAthleteDto.avatar = await this.uploadFile(createAthleteDto.avatar);
    }

    return await this.coachModel.create(createAthleteDto);
  }

  async findAll() {
    return await this.coachModel.find();
  }

  async findOne(id: string) {
    const user = await this.coachModel.findById(id);

    if (!user) {
      throw new NotFoundException('no user found.');
    }

    return user;
  }

  async update(id: string, updateAthleteDto: UpdateCoachDto) {
    const user = await this.findOne(id);

    if (updateAthleteDto.avatar) {
      updateAthleteDto.avatar = await this.uploadFile(updateAthleteDto.avatar);
    }

    return await this.coachModel.findByIdAndUpdate(user.id, updateAthleteDto, {
      new: true,
    });
  }

  async remove(id: string) {
    return await this.coachModel.findByIdAndDelete(id);
  }

  async assignAthletes(coachId: string, athleteIds: string[]) {
    await this.findOne(coachId);

    return await this.coachModel.findByIdAndUpdate(
      coachId,
      {
        athletes: athleteIds,
      },
      { new: true },
    );
  }
}
