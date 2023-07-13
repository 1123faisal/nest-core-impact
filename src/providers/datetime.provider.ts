import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as momentTimezone from 'moment-timezone';

@Injectable()
export class DateTimeProvider {
  constructor(private readonly configService: ConfigService) {}

  /**
   * @param dateStr '2023-07-22'
   * @param zone 'Asia/Kolkata'
   * @returns utcDateTime
   * supported formates: YYYY-MM-DD | YYYY-MM-DD HH:mm | YYYY-MM-DD HH:mm:ss
   */
  getUtc(dateStr: string, zone: string, format?: string) {
    const userDateTime = momentTimezone.tz(
      dateStr,
      format || 'YYYY-MM-DD',
      zone,
    );
    const utcDateTime = userDateTime.utc();
    return utcDateTime;
  }
}
