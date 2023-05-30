import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags } from '@nestjs/swagger';
import {
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
  MongooseHealthIndicator,
} from '@nestjs/terminus';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@ApiTags('App')
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private db: MongooseHealthIndicator,
    @InjectConnection()
    private defaultConnection: Connection,
  ) {}

  @Get('/health')
  @HealthCheck()
  check() {
    return this.health.check([
      // () => this.http.pingCheck('nestjs-docs', 'https://docs.nestjs.com'),
      () =>
        this.db.pingCheck('database', { connection: this.defaultConnection }),
    ]);
  }
}
