'use client';

import Image from 'next/image';
import React, { forwardRef, useState } from 'react';
import OutsideClickHandler from 'react-outside-click-handler';

import { cn } from '@/lib/utils';

import DownArrow from '@/../public/images/downArrow.png';

type SelectWithDropdownProps = {
  value?: string | number | null;
  placeholder?: string;
  options: { label: string; value: string }[];
  className?: string;
  onChange?: (value: string) => void;
  inputLabel?: string;
  listClassName?: string;
  requiredField?: boolean;
};

const SelectWithDropdown = forwardRef(
  (
    {
      options,
      className,
      onChange,
      value,
      placeholder = 'Select',
      inputLabel,
      listClassName,
      requiredField,
    }: SelectWithDropdownProps,
    _ref,
  ) => {
    const [open, setIsOpen] = useState(false);

    const onSelectAction = (option: { label: string; value: string }) => {
      if (onChange) {
        onChange(option.value);
      }
      setIsOpen(false);
    };

    return (
      <OutsideClickHandler
        onOutsideClick={() => {
          setIsOpen(false);
        }}
      >
        <div className='relative'>
          {inputLabel && (
            <p className='font-normal text-sm text-muted-foreground mb-2'>
              {inputLabel}
              {requiredField && <span className='text-red-600 text-xs'>*</span>}
            </p>
          )}
          <button
            type='button'
            className={cn(
              'relative flex h-10 w-full cursor-pointer items-center justify-between rounded-xl border border-gray-200 bg-[#FFF] pl-2',
              className,
            )}
            onClick={() => setIsOpen(!open)}
          >
            {!value && (
              <span className='font-normal text-sm text-muted-foreground'>
                {placeholder}
              </span>
            )}
            {value !== null && value !== 0 && (
              <span className='truncate text-sm capitalize'>
                {options?.filter((item) => item.value === value)[0]?.label ||
                  value}
              </span>
            )}

            <Image
              src={DownArrow}
              alt='dots'
              height={24}
              width={24}
              className='max-h-[24px] max-w-[24px]'
            />
          </button>

          {open && (
            <ul
              className={`absolute ${listClassName ?? 'top-[47px]'}  z-50 
            flex max-h-[300px] w-full  flex-col 
            overflow-auto  rounded-lg bg-gray-100`}
            >
              {options?.map((option) => (
                <li
                  key={option.value}
                  className='!w-full cursor-pointer border-b border-gray-300 px-2 py-2 text-left text-sm first:rounded-t-lg last:rounded-b-lg last:border-b-0 hover:bg-gray-300'
                  onClick={() => onSelectAction(option)}
                >
                  {option.label}
                </li>
              ))}
            </ul>
          )}
        </div>
      </OutsideClickHandler>
    );
  },
);

export default SelectWithDropdown;
