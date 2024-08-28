import * as React from 'react';
import DatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';

import { cn } from '@/lib/utils';

interface NewDatePickerProps {
  showIcon?: boolean;
  maxDate?: Date;
  minDate?: Date;
  dateFormat?: string;
}

const NewDatePicker = React.forwardRef<
  HTMLInputElement | NewDatePickerProps,
  any
>((props, ref) => {
  const {
    className,
    onChange,
    value,
    maxDate = new Date(),
    minDate,
    showIcon,
    dateFormat = 'MM/dd/YYYY',
    ...otherProps
  } = props;

  return (
    <div className=''>
      <DatePicker
        maxDate={maxDate}
        minDate={minDate}
        className=''
        showMonthDropdown
        showYearDropdown
        // dropdownMode='select'
        showPopperArrow={false}
        placeholderText='MM/DD/YYYY'
        disabled={false}
        popperClassName='z-50'
        customInput={
          <input
            className={cn(
              `flex h-10 w-full rounded-md border border-input 
              bg-background px-3 py-2 text-sm ring-offset-background 
              file:border-0 file:bg-transparent file:text-sm file:font-medium 
              placeholder:text-muted-foreground focus-visible:outline-none 
              focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 
              disabled:cursor-not-allowed disabled:opacity-50`,
              className,
              { ' datePicker-icon-class': showIcon },
            )}
            ref={ref}
            {...otherProps}
          />
        }
        selected={value}
        onChange={onChange}
        dateFormat={dateFormat}
      />
    </div>
  );
});

export default NewDatePicker;
