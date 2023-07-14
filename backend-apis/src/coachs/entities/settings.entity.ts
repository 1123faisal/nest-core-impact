import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, HydratedDocument } from 'mongoose';

// organization dashboard setting
export type CoachDBSetting = HydratedDocument<CoachSetting>;

@Schema()
export class CoachSetting extends Document {
  @ApiProperty({ example: 'image.jpg' })
  @Prop({ default: null })
  logo: string;

  @ApiProperty({ example: 'image.jpg' })
  @Prop({ default: null })
  banner: string;
}

const CoachSettingSchema = SchemaFactory.createForClass(CoachSetting);

export { CoachSettingSchema };
