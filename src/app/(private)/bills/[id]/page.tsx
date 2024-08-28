'use client';

export const dynamic = 'force-dynamic';

import { useMutation, useQuery } from '@tanstack/react-query';
import dynamicImport from 'next/dynamic';
import Link from 'next/link';
import { useRouter as useNpRouter } from 'next-nprogress-bar';
import React, { useEffect, useState } from 'react';
import { FaThumbsDown, FaThumbsUp } from 'react-icons/fa6';
import Joyride from 'react-joyride';
import { useRecoilState } from 'recoil';
import { toast } from 'sonner';

import { firebaseAnalytics } from '@/lib/helper';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

import { authState } from '@/store/auth.atom';
import { branchAtom } from '@/store/branch.atom';
import { userAtom } from '@/store/user.atom';

import {
  getFederalBillSummary,
  getMyOfficials,
  getStateBillSummary,
  voteFederalBill,
  voteStateBill,
} from '@/apis/bills';

const MyOfficialVoteCard = dynamicImport(
  () => import('@/components/bills/MyOfficialVoteCard'),
);

const TourTooltip = dynamicImport(
  () => import('@/components/guidedTour/TourTooltip'),
);

const NewTooltip = dynamicImport(() => import('@/components/utils/NewTooltip'));

const NoDataToDisplay = dynamicImport(
  () => import('@/components/utils/NoDataToDisplay'),
);
const Loading = dynamicImport(() => import('@/components/utils/Loading'));
const AccordionSingle = dynamicImport(
  () => import('@/components/utils/AccordionSingle'),
);
const VotingDoneModal = dynamicImport(
  () => import('@/components/bills/VotingDoneModal'),
);

const VerifyVoterRegWarningModal = dynamicImport(
  () => import('@/components/bills/VerifyVoterRegWarningModal'),
);

const StepperProgressBar = dynamicImport(
  () => import('@/components/bills/StepperProgress'),
  {
    loading: () => <Skeleton className='w-full h-[30px] md:h-[10px]' />,
    ssr: true,
  },
);

const SponsorBadge = dynamicImport(
  () => import('@/components/bills/SponsorBadge'),
);
const ChangeVoteModal = dynamicImport(
  () => import('@/components/bills/ChangeVoteModal'),
);

const Popover = dynamicImport(
  () => import('@/components/ui/popover').then((mod) => mod.Popover),
  {
    ssr: false,
  },
);

const PopoverContent = dynamicImport(
  () => import('@/components/ui/popover').then((mod) => mod.PopoverContent),
  {
    ssr: false,
  },
);

const PopoverTrigger = dynamicImport(
  () => import('@/components/ui/popover').then((mod) => mod.PopoverTrigger),
  {
    ssr: false,
  },
);

const Page = (props: any) => {
  const { params, searchParams } = props;
  const { id } = params;
  const { bill_type } = searchParams;

  const router = useNpRouter();
  const activeStep = React.useRef(0);

  const [userState, setUserState] = useRecoilState(userAtom);
  const [{ isNewUser }, setAuthStateValue] = useRecoilState(authState);
  const [, setBranchState] = useRecoilState(branchAtom);

  const [isOpenVoteDone, setIsOpenVoteDone] = useState(false);
  const [isOpenChangeVote, setIsOpenChangeVote] = useState(false);
  const [isOpenWarning, setIsOpenWarning] = useState(false);

  const [tourSteps, setTourSteps] = useState<any>([]);

  const {
    data: bill,
    isFetching,
    refetch: refetchBill,
  } = useQuery({
    queryKey: ['get-bill-summary'],
    queryFn:
      bill_type === 'state'
        ? () => getStateBillSummary({ id })
        : () => getFederalBillSummary({ id }),
    refetchOnWindowFocus: false,
  });

  const { data: myOfficials } = useQuery({
    queryKey: ['get-my-officials'],
    queryFn: () => getMyOfficials(),
    refetchOnWindowFocus: false,
  });

  const billOfficialsSenate = myOfficials?.data[bill_type].senate || [];
  const billOfficialsHouse = myOfficials?.data[bill_type].house || [];

  const { mutate, isPending } = useMutation({
    mutationFn: async (payload: any) =>
      bill_type === 'state' ? voteStateBill(payload) : voteFederalBill(payload),
    onSuccess: (res: any) => {
      toast('Vote Successful.', {
        description: res.message,
        duration: 3000,
      });
      firebaseAnalytics('vote_bill', {
        billId: id,
      });
      setIsOpenVoteDone(true);
      setIsOpenChangeVote(false);
      refetchBill();
    },
    onError(err: any) {
      toast(err.response.data.message, {
        description: '',
        duration: 3000,
        action: {
          label: 'Close',
          onClick: () => null,
        },
      });
    },
  });

  const onClickSkipWarning = () => {
    setIsOpenWarning(false);
    setIsOpenVoteDone(true);
  };

  const castVote = (vote: string) => {
    const reqData = {
      billId: id,
      voteType: vote,
    };
    mutate(reqData);
  };

  const hasUserVoted = bill?.data?.vote
    .map((item: any) => item.user.id)
    .includes(userState.id);

  const getUsersVote = () => {
    const vote = bill?.data?.vote?.filter(
      (vote: any) => vote?.user?.id === userState?.id,
    )[0];
    if (vote?.voteType === 'agree') {
      return (
        <FaThumbsUp
          className='min-h-[20px] min-w-[20px] ml-auto'
          fill='#77C388'
        />
      );
    } else if (vote?.voteType === 'disagree') {
      return (
        <FaThumbsDown
          className='min-h-[20px] min-w-[20px] ml-auto'
          fill='#EE7C7C'
        />
      );
    }
    return '';
  };

  useEffect(() => {
    setUserState((prev) => ({ ...prev, currentPageName: 'Bill Summary' }));
    activeStep.current = bill?.data?.billStatus?.step;
  }, [bill?.data?.billStatus?.step, setUserState]);

  useEffect(() => {
    setTimeout(() => {
      setTourSteps([
        {
          target: '.voting-buttons',
          content: `Explore detailed bill summaries and their social implications. Use these
        buttons to vote your stance. You can also set up
        notifications to to stay up to date on the latest developments!`,
          disableBeacon: true,
        },
      ]);
    }, 2000);
  }, [isFetching]);

  useEffect(() => {
    setBranchState({
      page: 'BillSummary',
      entity: bill_type === 'federal' ? 'federalBill' : 'stateBill',
      entityId: id,
      alias: '',
      androidUrl: '',
      iosUrl: '',
      campaign: 'bill_awareness',
      deepLinkPath: '/bill-feed/bill-summary',
      desktopUrl: '',
      description: bill?.data.billInfo,
      feature: 'billSummary',
    });
  }, [bill?.data.billInfo, bill_type, id, setBranchState]);

  useEffect(() => {
    firebaseAnalytics('page_view');
  }, []);

  if (isFetching) return <Loading />;

  if (!bill?.data)
    return (
      <NoDataToDisplay text='No data to display! Please come back later.' />
    );

  return (
    <div className='flex flex-col mt-14 md:mt-3 md:min-h-[calc(100vh_-_100px)] overflow-y-auto relative'>
      <title>Bill Summary</title>
      <Joyride
        steps={tourSteps}
        disableOverlayClose
        disableScrolling
        hideCloseButton
        run={isNewUser}
        tooltipComponent={(props) => (
          <TourTooltip
            {...props}
            onClickNext={() => router.push(`${id}/data-hub`)}
            onClickSkip={() =>
              setAuthStateValue((prev) => ({ ...prev, isNewUser: false }))
            }
          />
        )}
      />

      <Popover>
        <PopoverTrigger className='border-b border-gray-200 py-5 z-0 w-full '>
          <StepperProgressBar
            activeStep={activeStep.current}
            wrapperClassName='px-4 w-full'
          />
        </PopoverTrigger>
        <PopoverContent className='w-fit '>
          <p className='text-sm font-bold'>
            <span className='text-muted-foreground'>Status:</span>{' '}
            {bill?.data?.actualStatus || 'Actual bill status is unavailable!'}
          </p>
        </PopoverContent>
      </Popover>

      <div className='px-5 pt-2 flex flex-col gap-2 max-h-[calc(100vh_-_333px)] md:max-h-[calc(100vh_-_230px)]  overflow-auto md:h-full  '>
        <div className='flex items-center gap-2'>
          <p className='font-semibold text-base md:text-lg'>
            {bill?.data?.billTitle}
          </p>
          <NewTooltip text='Your Vote'>{getUsersVote()}</NewTooltip>
        </div>
        <p className='text-sm leading-5 md:leading-7 mt-2 text-muted-foreground font-normal'>
          {bill?.data?.billSummary}
        </p>

        <AccordionSingle header='Bill Information' defaultOpen={0}>
          <div className='flex flex-col gap-2'>
            <p className='text-sm leading-5 md:leading-7 text-muted-foreground font-normal'>
              {bill?.data?.billInfo || 'No data to display.'}
            </p>
            {!!bill?.data?.sponsors.length && (
              <div className='flex flex-col gap-2'>
                <h4 className='text-sm font-normal text-black'>Sponsors</h4>
                <div className='flex flex-wrap gap-2'>
                  {bill?.data?.sponsors?.map((sponsor: any) => (
                    <SponsorBadge
                      key={sponsor.id}
                      image={sponsor.imageUrl}
                      name={`${sponsor.firstName} ${sponsor.lastName}`}
                    />
                  ))}
                </div>
              </div>
            )}
            {!bill?.data?.sponsors.length && (
              <p className='text-xs font-normal text-gray-500'>
                No sponsors for this bill.
              </p>
            )}
          </div>
        </AccordionSingle>
        <AccordionSingle header='Social Impact' defaultOpen={0}>
          <div className='flex flex-col gap-2'>
            <p className='text-sm leading-5 md:leading-7 text-muted-foreground font-normal'>
              {bill?.data?.socialEffects}
            </p>
          </div>
        </AccordionSingle>
        <AccordionSingle header='My Official&rsquo;s Vote'>
          <div className='flex flex-col gap-4 '>
            {[...billOfficialsHouse, ...billOfficialsSenate].map(
              (person: any) => (
                <MyOfficialVoteCard
                  key={person?.id}
                  id={person?.id}
                  name={`${person?.firstName} ${person?.lastName}`}
                  electoScore={person?.score}
                  party={person?.party}
                  role='Senator'
                  state={person?.state}
                  voterMatchRate={person?.matchRate}
                />
              ),
            )}
          </div>
        </AccordionSingle>
      </div>

      {!hasUserVoted ? (
        <div className='voting-buttons mt-3 md:mt-0  flex gap-3 p-4 md:absolute bottom-0 w-full bg-gray-100 mb-[56px] md:mb-0'>
          <Button
            className='w-full rounded-full bg-green-400'
            type='button'
            onClick={() => castVote('agree')}
            disabled={isPending}
            loading={false}
            text='YAY'
          />
          <Button
            className='w-full rounded-full bg-red-300'
            type='button'
            onClick={() => castVote('disagree')}
            disabled={isPending}
            loading={false}
            text='NAY'
          />
        </div>
      ) : (
        <div className='mt-3 md:mt-0  flex gap-3 p-4 md:absolute bottom-0 w-full bg-gray-100 mb-[56px] md:mb-0'>
          <Button
            className='w-full rounded-full'
            type='button'
            variant='outline'
            onClick={() => setIsOpenChangeVote(true)}
            text='Change Vote'
          />
          <Link
            href={`${id}/data-hub?bill_type=${bill_type}`}
            className='w-full'
          >
            <Button
              className='w-full rounded-full'
              type='button'
              text='View Data'
            />
          </Link>
        </div>
      )}

      {/* Modals */}
      <VotingDoneModal isOpen={isOpenVoteDone} setIsOpen={setIsOpenVoteDone} />
      <VerifyVoterRegWarningModal
        isOpen={isOpenWarning}
        setIsOpen={setIsOpenWarning}
        onClickSkip={onClickSkipWarning}
      />
      <ChangeVoteModal
        isOpen={isOpenChangeVote}
        setIsOpen={setIsOpenChangeVote}
        handleChangeVote={castVote}
        isDisabled={isPending}
      />
    </div>
  );
};

export default Page;
