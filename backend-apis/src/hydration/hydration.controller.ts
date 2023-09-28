import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateHydrationLogDto } from './dto/create-hydration-log.dto';
import { SetTargetDto } from './dto/set-target.dto';
import { UpdateHydrationLogDto } from './dto/update-hydration-log.dto';
import { HydrationService } from './hydration.service';
import { ApiTags } from '@nestjs/swagger';
import { GetHydrationsDto } from './dto/get-hydration.dto';

@ApiTags('Hydration')
@Controller('hydration')
export class HydrationController {
  constructor(private readonly hydrationService: HydrationService) {}

  @Post('/set-target')
  setTarget(@Body() setTargetDto: SetTargetDto) {
    return this.hydrationService.setTarget(setTargetDto);
  }

  @Post()
  create(@Body() createHydrationDto: CreateHydrationLogDto) {
    return this.hydrationService.create(createHydrationDto);
  }

  @Get()
  findAll(@Query() query?: GetHydrationsDto) {
    return this.hydrationService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.hydrationService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateHydrationDto: UpdateHydrationLogDto,
  ) {
    return this.hydrationService.update(id, updateHydrationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.hydrationService.remove(id);
  }
}
