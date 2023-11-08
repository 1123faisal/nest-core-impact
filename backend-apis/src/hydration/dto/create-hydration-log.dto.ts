import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateHydrationLogDto {
  @ApiProperty({ example: 2 })
  @IsNumber()
  quantity: number;

  @ApiProperty({ example: 'ml' })
  @IsString()
  in: string;

  @ApiProperty({ example: 56 })
  @IsOptional()
  totalQ;
}
