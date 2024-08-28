'use client';

import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { useRecoilState } from 'recoil';

import { firebaseAnalytics } from '@/lib/helper';
import { cn } from '@/lib/utils';

import TabSwitcher from '@/components/bills/bill-data-hub/TabSwitcher';
import TrendingBillCard from '@/components/trends/trendingBillCard';
import Loading from '@/components/utils/Loading';

import { branchAtom } from '@/store/branch.atom';
import { userAtom } from '@/store/user.atom';

import { getTrendingFederalBills, getTrendingStateBills } from '@/apis/bills';

const tabs = [
  {
    label: 'Trending Bills',
    value: 'trending',
    branchPageName: 'TrendBills',
    mobileDeepLinkPath: '/trends/trending-bills',
  },
  {
    label: 'Popular Topics',
    value: 'popular',
    branchPageName: 'PopularTopics',
    mobileDeepLinkPath: '/trends/popular-topics',
  },
  {
    label: 'Common Grounds',
    value: 'common',
    branchPageName: 'CommonGrounds',
    mobileDeepLinkPath: '/trends/common-grounds',
  },
  {
    label: 'Disputed Areas',
    value: 'disputed',
    branchPageName: 'DisputedAreas',
    mobileDeepLinkPath: '/trends/disputed-areas',
  },
  {
    label: 'Officials Vs Voters',
    value: 'officals-vs-voters',
    branchPageName: 'OfficialsVsVoters',
    mobileDeepLinkPath: '',
  },
];

function fromCamelCase(str: string) {
  return (
    str
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      // .replace(/([A-Z])/g, ' $1') // Add a space before each uppercase letter
      .replace(/^\s*/, '')
      .replace(/\b\w/g, function (match) {
        return match.toUpperCase();
      })
  );
}

function toCamelCase(str: string) {
  return str
    .toLowerCase()
    .replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function (match, index) {
      return index === 0 ? match.toLowerCase() : match.toUpperCase();
    })
    .replace(/\s+/g, '');
}

const Trends = ({ searchParams }: any) => {
  const { category, bill_type } = searchParams;

  const { ref, inView } = useInView();

  const router = useRouter();

  const [, setUserState] = useRecoilState(userAtom);
  const [, setBranchState] = useRecoilState(branchAtom);

  // const [{ bill_type }, setBillType] = useRecoilState(billState);

  const [activeTab, setActiveTab] = React.useState({
    label: 'Trending Bills',
    value: 'trending',
  });
  const [bills, setBills] = React.useState<any>([]);
  const [payload] = React.useState({
    stateId: 'AL',
  });

  const { data, isLoading } = useQuery({
    queryKey: ['get-trending-bills', activeTab, bill_type],
    queryFn: async () => {
      const billsData =
        bill_type === 'federal'
          ? await getTrendingFederalBills({}, activeTab.value)
          : await getTrendingStateBills(payload, activeTab.value);

      setBills(billsData?.data);

      return billsData?.data;
    },
    refetchOnWindowFocus: false,
  });

  /**
   * Pagination might be needed in the future
   */
  React.useEffect(() => {
    if (inView && data?.length > 0) {
      // setPayload((prev) => ({ ...prev, pageNumber: prev.pageNumber + 1 }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  // React.useEffect(() => {
  // setBills([]);
  // setPayload((prev) => ({ ...prev, pageNumber: 1 }));
  // }, [activeTab, bill_type]);

  // React.useEffect(() => {
  // refetch();
  // }, [ activeTab, bill_type]);

  // React.useEffect(() => {
  //   setActiveTab('Trending Bills');
  // }, [bill_type]);

  React.useEffect(() => {
    setUserState((prev: any) => ({ ...prev, currentPageName: 'Trends' }));
  }, [setUserState]);

  const newBills = bills?.map((bill: any, index: number) => {
    const isLastItem = index === bills.length - 1;
    const _ref = isLastItem ? ref : null;

    return (
      <div key={index} ref={_ref}>
        <TrendingBillCard
          id={bill.billId}
          comments={Number(bill.comments)}
          shares={Number(bill.shares)}
          title={bill.billTitle}
          rank={index + 1}
          votes={Number(bill.agreeVotes)}
          identifier={`HR ${bill.billId}`}
        />
      </div>
    );
  });

  const onSwitchTab = (tabName: string) => {
    const newTabName = toCamelCase(tabName);
    router.replace(`trends?bill_type=${bill_type}&category=${newTabName}`);

    const tab: any = tabs.find((tab) => tab.label === tabName);
    setActiveTab(tab);
  };

  const onSwitchBillType = (type: string) => {
    router.replace(`trends?bill_type=${type}&category=${category}`);
  };

  useEffect(() => {
    if (category) {
      const normalCaseTab = fromCamelCase(category);
      const item: any = tabs.find((item) => item.label === normalCaseTab);

      setActiveTab(item);
      return;
    }
    router.replace(`trends?bill_type=federal&category=trendingBills`);
  }, [category, router]);

  const findBranchPageName = (tab: string): any => {
    if (!tab) return;
    const starts = tab.substring(0, 3);
    const tabPage = tabs.find((t) => t.value.startsWith(starts));
    return tabPage?.branchPageName || '';
  };

  const findMobileDeepLinkPath = (tab: string): any => {
    if (!tab) return;
    const starts = tab.substring(0, 3);
    const tabPage = tabs.find((t) => t.value.startsWith(starts));
    return tabPage?.mobileDeepLinkPath || '';
  };

  useEffect(() => {
    setBranchState({
      page: findBranchPageName(category),
      entity: null,
      entityId: null,
      alias: '',
      androidUrl: '',
      iosUrl: '',
      campaign: 'bill_awareness',
      deepLinkPath: findMobileDeepLinkPath(category),
      desktopUrl: `${process.env.DESKTOP_URL}/trends?bill_type=${bill_type}&category=${category}`,
      description: 'The top rated bills by the users',
      feature: 'trendingBills',
    });
  }, [bill_type, category, setBranchState]);

  useEffect(() => {
    firebaseAnalytics('page_view');
  }, []);

  return (
    <>
      <title>{activeTab.label}</title>
      <div className='mt-10 md:mt-0 pb-3.5 pt-3 flex items-center justify-around  w-full border-b border-gray-200'>
        <button
          className={cn('relative', {
            accountActiveTab: bill_type === 'federal',
          })}
          onClick={() => onSwitchBillType('federal')}
        >
          <span className='text-sm md:text-base'>Federal</span>{' '}
        </button>
        <button
          className={cn('relative', {
            accountActiveTab: bill_type === 'state',
          })}
          onClick={() => onSwitchBillType('state')}
        >
          <span className='text-sm md:text-base'>State</span>{' '}
        </button>
      </div>
      <div className='p-2 md:px-4 pb-4 mt-2 border-b border-gray-200'>
        <TabSwitcher
          tabs={tabs.map((tab) => tab.label)}
          activeTab={activeTab.label}
          setActiveTab={onSwitchTab}
        />
      </div>
      <div className='pt-2 max-h-[calc(100vh_-_204px)] overflow-auto flex flex-col gap-3'>
        {isLoading && <Loading />}

        {!isLoading && newBills}
      </div>
    </>
  );
};

export default Trends;
