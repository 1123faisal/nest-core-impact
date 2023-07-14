import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseBoolPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuardIsAdmin } from 'src/admin/jwt-auth.guard';
import { isMongoIdPipe } from 'src/common/pipes/is-mongo-id.pipe';
import { CreateExerciseCategoryDto } from './dto/create-exercise_category.dto';
import { CreateSubExerciseCategoryDto } from './dto/create-sub-exercise_category.dto';
import { UpdateExerciseCategoryDto } from './dto/update-exercise_category.dto';
import { ExerciseCategory } from './entities/exercise_category.entity';
import { ExerciseCategoriesService } from './exercise_categories.service';

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
  findAll(
    @Query('isParent', ParseBoolPipe) isParent: boolean,
    @Query('parentId', new DefaultValuePipe(null), isMongoIdPipe)
    parentId: string,
  ): Promise<ExerciseCategory[]> {
    return this.exerciseCategoriesService.findAll(isParent, parentId);
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
  @Post('sub')
  createSubCategory(
    @Body() createSubExerciseCategoryDto: CreateSubExerciseCategoryDto,
  ): Promise<ExerciseCategory> {
    return this.exerciseCategoriesService.createSubCategory(
      createSubExerciseCategoryDto,
    );
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuardIsAdmin)
  @Delete(':id')
  remove(@Param('id', isMongoIdPipe) id: string): Promise<ExerciseCategory> {
    return this.exerciseCategoriesService.remove(id);
  }
}
