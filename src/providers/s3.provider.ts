import { S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import * as csvParse from 'csv-parse';
import { Response } from 'express';
import * as csv from 'fast-csv';
import { createWriteStream } from 'fs';
import * as PDFDocument from 'pdfkit';
import { v4 as uuidv4 } from 'uuid';
import * as xlsx from 'xlsx';

export enum MimeType {
  CSV = 'text/csv',
  XLSX = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  PNG = 'image/png',
  JPG = 'image/jpg',
  JPEG = 'image/jpeg',
}

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
    try {
      const response = await axios.get(s3FileUri, {
        responseType: 'arraybuffer',
      });

      return Buffer.from(response.data);
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
      throw new BadRequestException('only list of files accepted.');
    }

    if (
      Array.isArray(files) &&
      files.findIndex((v) => typeof v === 'string') >= 0
    ) {
      throw new BadRequestException('only list of files accepted.');
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

  async parseCsv(file: Express.Multer.File) {
    return new Promise<{
      status: boolean;
      data?: Record<string, any>[];
    }>((resolve, reject) => {
      const results = [];

      // Parse the uploaded file buffer
      csvParse
        .parse(file.buffer)
        .on('readable', function () {
          let record;
          while ((record = this.read())) {
            results.push(record);
          }
        })
        .on('error', (error) => {
          // If any error occurs during parsing, reject the promise
          reject(error);
        })
        .on('end', () => {
          // Process the data and update the table accordingly
          // You can perform your database update operations here using an ORM or query builder

          // Once the update is completed, resolve the promise
          resolve({ status: true, data: results });
        });
    });
  }

  async parseXls(file: Express.Multer.File, sheetName: string) {
    return new Promise<{
      status: boolean;
      data?: Record<string, any>[];
    }>((resolve, reject) => {
      try {
        const workbook = xlsx.read(file.buffer, { type: 'buffer' });

        // Specify the sheet name or index to read
        const worksheet = workbook.Sheets[sheetName];
        // Or if you want to read by index: const worksheet = workbook.Sheets[workbook.SheetNames[0]];

        if (!worksheet) {
          reject('Sheet not found');
          return;
        }

        // Convert the worksheet to JSON
        const jsonData = xlsx.utils.sheet_to_json(worksheet, { header: 1 });

        // Process the JSON data and update the table accordingly
        // You can perform your database update operations here using an ORM or query builder

        // Once the update is completed, resolve the promise
        resolve({ status: true, data: jsonData });
      } catch (error) {
        reject(error);
      }
    });
  }

  downloadPDF(tableData: any[], res: Response): void {
    new Promise<Buffer>((resolve, reject) => {
      const doc = new PDFDocument();

      res.set('Content-Type', 'application/pdf');
      res.set('Content-Disposition', 'attachment; filename="table.pdf"');

      doc.pipe(res);

      // Add table data to the PDF
      // Customize this section to format your table data appropriately
      doc.fontSize(12);
      tableData.forEach((row, index) => {
        doc.text(row.toString(), 50, 50 + index * 20);
      });

      doc.end();
    });
  }

  downloadXlsx(tableData: any[], res: Response): void {
    const workbook = xlsx.utils.book_new();
    const worksheet = xlsx.utils.json_to_sheet(tableData);

    xlsx.utils.book_append_sheet(workbook, worksheet, 'Table');

    const fileStream = xlsx.stream.to_csv(workbook);

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader('Content-Disposition', 'attachment; filename=table.xlsx');

    fileStream.pipe(res);
  }

  downloadCsv(tableData: any[], res: Response): void {
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=table.csv');

    const csvStream = csv.format({ headers: true });

    csvStream.pipe(res);

    tableData.forEach((row) => csvStream.write(row.toString()));

    csvStream.end();
  }
}
