import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { CreateExerciseCategoryDto } from './dto/create-exercise_category.dto';
import { CreateSubExerciseCategoryDto } from './dto/create-sub-exercise_category.dto';
import { UpdateExerciseCategoryDto } from './dto/update-exercise_category.dto';
import {
  ExerciseCategory,
  ExerciseCategoryDocument,
} from './entities/exercise_category.entity';

@Injectable()
export class ExerciseCategoriesService {
  constructor(
    @InjectModel(ExerciseCategory.name)
    private readonly ExCategory: Model<ExerciseCategory>,
  ) {}

  async create(createExerciseCategoryDto: CreateExerciseCategoryDto) {
    return await this.ExCategory.create({
      ...createExerciseCategoryDto,
      isParent: true,
    });
  }

  async findAll(isParent = true, parentId?: string) {
    let params: Record<string, any> = { isParent };

    if (parentId) {
      params = { _id: parentId };
    }

    return await this.ExCategory.find(params)
      .populate({
        path: 'subCategories',
        select: 'name status',
      })
      .sort({ _id: -1 });
  }

  async findOne(id: string) {
    const category = await this.ExCategory.findById(id).populate({
      path: 'subCategories',
      select: 'name status',
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

  async createSubCategory(
    createSubExerciseCategoryDto: CreateSubExerciseCategoryDto,
  ) {
    const parentCategory = await this.ExCategory.findById(
      createSubExerciseCategoryDto.categoryId,
    );

    if (!parentCategory) {
      throw new NotFoundException('parent category not found.');
    }

    const newSubCat = await this.ExCategory.create({
      ...createSubExerciseCategoryDto,
      isParent: false,
    });

    await parentCategory.updateOne({
      $addToSet: { subCategories: newSubCat._id },
    });

    return newSubCat;
  }

  async remove(id: string) {
    const category = await this.ExCategory.findByIdAndRemove(id).exec();

    if (!category) {
      throw new NotFoundException('category not found.');
    }

    return category;
  }

  find(filter: FilterQuery<ExerciseCategory>) {
    return this.ExCategory.find(filter).populate({
      path: 'subCategories',
      select: 'name status',
    });
  }
}
