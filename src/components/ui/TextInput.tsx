import * as React from 'react';

import { cn } from '@/lib/utils';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  requiredField?: boolean;
}

const TextInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, type, requiredField, ...props }, ref) => {
    return (
      <div className='flex flex-col gap-2 w-full'>
        {label && (
          <label className='font-normal text-sm text-muted-foreground'>
            {label}
            {requiredField && <span className='text-red-600'>*</span>}
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
          disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-100`,
            className,
          )}
          ref={ref}
          {...props}
        />
        {error && <p className='text-red-600 text-xs'>{error}</p>}
      </div>
    );
  },
);
TextInput.displayName = 'TextInput';

export default TextInput;
