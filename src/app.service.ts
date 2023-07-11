import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
// import { Cron } from '@nestjs/schedule';
// import { Queue } from 'bull';

@Injectable()
export class AppService {
  // constructor(@InjectQueue('audio') private audioQueue: Queue) {}

  getHealth(): string {
    return 'OK';
  }

  // @Cron('* * * * * *')
  // everySec() {
  //   console.count();
  // }

  // @Cron('0 * * * * *')
  // async handleCron() {
  //   // console.log(
  //   //   await this.audioQueue.removeJobs('*'),
  //   //   await this.audioQueue.empty(),
  //   // );

  //   const job = await this.audioQueue.add(
  //     'transcode',
  //     {
  //       foo: 'bar',
  //     },
  //     {
  //       delay: 1000 * 10,
  //     },
  //   );
  //   console.log({ jid: job.id });
  //   console.log('Called every one minute');
  // }
}
