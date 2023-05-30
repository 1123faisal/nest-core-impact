import { HttpModule } from '@nestjs/axios';
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TerminusModule } from '@nestjs/terminus';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CmsPagesModule } from './cms-pages/cms-pages.module';
import { ContactUsModule } from './contact-us/contact-us.module';
import { SportsModule } from './sports/sports.module';
import { UsersModule } from './users/users.module';
import { SharedModule } from './decorators/shared.module';

@Module({
  imports: [
    CacheModule.register({
      isGlobal: true,
    }),
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.DB_URI),
    AuthModule,
    UsersModule,
    SportsModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'admin'),
    }),
    TerminusModule,
    HttpModule,
    CmsPagesModule,
    ContactUsModule,
    SharedModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
})
export class AppModule {}
