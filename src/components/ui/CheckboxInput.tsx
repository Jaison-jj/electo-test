import * as React from 'react';

import { cn } from '@/lib/utils';

type TCheckboxInputProps = {
  label?: string;
  renderlabel?: React.ReactNode;
  defaultChecked?: boolean;
  checked?: boolean;
  id?: string;
  containerClassName?: string;
};

const CheckboxInput = React.forwardRef(
  (props: TCheckboxInputProps, ref: any) => {
    const { label, renderlabel, containerClassName } = props;
    return (
      <label
        className={cn(
          'relative flex items-start justify-start gap-2',
          containerClassName,
        )}
      >
        <input
          {...props}
          type='checkbox'
          ref={ref}
          className='relative peer shrink-0 mt-[2px]
          appearance-none w-4 h-4 border-2 border-none rounded-sm bg-white
          checked:bg-white checked:border-1
          focus:outline-none focus:ring-offset-0 ring-1 ring-black focus:ring-gray-700
          disabled:border-steel-400 disabled:bg-steel-400 cursor-pointer'
        />
        <svg
          className='
          absolute top-[2px]
            w-4 h-4 
            hidden peer-checked:block
            pointer-events-none'
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 24 24'
          fill='none'
          stroke='black'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        >
          <polyline points='20 6 9 17 4 12'></polyline>
        </svg>
        {renderlabel ? (
          renderlabel
        ) : (
          <span className='text-muted-foreground font-normal text-sm'>
            {label}
          </span>
        )}
      </label>
    );
  },
);

export default CheckboxInput;
