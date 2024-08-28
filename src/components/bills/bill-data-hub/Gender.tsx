import { useQuery } from '@tanstack/react-query';
import React from 'react';

import { calculatePercentage, formatTickNumber } from '@/lib/helper';

import NewBarChart from '@/components/bills/bill-data-hub/charts/NewBarChart';
import { Progress } from '@/components/ui/progress';

import { getVoteAnalytics } from '@/apis/data-hub';
import { ChartSkeleton } from '@/app/(private)/bills/[id]/data-hub/page';

interface GenderProps {
  fromDate: string;
  toDate: string;
  billType: string;
  billId: any;
}

const Gender = (props: GenderProps) => {
  const { fromDate, toDate, billType, billId } = props;

  const params = {
    fromDate,
    toDate,
    billId,
    filter: 'gender',
  };

  const { data, isFetching, refetch } = useQuery({
    queryKey: ['get-gender-votes'],
    queryFn: () => getVoteAnalytics(params, { billType }),
    refetchOnWindowFocus: false,
  });

  const chartData = ['male', 'female', 'other'].map((category) => ({
    name:
      category.charAt(0).toUpperCase() +
      category
        .slice(1)
        .replace(/([A-Z])/g, ' $1')
        .trim(),
    agree: data?.data?.[category]?.agree ?? 0,
    disagree: data?.data?.[category]?.disagree ?? 0,
    agreePercentage: calculatePercentage(
      data?.data?.[category]?.agree,
      data?.data?.[category]?.agree + data?.data?.[category]?.disagree,
    ),
    disagreePercentage: calculatePercentage(
      data?.data?.[category]?.disagree,
      data?.data?.[category]?.agree + data?.data?.[category]?.disagree,
    ),
  }));

  const refetchFn = React.useCallback(() => refetch(), [refetch]);

  React.useEffect(() => {
    refetchFn();
  }, [fromDate, toDate, refetchFn]);

  if (isFetching) return <ChartSkeleton />;
  return (
    <div className='my-5'>
      <div className='h-[275px] mt-5 px-5'>
        <NewBarChart
          data={chartData}
          bar1DataKey='agree'
          bar2DataKey='disagree'
          yAxisTickFormatter={formatTickNumber}
          yAxisTickDomain={[0, 'dataMax + 0']}
        />
      </div>
      <hr className='h-px my-4 mb-6 bg-gray-200 border-0 dark:bg-gray-700' />
      <p className='mb-3 text-[#77c388] pl-4'>YAY</p>
      <div className='w-1/2'>
        <div className='flex justify-between px-4'>
          {chartData.map((item: any, index) => (
            <div className='flex flex-col gap-1' key={index}>
              <p className='text-sm'>{item?.agree}</p>
              <p className='text-xs text-muted-foreground'>{item?.name}</p>
            </div>
          ))}
        </div>
        <p className='my-3 text-[#ee7c7c] pl-4'>NAY</p>
        <div className='flex justify-between px-4'>
          {chartData.map((item: any, index) => (
            <div className='flex flex-col gap-1' key={index}>
              <p className='text-sm'>{item?.disagree}</p>
              <p className='text-xs text-muted-foreground'>{item?.name}</p>
            </div>
          ))}
        </div>
      </div>
      <h3 className='py-3 px-4 font-semibold text-lg'>Percentage</h3>
      <div className='px-4 flex flex-col gap-6'>
        {chartData.map((item: any) => (
          <Progress
            isZero={item.agreePercentage === 0 && item.disagreePercentage === 0}
            key={item.name}
            value={item.agreePercentage}
            renderBottomContent={() => (
              <div className='flex justify-between text-xs mt-2'>
                <p className='text-muted-foreground'>
                  {item.name}{' '}
                  <span className='text-[#77c388]'>
                    YAY {item.agreePercentage}%
                  </span>
                </p>
                <p className='text-muted-foreground'>
                  {item.name}{' '}
                  <span className='text-[#ee7c7c]'>
                    NAY {item.disagreePercentage}%
                  </span>
                </p>
              </div>
            )}
          />
        ))}
      </div>
    </div>
  );
};

export default Gender;
