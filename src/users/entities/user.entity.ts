import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, HydratedDocument, Types } from 'mongoose';
import { Gender, Role } from './types';
import { Password } from 'src/common/password';
import { ApiProperty } from '@nestjs/swagger';
import { Sport } from 'src/sports/entities/sport.entity';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User extends Document {
  @ApiProperty({ example: 'image.jpg' })
  @Prop()
  avatar: string;

  @ApiProperty({ example: 'John Doe' })
  @Prop()
  name: string;

  @ApiProperty({ example: 'JD' })
  @Prop()
  nickname: string;

  @ApiProperty({ example: '6.8' })
  @Prop()
  height: string;

  @ApiProperty({ example: '80' })
  @Prop()
  weight: string;

  @ApiProperty({ example: 'cm' })
  @Prop()
  heightIn: string;

  @ApiProperty({ example: 'kg' })
  @Prop()
  weightIn: string;

  @ApiProperty({ example: Gender.Male })
  @Prop({
    enum: Object.values(Gender),
  })
  gender: string;

  @ApiProperty({ example: 'US' })
  @Prop()
  country: string;

  @ApiProperty({ example: 'Taxes' })
  @Prop()
  state: string;

  @ApiProperty({ example: '343434' })
  @Prop()
  zipCode: string;

  @ApiProperty({ example: 'test@test.com' })
  @Prop()
  email: string;

  @ApiProperty({ example: 'Test@123' })
  @Prop()
  password: string;

  @ApiProperty({ example: Role.Elite })
  @Prop({
    enum: Object.values(Role),
  })
  role: Role;

  @ApiProperty({ example: '1234' })
  @Prop()
  otp: string;

  @ApiProperty({ example: new Date() })
  @Prop()
  otpExpiration: Date;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'sports' })
  sport: Sport;
}

const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', async function (next) {
  const user = this as User;
  if (!user.isModified('password')) {
    next();
  }

  user.password = await Password.hashPassword(user.password);
  next();
});

export { UserSchema };
