import { Module } from '@nestjs/common';
import { CmsPagesService } from './cms-pages.service';
import { CmsPagesController } from './cms-pages.controller';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { CmsPage, CmsPageSchema } from './entities/cms-page.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    MongooseModule.forFeature([{ name: CmsPage.name, schema: CmsPageSchema }]),
  ],
  controllers: [CmsPagesController],
  providers: [CmsPagesService],
})
export class CmsPagesModule {}
