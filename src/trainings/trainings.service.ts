import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTrainingDto, Step } from './dto/create-training.dto';
import { UpdateTrainingDto } from './dto/update-training.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Training } from './entities/training.entity';
import { Model } from 'mongoose';
import { S3Provider } from 'src/providers/s3.provider';

@Injectable()
export class TrainingsService {
  constructor(
    @InjectModel(Training.name) private readonly TrainingModel: Model<Training>,
    private readonly s3Provider: S3Provider,
  ) {}

  async create(
    createTrainingDto: CreateTrainingDto,
    userId: string,
  ): Promise<Training> {
    const steps = JSON.parse(createTrainingDto.steps);
    let mimetype;
    let file;

    if (createTrainingDto.file) {
      mimetype = createTrainingDto.file.mimetype;
      file = await this.s3Provider.uploadFileToS3(createTrainingDto.file);
    }

    return await this.TrainingModel.create({
      ...createTrainingDto,
      steps,
      mimetype,
      file,
      coach: userId,
    });
  }

  async findAll(): Promise<Training[]> {
    return await this.TrainingModel.find();
  }

  async findOne(id: string): Promise<Training> {
    const training = await this.TrainingModel.findById(id);

    if (!training) {
      throw new NotFoundException('no training found.');
    }
    return training;
  }

  async update(
    id: string,
    updateTrainingDto: UpdateTrainingDto,
    userId: string,
  ) {
    let mimetype;
    let file;

    const steps: Step[] = JSON.parse(updateTrainingDto.steps);

    if (updateTrainingDto.file) {
      mimetype = updateTrainingDto.file.mimetype;
      file = await this.s3Provider.uploadFileToS3(updateTrainingDto.file);
    }

    const training = await this.TrainingModel.findOneAndUpdate(
      { _id: id, coach: userId },
      { ...updateTrainingDto, steps, file, mimetype },
      { new: true },
    );

    if (!training) {
      throw new NotFoundException('no training found.');
    }

    return training;
  }

  async remove(id: string) {
    const training = await this.TrainingModel.findByIdAndDelete(id);

    if (!training) {
      throw new NotFoundException('no training found.');
    }
  }
}
