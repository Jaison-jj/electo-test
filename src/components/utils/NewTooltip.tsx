import { Arrow } from '@radix-ui/react-tooltip';
import React, { ReactNode } from 'react';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface NewTooltipProps {
  children: ReactNode;
  text: string;
}

const NewTooltip = (props: NewTooltipProps) => {
  const { children, text } = props;
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger className='cursor-help'>{children}</TooltipTrigger>
        <TooltipContent className='bg-black border-none text-white'>
          <p>{text}</p>
          <Arrow className='fill-black ' />
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default NewTooltip;
