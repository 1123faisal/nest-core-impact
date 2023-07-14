import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminsModule } from 'src/admin/admin.module';
import {
  ExerciseCategory,
  ExerciseCategorySchema,
} from './entities/exercise_category.entity';
import { ExerciseCategoriesController } from './exercise_categories.controller';
import { ExerciseCategoriesService } from './exercise_categories.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ExerciseCategory.name, schema: ExerciseCategorySchema },
    ]),
    AdminsModule,
  ],
  controllers: [ExerciseCategoriesController],
  providers: [ExerciseCategoriesService],
  exports: [ExerciseCategoriesService],
})
export class ExerciseCategoriesModule {}
