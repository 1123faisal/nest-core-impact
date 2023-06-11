import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import mongoose, { Document, HydratedDocument, Types } from 'mongoose';
import { Coach } from 'src/coachs/entities/coach.entity';

export type TrainingDocument = HydratedDocument<Training>;

@Schema()
export class Training extends Document {
  @ApiProperty({ example: 'example.png' })
  @Prop({ type: String, default: null })
  file: string;

  @ApiProperty({ example: 'image/png' })
  @Prop({ type: String, default: null })
  mimetype: string;

  @ApiProperty({ example: 'John Doe' })
  @Prop({ default: '' })
  name: string;

  @ApiProperty({ example: 'testing' })
  @Prop({ default: '' })
  description: string;

  @ApiProperty()
  @Prop({
    type: [
      {
        type: {
          title: String,
          content: String,
        },
      },
    ],
    default: [],
  })
  steps: {
    title: string;
    content: string;
  }[];

  @ApiProperty({ example: 'Strength & Power' })
  @Prop({ default: '' })
  trainingMode: string;

  @ApiProperty({ example: 'Chest' })
  @Prop({ default: '' })
  trainingTo: string;

  @ApiProperty({ example: [new Types.ObjectId()] })
  @Prop({
    default: null,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Coach',
  })
  coach: Coach;
}

const TrainingSchema = SchemaFactory.createForClass(Training);

export { TrainingSchema };
