import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateHydrationLogDto } from './dto/create-hydration-log.dto';
import { SetTargetDto } from './dto/set-target.dto';
import { UpdateHydrationLogDto } from './dto/update-hydration-log.dto';
import { HydrationService } from './hydration.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetHydrationsDto } from './dto/get-hydration.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiTags('Hydration')
@Controller('hydration')
export class HydrationController {
  constructor(private readonly hydrationService: HydrationService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('/set-target')
  setTarget(@Body() setTargetDto: SetTargetDto, @Req() req: any) {
    return this.hydrationService.setTarget(setTargetDto, req.user.id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createHydrationDto: CreateHydrationLogDto, @Req() req: any) {
    return this.hydrationService.create(createHydrationDto, req.user.id);
  }

  @Get()
  findAll(@Query() query?: GetHydrationsDto) {
    return this.hydrationService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.hydrationService.findOne(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateHydrationDto: UpdateHydrationLogDto,
  ) {
    return this.hydrationService.update(id, updateHydrationDto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.hydrationService.remove(id);
  }
}
