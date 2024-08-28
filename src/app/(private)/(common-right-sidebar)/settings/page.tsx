'use client';

import { ChevronRight } from 'lucide-react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';

import { firebaseAnalytics } from '@/lib/helper';

import { userAtom } from '@/store/user.atom';

const ForgotPasswordModal = dynamic(
  () => import('@/components/utils/ForgotPasswordModal'),
);

const navLinks = [
  { name: 'Account', link: '/profile' },
  { name: 'Privacy Policy', link: '/privacyPolicy' },
  { name: 'Password and Security', link: '#' },
  { name: 'Payments', link: '/payment' },
  { name: 'About', link: '/about' },
];

const Settings = () => {
  const [, setUserState] = useRecoilState(userAtom);
  const [isOpen, setIsOpen] = useState(false);

  const onClickChangePassword = (link: string) => {
    if (link === '#') setIsOpen(true);
  };

  useEffect(() => {
    setUserState((prev) => ({ ...prev, currentPageName: 'Settings' }));
  }, [setUserState]);

  useEffect(() => {
    firebaseAnalytics('page_view');
  }, []);

  return (
    <div className='w-full flex flex-col mt-[40px] md:mt-0'>
      <title>Settings</title>
      {/* <div className='md:w-[549px] bg-red-300'></div>
      <div className='hidden md:block md:w-[352px] bg-blue-300'>
      </div> */}
      {navLinks.map((nav) => (
        <Link
          href={nav.link}
          key={nav.name}
          className='flex px-2 justify-between items-center w-full h-[60px] hover:bg-gray-200'
          onClick={() => onClickChangePassword(nav.link)}
        >
          <p className='text-sm'>{nav.name}</p>
          <ChevronRight className='h-6 w-6' />
        </Link>
      ))}
      <ForgotPasswordModal isOpen={isOpen} setIsOpen={setIsOpen} />
    </div>
  );
};

export default Settings;
