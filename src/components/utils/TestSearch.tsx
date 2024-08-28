'use client';

import React from 'react';
import AsyncSelect from 'react-select/async';

export const colourOptions: readonly any[] = [
  { value: 'ocean', label: 'Ocean', color: '#00B8D9', isFixed: true },
  { value: 'blue', label: 'Blue', color: '#0052CC', isDisabled: true },
  { value: 'purple', label: 'Purple', color: '#5243AA' },
  { value: 'red', label: 'Red', color: '#FF5630', isFixed: true },
  { value: 'orange', label: 'Orange', color: '#FF8B00' },
  { value: 'yellow', label: 'Yellow', color: '#FFC400' },
  { value: 'green', label: 'Green', color: '#36B37E' },
  { value: 'forest', label: 'Forest', color: '#00875A' },
  { value: 'slate', label: 'Slate', color: '#253858' },
  { value: 'silver', label: 'Silver', color: '#666666' },
];

//remove this

const TestSearch = () => {
  const filterColors = (inputValue: string) => {
    return colourOptions.filter((i) =>
      i.label.toLowerCase().includes(inputValue.toLowerCase()),
    );
  };

  const promiseOptions = (inputValue: string) =>
    new Promise<any[]>((resolve) => {
      setTimeout(() => {
        resolve(filterColors(inputValue));
      }, 1000);
    });

  return (
    <AsyncSelect
      cacheOptions
      defaultOptions
      loadOptions={promiseOptions}
      // className='w-full text-sm truncate'
      styles={{
        menu: menuStyles,
        menuList: menuStyles,
        control: containerStyles,
        dropdownIndicator: dropdownIndicatorStyles,
        indicatorSeparator: dropdownIndicatorStyles,
      }}
    />
  );
};

export default TestSearch;

const dropdownIndicatorStyles = (base: any) => {
  const changes = {
    display: 'none',
  };
  return Object.assign(base, changes);
};

const containerStyles = (base: any) => {
  const changes = {
    color: 'red',
    boxShadow: 'none',
    border: '1px solid #e5e7eb',
    borderRadius: '20px',
    backgroundColor: '#f7f7f8',

    // width:'200px'
  };
  return Object.assign(base, changes);
};

const menuStyles = (base: any) => {
  const changes = {
    borderRadius: '20px',
  };
  return Object.assign(base, changes);
};
