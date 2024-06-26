/*
 * Copyright 2022 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import {AnyCalendarDate, CalendarDate, CalendarDateTime, Calendar as CalendarType, createCalendar, parseDate, ZonedDateTime} from '@internationalized/date';
import {Button, Calendar, CalendarCell, CalendarGrid, CalendarStateContext, Heading, RangeCalendar} from 'react-aria-components';
import {compareDate} from '@internationalized/date/src/queries';
import React, {CSSProperties, useContext} from 'react';

export default {
  title: 'React Aria Components'
};

function Footer() {
  const state = useContext(CalendarStateContext);
  const setValue = state?.setValue;
  
  return (
    <div>
      <Button 
        slot={null} 
        className="reset-button"
        onPress={() => {
          // reset value 
          setValue?.(null);
        }}>
        Reset value
      </Button>
    </div>
  );
}

export const CalendarExample = () => (
  <Calendar style={{width: 220}}>
    <div style={{display: 'flex', alignItems: 'center'}}>
      <Button slot="previous">&lt;</Button>
      <Heading style={{flex: 1, textAlign: 'center'}} />
      <Button slot="next">&gt;</Button>
    </div>
    <CalendarGrid style={{width: '100%'}}>
      {date => <CalendarCell date={date} style={({isSelected, isOutsideMonth}) => ({display: isOutsideMonth ? 'none' : '', textAlign: 'center', cursor: 'default', background: isSelected ? 'blue' : ''})} />}
    </CalendarGrid>
  </Calendar>
);

export const CalendarResetValue = () => (
  <Calendar style={{width: 220}}>
    <div style={{display: 'flex', alignItems: 'center'}}>
      <Button slot="previous">&lt;</Button>
      <Heading style={{flex: 1, textAlign: 'center'}} />
      <Button slot="next">&gt;</Button>
    </div>
    <CalendarGrid style={{width: '100%'}}>
      {date => <CalendarCell date={date} style={({isSelected, isOutsideMonth}) => ({display: isOutsideMonth ? 'none' : '', textAlign: 'center', cursor: 'default', background: isSelected ? 'blue' : ''})} />}
    </CalendarGrid>
    <Footer />
  </Calendar>
);

export const CalendarMultiMonth = () => (
  <Calendar style={{width: 500}} visibleDuration={{months: 2}}>
    <div style={{display: 'flex', alignItems: 'center'}}>
      <Button slot="previous">&lt;</Button>
      <Heading style={{flex: 1, textAlign: 'center'}} />
      <Button slot="next">&gt;</Button>
    </div>
    <div style={{display: 'flex', gap: 20}}>
      <CalendarGrid style={{flex: 1}}>
        {date => <CalendarCell date={date} style={({isSelected, isOutsideMonth}) => ({display: isOutsideMonth ? 'none' : '', textAlign: 'center', cursor: 'default', background: isSelected ? 'blue' : ''})} />}
      </CalendarGrid>
      <CalendarGrid style={{flex: 1}} offset={{months: 1}}>
        {date => <CalendarCell date={date} style={({isSelected, isOutsideMonth}) => ({display: isOutsideMonth ? 'none' : '', textAlign: 'center', cursor: 'default', background: isSelected ? 'blue' : ''})} />}
      </CalendarGrid>
    </div>
  </Calendar>
);

export const RangeCalendarExample = () => (
  <RangeCalendar style={{width: 220}}>
    <div style={{display: 'flex', alignItems: 'center'}}>
      <Button slot="previous">&lt;</Button>
      <Heading style={{flex: 1, textAlign: 'center'}} />
      <Button slot="next">&gt;</Button>
    </div>
    <CalendarGrid style={{width: '100%'}}>
      {date => <CalendarCell date={date} style={({isSelected, isOutsideMonth}) => ({display: isOutsideMonth ? 'none' : '', textAlign: 'center', cursor: 'default', background: isSelected ? 'blue' : ''})} />}
    </CalendarGrid>
  </RangeCalendar>
);

export const CustomRangeCalendarExample = () => {
  const getCellStyle = ({isSelected, isOutsideMonth}): CSSProperties => ({
    textAlign: 'center', 
    cursor: !isOutsideMonth ? 'pointer' : 'default', 
    // eslint-disable-next-line no-nested-ternary
    background: isOutsideMonth ? 'gray' : (isSelected ? 'blue' : ''),
    color: isSelected ? 'white' : 'black'
  });

  return (
    <RangeCalendar
      style={{width: 750}}
      visibleDuration={{months: 3}}
      createCalendar={createCustomCalendar}
      defaultValue={{start: new CalendarDate(2015, 3, 5), end: new CalendarDate(2015, 4, 1)}}>
      <div style={{display: 'flex', alignItems: 'center'}}>
        <Button slot="previous">&lt;</Button>
        <Heading style={{flex: 1, textAlign: 'center'}} />
        <Button slot="next">&gt;</Button>
      </div>
      <div style={{display: 'flex', gap: 20}}>
        {
          [0, 1, 2].map((offset) => (
            <CalendarGrid key={offset} style={{flex: 1}} offset={{months: offset}}>
              {date => (<CalendarCell date={date} style={getCellStyle} />)}
            </CalendarGrid>
          ))
        }
      </div>
    </RangeCalendar>
  );
};


// eslint-disable-next-line @typescript-eslint/no-unused-vars
function createCustomCalendar(_: string):CalendarType {
  return new Custom454Cal();
}

type DateValue = CalendarDate | ZonedDateTime | CalendarDateTime;
class Custom454Cal implements CalendarType {
  private internalCal: CalendarType;
  identifier: string;

  private cal454_2015 = [
    {'start': '2015-02-01', 'end': '2015-02-28', 'weeks': 4},
    {'start': '2015-03-01', 'end': '2015-04-04', 'weeks': 5},
    {'start': '2015-04-05', 'end': '2015-05-02', 'weeks': 4},

    {'start': '2015-05-03', 'end': '2015-05-30', 'weeks': 4},
    {'start': '2015-05-31', 'end': '2015-07-04', 'weeks': 5},
    {'start': '2015-07-05', 'end': '2015-08-01', 'weeks': 4},

    {'start': '2015-08-02', 'end': '2015-08-29', 'weeks': 4},
    {'start': '2015-08-30', 'end': '2015-10-03', 'weeks': 5},
    {'start': '2015-10-04', 'end': '2015-10-31', 'weeks': 4},

    {'start': '2015-11-01', 'end': '2015-11-28', 'weeks': 4},
    {'start': '2015-11-29', 'end': '2016-01-02', 'weeks': 5},
    {'start': '2016-01-03', 'end': '2016-01-30', 'weeks': 4}
  ] as const;

  constructor() {
    this.internalCal = createCalendar('gregory');
    this.identifier = 'custom-454';
  }
  fromJulianDay(jd: number): CalendarDate {
    const date = this.internalCal.fromJulianDay(jd + 5);
    return new CalendarDate(this, date.year, date.month, date.day);
  }
  toJulianDay(date: AnyCalendarDate): number {
    return this.internalCal.toJulianDay(date);
  }
  getFirstDayOfWeek(): number {
    return 0;
  }
  getStartOfMonth(date: DateValue): DateValue {
    const range = this.getRangeOfDate(date);
    if (range) {
      const diffToStart = compareDate(date, parseDate(range.start));
      return date.subtract({days: diffToStart});
    }
  }
  getEndOfMonth(date: DateValue): DateValue {
    const range = this.getRangeOfDate(date);
    if (range) {
      const diffToEnd = compareDate(date, parseDate(range.end));
      return date.add({days: 1 - diffToEnd});
    }
  }
  getStartOfYear(date: DateValue): DateValue {
    const range = this.getRangeOfDate(date);
    if (range) {
      const diffToStart = compareDate(date, parseDate(this.cal454_2015[0].start));
      return date.subtract({days: diffToStart});
    }
  }
  getEndOfYear(date: DateValue): DateValue {
    const range = this.getRangeOfDate(date);
    if (range) {
      const diffToEnd = compareDate(date, parseDate(this.cal454_2015[this.cal454_2015.length - 1].end));
      return date.add({days: 1 - diffToEnd});
    }
  }
  getDaysInMonth(date: AnyCalendarDate): number {
    const range = this.getRangeOfDate(date);
    if (range) {
      return range.weeks * 7;
    }
    return this.internalCal.getDaysInMonth(date);
  }
  
  getMonthsInYear(date: AnyCalendarDate): number {
    return this.internalCal.getMonthsInYear(date);
  }
  getYearsInEra(date: AnyCalendarDate): number {
    return this.internalCal.getYearsInEra(date);
  }
  getEras(): string[] {
    return this.internalCal.getEras();
  }
  private getRangeOfDate(date: AnyCalendarDate) {
    return this.cal454_2015.find(r => compareDate(date, parseDate(r.start)) >= 0 && compareDate(date, parseDate(r.end)) <= 0);
  }
}
