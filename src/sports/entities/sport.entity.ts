import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString } from 'class-validator';
import mongoose, { Document, HydratedDocument, Types } from 'mongoose';
import { User } from 'src/users/entities/user.entity';

export type SportDocument = HydratedDocument<Sport>;

export class HandedType {
  @ApiProperty()
  @IsBoolean()
  left: boolean;

  @ApiProperty()
  @IsBoolean()
  right: boolean;
}

export class BatType {
  @ApiProperty()
  @IsBoolean()
  wood: boolean;

  @ApiProperty()
  @IsBoolean()
  metal: boolean;
}

export class KineticMovement {
  @ApiProperty()
  @IsBoolean()
  throwing: boolean;

  @ApiProperty()
  @IsBoolean()
  hitting: boolean;
}

export class StaticMovement {
  @ApiProperty()
  @IsBoolean()
  muscleZone: boolean;

  @ApiProperty()
  @IsBoolean()
  muscleFatigue: boolean;

  @ApiProperty()
  @IsBoolean()
  heartRate: boolean;

  @ApiProperty()
  @IsBoolean()
  muscleAcceleration: boolean;
}

export class BatSpecification {
  @ApiProperty({ example: 'Generic' })
  @IsString()
  make: string;

  @ApiProperty({ example: 'wood' })
  @IsString()
  model: string;

  @ApiProperty({ example: '33.0 in' })
  @IsString()
  length: string;

  @ApiProperty({ example: '30 oz' })
  @IsString()
  weight: string;
}

@Schema()
export class Sport extends Document {
  @ApiProperty({ example: 'Baseball' })
  @Prop()
  name: string;

  @ApiProperty()
  @Prop({ type: HandedType })
  handedType: HandedType;

  @ApiProperty()
  @Prop({ type: BatType })
  batType: BatType;

  @ApiProperty()
  @Prop({ type: KineticMovement })
  kineticMovement: KineticMovement;

  @ApiProperty()
  @Prop({ type: BatSpecification })
  batSpec: BatSpecification;

  @ApiProperty()
  @Prop({ type: StaticMovement })
  staticMovement: StaticMovement;

  @ApiProperty({ example: new Types.ObjectId() })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'users' })
  user: User;
}

const SportSchema = SchemaFactory.createForClass(Sport);

export { SportSchema };
