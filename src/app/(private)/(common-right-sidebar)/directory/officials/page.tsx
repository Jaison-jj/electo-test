'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import Fuse from 'fuse.js';
import { Search } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { useRecoilState } from 'recoil';
import { toast } from 'sonner';

import { debounce, firebaseAnalytics } from '@/lib/helper';

import { ContactCard } from '@/components/bills/TakeActon';
import Skeleton from '@/components/Skeleton';
import { DropdownWithFilter } from '@/components/utils/DropdownWithFilter';
import NoDataToDisplay from '@/components/utils/NoDataToDisplay';

import { userAtom } from '@/store/user.atom';

import FilterIcon from '@/../public/svg/filter.svg';
import { getAllOfficials, getStates } from '@/apis/bills';

const options = {
  keys: ['name', 'code'],
  threshold: 0.3,
};

const Officials = () => {
  const { get } = useSearchParams();
  const locale = get('locale');
  const type = get('type');
  const modifiedChamber = type === 'house' ? 'lower' : 'upper';

  const { ref, inView } = useInView();

  const [, setUserState] = useRecoilState(userAtom);

  const [initialFetchDone, setInitialFetchDone] = React.useState(false);
  const [searchState, setSearchState] = React.useState('');
  const [open, onOpenChange] = React.useState(false);
  const [selectedStates, setSelectedStates] = React.useState<string[]>([]);
  const [allOfficials, setAllOfficials] = React.useState<any>([]);
  const [apiPayload, setApiPayload] = React.useState({
    pageNumber: 1,
    states: selectedStates,
    searchKey: null,
    category: locale,
    chamber: modifiedChamber,
  });

  const { data: states } = useQuery({
    queryKey: ['get-states'],
    queryFn: () => getStates(),
    refetchOnWindowFocus: false,
  });

  const fuse = React.useMemo(() => new Fuse(states as any, options), [states]);

  const filteredStates = searchState
    ? fuse.search(searchState).map((result: any) => result.item)
    : states;

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

  const onApplyFilter = () => {
    setAllOfficials([]);
    setApiPayload((prev) => ({
      ...prev,
      pageNumber: 1,
    }));
    mutate({ ...apiPayload, pageNumber: 1, states: selectedStates });
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedMutate = React.useCallback(
    debounce((keyword: string) => {
      setAllOfficials([]);
      setApiPayload((prev: any) => ({ ...prev, pageNumber: 1 }));
      mutate({ ...apiPayload, searchKey: keyword, pageNumber: 1 });
    }, 500),
    [selectedStates, locale, modifiedChamber],
  );

  const handleSearchOfficial = (value: any) => {
    setApiPayload((prev: any) => ({ ...prev, searchKey: value }));
    debouncedMutate(value);
  };

  const handleSearchState = React.useCallback((value: any) => {
    setSearchState(value);
  }, []);

  const onSelectDropdownItem = (e: any, state: string) => {
    e.preventDefault();
    onOpenChange(true);
    if (selectedStates.includes(state)) {
      setSelectedStates(selectedStates.filter((s) => s !== state));
    } else {
      setSelectedStates([...selectedStates, state]);
    }
  };

  useEffect(() => {
    if (!initialFetchDone) {
      mutate(apiPayload);
      setInitialFetchDone(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialFetchDone]);

  useEffect(() => {
    if (inView && officials?.data?.length > 0) {
      mutate({ ...apiPayload, states: selectedStates });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  useEffect(() => {
    if (initialFetchDone) {
      setAllOfficials([]);
      setSelectedStates([]);
      setApiPayload((prev) => ({
        ...prev,
        pageNumber: 1,
        searchKey: null,
        category: locale,
        chamber: modifiedChamber,
      }));
      mutate({
        ...apiPayload,
        pageNumber: 1,
        searchKey: '',
        states: [],
        category: locale,
        chamber: modifiedChamber,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale, modifiedChamber]);

  useEffect(() => {
    setUserState((prev: any) => ({ ...prev, currentPageName: 'Officials' }));
  }, [setUserState]);

  const newBills = allOfficials.map((official: any, index: number) => {
    const isLastItem = index === allOfficials.length - 1;
    const _ref = isLastItem ? ref : null;

    return (
      <div key={index} ref={_ref}>
        <ContactCard
          key={official.id}
          id={official.id}
          avatarUrl=''
          fallBackText={official.firstName[0] + official.lastName[0]}
          name={official.firstName + ' ' + official.lastName}
          role='Senator'
          politicalView={official.party}
          place={official.state}
          official={official}
          setUserState={setUserState}
        />
      </div>
    );
  });

  useEffect(() => {
    firebaseAnalytics('page_view');
  }, []);

  return (
    <div>
      <title>Officials</title>

      <div className='flex justify-between gap-2 py-4 items-center px-4 relative'>
        <Search className='w-5 h-5 absolute top-[23px] right-[64px]' />
        <input
          type='text'
          className='border border-gray-200 w-full rounded-2xl text-xs py-2 px-4 bg-gray-100'
          placeholder='Search...'
          value={apiPayload.searchKey || ''}
          onChange={(e) => handleSearchOfficial(e.target.value)}
        />
        <DropdownWithFilter
          open={open}
          onOpenChange={onOpenChange}
          onSelectDropdownItem={onSelectDropdownItem}
          options={filteredStates}
          selectedOptions={selectedStates}
          onSubmit={onApplyFilter}
          trigger={
            <FilterIcon
              className='h-8 w-8 rounded-full bg-gray-100  p-2'
              role='button'
            />
          }
          renderSearch={
            <input
              type='text'
              className='border border-gray-200 w-full rounded-lg text-xs py-2 px-4 bg-gray-100'
              placeholder='Search states'
              value={searchState}
              onChange={(e) => handleSearchState(e.target.value)}
            />
          }
        />
      </div>
      <div className='max-h-[calc(100vh_-_196px)] overflow-auto px-4'>
        <p className='py-2 text-sm'>
          {type === 'senate' ? 'Senate' : 'House of Representatives'}
        </p>
        {newBills}

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
    </div>
  );
};

export default Officials;

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
