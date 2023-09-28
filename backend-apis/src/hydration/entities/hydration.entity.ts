import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, HydratedDocument } from 'mongoose';

export type HydrationDocument = HydratedDocument<Hydration>;

@Schema()
export class Hydration extends Document {
  @ApiProperty({ example: '2022-12-23', required: false })
  @Prop()
  date: Date;

  @ApiProperty({ example: 200, required: false })
  @Prop({ default: 0 })
  target: number;

  @ApiProperty({
    type: [Object],
    example: [{ quantity: 200, in: 'ml' }],
    required: false,
  })
  @Prop({ type: [{ quantity: Number, in: String }] })
  logs: { quantity: number; in: string }[];
}

const HydrationSchema = SchemaFactory.createForClass(Hydration);

export { HydrationSchema };
