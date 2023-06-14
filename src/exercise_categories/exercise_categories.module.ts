import { Module } from '@nestjs/common';
import { ExerciseCategoriesService } from './exercise_categories.service';
import { ExerciseCategoriesController } from './exercise_categories.controller';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ExerciseCategory,
  ExerciseCategorySchema,
} from './entities/exercise_category.entity';
import { AdminsModule } from 'src/admin/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
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
