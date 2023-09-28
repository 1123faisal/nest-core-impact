import { Module } from '@nestjs/common';
import { HydrationService } from './hydration.service';
import { HydrationController } from './hydration.controller';
import { UsersModule } from 'src/users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Hydration, HydrationSchema } from './entities/hydration.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Hydration.name, schema: HydrationSchema },
    ]),
    UsersModule,
  ],
  controllers: [HydrationController],
  providers: [HydrationService],
})
export class HydrationModule {}
