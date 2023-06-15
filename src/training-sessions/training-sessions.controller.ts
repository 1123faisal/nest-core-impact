import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { TrainingSessionsService } from './training-sessions.service';
import { CreateTrainingSessionDto } from './dto/create-training-session.dto';
import { UpdateTrainingSessionDto } from './dto/update-training-session.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuardIsCoach } from 'src/coachs/jwt-auth.guard';
import { isMongoIdPipe } from 'src/common/pipes/is-mongo-id.pipe';
import { TrainingSession } from './entities/training-session.entity';

@ApiTags('Training Sessions')
@Controller('training-sessions')
export class TrainingSessionsController {
  constructor(
    private readonly trainingSessionsService: TrainingSessionsService,
  ) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuardIsCoach)
  @Post()
  create(
    @Body() createTrainingSessionDto: CreateTrainingSessionDto,
    @Req() { user },
  ): Promise<TrainingSession> {
    return this.trainingSessionsService.create(
      createTrainingSessionDto,
      user.id,
    );
  }

  @Get()
  findAll(): Promise<TrainingSession[]> {
    return this.trainingSessionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', isMongoIdPipe) id: string): Promise<TrainingSession> {
    return this.trainingSessionsService.findOne(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuardIsCoach)
  @Patch(':id')
  update(
    @Param('id', isMongoIdPipe) id: string,
    @Body() updateTrainingSessionDto: UpdateTrainingSessionDto,
  ): Promise<TrainingSession> {
    return this.trainingSessionsService.update(id, updateTrainingSessionDto);
  }

  @Delete(':id')
  remove(@Param('id', isMongoIdPipe) id: string) {
    this.trainingSessionsService.remove(id);
  }
}
