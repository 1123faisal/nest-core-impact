import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CmsPagesService } from './cms-pages.service';
import { CreateCmsPageDto } from './dto/create-cms-page.dto';
import { UpdateCmsPageDto } from './dto/update-cms-page.dto';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('CMS Pages')
@Controller('cms-pages')
export class CmsPagesController {
  constructor(private readonly cmsPagesService: CmsPagesService) {}

  @Post()
  create(@Body() createCmsPageDto: CreateCmsPageDto) {
    return this.cmsPagesService.create(createCmsPageDto);
  }

  @Get()
  findAll() {
    return this.cmsPagesService.findAll();
  }

  @Get(':key')
  findOne(@Param('key') key: string) {
    return this.cmsPagesService.findOne(key);
  }

  @Patch(':key')
  update(
    @Param('key') key: string,
    @Body() updateCmsPageDto: UpdateCmsPageDto,
  ) {
    return this.cmsPagesService.update(key, updateCmsPageDto);
  }

  @Delete(':key')
  remove(@Param('key') key: string) {
    return this.cmsPagesService.remove(key);
  }
}
