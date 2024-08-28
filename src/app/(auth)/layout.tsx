import * as React from 'react';

import NextImage from '@/components/NextImage';

import BalletBoxLogo from '@/../public/images/auth/authPageLogo.png';

export const metadata = {
  metadataBase: new URL('https://server.electoai.com'),
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/en-US',
    },
  },
  openGraph: {
    images: '/og-image.png',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className='flex w-full  md:min-h-screen '>
      <div className='hidden md:flex justify-center items-center  text-white md:w-1/2 auth-left-background'>
        <NextImage
          alt='logo'
          src={BalletBoxLogo}
          width={137}
          height={132}
          priority={true}
          useSkeleton
        />
      </div>
      <div className='w-full md:w-1/2 font-poppins max-h-screen overflow-auto'>
        {children}
      </div>
    </div>
  );
}
