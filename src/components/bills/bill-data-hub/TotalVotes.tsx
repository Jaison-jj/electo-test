import { useQuery } from '@tanstack/react-query';
import React from 'react';

import { calculatePercentage } from '@/lib/helper';

import NewBarChart from '@/components/bills/bill-data-hub/charts/NewBarChart';
import { Progress } from '@/components/ui/progress';

import { getVoteAnalytics } from '@/apis/data-hub';
import { ChartSkeleton } from '@/app/(private)/bills/[id]/data-hub/page';

interface TotalVotesProps {
  fromDate: string;
  toDate: string;
  billType: string;
  billId: any;
}

const TotalVotes = (props: TotalVotesProps) => {
  const { fromDate, toDate, billType, billId } = props;

  const params = {
    fromDate,
    toDate,
    billId,
    filter: 'totalVotes',
  };

  const { data, isFetching, refetch } = useQuery({
    queryKey: ['get-total-votes'],
    queryFn: () => getVoteAnalytics(params, { billType }),
    refetchOnWindowFocus: false,
  });

  const agreePercentage = calculatePercentage(
    data?.data?.agreeCount,
    data?.data?.agreeCount + data?.data?.disagreeCount,
  );

  const disagreePercentage = calculatePercentage(
    data?.data?.disagreeCount,
    data?.data?.agreeCount + data?.data?.disagreeCount,
  );

  const refetchFn = React.useCallback(() => refetch(), [refetch]);

  React.useEffect(() => {
    refetchFn();
  }, [fromDate, toDate, refetchFn]);

  // percentage value is taken since its a percentage graph
  const chartData = [
    {
      name: 'YAY',
      Agree: agreePercentage,
    },
    {
      name: 'NAY',
      Disagree: disagreePercentage,
    },
  ];

  if (isFetching) return <ChartSkeleton />;

  return (
    <div>
      <div className='h-[275px] mt-5 p-4'>
        <NewBarChart
          data={chartData}
          bar1DataKey='Agree'
          bar2DataKey='Disagree'
          yAxisTickFormatter={(tick: number) => `${tick}%`}
          yAxisTickDomain={[0, 100]}
        />
      </div>
      <hr className='h-px mt-9 mb-6 bg-gray-200 border-0 dark:bg-gray-700' />
      <div className='px-4'>
        <h3 className='pb-3 font-semibold text-lg'>Percentage</h3>
        <Progress
          isZero={agreePercentage === 0 && disagreePercentage === 0}
          value={agreePercentage}
          renderBottomContent={() => (
            <div className='flex justify-between text-xs mt-2'>
              <p className='text-black'>
                {data?.data?.agreeCount}{' '}
                <span className='text-[#77c388]'>YAY {agreePercentage}%</span>
              </p>
              <p className='text-black'>
                {data?.data?.disagreeCount}{' '}
                <span className='text-[#ff5756]'>
                  NAY {disagreePercentage}%
                </span>
              </p>
            </div>
          )}
        />
      </div>
    </div>
  );
};

export default TotalVotes;
