import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CmsPagesController } from './cms-pages.controller';
import { CmsPagesService } from './cms-pages.service';
import { CmsPage, CmsPageSchema } from './entities/cms-page.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: CmsPage.name, schema: CmsPageSchema }]),
  ],
  controllers: [CmsPagesController],
  providers: [CmsPagesService],
})
export class CmsPagesModule {}
