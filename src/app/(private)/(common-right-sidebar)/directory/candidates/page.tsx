'use client';

import { useQuery } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import { useRecoilState } from 'recoil';

import { firebaseAnalytics } from '@/lib/helper';

import { ContactCard } from '@/components/bills/TakeActon';
import Loading from '@/components/utils/Loading';

import { userAtom } from '@/store/user.atom';

import { getCandidates } from '@/apis/bills';

const Candidates = () => {
  const [, setUserState] = useRecoilState(userAtom);

  const { data: candidates, isFetching }: any = useQuery({
    queryKey: ['get-candidates'],
    queryFn: () => getCandidates(),
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    setUserState((prev: any) => ({ ...prev, currentPageName: 'Candidates' }));
  }, [setUserState]);

  useEffect(() => {
    firebaseAnalytics('page_view');
  }, []);

  if (isFetching) return <Loading />;

  if (!candidates.data)
    return (
      <div className='p-2 md:p-4 text-xs md:text-sm text-muted-foreground text-center'>
        There are no candidates to display as the state you are in now do not
        have any elections going on!
      </div>
    );

  return (
    <div>
      <title>Candidates</title>
      <div className='flex flex-col gap-3 px-4 md:h-[calc(100vh_-_80px)] overflow-auto'>
        <p className='text-sm text-muted-foreground font-semibold pl-4 py-2  border-b border-gray-300'>
          House of Representatives
        </p>
        {candidates?.data?.federal?.house?.map((official: any) => (
          <ContactCard
            key={official.id}
            id={official.id}
            avatarUrl=''
            fallBackText={
              official.name.split(' ')[0][0] + official.name.split(' ')[1][0]
            }
            name={official.name}
            role='Senator'
            politicalView={official.party}
            place={official.state}
            // activeParentTab={activeParentTab}
            setUserState={setUserState}
            official={official}
          />
        ))}
        <p className='text-sm text-muted-foreground font-semibold pl-4 py-2  border-b border-gray-300'>
          Senate
        </p>
        {candidates?.data?.state?.senate?.map((official: any) => (
          <ContactCard
            key={official.id}
            id={official.id}
            avatarUrl=''
            fallBackText={
              official.name.split(' ')[0][0] + official.name.split(' ')[1][0]
            }
            name={official.name}
            role='Senator'
            politicalView={official.party}
            place={official.state}
            // activeParentTab={activeParentTab}
            setUserState={setUserState}
            official={official}
          />
        ))}
      </div>
    </div>
  );
};

export default Candidates;
