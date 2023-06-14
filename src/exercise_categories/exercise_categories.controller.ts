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
import { ExerciseCategoriesService } from './exercise_categories.service';
import { CreateExerciseCategoryDto } from './dto/create-exercise_category.dto';
import { UpdateExerciseCategoryDto } from './dto/update-exercise_category.dto';
import { isMongoIdPipe } from 'src/common/pipes/is-mongo-id.pipe';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuardIsAdmin } from 'src/admin/jwt-auth.guard';
import { ExerciseCategory } from './entities/exercise_category.entity';

@ApiTags("Exercise's Categories")
@Controller('exercise-categories')
export class ExerciseCategoriesController {
  constructor(
    private readonly exerciseCategoriesService: ExerciseCategoriesService,
  ) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuardIsAdmin)
  @Post()
  create(
    @Body() createExerciseCategoryDto: CreateExerciseCategoryDto,
  ): Promise<ExerciseCategory> {
    return this.exerciseCategoriesService.create(createExerciseCategoryDto);
  }

  @Get()
  findAll(): Promise<ExerciseCategory[]> {
    return this.exerciseCategoriesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', isMongoIdPipe) id: string): Promise<ExerciseCategory> {
    return this.exerciseCategoriesService.findOne(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuardIsAdmin)
  @Patch(':id')
  update(
    @Param('id', isMongoIdPipe) id: string,
    @Body() updateExerciseCategoryDto: UpdateExerciseCategoryDto,
  ): Promise<ExerciseCategory> {
    return this.exerciseCategoriesService.update(id, updateExerciseCategoryDto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuardIsAdmin)
  @Delete(':id')
  remove(@Param('id', isMongoIdPipe) id: string): Promise<ExerciseCategory> {
    return this.exerciseCategoriesService.remove(id);
  }
}
