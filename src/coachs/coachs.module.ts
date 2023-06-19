import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { IsCoachEmailAlreadyExistConstraint } from 'src/common/decorators/is-coach-email-registered.decorator';
import { EmailProvider } from 'src/providers/email.provider';
import { S3Provider } from 'src/providers/s3.provider';
import { CoachsAuthController } from './coachs-auth.controller';
import { CoachsAuthService } from './coachs-auth.service';
import { CoachsController } from './coachs.controller';
import { CoachsService } from './coachs.service';
import { Coach, CoachSchema } from './entities/coach.entity';
import { CoachSetting, CoachSettingSchema } from './entities/settings.entity';
import { JwtStrategy } from './jwt.strategy';
import { CoachLocalStrategy } from './local.strategy';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Coach.name, schema: CoachSchema }]),
    MongooseModule.forFeature([
      { name: CoachSetting.name, schema: CoachSettingSchema },
    ]),
    PassportModule.register({
      defaultStrategy: 'coach-jwt',
      property: 'user',
      session: false,
    }),
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
      inject: [ConfigService],
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
