'use client';

import { Mail, Phone } from 'lucide-react';
import React from 'react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const DropdownRaw = (props: any) => {
  const { trigger, onSelectDropdownItem, options, open, onOpenChange } = props;
  // debugger
  return (
    <DropdownMenu open={open} onOpenChange={() => onOpenChange(!open)}>
      <DropdownMenuTrigger asChild={false}>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent
      // className='w-56 '
      // sideOffset={5}
      // align='end'
      // alignOffset={15}
      >
        <DropdownMenuLabel className='flex justify-between items-center'>
          <span className='font-poppins'>Contact Official</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuLabel className='flex justify-start gap-1 items-center'>
          <Mail className='h-4 w-4' />
          <span className='font-poppins text-xs'>Emails</span>
        </DropdownMenuLabel>
        <DropdownMenuGroup className='max-h-[200px] overflow-y-auto overflow-x-hidden'>
          {options?.emails?.map((item: any, index: any) => (
            <div key={index}>
              <DropdownMenuItem
                className='text-xs text-muted-foreground cursor-pointer'
                onSelect={(e) => onSelectDropdownItem(e, item)}
              >
                {item}
              </DropdownMenuItem>
            </div>
          ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuLabel className='flex justify-start gap-1 items-center'>
          <Phone className='h-4 w-4' />
          <span className='font-poppins text-xs'>Phones</span>
        </DropdownMenuLabel>
        <DropdownMenuGroup className='max-h-[200px] overflow-y-auto overflow-x-hidden'>
          {options?.phones?.map((item: any, index: any) => (
            <div key={index}>
              <DropdownMenuItem
                className='text-xs text-muted-foreground cursor-pointer'
                onSelect={(e) => onSelectDropdownItem(e, item)}
              >
                {item}
              </DropdownMenuItem>
            </div>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DropdownRaw;
