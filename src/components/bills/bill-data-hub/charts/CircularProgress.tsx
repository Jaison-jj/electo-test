import React from 'react';
import Progress from 'react-circle-progress-bar';

import { cn } from '@/lib/utils';

interface Props {
  valueClassName?: string;
  progress: number;
}

const CircularProgress = (props: Props) => {
  const { valueClassName, progress } = props;
  return (
    <div className=' flex justify-center items-center'>
      <div className='relative'>
        <Progress
          progress={progress}
          reduction={0}
          background='#f0f4fd'
          className='customCircularProgressbar'
          hideValue
          gradient={[
            { stop: 0.0, color: '#77c388' },
            { stop: 1, color: '#77c388' },
          ]}
        />
        <span
          className={cn(
            'absolute-center font-poppins font-semibold text-lg',
            valueClassName,
          )}
        >
          {progress}%
        </span>
      </div>
    </div>
  );
};

export default CircularProgress;
