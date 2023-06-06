import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, HydratedDocument } from 'mongoose';
import { Password } from 'src/common/password';
import { Gender } from 'src/users/entities/types';

export type CoachDocument = HydratedDocument<Coach>;

@Schema()
export class Coach extends Document {
  @ApiProperty({ example: 'image.jpg' })
  @Prop()
  avatar: string;

  @ApiProperty({ example: 'John Doe' })
  @Prop()
  name: string;

  @ApiProperty({ example: 'test@test.com' })
  @Prop()
  email: string;

  @ApiProperty({ example: '+91 9879879789' })
  @Prop()
  mobile: string;

  @ApiProperty({ example: 'Test@123' })
  @Prop()
  password: string;

  @ApiProperty({ example: '1234' })
  @Prop()
  otp: string;

  @ApiProperty({ example: new Date() })
  @Prop()
  otpExpiration: Date;

  @ApiProperty({ example: Object.values(Gender) })
  @Prop()
  gender: Gender;
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
