'use client';

import { useMutation } from '@tanstack/react-query';
import { Search } from 'lucide-react';
import Link from 'next/link';
import React, { useCallback, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { useRecoilState } from 'recoil';
import { toast } from 'sonner';

import { debounce, firebaseAnalytics } from '@/lib/helper';

import Skeleton from '@/components/Skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CategoryAndChamberSelector } from '@/components/utils/CategoryAndChamberSelector';
import NoDataToDisplay from '@/components/utils/NoDataToDisplay';

import { userAtom } from '@/store/user.atom';

import FilterIcon from '@/../public/svg/filter.svg';
import { getAllOfficials } from '@/apis/bills';

// lower- house
// upper- senate

const CommonDirectory = () => {
  const { ref, inView } = useInView();

  const [, setUserState] = useRecoilState(userAtom);

  const [initialFetchDone, setInitialFetchDone] = React.useState(false);

  const [open, onOpenChange] = React.useState(false);
  const [allOfficials, setAllOfficials] = React.useState<any>([]);
  const [apiPayload, setApiPayload] = React.useState({
    pageNumber: 1,
    searchKey: null,
    category: 'federal', //'federal',
    chamber: 'lower', //'upper'
  });

  const {
    mutate,
    isPending,
    data: officials,
  } = useMutation({
    mutationFn: async (payload: any) => getAllOfficials(payload),
    onSuccess: (res: any) => {
      setAllOfficials((prev: any) => [...prev, ...res.representatives]);
      setApiPayload((prev) => ({
        ...prev,
        pageNumber: prev.pageNumber + 1,
      }));
    },
    onError(err: any) {
      toast(err.response.data.message, {
        description: '',
        duration: 3000,
        action: {
          label: 'Close',
          onClick: () => null,
        },
      });
    },
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedMutate = useCallback(
    debounce((keyword: string) => {
      setAllOfficials([]);
      setApiPayload((prev: any) => ({
        ...prev,
        searchKey: keyword,
        pageNumber: 1,
      }));
      mutate({
        ...apiPayload,
        searchKey: keyword,
        pageNumber: 1,
        category: apiPayload.category, // Ensure category is retained
        chamber: apiPayload.chamber, // Ensure chamber is retained
      });
    }, 500),
    [apiPayload.category, apiPayload.chamber],
  );

  const handleSearchOfficial = (value: any) => {
    setApiPayload((prev: any) => ({ ...prev, searchKey: value }));
    debouncedMutate(value);
  };

  const onFilter = (option: string, key: string) => {
    setApiPayload((prev) => ({ ...prev, [key]: option }));
  };

  useEffect(() => {
    if (!initialFetchDone) {
      mutate(apiPayload);
      setInitialFetchDone(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialFetchDone]);

  useEffect(() => {
    if (inView && officials?.representatives?.length > 0) {
      mutate({ ...apiPayload });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  useEffect(() => {
    if (initialFetchDone) {
      setAllOfficials([]);

      setApiPayload((prev) => ({
        ...prev,
        pageNumber: 1,
      }));
      mutate({
        ...apiPayload,
        pageNumber: 1,
        searchKey: null,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiPayload.category, apiPayload.chamber]);

  const representatives = allOfficials.map((official: any, index: number) => {
    const isLastItem = index === allOfficials.length - 1;
    const _ref = isLastItem ? ref : null;

    return (
      <div key={index} ref={_ref}>
        <DirectoryContactCard
          key={official.id}
          id={official.id}
          avatarUrl={official.image}
          fallBackText={official.firstName[0] + official.lastName[0]}
          name={official.firstName + ' ' + official.lastName}
          role='Senator'
          politicalView={official.party}
          place={official.state}
          official={official}
          setUserState={setUserState}
          electoScore={official.score}
        />
      </div>
    );
  });

  React.useEffect(() => {
    setUserState((prev) => ({
      ...prev,
      currentPageName: 'Representative Directory',
    }));
  }, [setUserState, inView]);

  useEffect(() => {
    firebaseAnalytics('page_view');
  }, []);

  return (
    <>
      <div className='flex justify-between gap-2 py-4 items-center px-4 relative bg-white mt-[48px] md:mt-0 border-b border-b-gray-200 '>
        <title>Representative Directory</title>

        <Search className='w-5 h-5 absolute top-[23px] right-[64px]' />
        <input
          type='text'
          className='border border-gray-200 w-full rounded-2xl text-xs py-2 px-4 bg-gray-100'
          placeholder='Search : by name, state, party, etc.'
          value={apiPayload.searchKey || ''}
          onChange={(e) => handleSearchOfficial(e.target.value)}
        />
        <CategoryAndChamberSelector
          open={open}
          onOpenChange={onOpenChange}
          onSelect={onFilter}
          selectable={apiPayload}
          trigger={
            <FilterIcon
              className='h-8 w-8 rounded-full bg-gray-100  p-2'
              role='button'
            />
          }
        />
      </div>

      <div className='max-h-[calc(100vh_-_190px)] md:max-h-[calc(100vh_-_149px)] overflow-auto px-4'>
        {representatives}
        {!isPending && !allOfficials.length && (
          <div className='h-[calc(100vh_-_380px)]'>
            <NoDataToDisplay text='No data to match the filter options, please modify your search or filter' />
          </div>
        )}

        {isPending && (
          <div className='flex flex-col'>
            <OfficialSkeleton />
            <OfficialSkeleton />
            <OfficialSkeleton />
          </div>
        )}
      </div>
    </>
  );
};

export default CommonDirectory;

const OfficialSkeleton = () => {
  return (
    <div className='flex items-start space-x-4 p-2 md:p-4 '>
      <Skeleton className='h-12 w-12 rounded-full' />
      <div className='space-y-2 w-full'>
        <Skeleton className='h-4 w-full' />
        <Skeleton className='h-4 w-[200px]' />
      </div>
    </div>
  );
};

const DirectoryContactCard = (props: any) => {
  const {
    avatarUrl,
    fallBackText,
    politicalView,
    role,
    place,
    name,
    official,
    setUserState,
    id,
    electoScore = 0,
  } = props;

  const onClickContactCard = () => {
    setUserState((prev: any) => ({ ...prev, selectedOfficial: official }));
  };

  return (
    <Link
      href={`/account?name=${name}&id=${id}`}
      className='flex justify-between items-center bg-white hover:bg-gray-200 rounded-xl'
    >
      <div className='flex justify-between items-center w-full'>
        <div className='flex gap-2  w-full p-2 ' onClick={onClickContactCard}>
          <Avatar>
            <AvatarImage src={avatarUrl} />
            <AvatarFallback className='text-muted-foreground'>
              {fallBackText}
            </AvatarFallback>
          </Avatar>
          <div className='flex flex-col items-start justify-between gap-0'>
            <p className='text-xs md:text-sm font-medium truncate'>{name}</p>
            <p className='text-xs text-muted-foreground'>
              {role} | {politicalView} | {place}
            </p>
          </div>
        </div>
        <p className='text-[10px] md:text-xs text-white bg-[#63667B] w-[150px] md:w-[180px] p-1 md:p-2 rounded md:mr-2'>
          Electo Score {electoScore ?? 0}/100
        </p>
      </div>
    </Link>
  );
};
