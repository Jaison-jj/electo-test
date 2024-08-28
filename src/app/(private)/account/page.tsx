'use client';

import { useQuery } from '@tanstack/react-query';
import { Globe, Mail, Phone } from 'lucide-react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect } from 'react';
import { useRecoilState } from 'recoil';

import { cn } from '@/lib/utils';

import BillCardSkeleton from '@/components/utils/BillCardSkeleton';

const FundingResources = dynamic(
  () => import('@/components/account/FundingResources'),
  {
    loading: () => <BillCardSkeleton />,
  },
);

const VotingRecords = dynamic(
  () => import('@/components/account/VotingRecords'),
  {
    loading: () => <BillCardSkeleton />,
  },
);

import { useRouter } from 'next/navigation';

import { firebaseAnalytics } from '@/lib/helper';

import NewLineChart from '@/components/bills/bill-data-hub/charts/NewLineChart';
import Loading from '@/components/utils/Loading';

import { branchAtom } from '@/store/branch.atom';
import { userAtom } from '@/store/user.atom';

import ProfileAvatar from '@/../public/images/auth/profile-avatar-big.png';
import { getRepresentative } from '@/apis/user';

const lineChartData = [
  {
    name: 'jan',
    score: 1412,
  },
  {
    name: 'feb',
    score: 8456,
  },
  {
    name: 'mar',
    score: 2367,
  },
  {
    name: 'apr',
    score: 8454,
  },
  {
    name: 'may',
    score: 9565,
  },
  {
    name: 'jun',
    score: 4654,
  },
  {
    name: 'jul',
    score: 1412,
  },
  {
    name: 'aug',
    score: 8456,
  },
  {
    name: 'sep',
    score: 2367,
  },
  {
    name: 'oct',
    score: 8454,
  },
  {
    name: 'nov',
    score: 9565,
  },
  {
    name: 'dec',
    score: 4654,
  },
];

const Profile = ({ searchParams }: any) => {
  const { id, name, tab } = searchParams;

  const router = useRouter();

  const [, setUserState] = useRecoilState(userAtom);
  const [, setBranchState] = useRecoilState(branchAtom);

  const { data, isFetching } = useQuery({
    queryKey: ['get-representative-profile'],
    queryFn: () => getRepresentative(id),
    refetchOnWindowFocus: false,
  });

  // md:h-[calc(100vh_-_140px)] overflow-auto

  const renderProfileImage = () => {
    if (data?.representative?.image) return data?.representative?.image;

    return ProfileAvatar;
  };

  const onChangeTab = (tab: string) => {
    router.replace(`/account?name=${name}&id=${id}&tab=${tab}`);
  };

  const renderTabContent = () => {
    if (tab === 'funding-resources') {
      return <FundingResources representativeId={id} />;
    } else if (tab === 'voting-records') {
      return <VotingRecords representativeId={id} />;
    }

    return (
      <p className='text-muted-foreground text-sm px-4 pb-5'>
        Lorem Ipsum is simply dummy text of the printing and typesetting
        industry. Lorem Ipsum has been the industry's standard dummy text ever
        since the 1500s, when an unknown printer took a galley of type and
        scrambled it to make a type specimen book.
      </p>
    );
  };

  useEffect(() => {
    setUserState((prev) => ({ ...prev, currentPageName: name }));
  }, [name, setUserState]);

  useEffect(() => {
    setBranchState({
      page: 'Representatives',
      entity: null,
      entityId: id,
      alias: '',
      androidUrl: '',
      iosUrl: '',
      campaign: 'share-representative',
      deepLinkPath: '/representatives/funding-source',
      desktopUrl: `${process.env.DESKTOP_URL}/account?name=${name}&id=${id}&tab=${tab}`,
      description: 'Get to see the details of the representative',
      feature: 'representative',
    });
  }, [id, name, setBranchState, tab]);

  useEffect(() => {
    if (tab) return;
    router.replace(`/account?name=${name}&id=${id}&tab=biography`);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  useEffect(() => {
    firebaseAnalytics('page_view');
  }, []);

  if (isFetching) return <Loading />;

  return (
    <div className='flex flex-col flex-1 w-full mt-[40px] md:mt-0'>
      <title>Account</title>
      <div className='h-full md:h-[190px] bg-[#F7F7F8] flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between p-1 sm:p-4'>
        <div className='flex  gap-3'>
          <Image
            src={renderProfileImage()}
            alt='rep-img'
            className=' max-h-[190px]'
            height={0}
            width={160}
          />
          <div className='flex  flex-col justify-center'>
            <h4 className='text-base font-semibold'>
              {data?.representative?.firstName} {data?.representative?.lastName}
            </h4>
            <p className='text-muted-foreground text-sm mb-4'>
              {data?.representative?.title} | {data?.representative?.state} |{' '}
              {data?.representative?.party}
            </p>
            <div className='flex gap-2 mt-2 items-center'>
              <Phone className='h-4 w-4 text-muted-foreground' />
              <div className='flex flex-col gap-1'>
                {data?.representative?.phones.map((phone: string) => (
                  <p className='text-muted-foreground text-sm' key={phone}>
                    {phone}
                  </p>
                ))}
                {!data?.representative?.phones.length && (
                  <p className='text-xs text-gray-600'>Not available</p>
                )}
              </div>
            </div>
            <div className='flex gap-2 mt-2 items-center'>
              <Globe className='h-4 w-4 text-muted-foreground' />
              <div className='flex flex-col gap-1'>
                {data?.representative?.urls.map((url: string) => (
                  <Link
                    href={url}
                    target='_blank'
                    className='text-muted-foreground text-sm max-w-[200px] truncate'
                    key={url}
                  >
                    {url}
                  </Link>
                ))}
                {!data?.representative?.urls.length && (
                  <p className='text-xs text-gray-600'>Not available</p>
                )}
              </div>
            </div>
            <div className='flex gap-2 mt-2 items-center'>
              <Mail className='h-4 w-4 text-muted-foreground' />
              <div className='flex flex-col gap-1'>
                {data?.representative?.emails.map((mail: string) => (
                  <p className='text-muted-foreground text-sm' key={mail}>
                    {mail}
                  </p>
                ))}
                {!data?.representative?.emails.length && (
                  <p className='text-xs text-gray-600'>Not available</p>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className='bg-white md:w-[352px] md:h-[118px] md:mr-9 border border-gray-200 flex'>
          <div className='p-4 lg:p-0 h-full w-full flex flex-col items-center justify-center gap-1 sm:gap-2 border-r border-gray-200'>
            <h1 className='font-semibold text-xl lg:text-3xl'>{0}/100</h1>
            <p className='text-sm text-muted-foreground'>Elector Score</p>
          </div>
          <div className='p-4 lg:p-0 h-full w-full flex flex-col items-center justify-center gap-1 sm:gap-2'>
            <h1 className='font-semibold text-xl lg:text-3xl'>{0}%</h1>
            <p className='text-sm text-muted-foreground'>Voter Match Rate</p>
          </div>
        </div>
      </div>
      {/*   */}
      <div className='flex flex-col md:flex-row md:w-full'>
        <div className='md:w-[385px] lg:w-[550px] border-r border-gray-200  w-full '>
          <div className='px-4 flex items-center justify-between border-b border-gray-200 h-[50px]'>
            <button
              className={cn('relative text-sm text-muted-foreground', {
                accountActiveTab: tab === 'biography',
                'font-semibold text-black': tab === 'biography',
              })}
              onClick={() => onChangeTab('biography')}
            >
              <span>Biography</span>{' '}
            </button>
            <button
              className={cn('relative text-sm text-muted-foreground', {
                accountActiveTab: tab === 'voting-records',
                'font-semibold text-black': tab === 'voting-records',
              })}
              onClick={() => onChangeTab('voting-records')}
            >
              <span>Voting Records</span>{' '}
            </button>
            <button
              className={cn('relative text-sm text-muted-foreground', {
                accountActiveTab: tab === 'funding-resources',
                'font-semibold text-black': tab === 'funding-resources',
              })}
              onClick={() => onChangeTab('funding-resources')}
            >
              <span>Funding Sources</span>{' '}
            </button>
          </div>
          <div className='pt-4 md:h-[calc(100vh_-_237px)] overflow-y-auto'>
            {renderTabContent()}
          </div>
        </div>
        {/* <p>right</p> */}
        <div className='pt-4 border-t border-gray-200 md:border-none mb-10'>
          <p className='md:ml-4 pl-4 md:pl-0  border-b border-gray-200 pb-2.5 font-normal text-sm'>
            Elector Score
          </p>
          <div className='h-[275px] w-full md:w-[340px] pr-4 md:pr-0 mt-4'>
            <NewLineChart
              data={lineChartData}
              line2DataKey='score'
              xAxisTickAxisAngle={-45}
            />
          </div>
          <p className='md:ml-4 pl-4 md:pl-0 border-b border-gray-200 pb-2.5 pt-10 font-normal text-sm'>
            Voter Match Rate
          </p>
          <div className='h-[275px] w-full md:w-[340px] pr-4 md:pr-0 mt-4'>
            <NewLineChart
              data={lineChartData}
              line1DataKey='score'
              xAxisTickAxisAngle={-45}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
