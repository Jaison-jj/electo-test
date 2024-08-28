import { Loader2 } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/lib/utils';

interface Props {
  className?: string;
}

export default function Loading({ className }: Props) {
  return (
    <div className='h-full w-full flex justify-center items-center'>
      <Loader2 className={cn('animate-spin h-8 w-8', className)} />
    </div>
  );
}
