import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { matches } from 'class-validator';

@Injectable()
export class checkLogoAndBannerPipe implements PipeTransform<any> {
  transform(value: {
    logo: Express.Multer.File[];
    banner: Express.Multer.File[];
  }) {
    if (!value) return value;

    if (
      !value.logo?.every((v) => this.isFile(v)) &&
      !value.banner?.every((v) => this.isFile(v))
    ) {
      throw new BadRequestException('File validation failed!');
    }

    return value;
  }

  private isFile(value: Express.Multer.File): boolean {
    return (
      matches(value.mimetype, /^(image\/(jpg|jpeg|png))$/) &&
      value.size < 1 * 1024 * 1024
    ); // 1 MB
  }
}
