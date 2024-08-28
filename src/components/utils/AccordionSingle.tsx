'use client';

import {
  Accordion,
  AccordionBody,
  AccordionHeader,
} from '@material-tailwind/react';
import React, { ReactNode } from 'react';

function Icon({ id, open }: any) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      fill='none'
      viewBox='0 0 24 24'
      strokeWidth={2}
      stroke='currentColor'
      className={`${id === open ? 'rotate-180' : ''} h-5 w-5 transition-transform`}
    >
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        d='M19.5 8.25l-7.5 7.5-7.5-7.5'
      />
    </svg>
  );
}

interface AccordionSingleProps {
  children?: ReactNode;
  header: string;
  body?: string;
  defaultOpen?: 0 | 1 | number;
}

const AccordionSingle = (props: AccordionSingleProps) => {
  const { children, header, body, defaultOpen = 1 } = props;
  const [open, setOpen] = React.useState(defaultOpen);

  const handleOpen = (value: number) => setOpen(open === value ? 0 : value);
  return (
    <div>
      <Accordion
        placeholder=''
        open={open === 1}
        icon={<Icon id={1} open={open} />}
      >
        <AccordionHeader
          placeholder=''
          className='text-sm font-normal text-black font-poppins'
          onClick={() => handleOpen(1)}
        >
          {header}
        </AccordionHeader>
        <AccordionBody className='font-poppins'>
          {children ? children : body}
        </AccordionBody>
      </Accordion>
    </div>
  );
};

export default AccordionSingle;
