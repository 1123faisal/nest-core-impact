import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTrainingDto, Step } from './dto/create-training.dto';
import { UpdateTrainingDto } from './dto/update-training.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Training } from './entities/training.entity';
import { Model } from 'mongoose';
import { S3Provider } from 'src/providers/s3.provider';
import { ExerciseCategoriesService } from 'src/exercise_categories/exercise_categories.service';

@Injectable()
export class TrainingsService {
  constructor(
    @InjectModel(Training.name) private readonly TrainingModel: Model<Training>,
    private readonly s3Provider: S3Provider,
    private readonly exCategoryService: ExerciseCategoriesService,
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

    const [category] = await this.exCategoryService.find({
      _id: createTrainingDto.exCategory,
    });

    if (category.id != createTrainingDto.exCategory) {
      throw new NotFoundException('no exCategory found');
    }

    const subCategory = category.subCategories.find(
      (v) => v.id == createTrainingDto.exSubCategory,
    );

    if (!subCategory) {
      throw new NotFoundException('no exSubCategory found');
    }

    return await this.TrainingModel.create({
      ...createTrainingDto,
      steps,
      mimetype,
      file,
      coach: userId,
    });
  }

  async findAll(
    exCategory?: string,
    exSubCategory?: string,
  ): Promise<Training[]> {
    const conditions: Record<string, any> = {};

    if (exCategory) {
      conditions.exCategory = exCategory;
      if (exSubCategory) {
        conditions.exSubCategory = exSubCategory;
      }
    }

    return await this.TrainingModel.find(conditions)
      .populate({ path: 'coach', select: 'name' })
      .populate({ path: 'exCategory', select: 'name' })
      .populate({ path: 'exSubCategory', select: 'name' })
      .sort({ _id: -1 });
  }

  async findOne(id: string): Promise<Training> {
    const training = await this.TrainingModel.findById(id)
      .populate({ path: 'coach', select: 'name' })
      .populate({ path: 'exCategory', select: 'name' })
      .populate({ path: 'exSubCategory', select: 'name' });

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

    const [category] = await this.exCategoryService.find({
      _id: updateTrainingDto.exCategory,
    });

    if (category.id != updateTrainingDto.exCategory) {
      throw new NotFoundException('no exCategory found');
    }

    const subCategory = category.subCategories.find(
      (v) => v.id == updateTrainingDto.exSubCategory,
    );

    if (!subCategory) {
      throw new NotFoundException('no exSubCategory found');
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
