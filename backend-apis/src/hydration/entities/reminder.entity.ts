import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { Document, HydratedDocument, Types } from 'mongoose';
import { User } from 'src/users/entities/user.entity';

export enum ReminderType {
  Auto = 'Auto',
  Custom = 'Custom',
}

const validTime = {
  validator: (v) => {
    return /^(0?[1-9]|1[012])(:[0-5]\d) [APap][mM]$/.test(v);
  },
  message: (props) => `${props.value} is not a valid time format!`,
};

export type ReminderDocument = HydratedDocument<Reminder>;

@Schema({timestamps:true})
export class Reminder extends Document {
  @ApiProperty({ example: ReminderType.Auto, required: false })
  @Prop({
    // type: String,
    enum: Object.values(ReminderType),
    default: ReminderType.Auto,
  })
  reminderType: ReminderType;

  @ApiProperty({ example: '12:12 AM', required: false })
  @Prop({ default: '' })
  time: string;

  @ApiProperty({ example: '12:12 AM', required: false })
  @Prop({ default: '' })
  startTime: string;

  @ApiProperty({ example: '12:12 AM', required: false })
  @Prop({ default: '' })
  endTime: string;

  @ApiProperty({
    example: new Types.ObjectId(),
    required: false,
  })
  @Prop({
    default: null,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
  })
  user: User;
}

const ReminderSchema = SchemaFactory.createForClass(Reminder);

export { ReminderSchema };
