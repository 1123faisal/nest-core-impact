import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { SharedModule } from 'src/decorators/shared.module';
import { ContactUsController } from './contact-us.controller';
import { ContactUsService } from './contact-us.service';
import { Contact, ContactSchema } from './entities/contact-us.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    MongooseModule.forFeature([{ name: Contact.name, schema: ContactSchema }]),
    SharedModule,
  ],
  controllers: [ContactUsController],
  providers: [ContactUsService],
  exports: [ContactUsService],
})
export class ContactUsModule {}
