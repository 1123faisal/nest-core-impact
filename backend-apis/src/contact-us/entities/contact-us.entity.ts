import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { Document, HydratedDocument, Types } from 'mongoose';
import { User } from 'src/users/entities/user.entity';

export type ContactDocument = HydratedDocument<Contact>;

@Schema()
export class Contact extends Document {
  @ApiProperty({ example: 'test@test.com' })
  @Prop({ default: '' })
  email: string;

  @ApiProperty({ example: 'John' })
  @Prop({ default: '' })
  name: string;

  @ApiProperty({ example: 'test message...' })
  @Prop({ default: '' })
  message: string;

  @ApiProperty({ example: new Types.ObjectId() })
  @Prop({ default: null, type: mongoose.Schema.Types.ObjectId, ref: 'users' })
  user: User;
}

const ContactSchema = SchemaFactory.createForClass(Contact);

export { ContactSchema };
