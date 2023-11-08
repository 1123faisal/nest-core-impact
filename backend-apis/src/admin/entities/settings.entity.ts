import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, HydratedDocument } from 'mongoose';

// organization dashboard setting
export type AdminDBSetting = HydratedDocument<AdminSetting>;

@Schema()
export class AdminSetting extends Document {
  @ApiProperty({ example: 'image.jpg' })
  @Prop({ default: null })
  logo: string;

  @ApiProperty({ example: 'image.jpg' })
  @Prop({ default: null })
  banner: string;
}

const AdminSettingSchema = SchemaFactory.createForClass(AdminSetting);

export { AdminSettingSchema };
