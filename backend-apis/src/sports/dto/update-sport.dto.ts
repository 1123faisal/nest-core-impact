import { PartialType } from '@nestjs/swagger';
import { CreateSportDto } from './create-sport.dto';
import {
  BatSpecification,
  BatType,
  HandedType,
  KineticMovement,
  StaticMovement,
} from '../entities/sport.entity';

export class UpdateSportDto extends PartialType(CreateSportDto) {
  batSpec?: BatSpecification;
  batType?: BatType;
  handedType?: HandedType;
  kineticMovement?: KineticMovement;
  staticMovement?: StaticMovement;
}
