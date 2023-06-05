import { Controller, Get, Inject, Query, Req, Res } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { ApiTags } from '@nestjs/swagger';
import {
  HealthCheck,
  HealthCheckService,
  MongooseHealthIndicator,
} from '@nestjs/terminus';
import { Cache } from 'cache-manager';
import { Request, Response } from 'express';
import { Connection } from 'mongoose';
import * as sharp from 'sharp';
import { S3Provider } from './providers/s3.provider';

@ApiTags('App')
@Controller()
export class AppController {
  constructor(
    private health: HealthCheckService,
    private db: MongooseHealthIndicator,
    private s3Provider: S3Provider,
    @InjectConnection()
    private defaultConnection: Connection,
    @Inject('CACHE_MANAGER') private cacheManager: Cache,
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

  @Get('image')
  async serveOptimizedImage(
    @Query('height') height: number,
    @Query('width') width: number,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const data: any = await this.cacheManager.get(req.url);

    if (data) {
      res.set({
        'Content-Type': 'image/jpeg', // Adjust the content type based on your image format
        'Content-Length': data.length.toString(),
      });

      // Send the image buffer as the response
      return res.send(data);
    }

    // Retrieve the image from S3 based on your existing logic
    const originalImageBuffer = await this.s3Provider.retrieveImageFromS3(
      'https://fetch-delivery.s3.amazonaws.com/a572c4c7-bc61-489d-93a4-df74efacd1e8.jpg',
    );

    // Apply image optimization based on the provided query parameters
    const optimizedImageBuffer = await sharp(originalImageBuffer)
      .resize(Number(height), Number(width))
      .jpeg({ quality: 80 })
      .toBuffer();

    // await this.cacheManager.set(req.url, 'optimizedImageBuffer');
    console.log({
      vv: await this.cacheManager.get(req.url),
    });

    res.set({
      'Content-Type': 'image/jpeg', // Adjust the content type based on your image format
      'Content-Length': optimizedImageBuffer.length.toString(),
    });

    // Send the image buffer as the response
    return res.send(optimizedImageBuffer);
  }
}
