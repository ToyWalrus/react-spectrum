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

import {action} from '@storybook/addon-actions';
import {AnyCalendarDate, Calendar, CalendarDate, CalendarDateTime, createCalendar, getLocalTimeZone, isWeekend, parseDate, parseZonedDateTime, today} from '@internationalized/date';
import {compareDate} from '@internationalized/date/src/queries';
import {ComponentMeta, ComponentStoryObj} from '@storybook/react';
import {DateValue} from '@react-types/calendar';
import {Flex} from '@react-spectrum/layout';
import {RangeCalendar} from '../';
import React, {useState} from 'react';
import {TimeField} from '@react-spectrum/datepicker';
import {useLocale} from '@react-aria/i18n';
import {View} from '@react-spectrum/view';

export type RangeCalendarStory = ComponentStoryObj<typeof RangeCalendar>;

export default {
  title: 'Date and Time/RangeCalendar',
  component: RangeCalendar,
  args: {
    onChange: action('onChange')
  },
  argTypes: {
    onChange: {
      table: {
        disable: true
      }
    },
    defaultValue: {
      table: {
        disable: true
      }
    },
    minValue: {
      table: {
        disable: true
      }
    },
    value: {
      table: {
        disable: true
      }
    },
    maxValue: {
      table: {
        disable: true
      }
    },
    isDisabled: {
      control: 'boolean'
    },
    isReadOnly: {
      control: 'boolean'
    },
    allowsNonContiguousRanges: {
      control: 'boolean'
    },
    autoFocus: {
      control: 'boolean'
    },
    visibleMonths: {
      control: 'number'
    },
    pageBehavior: {
      control: 'select',
      options: [null, 'single', 'visible']
    },
    isInvalid: {
      control: 'boolean'
    },
    errorMessage: {
      control: 'text'
    }
  }
} as ComponentMeta<typeof RangeCalendar>;

export const Default: RangeCalendarStory = {
  render: (args) => render(args)
};

export const DefaultValue: RangeCalendarStory = {
  ...Default,
  args: {defaultValue: {start: new CalendarDate(2019, 6, 5), end: new CalendarDate(2019, 6, 10)}}
};

export const ControlledValue: RangeCalendarStory = {
  ...Default,
  args: {value: {start: new CalendarDate(2019, 6, 5), end: new CalendarDate(2019, 6, 10)}}
};

export const WithTime: RangeCalendarStory = {
  render: (args) => <RangeCalendarWithTime {...args} />
};

export const ZonedTime: RangeCalendarStory = {
  render: (args) => <RangeCalendarWithZonedTime {...args} />,
  name: 'with zoned time'
};

export const Custom454: RangeCalendarStory = {
  ...Default,
  args: {
    createCalendar: createCustomCalendar,
    defaultValue: {start: new CalendarDate(2015, 2, 10), end: new CalendarDate(2015, 4, 28)}, 
    visibleMonths: 3
  },
  name: 'custom calendar: 4-5-4 week layout'
};

export const OneWeek: RangeCalendarStory = {
  ...Default,
  args: {minValue: today(getLocalTimeZone()), maxValue: today(getLocalTimeZone()).add({weeks: 1})},
  name: 'minValue: today, maxValue: 1 week from now'
};

export const DefaultMinMax: RangeCalendarStory = {
  ...Default,
  args: {defaultValue: {start: new CalendarDate(2019, 6, 10), end: new CalendarDate(2019, 6, 12)}, minValue: new CalendarDate(2019, 6, 5), maxValue: new CalendarDate(2019, 6, 20)},
  name: 'defaultValue + minValue + maxValue'
};

export const DateUnavailable: RangeCalendarStory = {
  ...Default,
  args: {isDateUnavailable: (date: DateValue) => {
    const disabledIntervals = [[today(getLocalTimeZone()), today(getLocalTimeZone()).add({weeks: 1})], [today(getLocalTimeZone()).add({weeks: 2}), today(getLocalTimeZone()).add({weeks: 3})]];
    return disabledIntervals.some((interval) => date.compare(interval[0]) > 0 && date.compare(interval[1]) < 0);
  }},
  name: 'isDateUnavailable'
};

export const MinValue: RangeCalendarStory = {
  ...Default,
  args: {minValue: today(getLocalTimeZone())},
  name: 'minValue: today'
};

export const DefaultValVisibleMonths: RangeCalendarStory = {
  ...Default,
  args: {visibleMonths: 3, defaultValue: {start: new CalendarDate(2021, 10, 5), end: new CalendarDate(2021, 12, 10)}},
  name: 'defaultValue, visibleMonths: 3'
};

export const DateUnavailableInvalid: RangeCalendarStory = {
  render: (args) => <DateUnavailableAndInvalid {...args} />,
  name: 'isDateUnavailable, invalid'
};

function render(props) {
  return (
    <View maxWidth="100vw" overflow="auto">
      <RangeCalendar {...props} />
    </View>
  );
}

function RangeCalendarWithTime(props) {
  let [value, setValue] = useState({start: new CalendarDateTime(2019, 6, 5, 8), end: new CalendarDateTime(2019, 6, 10, 12)});
  let onChange = (v) => {
    setValue(v);
    props?.onChange?.(v);
  };

  return (
    <Flex direction="column">
      <RangeCalendar {...props} value={value} onChange={onChange} />
      <Flex gap="size-100">
        <TimeField label="Start time" value={value.start} onChange={v => onChange({...value, start: v})} />
        <TimeField label="End time" value={value.end} onChange={v => onChange({...value, end: v})} />
      </Flex>
    </Flex>
  );
}

function RangeCalendarWithZonedTime(props) {
  let [value, setValue] = useState({start: parseZonedDateTime('2021-03-10T00:45-05:00[America/New_York]'), end: parseZonedDateTime('2021-03-26T18:05-07:00[America/Los_Angeles]')});
  let onChange = (v) => {
    setValue(v);
    props?.onChange?.(v);
  };

  return (
    <Flex direction="column">
      <RangeCalendar {...props} value={value} onChange={onChange} />
      <Flex gap="size-100">
        <TimeField label="Start time" value={value.start} onChange={v => onChange({...value, start: v})} />
        <TimeField label="End time" value={value.end} onChange={v => onChange({...value, end: v})} />
      </Flex>
    </Flex>
  );
}

function DateUnavailableAndInvalid(props) {
  let {locale} = useLocale();
  return (
    render({...props, isDateUnavailable: (date: DateValue) => isWeekend(date, locale), allowsNonContiguousRanges: true, defaultValue: {start: new CalendarDate(2021, 10, 3), end: new CalendarDate(2021, 10, 16)}})
  );
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function createCustomCalendar(_: string):Calendar {
  return new Custom454Cal();
}

export class Custom454Cal implements Calendar {
  private internalCal: Calendar;
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
    const date = this.internalCal.fromJulianDay(jd);
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
  balanceDate1(date) {
    if (date.month === 2) {
      // return new CalendarDate(this, 2015, 2, 1);
      date.day = 1;
      date.month = 3;
    } else if (date.month === 3) {
      // return new CalendarDate(this, 2015, 3, 1);
      date.day = 5;
      date.month = 4;
    }
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
