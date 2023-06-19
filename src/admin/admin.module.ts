import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { IsAdminEmailAlreadyExistConstraint } from 'src/common/decorators/is-admin-email-registered.decorator';
import { EmailProvider } from 'src/providers/email.provider';
import { S3Provider } from 'src/providers/s3.provider';
import { AdminsAuthController } from './admin-auth.controller';
import { AdminsAuthService } from './admin-auth.service';
import { AdminsController } from './admin.controller';
import { AdminsService } from './admin.service';
import { Admin, AdminSchema } from './entities/admin.entity';
import { AdminSetting, AdminSettingSchema } from './entities/settings.entity';
import { JwtStrategy } from './jwt.strategy';
import { AdminLocalStrategy } from './local.strategy';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Admin.name, schema: AdminSchema }]),
    MongooseModule.forFeature([
      { name: AdminSetting.name, schema: AdminSettingSchema },
    ]),
    PassportModule.register({
      defaultStrategy: 'admin-jwt',
      property: 'user',
      session: false,
    }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AdminsAuthController, AdminsController],
  providers: [
    AdminsAuthService,
    AdminsService,
    AdminLocalStrategy,
    JwtStrategy,
    S3Provider,
    EmailProvider,
    IsAdminEmailAlreadyExistConstraint,
  ],
  exports: [AdminsAuthService, AdminsService],
})
export class AdminsModule {}
