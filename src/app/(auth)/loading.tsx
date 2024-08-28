import { Loader2 } from 'lucide-react';
import * as React from 'react';

export default function Loading() {
  return (
    <div className='h-screen flex justify-center items-center'>
      <Loader2 className='animate-spin h-8 w-8' />
    </div>
  );
}
