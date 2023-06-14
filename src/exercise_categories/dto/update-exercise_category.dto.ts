import { PartialType } from '@nestjs/swagger';
import { CreateExerciseCategoryDto } from './create-exercise_category.dto';

export class UpdateExerciseCategoryDto extends PartialType(CreateExerciseCategoryDto) {}
