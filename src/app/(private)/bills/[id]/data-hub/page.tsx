'use client';

import { sub } from 'date-fns';
import dynamic from 'next/dynamic';
import { useParams } from 'next/navigation';
import React from 'react';
import ReactJoyride from 'react-joyride';
import { useRecoilState } from 'recoil';

import { firebaseAnalytics, formatDateAPIpayload } from '@/lib/helper';

import TourTooltip from '@/components/guidedTour/TourTooltip';
import { Skeleton } from '@/components/ui/skeleton';
import NewDatePicker from '@/components/utils/NewDatePicker';

import { authState } from '@/store/auth.atom';
import { branchAtom } from '@/store/branch.atom';
import { userAtom } from '@/store/user.atom';

const TabSwitcher = dynamic(
  () => import('@/components/bills/bill-data-hub/TabSwitcher'),
  {
    loading: () => <Skeleton className='h-[30px] w-full' />,
  },
);

const Age = dynamic(() => import('@/components/bills/bill-data-hub/Age'), {
  loading: () => <ChartSkeleton />,
});
const Gender = dynamic(
  () => import('@/components/bills/bill-data-hub/Gender'),
  {
    loading: () => <ChartSkeleton />,
  },
);
const Race = dynamic(() => import('@/components/bills/bill-data-hub/Race'), {
  loading: () => <ChartSkeleton />,
});
const VoteRate = dynamic(
  () => import('@/components/bills/bill-data-hub/VoteRate'),
  {
    loading: () => <ChartSkeleton />,
  },
);
const TotalVotes = dynamic(
  () => import('@/components/bills/bill-data-hub/TotalVotes'),
  {
    loading: () => <ChartSkeleton />,
  },
);

const Education = dynamic(
  () => import('@/components/bills/bill-data-hub/Education'),
  {
    loading: () => <ChartSkeleton />,
  },
);
const PoliticalParty = dynamic(
  () => import('@/components/bills/bill-data-hub/PoliticalParty'),
  {
    loading: () => <ChartSkeleton />,
  },
);

export const tabs: string[] = [
  'Total Votes',
  'Age',
  'Gender',
  'Race',
  'Education',
  'Political party',
  'Vote Rate',
];

export const renderTabContent = (
  activeTab: string,
  fromDate: Date,
  toDate: Date,
  billType: string,
  id: any,
) => {
  switch (activeTab) {
    case 'Total Votes':
      return {
        component: (
          <TotalVotes
            fromDate={formatDateAPIpayload(fromDate, 'yyyy-MM-dd')}
            toDate={formatDateAPIpayload(toDate, 'yyyy-MM-dd')}
            billType={billType}
            billId={id}
          />
        ),
        subHeading: 'Compare your vote to fellow citizens',
      };
    case 'Age':
      return {
        component: (
          <Age
            fromDate={formatDateAPIpayload(fromDate, 'yyyy-MM-dd')}
            toDate={formatDateAPIpayload(toDate, 'yyyy-MM-dd')}
            billType={billType}
            billId={id}
          />
        ),
        subHeading: 'Compare votes across age groups',
      };
    case 'Gender':
      return {
        component: (
          <Gender
            fromDate={formatDateAPIpayload(fromDate, 'yyyy-MM-dd')}
            toDate={formatDateAPIpayload(toDate, 'yyyy-MM-dd')}
            billType={billType}
            billId={id}
          />
        ),
        subHeading: 'Compare votes between genders',
      };
    case 'Race':
      return {
        component: (
          <Race
            fromDate={formatDateAPIpayload(fromDate, 'yyyy-MM-dd')}
            toDate={formatDateAPIpayload(toDate, 'yyyy-MM-dd')}
            billType={billType}
            billId={id}
          />
        ),
        subHeading: 'Compare votes across diverse backgrounds',
      };
    case 'Education':
      return {
        component: (
          <Education
            fromDate={formatDateAPIpayload(fromDate, 'yyyy-MM-dd')}
            toDate={formatDateAPIpayload(toDate, 'yyyy-MM-dd')}
            billType={billType}
            billId={id}
          />
        ),
        subHeading: 'Compare votes across education levels',
      };
    case 'Political party':
      return {
        component: (
          <PoliticalParty
            fromDate={formatDateAPIpayload(fromDate, 'yyyy-MM-dd')}
            toDate={formatDateAPIpayload(toDate, 'yyyy-MM-dd')}
            billType={billType}
            billId={id}
          />
        ),
        subHeading: 'Compare votes between parties',
      };
    case 'Vote Rate':
      return {
        component: (
          <VoteRate
            fromDate={formatDateAPIpayload(fromDate, 'yyyy-MM-dd')}
            toDate={formatDateAPIpayload(toDate, 'yyyy-MM-dd')}
            billType={billType}
            billId={id}
          />
        ),
        subHeading: 'Percentage of citizens who examined the bill and voted',
      };
    default:
      return null;
  }
};

const DataHub = ({ params, searchParams }: any) => {
  const { id } = useParams();
  const { bill_type } = searchParams;

  const [{ isNewUser }, setAuthStateValue] = useRecoilState(authState);
  const [, setUserState] = useRecoilState(userAtom);
  const [, setBranchState] = useRecoilState(branchAtom);

  const [activeTab, setActiveTab] = React.useState('Total Votes');
  const [fromDate, setFromDate] = React.useState(
    sub(new Date(), {
      months: 1,
    }),
  );
  const [toDate, setToDate] = React.useState(new Date());

  const [tourSteps, setTourSteps] = React.useState<any>([]);

  React.useEffect(() => {
    setTourSteps([
      {
        target: '.tour-data-hub',
        content: `Dive into analytics to see detailed insights on public opinion and bill!`,
        disableBeacon: true,
      },
    ]);
  }, []);

  const { component, subHeading }: any = renderTabContent(
    activeTab,
    fromDate,
    toDate,
    bill_type,
    id,
  );

  React.useEffect(() => {
    setUserState((prev) => ({ ...prev, currentPageName: 'Data Hub' }));
  }, [setUserState]);

  React.useEffect(() => {
    setBranchState((prev) => ({
      ...prev,
      page: 'BillAnalytics',
      entity: bill_type === 'federal' ? 'federalBill' : 'stateBill',
      entityId: id as string,
      alias: '',
      androidUrl: '',
      iosUrl: '',
      campaign: 'bill_analytics',
      deepLinkPath: '/bill-feed/bill-summary/data-hub',
      desktopUrl: `${process.env.DESKTOP_URL}/bills/${params.id}/data-hub?bill_type=${bill_type}`,
      feature: 'bill-map',
    }));
  }, [bill_type, id, params.id, setBranchState]);

  React.useEffect(() => {
    firebaseAnalytics('page_view');
  }, []);

  return (
    <div className='mt-[50px] md:mt-3'>
      <title>Data Hub</title>
      <ReactJoyride
        steps={tourSteps}
        disableOverlayClose
        disableScrolling
        hideCloseButton
        run={isNewUser}
        styles={{
          options: {},
          overlay: {
            height: '100%',
          },
        }}
        tooltipComponent={(props) => (
          <TourTooltip
            {...props}
            // onClickNext={() => router.push(`/`)}
            nextBtnText='Done'
            onClickNext={() =>
              setAuthStateValue((prev) => ({ ...prev, isNewUser: false }))
            }
            onClickSkip={() =>
              setAuthStateValue((prev) => ({ ...prev, isNewUser: false }))
            }
          />
        )}
      />
      <div className='tour-data-hub p-2 md:px-4'>
        <TabSwitcher
          tabs={tabs}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      </div>

      <hr className='h-px mt-[10px] bg-gray-200 border-0 dark:bg-gray-700' />

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
  );
};

export default DataHub;

export const ChartSkeleton = () => (
  <div className='px-4 flex flex-col gap-3'>
    <Skeleton className='h-[275px] w-full' />
    <Skeleton className='h-[5px] w-1/2' />
    <Skeleton className='h-[30px] w-full' />
    <Skeleton className='h-[30px] w-full' />
    <Skeleton className='h-[30px] w-full' />
  </div>
);
