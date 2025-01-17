import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { Document, HydratedDocument, Types } from 'mongoose';
import { Password } from 'src/common/password';
import { Gender } from 'src/users/entities/types';
import { User } from 'src/users/entities/user.entity';

export type CoachDocument = HydratedDocument<Coach>;

@Schema()
export class Coach extends Document {
  @ApiProperty({ example: 'image.jpg' })
  @Prop({ default: null })
  avatar: string;

  @ApiProperty({ example: 'John Doe' })
  @Prop({ default: '' })
  name: string;

  @ApiProperty({ example: 'test@test.com' })
  @Prop({ default: '', unique: true })
  email: string;

  @ApiProperty({ example: '+91 9879879789' })
  @Prop({ default: '' })
  mobile: string;

  @ApiProperty({ example: 'Test@123' })
  @Prop({ default: null })
  password: string;

  @ApiProperty({ example: '1234' })
  @Prop({ default: null })
  otp: string;

  @ApiProperty({ example: new Date() })
  @Prop({ default: null })
  otpExpiration: Date;

  @ApiProperty({ example: Object.values(Gender) })
  @Prop({ default: Gender.Male })
  gender: Gender;

  @ApiProperty({ example: true })
  @Prop({ default: false })
  status: boolean;

  @ApiProperty({ example: [new Types.ObjectId()] })
  @Prop({
    default: null,
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  })
  athletes: [User];
}

const CoachSchema = SchemaFactory.createForClass(Coach);

CoachSchema.pre('save', async function (next) {
  const user = this as Coach;
  if (!user.isModified('password')) {
    next();
  }

  user.password = await Password.hashPassword(user.password);
  next();
});

export { CoachSchema };
