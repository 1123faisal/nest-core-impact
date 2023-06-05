import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, HydratedDocument } from 'mongoose';
import slugify from 'slugify';

export type CmsPageDocument = HydratedDocument<CmsPage>;

@Schema()
export class CmsPage extends Document {
  @ApiProperty({ example: 'About Us' })
  @Prop()
  name: string;

  @ApiProperty({ example: 'about content' })
  @Prop()
  key: string;

  @ApiProperty({ example: 'about content' })
  @Prop()
  content: string;
}

const CmsPageSchema = SchemaFactory.createForClass(CmsPage);

CmsPageSchema.pre('save', async function (next) {
  const page = this as CmsPage;
  if (!page.isModified('name')) {
    next();
  }

  page.key = slugify(page.name, { lower: true });
  next();
});

export { CmsPageSchema };
