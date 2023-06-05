import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { IsOrgUserEmailAlreadyExistConstraint } from 'src/decorators/is-org-user-email-registered.decorator';
import { S3Provider } from 'src/providers/s3.provider';
import { OrgUser, OrgUserSchema } from './entities/org-user.entity';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';
import { OrgUsersController } from './org-users.controller';
import { OrgUsersService } from './org-users.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    MongooseModule.forFeature([{ name: OrgUser.name, schema: OrgUserSchema }]),
    PassportModule.register({
      defaultStrategy: 'org-jwt',
      property: 'user',
      session: false,
    }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [OrgUsersController],
  providers: [
    OrgUsersService,
    LocalStrategy,
    JwtStrategy,
    S3Provider,
    IsOrgUserEmailAlreadyExistConstraint,
  ],
  exports: [OrgUsersService],
})
export class OrgUsersModule {}
