import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { Queue } from 'bull';

@Injectable()
export class AppService {
  constructor(@InjectQueue('audio') private audioQueue: Queue) {}

  getHealth(): string {
    return 'OK';
  }

  @Cron('0 * * * * *')
  async handleCron() {
    const job = await this.audioQueue.add(
      'transcode',
      {
        foo: 'bar',
      },
      {
        repeat: {
          every: 10000,
          limit: 2,
        },
      },
    );
    console.log('Called every one minute');
    console.log({ job });
    console.log('Called every one minute');
  }
}
