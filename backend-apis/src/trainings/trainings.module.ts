import { Module } from '@nestjs/common';
import { TrainingsService } from './trainings.service';
import { TrainingsController } from './trainings.controller';
import { CoachsModule } from 'src/coachs/coachs.module';
import { Training, TrainingSchema } from './entities/training.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { S3Provider } from 'src/providers/s3.provider';
import { ExerciseCategoriesModule } from 'src/exercise_categories/exercise_categories.module';

@Module({
  imports: [
    CoachsModule,
    MongooseModule.forFeature([
      { name: Training.name, schema: TrainingSchema },
    ]),
    ExerciseCategoriesModule,
  ],
  controllers: [TrainingsController],
  providers: [TrainingsService, S3Provider],
  exports: [TrainingsService],
})
export class TrainingsModule {}
