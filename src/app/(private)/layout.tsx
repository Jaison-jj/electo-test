'use client';

import { useQuery } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import { useParams, usePathname } from 'next/navigation';
import { useRouter as useNpRouter } from 'next-nprogress-bar';
import { useEffect, useState } from 'react';

import { firebaseAnalytics } from '@/lib/helper';

import { getProfile } from '@/apis/user';

const HeaderMobile = dynamic(() => import('@/components/bills/HeaderMobile'));
const Sidebar = dynamic(() => import('@/components/bills/Sidebar'), {
  loading: () => <div className='md:w-[239px]'></div>,
});
const ThreeColHeader = dynamic(
  () => import('@/components/bills/ThreeColHeader'),
);
const TwoColHeader = dynamic(() => import('@/components/bills/TwoColHeader'));
const FooterNavMobile = dynamic(
  () => import('@/components/others/mobile/FooterNavMobile'),
);

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathName = usePathname();
  const params = useParams();
  const router = useNpRouter();

  const [hydrated, setHydrated] = useState(false);

  useQuery({
    queryKey: ['get-profile-from-layout'],
    queryFn: async () => {
      const { user }: any = await getProfile().then((res) => {
        //backend dependency to fix redirection
        if (!res.user.maritalStatus) {
          return router.push('about-you');
        }

        if (!res.user.interests.length) {
          router.push('interests');
        }
      });
      return user;
    },
  });

  const renderHeader = () => {
    if (pathName.includes('/bills') && params?.id) {
      return <TwoColHeader />;
    }

    if (pathName.includes('/bills')) {
      return <ThreeColHeader />;
    }

    return <TwoColHeader />;
  };

  const renderMobileFooter = () => {
    if (pathName.includes('/bills') && params?.id) {
      return <FooterNavMobile billId={params?.id} />;
    }
  };

  useEffect(() => {
    setHydrated(true);
    firebaseAnalytics('session_start', { timestamp: Date.now() });
  }, []);

  if (!hydrated) return null;

  return (
    <div className='flex font-poppins '>
      {/* mt-12 */}
      <main className='w-full md:mt-0 md:h-[calc(100vh_-_80px)]'>
        <HeaderMobile />
        <div className='mt-[40px] md:mt-0 fixed bg-white left-0 right-0 z-10'>
          {renderHeader()}
        </div>
        <div className='flex md:h-full items-start justify-center mx-auto md:max-w-[1125px] md:mt-[80px]'>
          <Sidebar />
          <div className='max-h-screen overflow-auto mt-[80px] md:mt-0 flex  md:h-full md:w-[620px]  lg:w-[886px] w-full border-l border-gray-200 '>
            {children}
          </div>
        </div>
        <div className='md:hidden fixed w-full bottom-0'>
          {renderMobileFooter()}
        </div>
      </main>
    </div>
  );
}
