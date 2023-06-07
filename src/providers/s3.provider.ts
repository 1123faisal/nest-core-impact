import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';

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

  async retrieveImageFromS3(s3FileUri: string): Promise<Buffer> {
    const imageName = s3FileUri.replace(
      'https://fetch-delivery.s3.amazonaws.com/',
      '',
    ); // Replace with the actual image name or identifier
    // ('https://fetch-delivery.s3.amazonaws.com/a572c4c7-bc61-489d-93a4-df74efacd1e8.jpg');

    // Create a command to get the object from S3
    const getObjectCommand = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: imageName,
    });

    try {
      // Use the S3 client to send the getObject command and retrieve the image
      const response = await this.s3.send(getObjectCommand);

      // Read the response body as a Buffer
      const imageBuffer = await new Response(
        await response.Body.transformToByteArray(),
      ).arrayBuffer();

      return Buffer.from(imageBuffer);
    } catch (error) {
      // Handle any errors that occur during the retrieval
      console.error('Error retrieving image from S3:', error);
      throw error;
    }
  }

  async uploadFileToS3(file: Express.Multer.File | string) {
    if (!file || typeof file === 'string') {
      // throw new Error('only file is accepted');
      return;
    }

    const uniqueFileName = `${uuidv4()}${file.originalname.substring(
      file.originalname.lastIndexOf('.'),
    )}`;

    const uploadParams = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: uniqueFileName,
      Body: file.buffer,
    };

    const upload = new Upload({
      client: this.s3,
      params: uploadParams,
    });

    await upload.done();

    return process.env.AWS_BUCKET_URL + uniqueFileName;
  }

  async uploadFilesToS3(files: Express.Multer.File[] | string[] | string) {
    if (typeof files === 'string') {
      throw new Error('only list of files accepted.');
    }

    if (
      Array.isArray(files) &&
      files.findIndex((v) => typeof v === 'string') >= 0
    ) {
      throw new Error('only list of files accepted.');
    }

    const urls: string[] = [];

    for await (const file of files as Express.Multer.File[]) {
      const uniqueFileName = `${uuidv4()}${file.originalname.substring(
        file.originalname.lastIndexOf('.'),
      )}`;

      const uploadParams = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: uniqueFileName,
        Body: file.buffer,
      };

      const upload = new Upload({
        client: this.s3,
        params: uploadParams,
      });

      await upload.done();
      urls.push(process.env.AWS_BUCKET_URL + uniqueFileName);
    }

    return urls;
  }
}
