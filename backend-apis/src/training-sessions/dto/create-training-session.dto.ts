import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';
import mongoose, { Types } from 'mongoose';

export class CreateTrainingSessionDto {
  @ApiProperty({ example: 'Strength & Power' })
  @IsString()
  exCategory;

  @ApiProperty({ example: 'Chest' })
  @IsString()
  exSubCategory;

  @ApiProperty({ example: new Types.ObjectId() })
  @IsString()
  exercise;

  @ApiProperty({ type: Array, example: [new Types.ObjectId()] })
  @IsArray()
  athletes: mongoose.ObjectId[];
}
