import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import { useRecoilState } from 'recoil';

import { cn } from '@/lib/utils';

import { userAtom } from '@/store/user.atom';

interface RightSidebarRouteWidgetProps {
  icon: any;
  label: string;
  href: string;
}

const RightSidebarRouteWidget = (props: RightSidebarRouteWidgetProps) => {
  const pathName = usePathname();
  const [, setUserState] = useRecoilState(userAtom);

  React.useEffect(() => {
    setUserState((prev: any) => ({ ...prev, currentPageName: pathName }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { icon, label, href } = props;
  return (
    <Link
      href={href}
      className={cn(
        'flex justify-between items-center border border-gray-300 px-[16px] py-[12px] rounded-full hover:bg-gray-400',
        {
          'bg-[#63667B] text-white': pathName.includes(href),
        },
      )}
    >
      <div className='flex gap-3 items-center'>
        {icon}
        <span className='text-sm font-normal'>{label}</span>
      </div>
      <ChevronRight />
    </Link>
  );
};

export default RightSidebarRouteWidget;
