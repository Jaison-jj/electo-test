import { ChevronLeft, ChevronRight } from 'lucide-react';
import React from 'react';

import { cn } from '@/lib/utils';

interface TabSwitcherProps {
  tabs: string[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TabSwitcher = (props: TabSwitcherProps) => {
  const { tabs, activeTab, setActiveTab } = props;
  const containerRef: any = React.useRef();
  const tabRef: any = React.useRef();

  const onClickScroll = (direction: string) => {
    const scrollAmount = direction === 'right' ? 100 : -100;

    containerRef.current.scrollTo({
      left: containerRef.current.scrollLeft + scrollAmount,
      behavior: 'smooth',
    });
  };

  const onClickTab = (tab: string) => {
    setActiveTab(tab);
    // tabRef.current.scrollIntoView({
    //   behavior: 'smooth',
    //   block: 'start',
    //   inline: 'nearest',
    // });
  };

  return (
    <div className='flex justify-between items-center gap-3'>
      <ChevronLeft
        className='w-6 h-5 bg-gray-200 rounded-2xl'
        role='button'
        onClick={() => onClickScroll('left')}
      />
      <div
        ref={containerRef}
        className='flex gap-1 md:gap-4 w-full overflow-auto no-scrollbar'
      >
        {tabs.map((tab) => (
          <button
            key={tab}
            ref={tabRef}
            onClick={() => onClickTab(tab)}
            style={{
              overflowWrap: 'normal',
              wordWrap: 'normal',
              whiteSpace: 'nowrap',
            }}
            className={cn(
              'py-1 px-2 border border-gray-300 text-muted-foreground rounded-2xl text-sm',
              {
                'border-black bg-black text-white': activeTab === tab,
              },
            )}
          >
            {tab}
          </button>
        ))}
      </div>
      <ChevronRight
        className='w-6 h-5 bg-gray-200 rounded-full '
        role='button'
        onClick={() => onClickScroll('right')}
      />
    </div>
  );
};

export default TabSwitcher;
