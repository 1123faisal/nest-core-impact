import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

export class SetTargetDto {
  @ApiProperty({ example: 200 })
  @IsNumber()
  target: number;

  @ApiProperty()
  @IsOptional()
  logs: [];
}
