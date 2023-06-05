import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { S3Provider } from 'src/providers/s3.provider';
import { CoachsController } from './coachs.controller';
import { CoachsService } from './coachs.service';
import { Coach, CoachSchema } from './entities/coach.entity';
import { JwtStrategy } from './jwt.strategy';
import { CoachLocalStrategy } from './local.strategy';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    MongooseModule.forFeature([{ name: Coach.name, schema: CoachSchema }]),
    PassportModule.register({
      defaultStrategy: 'coach-jwt',
      property: 'user',
      session: false,
    }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [CoachsController],
  providers: [CoachsService, CoachLocalStrategy, JwtStrategy, S3Provider],
  exports: [CoachsService],
})
export class CoachsModule {}
