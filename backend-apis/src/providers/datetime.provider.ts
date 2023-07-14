import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as momentTimezone from 'moment-timezone';
import * as moment from 'moment';

@Injectable()
export class DateTimeProvider {
  constructor(private readonly configService: ConfigService) {}

  /**
   * @param dateStr '2023-07-22'
   * @param zone 'Asia/Kolkata'
   * @returns utcDateTime
   * supported format's: YYYY-MM-DD | YYYY-MM-DD HH:mm | YYYY-MM-DD HH:mm:ss
   * using moment-timezone because client sent date with time and to convert time to utc, we need timezone.
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

  /**
   * there no need a moment-timezone because only date convert to utc doesn't need timezone.
   * @returns start utc date time and end utc date time
   */
  getStartAndEndDayDateTime() {
    // User's query date ("2023-07-12" in this example)
    const userQueryDate = moment('2023-07-12').startOf('day');

    // Convert the user's query date to UTC
    const utcQueryDate = userQueryDate.utc();

    // Calculate the UTC date range for the user's query
    const startUTCDate = utcQueryDate.startOf('day');
    const endUTCDate = utcQueryDate.endOf('day');

    // example
    // Event.find({
    //   date: { $gte: startUTCDate.toDate(), $lte: endUTCDate.toDate() }
    // }),

    return { startUTCDate, endUTCDate };
  }
}
