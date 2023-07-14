import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, HydratedDocument } from 'mongoose';

// organization dashboard setting
export type OrgDBSetting = HydratedDocument<OrgSetting>;

@Schema()
export class OrgSetting extends Document {
  @ApiProperty({ example: 'image.jpg' })
  @Prop({ default: null })
  logo: string;

  @ApiProperty({ example: 'image.jpg' })
  @Prop({ default: null })
  banner: string;
}

const OrgSettingSchema = SchemaFactory.createForClass(OrgSetting);

export { OrgSettingSchema };
