'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React from 'react';

import { cn } from '@/lib/utils';

const Layout = ({ children }: any) => {
  const pathName = usePathname();
  const params = useSearchParams();
  const locale = params.get('locale');
  const type = params.get('type');

  const router = useRouter();

  const handleClick = (locale: string) => {
    const url = `${pathName}?locale=${locale}&type=${type}`;
    router.replace(url);
  };

  return (
    <div className='mt-[40px] md:mt-0 '>
      {!pathName.includes('candidates') && (
        <div className='px-4 flex items-center justify-around border-b border-gray-200 h-[50px]'>
          <button
            className={cn('relative text-sm text-muted-foreground', {
              accountActiveTab: locale === 'federal',
              'font-semibold text-black': locale === 'federal',
            })}
            onClick={() => handleClick('federal')}
          >
            <span>Federal</span>{' '}
          </button>
          <button
            className={cn('relative text-sm text-muted-foreground', {
              accountActiveTab: locale === 'state',
              'font-semibold text-black': locale === 'state',
            })}
            onClick={() => handleClick('state')}
          >
            <span>State</span>{' '}
          </button>
        </div>
      )}
      {children}
    </div>
  );
};

export default Layout;
