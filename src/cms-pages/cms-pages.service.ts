import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCmsPageDto } from './dto/create-cms-page.dto';
import { UpdateCmsPageDto } from './dto/update-cms-page.dto';
import { CmsPage } from './entities/cms-page.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class CmsPagesService {
  constructor(
    @InjectModel(CmsPage.name) private readonly cmsPage: Model<CmsPage>,
  ) {}

  async create(createCmsPageDto: CreateCmsPageDto): Promise<CmsPage> {
    return await this.cmsPage.create(createCmsPageDto);
  }

  async findAll(): Promise<CmsPage[]> {
    return await this.cmsPage.find().sort({ _id: -1 });
  }

  async findOne(key: string): Promise<CmsPage> {
    const page = await this.cmsPage.findOne({ key });

    if (!page) {
      throw new NotFoundException('no page found');
    }

    return page;
  }

  async update(key: string, updateCmsPageDto: UpdateCmsPageDto) {
    await this.findOne(key);
    await this.cmsPage.findOneAndUpdate({ key }, updateCmsPageDto);
  }

  async remove(key: string) {
    await this.findOne(key);
    await this.cmsPage.findOneAndRemove({ key });
  }
}
