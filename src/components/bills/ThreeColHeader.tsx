'use client';

import Link from 'next/link';
import React from 'react';
import { useRecoilState } from 'recoil';

import { cn } from '@/lib/utils';

import SearchInput from '@/components/utils/SearchInput';

import { billState } from '@/store/bill.atom';

// import useScroll from '@/hooks/use-scroll';
// import { useSelectedLayoutSegment } from 'next/navigation';
import CompanyLogoNew from '@/../public/svg/logoHeaderNew.svg';

const ThreeColHeader = () => {
  // const scrolled = useScroll(5);
  // const selectedLayout = useSelectedLayoutSegment();

  const [billStateValue, setBillStateValue] = useRecoilState(billState);

  const onChangeBillListType = (type: string) => {
    setBillStateValue((prev) => ({
      ...prev,
      billType: type,
    }));
  };

  return (
    <div className={cn(`w-full transition-all border-b border-gray-200 `)}>
      <div className='flex h-[40px] md:h-[80px] items-center justify-center mx-auto md:max-w-[1125px]'>
        <div className='hidden md:flex h-full md:w-[167px]  lg:w-[239px]'>
          <Link
            href='/bills'
            className='flex flex-row space-x-3 items-center justify-start w-full'
          >
            {/* <span className='font-bold text-2xl font-syncopate flex'>
              ELECTO
            </span> */}
            <CompanyLogoNew className='w-[125px] h-[30px]' />
          </Link>
        </div>
        <div className='flex items-center justify-around h-full md:w-[385px]  lg:w-[550px] w-full border-l border-r border-gray-200'>
          <button
            className={cn('relative', {
              activeHeader: billStateValue.billType === 'federal',
            })}
            onClick={() => onChangeBillListType('federal')}
          >
            <span>Federal</span>{' '}
          </button>
          <button
            className={cn('relative', {
              activeHeader: billStateValue.billType === 'state',
            })}
            onClick={() => onChangeBillListType('state')}
          >
            <span>State</span>{' '}
          </button>
        </div>
        <div className='hidden md:flex justify-left items-center h-full md:w-[235px] lg:w-[336px] pl-4'>
          <SearchInput placeholder='Search by bill, official, topic, etc...' />
        </div>
      </div>
    </div>
  );
};

export default ThreeColHeader;
