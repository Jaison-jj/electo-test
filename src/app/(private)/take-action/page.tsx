'use client';

import React, { useEffect } from 'react';
import { useRecoilState } from 'recoil';

import { firebaseAnalytics } from '@/lib/helper';

import TakeAction from '@/components/bills/TakeActon';

import { userAtom } from '@/store/user.atom';

const TakeActionPage = () => {
  const [, setUserState] = useRecoilState(userAtom);

  React.useEffect(() => {
    setUserState((prev) => ({ ...prev, currentPageName: 'Take Action' }));
  }, [setUserState]);

  useEffect(() => {
    firebaseAnalytics('page_view');
  }, []);

  // if (isFetching) return <Loading />;

  return (
    <div>
      <title>Take Action</title>
      <TakeAction />
    </div>
  );
};

export default TakeActionPage;
