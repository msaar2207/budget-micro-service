import {
  subYears,
  subMonths,
  subDays,
  subQuarters,
  subWeeks,
  startOfYear,
  startOfMonth,
  startOfDay,
  startOfQuarter,
  startOfWeek,
} from 'date-fns';
import { TimeUnit } from './enums/timeUnits';

export function subTimeUnit(
  date: Date,
  quantity: number,
  unit: TimeUnit,
): Date {
  switch (unit) {
    case TimeUnit.Years:
      return subYears(date, quantity);
    case TimeUnit.Months:
      return subMonths(date, quantity);
    case TimeUnit.Days:
      return subDays(date, quantity);
    case TimeUnit.Quarters:
      return subQuarters(date, quantity);
    case TimeUnit.Weeks:
      return subWeeks(date, quantity);
    default:
      throw new Error('Invalid time unit');
  }
}

export function startOfTimeUnit(date: Date, unit: TimeUnit): Date {
  switch (unit) {
    case TimeUnit.Years:
      return startOfYear(date);
    case TimeUnit.Months:
      return startOfMonth(date);
    case TimeUnit.Days:
      return startOfDay(date);
    case TimeUnit.Quarters:
      return startOfQuarter(date);
    case TimeUnit.Weeks:
      return startOfWeek(date);
    default:
      throw new Error('Invalid time unit');
  }
}
