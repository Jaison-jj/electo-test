'use client';

import React from 'react';

import { cn } from '@/lib/utils';

const Polls = ({ polls, onSelectAnswer, selectedAnswer }: any) => {
  // debugger
  return (
    <div className='flex flex-col gap-2'>
      {polls.map((poll: any) => (
        <div
          key={poll.choice}
          id='1'
          className={cn(
            'text-sm text-gray-700 p-4 rounded-2xl flex justify-between items-center gap-2 border border-gray-200 cursor-pointer',
            {
              'border-black bg-gray-100 text-black':
                selectedAnswer === poll.choice,
              'cursor-default': poll.percentage,
            },
          )}
          onClick={
            poll.percentage ? () => null : () => onSelectAnswer(poll.choice)
          }
        >
          <p>{poll.choice}</p>
          <p className='text-black'>
            {poll?.percentage != null ? Math.round(poll.percentage) + '%' : ''}
          </p>
        </div>
      ))}
    </div>
  );
};

export default Polls;
