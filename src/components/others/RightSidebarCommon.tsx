import { LayoutList, NotepadText, SquareUserRound } from 'lucide-react';
import React from 'react';

import RightSidebarListWidget from '@/components/others/RightSidebarListWidget';
import RightSidebarRouteWidget from '@/components/others/RightSidebarRouteWidget';

const RightSidebarCommon = () => {
  return (
    <>
      <RightSidebarRouteWidget
        icon={<NotepadText />}
        label='My Voting Records'
        href='/voting-records'
      />
      <RightSidebarRouteWidget
        icon={<LayoutList />}
        label='General Polling'
        href='/general-polling'
      />
      <RightSidebarRouteWidget
        icon={<SquareUserRound />}
        label='Directory'
        href='/common-directory'
      />
      <div className='h-[calc(100vh_-_281px)] overflow-auto no-scrollbar flex flex-col gap-3 pb-4'>
        <RightSidebarListWidget
          title='Trending Bills'
          href='trends?category=trendingBills'
          category='trending'
        />
        <RightSidebarListWidget
          title='Popular topics'
          href='trends?category=popularTopics'
          category='popular'
        />
        <RightSidebarListWidget
          title='Common grounds'
          href='trends?category=commonGrounds'
          category='common'
        />
        <RightSidebarListWidget
          title='Disputed Areas'
          href='trends?category=disputedAreas'
          category='disputed'
        />
        <RightSidebarListWidget
          title='Officials and Voters'
          href='trends?category=officialsAndVoters'
          category='officals-vs-voters'
        />
      </div>
    </>
  );
};

export default RightSidebarCommon;
