import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateExerciseCategoryDto } from './dto/create-exercise_category.dto';
import { UpdateExerciseCategoryDto } from './dto/update-exercise_category.dto';
import { ExerciseCategory } from './entities/exercise_category.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class ExerciseCategoriesService {
  constructor(
    @InjectModel(ExerciseCategory.name)
    private readonly ExCategory: Model<ExerciseCategory>,
  ) {}

  async create(createExerciseCategoryDto: CreateExerciseCategoryDto) {
    return await this.ExCategory.create(createExerciseCategoryDto);
  }

  async findAll() {
    return await this.ExCategory.find({ isParent: true }).populate({
      path: 'subCategories',
      select: 'name',
    });
  }

  async findOne(id: string) {
    const category = await this.ExCategory.findById(id).populate({
      path: 'subCategories',
      select: 'name',
    });

    if (!category) {
      throw new NotFoundException('category not found.');
    }

    return category;
  }

  async update(
    id: string,
    updateExerciseCategoryDto: UpdateExerciseCategoryDto,
  ) {
    const category = await this.ExCategory.findByIdAndUpdate(
      id,
      updateExerciseCategoryDto,
      { new: true },
    );

    if (!category) {
      throw new NotFoundException('category not found.');
    }

    return category;
  }

  async remove(id: string) {
    const category = await this.ExCategory.findByIdAndRemove(id).exec();

    if (!category) {
      throw new NotFoundException('category not found.');
    }

    return category;
  }
}
