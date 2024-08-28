'use client';

import { sub } from 'date-fns';
import React from 'react';
import { useRecoilState } from 'recoil';

import TabSwitcher from '@/components/bills/bill-data-hub/TabSwitcher';
import NewDatePicker from '@/components/utils/NewDatePicker';

import { billState } from '@/store/bill.atom';

import {
  renderTabContent,
  tabs,
} from '@/app/(private)/bills/[id]/data-hub/page';

interface BillCommentProps {
  billId?: string | string[];
}

const DataHubMobile = (props: BillCommentProps) => {
  const { billId } = props;
  const [{ billType }] = useRecoilState(billState);

  const [activeTab, setActiveTab] = React.useState('Total Votes');
  const [fromDate, setFromDate] = React.useState(
    sub(new Date(), {
      months: 1,
    }),
  );
  const [toDate, setToDate] = React.useState(new Date());

  const { component, subHeading }: any = renderTabContent(
    activeTab,
    fromDate,
    toDate,
    billType,
    billId,
  );

  return (
    <div className='w-full relative min-h-[90%]'>
      <div className='px-4 pt-3 pb-3 border-b border-gray-200 w-full flex items-center'>
        <h3 className='font-semibold text-sm mb-1'>Data Hub</h3>
      </div>
      <div className=' max-h-[calc(100dvh_-_225px)] overflow-auto overflow-y-auto flex flex-col  gap-1 py-2'>
        <div className='tour-data-hub p-2 md:px-4'>
          <TabSwitcher
            tabs={tabs}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        </div>
        <hr className='h-px  bg-gray-200 border-0 dark:bg-gray-700' />
        <div className='max-h-[calc(100dvh_-_240px)] md:max-h-full md:h-[calc(100vh_-_150px)] overflow-auto'>
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
              <div className='flex items-center gap-2 mt-6'>
                <span className='block w-2 h-2 bg-green-400 rounded-full' />
                <span className='block text-muted-foreground text-sm'>YAY</span>
              </div>
              <div className='flex items-center gap-2 mt-6'>
                <span className='block w-2 h-2 bg-red-400 rounded-full' />
                <span className='block text-muted-foreground text-sm'>NAY</span>
              </div>
            </div>
          </div>
          <div className='mt-4'>{component}</div>
        </div>
      </div>
    </div>
  );
};

export default DataHubMobile;
