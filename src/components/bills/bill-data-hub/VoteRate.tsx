import { useQuery } from '@tanstack/react-query';
import React from 'react';

import { calculatePercentage } from '@/lib/helper';

import CircularProgress from '@/components/bills/bill-data-hub/charts/CircularProgress';
import { Progress } from '@/components/ui/progress';

import { getVoteAnalytics } from '@/apis/data-hub';
import { ChartSkeleton } from '@/app/(private)/bills/[id]/data-hub/page';

interface Props {
  fromDate: string;
  toDate: string;
  billType: string;
  billId: any;
}

const VoteRate = (props: Props) => {
  const { fromDate, toDate, billType, billId } = props;

  const params = {
    fromDate,
    toDate,
    billId,
    filter: 'voteRate',
  };

  const { data, isFetching, refetch } = useQuery({
    queryKey: ['get-vote-rate'],
    queryFn: () => getVoteAnalytics(params, { billType }),
    refetchOnWindowFocus: false,
  });

  const percentage = calculatePercentage(
    data?.data?.votes,
    data?.data?.votes + data?.data?.views,
  );

  const refetchFn = React.useCallback(() => refetch(), [refetch]);

  React.useEffect(() => {
    refetchFn();
  }, [fromDate, refetchFn, toDate]);

  if (isFetching) return <ChartSkeleton />;

  return (
    <div className=''>
      <CircularProgress progress={percentage || 0} valueClassName='text-xl' />
      <hr className='h-px mt-9 mb-6 bg-gray-200 border-0 dark:bg-gray-700' />
      <div className='px-4'>
        <h3 className='pb-3 font-semibold text-lg'>Percentage</h3>
        <Progress
          className='bg-[#f0f4fd]'
          value={percentage}
          renderBottomContent={() => (
            <div className='flex justify-between text-xs mt-2'>
              <p className='text-black'>
                {data?.data?.votes || 0}{' '}
                <span className='text-[#77c388]'>Voted</span>
              </p>
              <p className='text-black'>
                {data?.data?.views || 0} <span className=''>Viewed</span>
              </p>
            </div>
          )}
        />
      </div>
    </div>
  );
};

export default VoteRate;
