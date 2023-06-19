import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/users/entities/user.entity';
import { Sport, SportSchema } from './entities/sport.entity';
import { SportsController } from './sports.controller';
import { SportsService } from './sports.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Sport.name, schema: SportSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [SportsController],
  providers: [SportsService],
  exports: [SportsService],
})
export class SportsModule {}
