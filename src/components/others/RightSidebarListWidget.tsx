'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import React from 'react';
import { useRecoilState } from 'recoil';

import { Button } from '@/components/ui/button';

import { billState } from '@/store/bill.atom';

import { getTrendingFederalBills, getTrendingStateBills } from '@/apis/bills';

interface RightSidebarListWidgetProps {
  title: string;
  href: string;
  category: string;
}

const RightSidebarListWidget = (props: RightSidebarListWidgetProps) => {
  const { title, href, category } = props;
  const [{ billType }] = useRecoilState(billState);

  const { data, isLoading } = useQuery({
    queryKey: ['get-trending-bills-home', billType],
    queryFn: async () => {
      const billsData =
        billType === 'federal'
          ? await getTrendingFederalBills({}, category)
          : await getTrendingStateBills({ stateId: 'AL' }, category);

      return await billsData?.data;
    },
    enabled: true,
    refetchOnWindowFocus: false,
  });

  if (isLoading) return null;

  return (
    <div className='bg-secondaryAsh h-fit py-[16px] rounded-2xl flex flex-col gap-3'>
      <h4 className='font-semibold text-base px-[16px]'>{title}</h4>
      <ul className='flex flex-col'>
        {data?.slice(0, 5)?.map((bill: any, index: any) => (
          <Link href={`/bills/${bill?.billId}`} key={bill.billId}>
            <li className='hover:bg-[#efeff1] px-[16px] py-[10px]  text-sm'>
              <p className='mb-1'>{`#${index + 1}-HR ${bill.billId}`}</p>
              <p className='text-muted-foreground'>{bill.billTitle}</p>
            </li>
          </Link>
        ))}
      </ul>
      <Link href={`/${href}`} className='w-[120px] px-[16px]'>
        <Button
          className=' rounded-full mt-2'
          type='button'
          disabled={false}
          text='View All'
          loading={false}
        />
      </Link>
    </div>
  );
};

export default RightSidebarListWidget;
