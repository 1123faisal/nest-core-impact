import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { AthletesModule } from 'src/athlets/athletes.module';
import { CoachsModule } from 'src/coachs/coachs.module';
import { IsOrgUserEmailAlreadyExistConstraint } from 'src/common/decorators/is-org-user-email-registered.decorator';
import { S3Provider } from 'src/providers/s3.provider';
import { OrgUser, OrgUserSchema } from './entities/org-user.entity';
import { OrgSetting, OrgSettingSchema } from './entities/settings.entity';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';
import { OrgUsersController } from './org-users.controller';
import { OrgUsersService } from './org-users.service';
import { EmailProvider } from 'src/providers/email.provider';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    MongooseModule.forFeature([{ name: OrgUser.name, schema: OrgUserSchema }]),
    MongooseModule.forFeature([
      { name: OrgSetting.name, schema: OrgSettingSchema },
    ]),
    PassportModule.register({
      defaultStrategy: 'org-jwt',
      property: 'user',
      session: false,
    }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
    AthletesModule,
    CoachsModule,
  ],
  controllers: [OrgUsersController],
  providers: [
    OrgUsersService,
    LocalStrategy,
    JwtStrategy,
    S3Provider,
    EmailProvider,
    IsOrgUserEmailAlreadyExistConstraint,
  ],
  exports: [OrgUsersService],
})
export class OrgUsersModule {}
