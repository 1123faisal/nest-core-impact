import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { TrainingSessionsService } from './training-sessions.service';
import { CreateTrainingSessionDto } from './dto/create-training-session.dto';
import { UpdateTrainingSessionDto } from './dto/update-training-session.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuardIsCoach } from 'src/coachs/jwt-auth.guard';

@ApiTags('Training Sessions')
@Controller('training-sessions')
export class TrainingSessionsController {
  constructor(
    private readonly trainingSessionsService: TrainingSessionsService,
  ) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuardIsCoach)
  @Post()
  create(@Body() createTrainingSessionDto: CreateTrainingSessionDto) {
    return this.trainingSessionsService.create(createTrainingSessionDto);
  }

  @Get()
  findAll() {
    return this.trainingSessionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.trainingSessionsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTrainingSessionDto: UpdateTrainingSessionDto,
  ) {
    return this.trainingSessionsService.update(id, updateTrainingSessionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.trainingSessionsService.remove(id);
  }
}
