'use client';

import React, { useEffect } from 'react';

import { firebaseAnalytics } from '@/lib/helper';

import TakeAction from '@/components/bills/TakeActon';

const Page = ({ params, searchParams }: any) => {
  useEffect(() => {
    firebaseAnalytics('page_view');
  }, []);

  return (
    <div>
      <title>Bill-Take Action</title>
      <TakeAction billId={params.id} billType={searchParams.bill_type} />
    </div>
  );
};

export default Page;
