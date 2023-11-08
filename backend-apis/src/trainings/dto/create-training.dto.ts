import { BadRequestException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsJSON,
  IsNotEmpty,
  IsOptional,
  IsString,
  Validate,
} from 'class-validator';
import { Types } from 'mongoose';

export class Step {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  content: string;
}

export class CreateTrainingDto {
  @ApiProperty({ example: 'Barbell Bench Chest' })
  @IsString()
  name: string;

  @ApiProperty({
    example:
      '[{"title":"Step 1","content":"Content 1"},{"title":"Step 2","content":"Content 2"}]',
  })
  @IsNotEmpty()
  @IsString()
  @IsJSON({ message: 'Steps must be a valid JSON string' })
  steps: string;

  @ApiProperty({ type: 'string', format: 'binary', required: false })
  @IsOptional()
  file: Express.Multer.File;

  @ApiProperty({ example: 'testing' })
  @IsString()
  description: string;

  @ApiProperty({ example: new Types.ObjectId() })
  @IsString()
  exCategory: string;

  @ApiProperty({ example: new Types.ObjectId() })
  @IsString()
  exSubCategory: string;
}
