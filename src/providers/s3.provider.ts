import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client } from '@aws-sdk/client-s3';

@Injectable()
export class S3Provider {
  private s3: S3Client;

  constructor(private readonly configService: ConfigService) {
    this.s3 = new S3Client({
      credentials: {
        accessKeyId: configService.get('AWS_ACCESS_KEY'),
        secretAccessKey: configService.get('AWS_SECRET_KEY'),
      },
      region: configService.get('AWS_REGION'),
    });
  }

  getS3Instance(): S3Client {
    return this.s3;
  }
}
