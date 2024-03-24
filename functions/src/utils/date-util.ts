import moment from 'moment';

const DATE_FORMAT_YYYY_MM_DD = 'YYYY-MM-DD';

export class DateUtil {

  // Set the start day of the week in number,
  // the number can be set as follows
  // For sunday - 0, Monday - 1, Tuesday - 2 etc.
  // Refer https://stackoverflow.com/questions/57799597/moment-js-set-week-start-on-monday
  constructor(startDayOfTheWeek: number) {
    moment.updateLocale('en', {
      week: {
        dow: startDayOfTheWeek,
      },
    });
  }

  // It calculates the no of week of a month for given input date
  // When calculating the week of the month based on a given date,
  // we have to take the offset into account.

  endOf(input: string, unitOfTime: 'week' | 'month', format: string = DATE_FORMAT_YYYY_MM_DD) {

    const inputMoment = moment(input, format);
    const lastDayOfWeek = inputMoment.clone().endOf(unitOfTime);
    return lastDayOfWeek.format(DATE_FORMAT_YYYY_MM_DD);
  }

  // Not all months start on the first day of the week.
  weekOfMonth(input: string, format: string = DATE_FORMAT_YYYY_MM_DD) {

    const inputMoment = moment(input, format);
    const firstDayOfMonth = inputMoment.clone().startOf('month');
    const firstDayOfWeek = firstDayOfMonth.clone().startOf('week');
    const offset = firstDayOfMonth.diff(firstDayOfWeek, 'days');
    return Math.ceil((inputMoment.date() + offset) / 7);
  }
}
