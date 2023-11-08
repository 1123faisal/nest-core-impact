import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { Document, HydratedDocument, Types } from 'mongoose';
import { User } from 'src/users/entities/user.entity';

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
    example: [{ quantity: 200, in: 'Oz' }],
    required: false,
  })
  @Prop({ type: [{ quantity: Number, in: String }] })
  logs: { quantity: number; in: string }[];

  @Prop({default:0,example:50})
  totalQuantity:number;

  @ApiProperty({ example: new Types.ObjectId(), required: false })
  @Prop({ default: null, type: mongoose.Schema.Types.ObjectId, ref: 'users' })
  user: User;
}

const HydrationSchema = SchemaFactory.createForClass(Hydration);

export { HydrationSchema };
