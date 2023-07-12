import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, HydratedDocument } from 'mongoose';
import { Password } from 'src/common/password';

export type OrgUserDocument = HydratedDocument<OrgUser>;

@Schema()
export class OrgUser extends Document {
  @ApiProperty({ example: 'image.jpg' })
  @Prop({ default: null })
  avatar: string;

  @ApiProperty({ example: 'John Doe' })
  @Prop({ default: '' })
  name: string;

  @ApiProperty({ example: 'test@test.com' })
  @Prop({ default: '', unique: true })
  email: string;

  @ApiProperty({ example: '9879879789' })
  @Prop({ default: '' })
  mobile: string;

  @ApiProperty({ example: 'Test@123' })
  @Prop({ default: null })
  password: string;

  @ApiProperty({ example: '1234' })
  @Prop({ default: null })
  otp: string;

  @ApiProperty({ example: Date.now })
  @Prop({ default: null })
  otpExpiration: Date;
}

const OrgUserSchema = SchemaFactory.createForClass(OrgUser);

OrgUserSchema.pre('save', async function (next) {
  const user = this as OrgUser;
  if (!user.isModified('password')) {
    next();
  }

  user.password = await Password.hashPassword(user.password);
  next();
});

export { OrgUserSchema };
