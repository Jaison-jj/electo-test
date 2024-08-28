/* eslint-disable unused-imports/no-unused-imports */
'use client';

import { X } from 'lucide-react';

import CheckboxInput from '@/components/ui/CheckboxInput';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
export function DropdownWithFilter(props: any) {
  const {
    trigger,
    onSelectDropdownItem,
    options,
    onSubmit,
    open,
    selectedOptions,
    onOpenChange,
    renderSearch,
  } = props;

  return (
    <DropdownMenu open={open} onOpenChange={() => onOpenChange(!open)}>
      <DropdownMenuTrigger asChild={false}>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent
        className='w-56 '
        sideOffset={5}
        align='end'
        alignOffset={15}
      >
        <DropdownMenuLabel className='flex justify-between items-center'>
          <span className='font-poppins'>Select States</span>
          <X
            className='h-5 w-5 text-black'
            role='button'
            onClick={() => onOpenChange(!open)}
          />
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className='pt-1 pb-2'>{renderSearch}</div>
        <DropdownMenuGroup className='max-h-[200px] overflow-y-auto overflow-x-hidden'>
          {options?.map((item: any, index: any) => (
            <div key={index}>
              <DropdownMenuItem
                onSelect={(e) => onSelectDropdownItem(e, item.code)}
              >
                {/* <DropdownMenuCheckboxItem
                checked={selectedOptions.includes(item)}
                >
                {item}
              </DropdownMenuCheckboxItem> */}
                <CheckboxInput
                  checked={selectedOptions.includes(item.code)}
                  containerClassName='flex-row-reverse justify-between w-full'
                  renderlabel={
                    <span
                      onClick={(e) => onSelectDropdownItem(e, item.code)}
                      className='font-poppins'
                    >
                      {item.name}
                    </span>
                  }
                />
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </div>
          ))}
        </DropdownMenuGroup>

        <DropdownMenuLabel
          className='text-center font-poppins'
          onClick={onSubmit}
          role='button'
        >
          Apply
        </DropdownMenuLabel>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
