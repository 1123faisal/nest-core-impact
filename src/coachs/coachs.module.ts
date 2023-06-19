import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { IsCoachEmailAlreadyExistConstraint } from 'src/common/decorators/is-coach-email-registered.decorator';
import { S3Provider } from 'src/providers/s3.provider';
import { CoachsAuthController } from './coachs-auth.controller';
import { CoachsAuthService } from './coachs-auth.service';
import { CoachsController } from './coachs.controller';
import { CoachsService } from './coachs.service';
import { Coach, CoachSchema } from './entities/coach.entity';
import { JwtStrategy } from './jwt.strategy';
import { CoachLocalStrategy } from './local.strategy';
import { CoachSetting, CoachSettingSchema } from './entities/settings.entity';
import { EmailProvider } from 'src/providers/email.provider';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    MongooseModule.forFeature([{ name: Coach.name, schema: CoachSchema }]),
    MongooseModule.forFeature([
      { name: CoachSetting.name, schema: CoachSettingSchema },
    ]),
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
  controllers: [CoachsAuthController, CoachsController],
  providers: [
    CoachsAuthService,
    CoachsService,
    CoachLocalStrategy,
    JwtStrategy,
    S3Provider,
    EmailProvider,
    IsCoachEmailAlreadyExistConstraint,
  ],
  exports: [CoachsAuthService, CoachsService],
})
export class CoachsModule {}
