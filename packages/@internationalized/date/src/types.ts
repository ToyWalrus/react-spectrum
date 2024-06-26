/*
 * Copyright 2020 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import {CalendarDate, CalendarDateTime, ZonedDateTime} from './CalendarDate';

type DateValue = CalendarDate | CalendarDateTime | ZonedDateTime;

/** An interface that is compatible with any object with date fields. */
export interface AnyCalendarDate {
  readonly calendar: Calendar,
  readonly era: string,
  readonly year: number,
  readonly month: number,
  readonly day: number,
  copy(): this
}

/** An interface that is compatible with any object with time fields. */
export interface AnyTime {
  readonly hour: number,
  readonly minute: number,
  readonly second: number,
  readonly millisecond: number,
  copy(): this
}

/** An interface that is compatible with any object with both date and time fields. */
export interface AnyDateTime extends AnyCalendarDate, AnyTime {}

/**
 * The Calendar interface represents a calendar system, including information
 * about how days, months, years, and eras are organized, and methods to perform
 * arithmetic on dates.
 */
export interface Calendar {
  /** A string identifier for the calendar, as defined by Unicode CLDR. */
  identifier: string,

  /** Creates a CalendarDate in this calendar from the given Julian day number. */
  fromJulianDay(jd: number): CalendarDate,
  /** Converts a date in this calendar to a Julian day number. */
  toJulianDay(date: AnyCalendarDate): number,

  /** Returns the number of days in the month of the given date. */
  getDaysInMonth(date: AnyCalendarDate): number,
  /** Returns the number of months in the year of the given date. */
  getMonthsInYear(date: AnyCalendarDate): number,
  /** Returns the number of years in the era of the given date. */
  getYearsInEra(date: AnyCalendarDate): number,
  /** Returns a list of era identifiers for the calendar. */
  getEras(): string[],

  /**
   * Returns the index of the day of the week that should be considered
   * the first day of the calendar week. Indices are 0-based, with 0 being
   * Sunday, 1 being Monday, and so on.
   * 
   * If this method is not implemented, the first day of the week is determined
   * based on locale, unrelated to the calendar.
   */
  getFirstDayOfWeek?(): number,
  /**
   * Returns the start of the month of the given date.
   * 
   * If this method is not implemented, the start of the month is considered
   * to be the first day of the month. This method is useful for calendars
   * where the start of the month is not always the same day number.
   */
  getStartOfMonth?(date: DateValue): DateValue,
  /**
   * Returns the end of the month of the given date.
   * 
   * If this method is not implemented, the end of the month is considered
   * to be the last day of the month. This method is useful for calendars
   * where the end of the month is not always the same day number.
   */
  getEndOfMonth?(date: DateValue): DateValue,
  /**
   * Returns the start of the year of the given date.
   * 
   * If this method is not implemented, the start of the year is considered
   * to be the first day of the year. This method is useful for calendars
   * where the start of the year is not always the same month and day.
   */
  getStartOfYear?(date: DateValue): DateValue,
  /**
   * Returns the end of the year of the given date.
   * 
   * If this method is not implemented, the end of the year is considered
   * to be the last day of the year. This method is useful for calendars
   * where the end of the year is not always the same month and day.
   */
  getEndOfYear?(date: DateValue): DateValue,

  
  /**
   * Returns the minimum month number of the given date's year.
   * Normally, this is 1, but in some calendars such as the Japanese,
   * eras may begin in the middle of a year.
   */
  getMinimumMonthInYear?(date: AnyCalendarDate): number,
  /**
   * Returns the minimum day number of the given date's month.
   * Normally, this is 1, but in some calendars such as the Japanese,
   * eras may begin in the middle of a month.
   */
  getMinimumDayInMonth?(date: AnyCalendarDate): number,

  /** @private */
  balanceDate?(date: AnyCalendarDate): void,
  /** @private */
  balanceYearMonth?(date: AnyCalendarDate, previousDate: AnyCalendarDate): void,
  /** @private */
  constrainDate?(date: AnyCalendarDate): void,
  /** @private */
  isInverseEra?(date: AnyCalendarDate): boolean
}

/** Represents an amount of time in calendar-specific units, for use when performing arithmetic. */
export interface DateDuration {
  /** The number of years to add or subtract. */
  years?: number,
  /** The number of months to add or subtract. */
  months?: number,
  /** The number of weeks to add or subtract. */
  weeks?: number,
  /** The number of days to add or subtract. */
  days?: number
}

/** Represents an amount of time, for use whe performing arithmetic. */
export interface TimeDuration {
  /** The number of hours to add or subtract. */
  hours?: number,
  /** The number of minutes to add or subtract. */
  minutes?: number,
  /** The number of seconds to add or subtract. */
  seconds?: number,
  /** The number of milliseconds to add or subtract. */
  milliseconds?: number
}

/** Represents an amount of time with both date and time components, for use when performing arithmetic. */
export interface DateTimeDuration extends DateDuration, TimeDuration {}

export interface DateFields {
  era?: string,
  year?: number,
  month?: number,
  day?: number
}

export interface TimeFields {
  hour?: number,
  minute?: number,
  second?: number,
  millisecond?: number
}

export type DateField = keyof DateFields;
export type TimeField = keyof TimeFields;

export type Disambiguation = 'compatible' | 'earlier' | 'later' | 'reject';

export interface CycleOptions {
  /** Whether to round the field value to the nearest interval of the amount. */
  round?: boolean
}

export interface CycleTimeOptions extends CycleOptions {
  /**
   * Whether to use 12 or 24 hour time. If 12 hour time is chosen, the resulting value
   * will remain in the same day period as the original value (e.g. if the value is AM,
   * the resulting value also be AM).
   * @default 24
   */
  hourCycle?: 12 | 24
}
