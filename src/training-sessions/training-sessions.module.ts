import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CoachsModule } from 'src/coachs/coachs.module';
import { TrainingsModule } from 'src/trainings/trainings.module';
import { UsersModule } from 'src/users/users.module';
import {
  TrainingSession,
  TrainingSessionSchema,
} from './entities/training-session.entity';
import { TrainingSessionsController } from './training-sessions.controller';
import { TrainingSessionsService } from './training-sessions.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TrainingSession.name, schema: TrainingSessionSchema },
    ]),
    CoachsModule,
    UsersModule,
    TrainingsModule,
  ],
  controllers: [TrainingSessionsController],
  providers: [TrainingSessionsService],
})
export class TrainingSessionsModule {}
