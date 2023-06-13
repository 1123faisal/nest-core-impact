import { Module } from '@nestjs/common';
import { TrainingSessionsService } from './training-sessions.service';
import { TrainingSessionsController } from './training-sessions.controller';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import {
  TrainingSession,
  TrainingSessionSchema,
} from './entities/training-session.entity';
import { CoachsModule } from 'src/coachs/coachs.module';
import { UsersModule } from 'src/users/users.module';
import { TrainingsModule } from 'src/trainings/trainings.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
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
