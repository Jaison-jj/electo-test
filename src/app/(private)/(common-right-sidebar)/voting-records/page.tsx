'use client';

import { intlFormatDistance } from 'date-fns';
import dynamicImport from 'next/dynamic';
import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { useRecoilState } from 'recoil';
import { toast } from 'sonner';

import { firebaseAnalytics } from '@/lib/helper';
import { cn } from '@/lib/utils';

import BillCardSkeleton from '@/components/utils/BillCardSkeleton';

import { billState } from '@/store/bill.atom';
import { userAtom } from '@/store/user.atom';

import { getVotingRecords } from '@/apis/bills';

const BillCard = dynamicImport(() => import('@/components/bills/BillCard'), {
  loading: () => <BillCardSkeleton />,
});

const VotingRecords = () => {
  const { ref, inView } = useInView();

  const [{ billType }, setBillStateValue] = useRecoilState(billState);
  const [, setUserState] = useRecoilState(userAtom);

  const [isLoading, setLoading] = React.useState<boolean>(false);
  const [currentPage, setCurrentPage] = React.useState<number>(1);
  const [bills, setBills] = React.useState<any>({
    federal: [],
    state: [],
  });

  const onChangeBillListType = (type: string) => {
    setBillStateValue((prev) => ({
      ...prev,
      billType: type,
    }));
  };

  const bill_type = billType === 'state' ? 'stateBills' : 'federalBills';

  const getBills = async () => {
    setLoading(true);
    try {
      await getVotingRecords({ pageNumber: currentPage }, bill_type).then(
        async (response) => {
          setBills((prev: any) => ({
            ...prev,
            [billType]: [...(prev[billType] || []), ...response.data],
          }));
          setLoading(false);
        },
      );
    } catch (error) {
      toast('Something went wrong with fetching bills!');
      setLoading(false);
    }
  };

  const billsPerType = billType === 'federal' ? bills.federal : bills.state;

  const newBills = billsPerType.map((bill: any, index: number) => {
    const isLastItem = index === bills[billType].length - 3;
    const _ref = isLastItem ? ref : null;

    const time = intlFormatDistance(new Date(bill.createdAt), new Date());

    return (
      <div key={index} ref={_ref}>
        <BillCard
          description={bill.billText}
          type='votingRecords'
          authors={bill?.authors || []}
          time={time}
          agreeVotes={bill.agreeVotes || 0}
          comments={bill.comments || 0}
          shares={bill.shares || 0}
          id={bill.billId}
          voted={bill.voteType === 'agree'}
          billType={billType}
        />
      </div>
    );
  });

  React.useEffect(() => {
    getBills();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, billType]);

  React.useEffect(() => {
    if (inView && (bills.state.length > 0 || bills.federal.length > 0)) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  React.useEffect(() => {
    setCurrentPage(1);
    setBills({ federal: [], state: [] });
  }, [billType]);

  useEffect(() => {
    setUserState((prev: any) => ({
      ...prev,
      currentPageName: 'My Voting Records',
    }));
  }, [setUserState]);

  useEffect(() => {
    firebaseAnalytics('page_view');
  }, []);

  return (
    <>
      <title>Voting Records</title>
      <div className='mt-10 md:mt-0 pb-3.5 pt-3 flex items-center justify-around w-full border-b border-gray-200'>
        <button
          className={cn('relative', {
            accountActiveTab: billType === 'federal',
          })}
          onClick={() => onChangeBillListType('federal')}
        >
          <span className='text-sm md:text-base'>Federal</span>{' '}
        </button>
        <button
          className={cn('relative', {
            accountActiveTab: billType === 'state',
          })}
          onClick={() => onChangeBillListType('state')}
        >
          <span className='text-sm md:text-base'>State</span>{' '}
        </button>
      </div>

      <div className='flex w-full flex-col'>
        {!billsPerType.length && !isLoading && (
          <p className='py-4 text-sm text-center text-muted-foreground'>
            No data to display!
          </p>
        )}

        {newBills}
        {isLoading && (
          <>
            <BillCardSkeleton />
            <BillCardSkeleton />
            <BillCardSkeleton />
          </>
        )}
      </div>
    </>
  );
};

export default VotingRecords;
