import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CoachsModule } from 'src/coachs/coachs.module';
import { S3Provider } from 'src/providers/s3.provider';
import { SportsModule } from 'src/sports/sports.module';
import { User, UserSchema } from 'src/users/entities/user.entity';
import { UsersModule } from 'src/users/users.module';
import { AthletesController } from './athletes.controller';
import { AthletesService } from './athletes.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    UsersModule,
    CoachsModule,
    SportsModule,
  ],
  controllers: [AthletesController],
  providers: [AthletesService, S3Provider],
  exports: [AthletesService],
})
export class AthletesModule {}
