import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { matches } from 'class-validator';

@Injectable()
export class isValidAvatar implements PipeTransform<any> {
  transform(value: any) {
    if (!value) return value;

    if (!this.isFile(value)) {
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
