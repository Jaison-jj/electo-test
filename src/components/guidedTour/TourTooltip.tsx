/* eslint-disable unused-imports/no-unused-vars */
import React from 'react';

import { Button } from '@/components/ui/button';

interface TourTooltipProps {
  continuous: any;
  index: any;
  step: any;
  backProps: any;
  closeProps: any;
  primaryProps: any;
  tooltipProps: any;
  onClickNext?: () => void;
  nextBtnText?: string;
  onClickSkip?: () => void;
}

const TourTooltip = (props: TourTooltipProps) => {
  const {
    continuous,
    index,
    step,
    backProps,
    closeProps,
    primaryProps,
    tooltipProps,
    onClickNext,
    onClickSkip,
    nextBtnText = 'Next',
  } = props;

  return (
    <div className='bg-white p-4 text-sm text-justify w-[350px] md:w-full md:max-w-[500px] rounded-xl'>
      <p className='text-muted-foreground text-sm pb-2'>{step.content}</p>
      <div className='flex justify-between'>
        <Button
          variant='outline'
          className='rounded-3xl font-semibold py-0 px-6'
          id='next'
          text={nextBtnText}
          onClick={onClickNext}
        />
        <Button
          {...closeProps}
          variant='outline'
          className='rounded-3xl font-semibold py-0 px-6'
          id='close'
          text='Skip'
          onClick={onClickSkip}
        />
      </div>
    </div>
  );
};

export default TourTooltip;

//template,
// <TooltipBody {...tooltipProps}>
//   {step.title && <TooltipTitle>{step.title}</TooltipTitle>}
//   <TooltipContent>{step.content}</TooltipContent>
//   <TooltipFooter>
//     {index > 0 && (
//       <Button {...backProps}>
//         <FormattedMessage id='back' />
//       </Button>
//     )}
//     {continuous && (
//       <Button {...primaryProps}>
//         <FormattedMessage id='next' />
//       </Button>
//     )}
//     {!continuous && (
//       <Button {...closeProps}>
//         <FormattedMessage id='close' />
//       </Button>
//     )}
//   </TooltipFooter>
// </TooltipBody>
