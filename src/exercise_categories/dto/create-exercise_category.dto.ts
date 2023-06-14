import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import mongoose, { Types } from 'mongoose';

export class CreateExerciseCategoryDto {
  @ApiProperty({ example: 'John Doe', required: false })
  @IsString()
  name: string;

  // @Transform(({ value }) => (value === 'true' ? true : false))
  @IsBoolean()
  isParent: boolean;

  @ApiProperty({ type: Array, example: [new Types.ObjectId()] })
  @IsArray()
  @IsOptional()
  subCategories: mongoose.ObjectId[];

  //   @ApiProperty({ type: 'string', format: 'binary', required: false })
  //   @IsOptional()
  //   @IsString()
  //   avatar: Express.Multer.File | string;
}
