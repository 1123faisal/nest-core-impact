import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, HydratedDocument } from 'mongoose';
import { Password } from 'src/common/password';

export type OrgUserDocument = HydratedDocument<OrgUser>;

@Schema()
export class OrgUser extends Document {
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
