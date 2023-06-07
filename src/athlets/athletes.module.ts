import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/users/entities/user.entity';
import { UsersModule } from 'src/users/users.module';
import { AthletesController } from './athletes.controller';
import { AthletesService } from './athletes.service';
import { S3Provider } from 'src/providers/s3.provider';
import { CoachsModule } from 'src/coachs/coachs.module';
import { SportsModule } from 'src/sports/sports.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
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
