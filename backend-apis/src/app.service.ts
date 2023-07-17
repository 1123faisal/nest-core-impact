import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { DateTimeProvider } from './providers/datetime.provider';
// import { Cron } from '@nestjs/schedule';
import { Queue } from 'bull';

@Injectable()
export class AppService {
  constructor(
    // @InjectQueue('audio') private audioQueue: Queue,
    private dateTimeProvider: DateTimeProvider,
  ) {}

  /**
   * this function run when app start, perform some operations like create default etc.
   */
  async createDefaultAdmin() {
    // const job = await this.audioQueue.add(
    //   'transcode',
    //   {
    //     foo: 'bar',
    //   },
    //   {
    //     delay: 1000 * 10,
    //   },
    // );
    console.log('called create admin', process.env.PORT);
  }

  getHealth(): string {
    const utcDateTime = this.dateTimeProvider.getUtc(
      '2023-07-12 16:00',
      'Asia/Kolkata',
      'YYYY-MM-DD HH:mm',
    );
    console.log(utcDateTime, utcDateTime.toDate());
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
