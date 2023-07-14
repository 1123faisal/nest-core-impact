import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { Document, HydratedDocument, Types } from 'mongoose';
import { Password } from 'src/common/password';
import { Sport } from 'src/sports/entities/sport.entity';
import { Gender, Role } from './types';
import { Coach } from 'src/coachs/entities/coach.entity';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User extends Document {
  @ApiProperty({ example: 'image.jpg' })
  @Prop({ default: null })
  avatar: string;

  @ApiProperty({ example: 'John Doe' })
  @Prop({ default: '' })
  name: string;

  @ApiProperty({ example: 'JD' })
  @Prop({ default: '' })
  nickname: string;

  @ApiProperty({ example: '6.8' })
  @Prop({ default: '' })
  height: string;

  @ApiProperty({ example: '80' })
  @Prop({ default: '' })
  weight: string;

  @ApiProperty({ example: 'cm' })
  @Prop({ default: '' })
  heightIn: string;

  @ApiProperty({ example: 'kg' })
  @Prop({ default: '' })
  weightIn: string;

  @ApiProperty({ example: Gender.Male })
  @Prop({
    default: Gender.Male,
    enum: Object.values(Gender),
  })
  gender: Gender;

  @ApiProperty({ example: 'US' })
  @Prop({ default: '' })
  country: string;

  @ApiProperty({ example: 'Taxes' })
  @Prop({ default: '' })
  state: string;

  @ApiProperty({ example: '343434' })
  @Prop({ default: '' })
  zipCode: string;

  @ApiProperty({ example: 'test@test.com' })
  @Prop({ default: '', unique: true })
  email: string;

  @ApiProperty({ example: true })
  @Prop({ default: false })
  status: boolean;

  @ApiProperty({ example: 'Test@123' })
  @Prop({ default: null })
  password: string;

  @ApiProperty({ example: Role.Elite })
  @Prop({
    default: Role.Elite,
    enum: Object.values(Role),
  })
  role: Role;

  @ApiProperty({ example: '1234' })
  @Prop({ default: null })
  otp: string;

  @ApiProperty({ example: '9879879877' })
  @Prop({ default: null })
  mobile: string;

  @ApiProperty({ example: '9879879877' })
  @Prop({ default: null })
  provider?: string;

  @ApiProperty({ example: '9879879877' })
  @Prop({ default: null })
  sub?: string;

  @ApiProperty({ example: new Date() })
  @Prop({ default: null })
  otpExpiration: Date;

  @Prop({
    default: null,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sport',
  })
  sport: Sport;

  @ApiProperty({ example: true })
  @Prop({ default: false })
  profileCompleted: boolean;

  @ApiProperty({ example: [new Types.ObjectId()] })
  @Prop({
    default: null,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Coach',
  })
  physician_coach: Coach;

  @ApiProperty({ example: [new Types.ObjectId()] })
  @Prop({
    default: null,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Coach',
  })
  batting_coach: Coach;

  @ApiProperty({ example: [new Types.ObjectId()] })
  @Prop({
    default: null,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Coach',
  })
  trainer_coach: Coach;

  @ApiProperty({ example: [new Types.ObjectId()] })
  @Prop({
    default: null,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Coach',
  })
  pitching_coach: Coach;
}

const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', async function (next) {
  const user = this as User;
  if (!user.isModified('password')) {
    return next();
  }

  user.password = await Password.hashPassword(user.password);
  next();
});

export { UserSchema };
