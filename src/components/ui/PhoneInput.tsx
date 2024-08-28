import React from 'react';

import { sysPhone } from '@/lib/helper';
import { cn } from '@/lib/utils';

export interface PhoneInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  requiredField?: boolean;
  onChange?: any; // Add type for onChange  (value: string) => void
}

const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
  (
    { className, label, error, onChange, type, requiredField, ...props },
    ref,
  ) => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      let input = event.target.value.replace(/\D/g, '');
      if (input.length === 11) input = input.slice(0, 10); // Limit to 10 characters
      const formatted = sysPhone(input);
      onChange && onChange(formatted);
    };

    return (
      <div className='flex flex-col gap-2'>
        {label && (
          <label className='font-normal text-sm text-muted-foreground'>
            {label}
            {requiredField && <span className='text-red-600 text-xs'>*</span>}
          </label>
        )}
        <input
          type={type}
          className={cn(
            `flex h-10 w-full rounded-md border border-input 
            bg-background px-3 py-2 text-sm ring-offset-background 
            file:border-0 file:bg-transparent file:text-sm file:font-medium 
            placeholder:text-muted-foreground focus-visible:outline-none 
            focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 
            disabled:cursor-not-allowed disabled:opacity-50`,
            className,
          )}
          ref={ref}
          onChange={handleChange}
          value={props.value}
          name={props.name}
          placeholder={props.placeholder}
          // {...props}
        />
        {error && <p className='text-red-600 text-xs'>{error}</p>}
      </div>
    );
  },
);

PhoneInput.displayName = 'PhoneInput';

export default PhoneInput;
