'use client';

import { useQuery } from '@tanstack/react-query';
import React from 'react';

import Loading from '@/components/utils/Loading';

import { representativesFundingResources } from '@/apis/bills';

const FundingResources = (props: any) => {
  const { representativeId } = props;

  const { data, isLoading } = useQuery({
    queryKey: ['funding-resources'],
    queryFn: () => representativesFundingResources({ representativeId }),
  });

  const USDollar = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className='px-4'>
      <p className='text-sm border-b border-gray-200 pb-3'>
        Leadership PAC: American Revival PAC
      </p>
      <div className='mt-3 flex flex-col gap-3 border-b border-gray-200 pb-3'>
        <div className='flex justify-between'>
          <p className='text-sm text-[#77C388]'>Raised</p>
          <p className='text-sm text-[#77C388]'>
            {USDollar.format(data?.data?.raised)}
          </p>
        </div>
        <div className='flex justify-between'>
          <p className='text-sm text-[#EE7C7C]'>Spent</p>
          <p className='text-sm text-[#EE7C7C]'>
            {USDollar.format(data?.data?.spent)}
          </p>
        </div>
        <div className='flex justify-between'>
          <p className='text-sm text-[#518EF8]'>Cash on hand</p>
          <p className='text-sm text-[#518EF8]'>
            {USDollar.format(data?.data?.cashOnHand)}
          </p>
        </div>
        <div className='flex justify-between'>
          <p className='text-sm'>Debts</p>
          <p className='text-sm'>{USDollar.format(data?.data?.debts)}</p>
        </div>
      </div>
      <p className='my-4 text-sm'>Top Contributors : 2023 - 2024</p>
      <div className='flex flex-col gap-3 border-b border-gray-200 py-3'>
        {data?.data?.topContributors.map((c: any) => (
          <Contributor
            key={c.name}
            title={c.name}
            total={USDollar.format(c.total)}
            individuals={USDollar.format(c.indivs)}
            pacs={USDollar.format(c.pacs)}
          />
        ))}
      </div>
      <p className='my-4 text-sm'>Top Industries : 2023 - 2024</p>
      <div className='flex flex-col gap-3 border-b border-gray-200 py-3'>
        {data?.data?.topIndustries.map((c: any) => (
          <Contributor
            key={c.name}
            title={c.name}
            total={USDollar.format(c.total)}
            individuals={USDollar.format(c.indivs)}
            pacs={USDollar.format(c.pacs)}
          />
        ))}
      </div>
    </div>
  );
};

export default FundingResources;

interface ContributorProps {
  title: string;
  total: string;
  individuals: string;
  pacs: string;
}

const Contributor = (props: ContributorProps) => {
  const { title, total, individuals, pacs } = props;
  return (
    <div>
      <p className='font-semibold text-muted-foreground mb-2'>{title}</p>
      <div className='flex flex-col gap-3 text-muted-foreground'>
        <div className='flex justify-between'>
          <p className='text-sm'>Total</p>
          <p className='text-sm'>{total}</p>
        </div>
        <div className='flex justify-between'>
          <p className='text-sm'>Individual</p>
          <p className='text-sm'>{individuals}</p>
        </div>
        <div className='flex justify-between'>
          <p className='text-sm'>PACs</p>
          <p className='text-sm'>{pacs}</p>
        </div>
      </div>
    </div>
  );
};
