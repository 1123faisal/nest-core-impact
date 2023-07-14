import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { isValidObjectId } from 'mongoose';

@Injectable()
export class isMongoIdPipe implements PipeTransform<string> {
  transform(value: string, _: ArgumentMetadata): string {
    if (value == null || isValidObjectId(value)) {
      return value;
    }
    throw new BadRequestException('invalid record id.');
  }
}
