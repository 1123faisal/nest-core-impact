import { InjectQueue, Process, Processor } from '@nestjs/bull';
import { Job, Queue } from 'bull';

@Processor('audio')
export class AppConsumer {
  constructor(@InjectQueue('audio') private audioQueue: Queue) {}

  @Process('transcode')
  async transcode(job: Job<unknown>) {
    console.log('transcode called', job.id);
    return await job.finished();
  }
}
