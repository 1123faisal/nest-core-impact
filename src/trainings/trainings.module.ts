import { Module } from '@nestjs/common';
import { TrainingsService } from './trainings.service';
import { TrainingsController } from './trainings.controller';
import { CoachsModule } from 'src/coachs/coachs.module';
import { Training, TrainingSchema } from './entities/training.entity';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    CoachsModule,
    MongooseModule.forFeature([
      { name: Training.name, schema: TrainingSchema },
    ]),
  ],
  controllers: [TrainingsController],
  providers: [TrainingsService],
})
export class TrainingsModule {}
