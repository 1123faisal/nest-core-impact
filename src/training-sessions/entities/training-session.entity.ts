import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { Document, HydratedDocument, Types } from 'mongoose';
import { Training } from 'src/trainings/entities/training.entity';
import { User } from 'src/users/entities/user.entity';

export type TrainingSessionDocument = HydratedDocument<TrainingSession>;

@Schema()
export class TrainingSession extends Document {
  @ApiProperty({ example: 'Baseball' })
  @Prop({ default: null })
  exCategory: string;

  @ApiProperty({ example: 'Baseball' })
  @Prop({ default: null })
  exSubCategory: string;

  @ApiProperty({ example: new Types.ObjectId() })
  @Prop({
    default: null,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Training',
  })
  exercise: Training;

  @ApiProperty({ example: new Types.ObjectId() })
  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    default: null,
  })
  athletes: User[];
}

const TrainingSessionSchema = SchemaFactory.createForClass(TrainingSession);

export { TrainingSessionSchema };
