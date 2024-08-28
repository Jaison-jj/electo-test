import { BarChart2, Map, MessageSquareMore, Search } from 'lucide-react';
// import MobileDrawer from '@/components/utils/MobileDrawer';
import Link from 'next/link';
import React from 'react';

import BillCommentsMobile from '@/components/others/mobile/BillComments.mob';
import DataHubMobile from '@/components/others/mobile/DataHub.mob';
import FullPageModal from '@/components/utils/FullPageModal';

interface FooterNavMobileProps {
  billId: any;
}
//test

const FooterNavMobile = (props: FooterNavMobileProps) => {
  const { billId } = props;

  return (
    <div className='w-full h-14 bg-white  shadow-inner flex gap-5 items-center justify-around'>
      <FullPageModal renderTrigger={<MessageSquareMore className='h-6 w-6' />}>
        <BillCommentsMobile billId={billId} />
      </FullPageModal>
      <FullPageModal renderTrigger={<Search className='h-6 w-6' />}>
        <h1>this is search</h1>
      </FullPageModal>
      <FullPageModal renderTrigger={<BarChart2 className='h-6 w-6' />}>
        <DataHubMobile />
      </FullPageModal>
      <Link href={`${billId}/map`}>
        <Map className='h-6 w-6' />
      </Link>
    </div>
  );
};

export default FooterNavMobile;
