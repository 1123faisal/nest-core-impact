import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import mongoose, { Types } from 'mongoose';

export class CreateSubExerciseCategoryDto {
  @ApiProperty({ example: 'John Doe', required: false })
  @IsString()
  name: string;

  @ApiProperty({ example: new Types.ObjectId() })
  @IsString()
  categoryId: mongoose.ObjectId;

  //   @ApiProperty({ type: 'string', format: 'binary', required: false })
  //   @IsOptional()
  //   @IsString()
  //   avatar: Express.Multer.File | string;
}
