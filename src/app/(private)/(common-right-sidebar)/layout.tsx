'use client';

import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';

import RightSidebarCommon from '@/components/others/RightSidebarCommon';

interface CommonRightSidebarProps {
  children: React.ReactNode;
}

export default function Layout(props: CommonRightSidebarProps) {
  const { children } = props;

  const pathName = usePathname();

  const renderRightSidebar = () => {
    return (
      <div className='flex flex-col gap-3 pl-[16px] pt-[16px]'>
        <RightSidebarCommon />
      </div>
    );
  };

  return (
    <div className='flex justify-between w-full'>
      <div
        className={cn(
          'md:w-[385px] overflow-auto w-full lg:w-[550px] md:border-r border-gray-200',
          {
            'border-none md:w-full  lg:w-full': pathName.includes('/map'),
          },
        )}
      >
        {children}
      </div>
      <div
        className={cn(
          'hidden md:flex justify-left  md:w-[235px] lg:w-[336px]',
          {
            hidden: pathName.includes('/map'),
          },
        )}
      >
        {renderRightSidebar()}
      </div>
    </div>
  );
}
