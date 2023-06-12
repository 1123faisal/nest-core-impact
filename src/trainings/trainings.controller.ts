import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiExtraModels,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuardIsCoach } from 'src/coachs/jwt-auth.guard';
import { PaginatedDto } from 'src/sports/dto/paginates.dto';
import { CreateTrainingDto } from './dto/create-training.dto';
import { UpdateTrainingDto } from './dto/update-training.dto';
import { TrainingsService } from './trainings.service';

@ApiExtraModels(PaginatedDto)
@ApiTags('Trainings')
@Controller('trainings')
export class TrainingsController {
  constructor(private readonly trainingsService: TrainingsService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuardIsCoach)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @Post()
  create(
    @UploadedFile()
    file: Express.Multer.File,
    @Body() createTrainingDto: CreateTrainingDto,
    @Req() { user },
  ) {
    createTrainingDto.file = file;
    return this.trainingsService.create(createTrainingDto, user.id);
  }

  @Get()
  findAll() {
    return this.trainingsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.trainingsService.findOne(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuardIsCoach)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @Patch(':id')
  update(
    @Param('id') id: string,
    @UploadedFile()
    file: Express.Multer.File,
    @Body() updateTrainingDto: UpdateTrainingDto,
    @Req() { user },
  ) {
    updateTrainingDto.file = file;
    return this.trainingsService.update(id, updateTrainingDto, user.id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuardIsCoach)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.trainingsService.remove(id);
  }
}
