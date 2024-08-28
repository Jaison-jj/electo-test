'use client';

import {
  ArrowLeft,
  MessageSquareText,
  Search,
  Share2,
  TrendingUp,
  X,
} from 'lucide-react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from 'next/navigation';
import React, { useCallback, useEffect } from 'react';
import { useRecoilState } from 'recoil';

import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
const SearchInput = dynamic(() => import('@/components/utils/SearchInput'));

import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import { createBranchLink, initializeBranch } from '@/lib/branch';
import { firebaseAnalytics } from '@/lib/helper';

import Loading from '@/components/utils/Loading';

import { branchAtom } from '@/store/branch.atom';
import { userAtom } from '@/store/user.atom';

import CompanyLogoNew from '@/../public/svg/logoHeaderNew.svg';
import MapIcon from '@/../public/svg/map.svg';
import { share } from '@/apis/branchIo';

const TwoColHeader = () => {
  const router = useRouter();
  const { id } = useParams();
  const pathName = usePathname();
  const isMapPage = pathName.includes('map');
  const page = pathName.split('/').at(pathName.split('/').length - 1);

  const searchParams = useSearchParams();
  const bill_type = searchParams.get('bill_type');
  const view = searchParams.get('view');

  const [userState] = useRecoilState(userAtom);
  const [branchState, setBranchState] = useRecoilState(branchAtom);

  const [showShowSearchBar, setShowSearchBar] = React.useState(false);

  const pageName = userState?.currentPageName?.replace(/[/-]/g, ' ');

  const { mutate: getBranchUrl, isPending: isPendingBranchUrl } = useMutation({
    mutationFn: async () => await createBranchLink(branchState),
    onSuccess: async (res: any) => {
      firebaseAnalytics('vote_bill', {
        sharedLink: res,
      });

      try {
        await navigator.clipboard.writeText(res);
        toast.success('Link copied to clipboard');
      } catch (err) {
        toast.error('Failed to copy link to the clipboard!');
      }
    },
    onError(err: any) {
      toast(err.response.data.message, {});
    },
  });

  const { mutate: getShareInfo, isPending } = useMutation({
    mutationFn: async (payload: any) => share(payload),
    onSuccess: async (res: any) => {
      await setBranchState((prev) => ({
        ...prev,
        title: res.title,
        imageUrl: res.image,
        desktopUrl: res.link,
      }));
      await getBranchUrl();
    },
    onError(err: any) {
      toast(err.response.data.message, {});
    },
  });

  const onClickShare = useCallback(async () => {
    getShareInfo({
      page: branchState.page,
      entity: branchState.entity,
      entityId: branchState.entityId,
    });
  }, [branchState, getShareInfo]);

  useEffect(() => {
    initializeBranch();
  }, []);

  const searchNotEnabledPages = [
    'election-center',
    'settings',
    'profile',
    'take-action',
    'voting-records',
    'common-directory',
    'payment',
  ];

  const renderNavComponents = () => {
    if (
      userState.currentPageName === 'Data Hub' ||
      userState.currentPageName === 'Electo Map'
    ) {
      return (
        <>
          {showShowSearchBar ? (
            <div className='hidden md:flex gap-2 justify-left items-center h-full  md:w-[235px] lg:w-[336px]'>
              <SearchInput placeholder='Search by bill, official, etc...' />
              <X
                className=' bg-gray-100 w-6 h-6 p-2 box-content cursor-pointer rounded-full'
                role='button'
                onClick={() => setShowSearchBar(false)}
              />
            </div>
          ) : (
            <div className='hidden md:flex gap-2 justify-left items-center h-full  pl-4'>
              <Search
                role='button'
                onClick={() => setShowSearchBar(true)}
                className=' bg-gray-100 w-6 h-6 p-2 box-content cursor-pointer rounded-full'
              />

              {isMapPage && (
                <Link
                  href={`/bills/${id}/${bill_type === 'federal' ? 'federal-map' : 'state-map'}?bill_type=${bill_type}&view=chart`}
                >
                  <TrendingUp
                    className={cn(
                      'bg-gray-100 w-6 h-6 p-2 box-content cursor-pointer rounded-full ',
                      {
                        'border border-black': view === 'chart',
                      },
                    )}
                  />
                </Link>
              )}
              {isMapPage && (
                <Link
                  href={`/bills/${id}/${bill_type === 'federal' ? 'federal-map' : 'state-map'}?bill_type=${bill_type}&view=comments`}
                >
                  <MessageSquareText
                    role='button'
                    className={cn(
                      'bg-gray-100 w-6 h-6 p-2 box-content cursor-pointer rounded-full ',
                      {
                        'border border-black': view === 'comments',
                      },
                    )}
                  />
                </Link>
              )}
              {!isMapPage && (
                <Link
                  href={`${bill_type === 'state' ? 'state-map' : 'federal-map'}?bill_type=${bill_type}`}
                >
                  <Button
                    variant='outline'
                    className='rounded-full'
                    text={
                      <div className='flex justify-center items-center gap-2'>
                        <MapIcon className='h-6 w-6' />
                        <span>View Map</span>
                      </div>
                    }
                  />
                </Link>
              )}
              <Link href={`/bills/${id}/take-action?bill_type=${bill_type}`}>
                <Button className='rounded-full' text='Take Action' />
              </Link>
              <Button
                variant='outline'
                className='rounded-full border-none bg-gray-100'
                onClick={onClickShare}
                disabled={isPending || isPendingBranchUrl}
                text={
                  <div className='flex justify-center items-center gap-2 rounded-full text-sm'>
                    <span>Share</span>
                    {isPending || isPendingBranchUrl ? (
                      <Loading className='h-5 w-5' />
                    ) : (
                      <Share2 className='h-5 w-5' />
                    )}
                  </div>
                }
              />
            </div>
          )}
        </>
      );
    }

    return (
      <div
        className={cn(
          'hidden md:flex gap-2 justify-between items-center h-full  md:w-[235px] lg:w-[336px]',
          {
            'justify-end': searchNotEnabledPages.includes(pathName),
          },
        )}
      >
        <SearchInput placeholder='Search by bill, official, etc...' />
        {!searchNotEnabledPages.includes(page as string) && (
          <Button
            variant='outline'
            className='rounded-full border-none bg-gray-100'
            onClick={onClickShare}
            disabled={isPending || isPendingBranchUrl}
            text={
              <div className='flex justify-center items-center gap-2 rounded-full text-sm'>
                <span>Share</span>
                {isPending || isPendingBranchUrl ? (
                  <Loading className='h-5 w-5' />
                ) : (
                  <Share2 className='h-5 w-5' />
                )}
              </div>
            }
          />
        )}
      </div>
    );
  };

  return (
    <div className={cn(`w-full transition-all border-b border-gray-200 `)}>
      <div className='flex h-[80px] items-center justify-center mx-auto md:max-w-[1125px]'>
        <div className='hidden md:flex h-full md:w-[167px]  lg:w-[239px]'>
          <Link
            href='/bills'
            className='flex flex-row space-x-3 items-center justify-start w-full'
          >
            {/* <span className='font-bold text-2xl font-syncopate flex'>
              ELECTO
            </span> */}
            <CompanyLogoNew className='w-[125px] h-[30px]' />
          </Link>
        </div>
        <div className=' flex items-center justify-between h-full md:w-[620px]  lg:w-[886px] w-full border-l border-gray-200 z-30'>
          {/* <div className='flex justify-between w-full pr-4'> */}
          <div className='flex gap-2 pl-[16px]'>
            <button onClick={() => router.back()}>
              <ArrowLeft />
            </button>
            <span className='font-semibold text-base capitalize'>
              {pageName}
            </span>
          </div>
          {/* <select name='' id='' className='pl-2 pt-2 pb-2 rounded-3xl '>
              <option value=''>State</option>
              <option value=''>Federal</option>
            </select> */}
          {/* </div> */}
          {/*  */}
          {renderNavComponents()}
        </div>
      </div>
    </div>
  );
};

export default TwoColHeader;
