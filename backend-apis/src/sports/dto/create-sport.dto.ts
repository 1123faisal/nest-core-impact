import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, ValidateNested } from 'class-validator';
import {
  BatSpecification,
  BatType,
  HandedType,
  KineticMovement,
  StaticMovement,
} from '../entities/sport.entity';

export class CreateSportDto {
  @ApiProperty({ example: 'Baseball' })
  @IsString()
  name: string;

  @ApiProperty()
  @ValidateNested()
  @Type(() => HandedType)
  handedType: HandedType;

  @ApiProperty()
  @ValidateNested()
  @Type(() => BatType)
  batType: BatType;

  @ApiProperty()
  @ValidateNested()
  @Type(() => KineticMovement)
  kineticMovement: KineticMovement;

  @ApiProperty()
  @ValidateNested()
  @Type(() => BatSpecification)
  batSpec: BatSpecification;

  @ApiProperty()
  @ValidateNested()
  @Type(() => StaticMovement)
  staticMovement: StaticMovement;
}
