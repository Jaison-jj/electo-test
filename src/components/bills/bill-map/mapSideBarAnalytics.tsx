'use client';

import { sub } from 'date-fns';
import { X } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import React from 'react';

import TabSwitcher from '@/components/bills/bill-data-hub/TabSwitcher';
import NewDatePicker from '@/components/utils/NewDatePicker';

import {
  renderTabContent,
  tabs,
} from '@/app/(private)/bills/[id]/data-hub/page';

const MapSideBarAnalytics = (props: any) => {
  const { setIsOpen, bill_type } = props;

  const router = useRouter();
  const { id } = useParams();

  const [activeTab, setActiveTab] = React.useState('Total Votes');
  const [fromDate, setFromDate] = React.useState(
    sub(new Date(), {
      months: 1,
    }),
  );
  const [toDate, setToDate] = React.useState(new Date());

  const onClickClose = () => {
    setIsOpen(false);
    router.replace(
      `/bills/${id}/${bill_type === 'federal' ? 'federal-map' : 'state-map'}?bill_type=${bill_type}`,
    );
  };

  const { component, subHeading }: any = renderTabContent(
    activeTab,
    fromDate,
    toDate,
    bill_type as any,
    id,
  );

  return (
    <div className=''>
      <X
        role='button'
        className=' border border-black  px-1 py-1 rounded-2xl ml-auto text-xs m-2'
        onClick={onClickClose}
      />
      <div className='p-2 md:px-4'>
        <TabSwitcher
          tabs={tabs}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      </div>
      <hr className='h-px mt-[10px] bg-gray-200 border-0 dark:bg-gray-700' />

      <div className=''>
        <div className='p-4'>
          <h2 className='text-lg font-semibold'>{activeTab}</h2>
          <p className='text-muted-foreground text-sm py-3'>{subHeading}</p>
          <div className='flex gap-5 items-center'>
            <div className='flex flex-col gap-2'>
              <label className='font-normal text-xs text-muted-foreground'>
                From
              </label>
              <NewDatePicker
                className=''
                value={fromDate}
                onChange={setFromDate}
                maxDate={toDate}
                dateFormat='MMMM dd YYYY'
                portalId='root-portal'
              />
            </div>
            <div className='flex flex-col gap-2'>
              <label className='font-normal text-xs text-muted-foreground'>
                To
              </label>
              <NewDatePicker
                className=''
                value={toDate}
                onChange={setToDate}
                minDate={fromDate}
                dateFormat='MMMM dd YYYY'
              />
            </div>
          </div>
          <div className='flex justify-center gap-4'>
            <div className='flex items-center gap-2 mt-4'>
              <span className='block w-2 h-2 bg-green-400 rounded-full' />
              <span className='block text-muted-foreground text-sm'>YAY</span>
            </div>
            <div className='flex items-center gap-2 mt-4'>
              <span className='block w-2 h-2 bg-red-400 rounded-full' />
              <span className='block text-muted-foreground text-sm'>NAY</span>
            </div>
          </div>
        </div>
        <div className='mt-4'>{component}</div>
      </div>
    </div>
  );
};

export default MapSideBarAnalytics;
