import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import React from 'react';

import { calculatePercentage } from '@/lib/helper';

import NewLineChart from '@/components/bills/bill-data-hub/charts/NewLineChart';
import { Progress } from '@/components/ui/progress';

import { getVoteAnalytics } from '@/apis/data-hub';
import { ChartSkeleton } from '@/app/(private)/bills/[id]/data-hub/page';

interface AgeProps {
  fromDate: string;
  toDate: string;
  billType: string;
  billId: any;
}

const Age = (props: AgeProps) => {
  const { fromDate, toDate, billType } = props;
  const { id } = useParams();
  const params = {
    fromDate,
    toDate,
    filter: 'age',
    billId: id,
  };

  const { data, isFetching, refetch } = useQuery({
    queryKey: ['get-age-votes'],
    queryFn: () => getVoteAnalytics(params, { billType }),
    refetchOnWindowFocus: false,
  });

  const lineChartData = [
    {
      name: '18-24',
      Agree: data?.data['18-24']?.agree || 0,
      Disagree: data?.data['18-24']?.disagree || 0,
    },
    {
      name: '25-34',
      Agree: data?.data['25-34']?.agree || 0,
      Disagree: data?.data['25-34']?.disagree || 0,
    },
    {
      name: '35-44',
      Agree: data?.data['35-44']?.agree || 0,
      Disagree: data?.data['35-44']?.disagree || 0,
    },
    {
      name: '45-54',
      Agree: data?.data['45-54']?.agree || 0,
      Disagree: data?.data['45-54']?.disagree || 0,
    },
    {
      name: '55-64',
      Agree: data?.data['55-64']?.agree || 0,
      Disagree: data?.data['55-64']?.disagree || 0,
    },
    {
      name: '65+',
      Agree: data?.data['65+']?.agree || 0,
      Disagree: data?.data['65+']?.disagree || 0,
    },
  ];

  const agreePercentages = lineChartData.map((item) =>
    calculatePercentage(item.Agree, item.Agree + item.Disagree),
  );

  const disagreePercentages = lineChartData.map((item) =>
    calculatePercentage(item.Disagree, item.Agree + item.Disagree),
  );

  const refetchFn = React.useCallback(() => refetch(), [refetch]);

  React.useEffect(() => {
    refetchFn();
  }, [fromDate, toDate, refetchFn]);

  if (isFetching) return <ChartSkeleton />;
  return (
    <div className='mt-5 mb-10'>
      <div className='h-[275px] pr-5'>
        <NewLineChart
          data={lineChartData}
          line1DataKey='Disagree'
          line2DataKey='Agree'
          yAxisTickDomain={[0, 'dataMax + 1']}
        />
      </div>
      <hr className='h-px my-4 mb-6 bg-gray-200 border-0 dark:bg-gray-700' />
      <p className='mb-3 text-[#77c388] pl-4'>YAY</p>
      <div className='flex justify-between px-4'>
        <div className='flex flex-col gap-1'>
          <p className='text-sm'>{data?.data['18-24']?.agree || 0}</p>
          <p className='text-xs text-muted-foreground'>18-24</p>
        </div>
        <div className='flex flex-col gap-1'>
          <p className='text-sm'>{data?.data['25-34']?.agree || 0}</p>
          <p className='text-xs text-muted-foreground'>25-34</p>
        </div>
        <div className='flex flex-col gap-1'>
          <p className='text-sm'>{data?.data['35-44']?.agree || 0}</p>
          <p className='text-xs text-muted-foreground'>35-44</p>
        </div>
        <div className='flex flex-col gap-1'>
          <p className='text-sm'>{data?.data['45-54']?.agree || 0}</p>
          <p className='text-xs text-muted-foreground'>45-54</p>
        </div>
        <div className='flex flex-col gap-1'>
          <p className='text-sm'>{data?.data['55-64']?.agree || 0}</p>
          <p className='text-xs text-muted-foreground'>55-64</p>
        </div>
        <div className='flex flex-col gap-1'>
          <p className='text-sm'>{data?.data['65+']?.agree || 0}</p>
          <p className='text-xs text-muted-foreground'>65+</p>
        </div>
      </div>
      <p className='my-3 text-[#ff5756] pl-4'>NAY</p>
      <div className='flex justify-between px-4'>
        <div className='flex flex-col gap-1'>
          <p className='text-sm'>{data?.data['18-24']?.disagree || 0}</p>
          <p className='text-xs text-muted-foreground'>18-24</p>
        </div>
        <div className='flex flex-col gap-1'>
          <p className='text-sm'>{data?.data['25-34']?.disagree || 0}</p>
          <p className='text-xs text-muted-foreground'>25-34</p>
        </div>
        <div className='flex flex-col gap-1'>
          <p className='text-sm'>{data?.data['35-44']?.disagree || 0}</p>
          <p className='text-xs text-muted-foreground'>35-44</p>
        </div>
        <div className='flex flex-col gap-1'>
          <p className='text-sm'>{data?.data['45-54']?.disagree || 0}</p>
          <p className='text-xs text-muted-foreground'>45-54</p>
        </div>
        <div className='flex flex-col gap-1'>
          <p className='text-sm'>{data?.data['55-64']?.disagree || 0}</p>
          <p className='text-xs text-muted-foreground'>55-64</p>
        </div>
        <div className='flex flex-col gap-1'>
          <p className='text-sm'>{data?.data['65+']?.disagree || 0}</p>
          <p className='text-xs text-muted-foreground'>65+</p>
        </div>
      </div>
      <h3 className='py-3 px-4 font-semibold text-lg'>Percentage</h3>
      <div className='px-4 flex flex-col gap-6'>
        <Progress
          isZero={agreePercentages[0] === 0 && disagreePercentages[0] === 0}
          value={agreePercentages[0]}
          renderBottomContent={() => (
            <div className='flex justify-between text-xs mt-2'>
              <p className='text-muted-foreground'>
                18-24{' '}
                <span className='text-[#77c388]'>
                  YAY {agreePercentages[0]}%
                </span>
              </p>
              <p className='text-muted-foreground'>
                18-24{' '}
                <span className='text-[#ff5756]'>
                  NAY {disagreePercentages[0]}%
                </span>
              </p>
            </div>
          )}
        />
        <Progress
          isZero={agreePercentages[1] === 0 && disagreePercentages[1] === 0}
          value={agreePercentages[1]}
          renderBottomContent={() => (
            <div className='flex justify-between text-xs mt-2'>
              <p className='text-muted-foreground'>
                25-34{' '}
                <span className='text-[#77c388]'>
                  YAY {agreePercentages[1]}%
                </span>
              </p>
              <p className='text-muted-foreground'>
                25-34{' '}
                <span className='text-[#ff5756]'>
                  NAY {disagreePercentages[1]}%
                </span>
              </p>
            </div>
          )}
        />
        <Progress
          isZero={agreePercentages[2] === 0 && disagreePercentages[2] === 0}
          value={agreePercentages[2]}
          renderBottomContent={() => (
            <div className='flex justify-between text-xs mt-2'>
              <p className='text-muted-foreground'>
                35-44{' '}
                <span className='text-[#77c388]'>
                  YAY {agreePercentages[2]}%
                </span>
              </p>
              <p className='text-muted-foreground'>
                35-44{' '}
                <span className='text-[#ff5756]'>
                  NAY {disagreePercentages[2]}%
                </span>
              </p>
            </div>
          )}
        />
        <Progress
          isZero={agreePercentages[3] === 0 && disagreePercentages[3] === 0}
          value={agreePercentages[3]}
          renderBottomContent={() => (
            <div className='flex justify-between text-xs mt-2'>
              <p className='text-muted-foreground'>
                45-54{' '}
                <span className='text-[#77c388]'>
                  YAY {agreePercentages[3]}%
                </span>
              </p>
              <p className='text-muted-foreground'>
                45-54{' '}
                <span className='text-[#ff5756]'>
                  NAY {disagreePercentages[3]}%
                </span>
              </p>
            </div>
          )}
        />
        <Progress
          isZero={agreePercentages[4] === 0 && disagreePercentages[4] === 0}
          value={agreePercentages[4]}
          renderBottomContent={() => (
            <div className='flex justify-between text-xs mt-2'>
              <p className='text-muted-foreground'>
                55-64{' '}
                <span className='text-[#77c388]'>
                  YAY {agreePercentages[4]}%
                </span>
              </p>
              <p className='text-muted-foreground'>
                55-64{' '}
                <span className='text-[#ff5756]'>
                  NAY {disagreePercentages[4]}%
                </span>
              </p>
            </div>
          )}
        />
        <Progress
          isZero={agreePercentages[5] === 0 && disagreePercentages[5] === 0}
          value={agreePercentages[5]}
          renderBottomContent={() => (
            <div className='flex justify-between text-xs mt-2'>
              <p className='text-muted-foreground'>
                65+{' '}
                <span className='text-[#77c388]'>
                  YAY {agreePercentages[5]}%
                </span>
              </p>
              <p className='text-muted-foreground'>
                65+{' '}
                <span className='text-[#ff5756]'>
                  NAY {disagreePercentages[5]}%
                </span>
              </p>
            </div>
          )}
        />
      </div>
    </div>
  );
};

export default Age;
