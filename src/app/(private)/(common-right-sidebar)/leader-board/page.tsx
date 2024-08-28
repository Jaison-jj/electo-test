'use client';

import { useQuery } from '@tanstack/react-query';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect } from 'react';
import { useRecoilState } from 'recoil';

import { firebaseAnalytics } from '@/lib/helper';
import { cn } from '@/lib/utils';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Loading from '@/components/utils/Loading';

import { branchAtom } from '@/store/branch.atom';
import { userAtom } from '@/store/user.atom';

import { getLeaderBoardCitizens, getLeaderBoardOfficials } from '@/apis/user';

const LeaderBoard = () => {
  const pathName = usePathname();
  const router = useRouter();
  const params = useSearchParams();
  const tab = params.get('tab');

  const [, setUserState] = useRecoilState(userAtom);
  const [, setBranchState] = useRecoilState(branchAtom);

  const { data, isFetching } = useQuery({
    queryKey: ['get-leader-board', tab],
    queryFn: async () => {
      const response =
        tab === 'officials'
          ? await getLeaderBoardOfficials()
          : await getLeaderBoardCitizens();
      return response?.data ?? response?.leaderBoard;
    },
    refetchOnWindowFocus: false,
  });

  const onChangeTab = (tab: string) => {
    router.replace(`/leader-board?tab=${tab}`);
  };

  React.useEffect(() => {
    setUserState((prev: any) => ({ ...prev, currentPageName: 'Leader Board' }));
    router.replace('/leader-board?tab=officials');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    setBranchState({
      page: 'LeaderBoard',
      entity: null,
      entityId: null,
      alias: '',
      androidUrl: '',
      iosUrl: '',
      campaign: 'leader_board',
      deepLinkPath: '/leaderboard',
      desktopUrl: `${process.env.DESKTOP_URL}/leader-board`,
      description: 'A list of leaders',
      feature: 'leader-board',
    });
  }, [setBranchState]);

  return (
    <div className='mt-10 md:mt-0 flex flex-col gap-4'>
      {!pathName.includes('candidates') && (
        <div className='px-4 flex items-center justify-around border-b border-gray-200 h-[50px]'>
          <button
            className={cn('relative text-sm text-muted-foreground', {
              accountActiveTab: tab === 'officials',
              'font-semibold text-black': tab === 'federal',
            })}
            onClick={() => onChangeTab('officials')}
          >
            <span>Officials</span>{' '}
          </button>
          <button
            className={cn('relative text-sm text-muted-foreground', {
              accountActiveTab: tab === 'Citizens',
              'font-semibold text-black': tab === 'state',
            })}
            onClick={() => onChangeTab('Citizens')}
          >
            <span>Citizens</span>{' '}
          </button>
        </div>
      )}

      {isFetching && <Loading />}

      {!isFetching &&
        data?.map((leader: any) => (
          <Leader
            key={leader?.id}
            firstName={leader?.firstName}
            lastName={leader?.lastName}
            image={leader?.image}
            rank={leader?.rank}
            score={leader?.score}
          />
        ))}
    </div>
  );
};

export default LeaderBoard;

interface LeaderProps {
  firstName: string;
  lastName: string;
  image: string;
  rank: number;
  score: number;
}

const Leader = (props: LeaderProps) => {
  const { firstName, lastName, image, rank, score } = props;
  const fallbackText = `${firstName.at(0)}${lastName.at(0)}`;

  useEffect(() => {
    firebaseAnalytics('page_view');
  }, []);

  return (
    <div className='flex items-center justify-between px-2 md:px-4'>
      <title>Leader Board</title>
      <div className='flex gap-4 items-center'>
        <p className='font-semibold text-sm'>{rank}</p>
        <div className='flex gap-2 items-center'>
          <Avatar className=' w-10 h-10'>
            <AvatarImage
              src={`${process.env.BASE_URL}/${image}`}
              alt='sponsor'
            />
            <AvatarFallback>
              <span className='text-muted-foreground uppercase text-sm'>
                {fallbackText}
              </span>
            </AvatarFallback>
          </Avatar>
          <p className='text-sm text-muted-foreground'>
            {firstName} {lastName}
          </p>
        </div>
      </div>
      <p className='text-sm text-muted-foreground'>{score}</p>
    </div>
  );
};
