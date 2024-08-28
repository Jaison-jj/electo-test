'use client';

import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import React, { useEffect } from 'react';
import { useRecoilState } from 'recoil';

import { firebaseAnalytics } from '@/lib/helper';

import { ContactCard } from '@/components/bills/TakeActon';
import Loading from '@/components/utils/Loading';

import { userAtom } from '@/store/user.atom';

import { getMyOfficials } from '@/apis/bills';

const MyOfficials = () => {
  const [, setUserState] = useRecoilState(userAtom);
  const params = useSearchParams();

  const locale: any = params.get('locale');

  const { data: myOfficials, isFetching } = useQuery({
    queryKey: ['get-my-officials-take-action'],
    queryFn: () => getMyOfficials(),
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    setUserState((prev: any) => ({ ...prev, currentPageName: 'My Officials' }));
  }, [setUserState]);

  useEffect(() => {
    firebaseAnalytics('page_view');
  }, []);

  if (isFetching) return <Loading />;

  if (!myOfficials) return null;

  return (
    <div>
      <title>My Officials</title>

      <div className='flex flex-col gap-3 px-4 md:h-[calc(100vh_-_130px)] overflow-auto'>
        <p className='text-sm text-muted-foreground font-semibold pl-4 py-2  border-b border-gray-300'>
          House of Representatives
        </p>
        {!myOfficials?.data[locale]?.house?.length && (
          <p className='ml-4 text-xs md:text-sm text-muted-foreground'>
            No data to display!
          </p>
        )}
        {myOfficials?.data[locale]?.house?.map((official: any) => (
          <ContactCard
            key={official.id}
            id={official.id}
            avatarUrl=''
            fallBackText={official.firstName[0] + official.lastName[0]}
            name={official.firstName + ' ' + official.lastName}
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
        {!myOfficials?.data[locale]?.senate?.length && (
          <p className='ml-4 text-xs md:text-sm text-muted-foreground'>
            No data to display!
          </p>
        )}

        {myOfficials?.data[locale]?.senate?.map((official: any) => (
          <ContactCard
            key={official.id}
            id={official.id}
            avatarUrl=''
            fallBackText={official.firstName[0] + official.lastName[0]}
            name={official.firstName + ' ' + official.lastName}
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

export default MyOfficials;
