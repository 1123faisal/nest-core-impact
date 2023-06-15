import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { Document, HydratedDocument, Types } from 'mongoose';

// organization dashboard setting
export type ExerciseCategoryDocument = HydratedDocument<ExerciseCategory>;

@Schema()
export class ExerciseCategory extends Document {
  @ApiProperty({ example: true })
  @Prop({ default: true })
  isParent: boolean;

  @ApiProperty({ example: 'Strength and power / Chest' })
  @Prop({ default: '' })
  name: string;

  @ApiProperty({ example: true })
  @Prop({ default: true })
  status: boolean;

  @ApiProperty({
    example: [new Types.ObjectId()],
    isArray: true,
  })
  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ExerciseCategory' }],
    default: null,
  })
  subCategories: ExerciseCategory[];
}

const ExerciseCategorySchema = SchemaFactory.createForClass(ExerciseCategory);

export { ExerciseCategorySchema };
