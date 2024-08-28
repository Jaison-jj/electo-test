import { FileSearch } from 'lucide-react';
import * as React from 'react';

interface NoDataToDisplayProps {
  text: string;
}

export default function NoDataToDisplay(props: NoDataToDisplayProps) {
  const { text } = props;
  return (
    <div className='h-full w-full flex flex-col gap-2 justify-center items-center'>
      <FileSearch className='h-8 w-8 text-muted-foreground' />
      <p className='text-muted-foreground text-sm'>{text}</p>
    </div>
  );
}
