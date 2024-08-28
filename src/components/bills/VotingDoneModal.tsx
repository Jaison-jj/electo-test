import { useMutation } from '@tanstack/react-query';
import { useParams, useSearchParams } from 'next/navigation';
import { useRouter as useNpRouter } from 'next-nprogress-bar';
import React, { useCallback } from 'react';
import { useRecoilState } from 'recoil';
import { toast } from 'sonner';

import { createBranchLink } from '@/lib/branch';

import { Button } from '@/components/ui/button';
import Modal from '@/components/utils/Modal';

import { branchAtom } from '@/store/branch.atom';

import VotingDoneIcon from '@/../public/svg/voting-done.svg';
import { share } from '@/apis/branchIo';

interface VotingDoneModalProps {
  isOpen: boolean;
  setIsOpen: any;
}

const VotingDoneModal = (props: VotingDoneModalProps) => {
  const { isOpen, setIsOpen } = props;
  const router = useNpRouter();
  const { id } = useParams();
  const searchParams = useSearchParams();
  const bill_type = searchParams.get('bill_type');

  const [branchState, setBranchState] = useRecoilState(branchAtom);

  const onClickViewData = () => {
    setIsOpen(false);
    router.push(`/bills/${id}/data-hub?bill_type=${bill_type}`);
  };

  const { mutate: getBranchUrl, isPending: isPendingBranchUrl } = useMutation({
    mutationFn: async () => await createBranchLink(branchState),
    onSuccess: async (res: any) => {
      try {
        await navigator.clipboard.writeText(res);
        toast.success('Link copied to clipboard');
        setIsOpen(false);
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
        deepLinkPath: '/bill-feed/bill-summary/vote',
      }));
      await getBranchUrl();
    },
    onError(err: any) {
      toast(err.response.data.message, {});
    },
  });

  const onClickShare = useCallback(async () => {
    getShareInfo({
      page: 'BillVote',
      entity: branchState.entity,
      entityId: branchState.entityId,
    });
  }, [branchState, getShareInfo]);

  return (
    <Modal
      contentClassName='md:max-w-[450px]'
      isOpen={isOpen}
      preventOutsideClick
      setIsOpen={setIsOpen}
      renderContent={
        <div className='flex flex-col   items-center gap-4 font-poppins'>
          <VotingDoneIcon className='max-w-[120px] max-h-[120px]' />
          <h3 className='font-semibold text-base'>Congratulations</h3>
          <p className='text-muted-foreground text-center text-sm'>
            Thank you for voting on this bill.
          </p>
          <div className='w-full flex flex-col gap-2'>
            <Button
              className='w-full rounded-full mt-2'
              type='submit'
              text='View Data'
              onClick={onClickViewData}
            />
            <Button
              className='w-full rounded-full mt-2'
              variant='outline'
              type='button'
              text='Share My vote'
              loading={isPendingBranchUrl || isPending}
              disabled={isPendingBranchUrl || isPending}
              onClick={onClickShare}
            />
          </div>
        </div>
      }
    />
  );
};

export default VotingDoneModal;
