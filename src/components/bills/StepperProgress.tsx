'use client';

import { Step, Stepper, Typography } from '@material-tailwind/react';
import React from 'react';

interface StepperProgressBarProps {
  wrapperClassName: string;
  activeStep: number;
  setActiveStep?: any;
}

const StepperProgressBar = (props: StepperProgressBarProps) => {
  const { wrapperClassName, activeStep } = props;

  return (
    <div className={`w-full ${wrapperClassName}`}>
      <Stepper
        placeholder=''
        activeStep={activeStep}
        lineClassName='bg-gray-300'
        activeLineClassName='bg-green-300'
      >
        <Step
          placeholder=''
          className='h-4 w-4 !bg-gray-300 text-gray-500 cursor-pointer'
          activeClassName='ring-0 !bg-green-500 text-gray-500'
          completedClassName='!bg-green-500 text-gray-500'
        >
          <div className='absolute -top-[1.5rem] w-max text-center text-xs'>
            <Typography
              placeholder=''
              variant='small'
              className='font-poppins font-normal'
              color='inherit'
            >
              Intro
            </Typography>
          </div>
        </Step>
        <Step
          placeholder=''
          className='h-4 w-4 !bg-gray-300 text-gray-500 cursor-pointer'
          activeClassName='ring-0 !bg-green-500 text-gray-500'
          completedClassName='!bg-green-500 text-gray-500'
        >
          <div className='absolute -top-[1.5rem] w-max text-center text-xs'>
            <Typography
              placeholder=''
              variant='small'
              className='font-poppins font-normal'
              color='inherit'
            >
              Review
            </Typography>
          </div>
        </Step>
        <Step
          placeholder=''
          className='h-4 w-4 !bg-gray-300 text-gray-500 cursor-pointer'
          activeClassName='ring-0 !bg-green-500 text-gray-500'
          completedClassName='!bg-green-500 text-gray-500'
        >
          <div className='absolute -top-[1.5rem] w-max text-center text-xs'>
            <Typography
              placeholder=''
              variant='small'
              className='font-poppins font-normal'
              color='inherit'
            >
              Debate
            </Typography>
          </div>
        </Step>
        <Step
          placeholder=''
          className='h-4 w-4 !bg-gray-300 text-gray-500 cursor-pointer'
          activeClassName='ring-0 !bg-green-500 text-gray-500'
          completedClassName='!bg-green-500 text-gray-500'
        >
          <div className='absolute -top-[1.5rem] w-max text-center text-xs'>
            <Typography
              placeholder=''
              variant='small'
              className='font-poppins font-normal'
              color='inherit'
            >
              Resolve
            </Typography>
          </div>
        </Step>
        <Step
          placeholder=''
          className='h-4 w-4 !bg-gray-300 text-gray-500 cursor-pointer'
          activeClassName='ring-0 !bg-green-500 text-gray-500'
          completedClassName='!bg-green-500 text-gray-500'
        >
          <div className='absolute -top-[1.5rem] w-max text-center text-xs'>
            <Typography
              placeholder=''
              variant='small'
              className='font-poppins font-normal'
              color='inherit'
            >
              Result
            </Typography>
          </div>
        </Step>
      </Stepper>
    </div>
  );
};

export default StepperProgressBar;
