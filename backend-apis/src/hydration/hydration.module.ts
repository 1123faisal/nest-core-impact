import { Module } from '@nestjs/common';
import { HydrationService } from './hydration.service';
import { HydrationController } from './hydration.controller';
import { UsersModule } from 'src/users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Hydration, HydrationSchema } from './entities/hydration.entity';
import { ReminderController } from './reminder.controller';
import { ReminderService } from './reminder.service';
import { Reminder, ReminderSchema } from './entities/reminder.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Hydration.name, schema: HydrationSchema },
    ]),
    MongooseModule.forFeature([
      { name: Reminder.name, schema: ReminderSchema },
    ]),
    UsersModule,
  ],
  controllers: [HydrationController, ReminderController],
  providers: [HydrationService, ReminderService],
})
export class HydrationModule {}
