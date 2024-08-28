'use client';

import * as ProgressPrimitive from '@radix-ui/react-progress';
import * as React from 'react';

import { cn } from '@/lib/utils';

interface ProgressProps
  extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  renderBottomContent?: any;
  isZero?: boolean;
  // primitiveBgColor:string
}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ className, value, renderBottomContent, isZero, ...props }, ref) => (
  <div className=''>
    <ProgressPrimitive.Root
      ref={ref}
      className={cn(
        'relative h-1 w-full overflow-hidden bg-[#ff5756]',
        className,
        {
          'bg-[#f0f4fd]': isZero,
        },
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className={cn('h-full w-full flex-1 bg-[#77c388] transition-all', {
          'bg-[#f0f4fd]': isZero,
        })}
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
    {renderBottomContent()}
  </div>
));
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
