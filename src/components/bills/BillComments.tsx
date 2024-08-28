'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import { intlFormatDistance } from 'date-fns';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { useRecoilState } from 'recoil';
import { toast } from 'sonner';

import BillCommentCard from '@/components/bills/BillCommentCard';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import Loading from '@/components/utils/Loading';
import NoDataToDisplay from '@/components/utils/NoDataToDisplay';

import { userAtom } from '@/store/user.atom';

import {
  commentFederalBill,
  commentStateBill,
  getFederalBillComments,
  getStateBillComments,
} from '@/apis/bills';

interface BillCommentProps {
  billId?: string | string[];
}

const BillComments = (props: BillCommentProps) => {
  const { billId } = props;
  const [userState] = useRecoilState(userAtom);
  const params = useSearchParams();
  const billType = params.get('bill_type');

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [commentText, setCommentText] = useState('');

  const {
    data: comments,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ['get-bill-comments'],
    queryFn: async () => {
      const response =
        billType === 'state'
          ? await getStateBillComments({ billId: billId })
          : await getFederalBillComments({ billId: billId });
      scrollToBottom();
      return response.data;
    },
    refetchOnWindowFocus: false,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (payload: any) =>
      billType === 'state'
        ? commentStateBill(payload)
        : commentFederalBill(payload),
    onSuccess: (res: any) => {
      toast(res.message, {
        position: 'top-right',
        description: '',
        duration: 3000,
      });
      refetch();
      setCommentText('');
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

  const handleAddComment = () => {
    const reqData = {
      billId: billId,
      commentText,
    };
    mutate(reqData);
  };

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [comments]);

  if (isFetching)
    return (
      <div className='md:w-[235px] lg:w-[336px] pt-10'>
        <Loading />
      </div>
    );

  return (
    <div className='w-full relative  md:h-full md:w-[235px] lg:min-w-[336px] '>
      <div className='pl-2 lg:pl-4 h-[69px] border-b md:border-r border-gray-200 w-full flex items-center'>
        <p>Comments</p>
      </div>
      <div className='md:h-[calc(100dvh_-_228px)] pl-2 md:border-r border-gray-200 lg:pl-4 pt-2 lg:pt-0  relative '>
        <div
          ref={scrollRef}
          className=' max-h-[calc(100dvh_-_270px)] overflow-auto md:max-h-[calc(100dvh_-_229px)] overflow-y-auto flex flex-col  gap-6 py-2'
        >
          {comments ? (
            comments?.map((comment: any) => {
              const time = intlFormatDistance(
                new Date(comment.timeOfComment),
                new Date(),
                { style: 'short' },
              );

              return (
                <BillCommentCard
                  key={comment?.timeOfComment}
                  timeOfComment={comment.timeOfComment}
                  profilePicture={comment.profilePicture}
                  commentText={comment.commentText}
                  isVerified={comment.isVerified}
                  username={comment.username}
                  time={time}
                />
              );
            })
          ) : (
            <NoDataToDisplay text='No comments added yet.' />
          )}
        </div>
      </div>
      <div className='absolute bottom-3 md:bottom-0 w-full'>
        <div className='mt-2 relative'>
          <textarea
            disabled={isPending}
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className='relative bg-gray-100 w-full focus:outline-none text-sm  pl-[65px] pr-20 pt-6 h-[72px] rounded-xl md:rounded-none'
            placeholder='Post your comment...'
            maxLength={200}
          />
          <Avatar className='absolute top-[17px] left-[15px] flex items-center w-10 h-10'>
            <AvatarImage
              src={`${process.env.BASE_URL}/${userState.image}`}
              alt='sponsor'
            />
            <AvatarFallback>
              <span className='text-muted-foreground uppercase'>
                {userState?.firstName?.at(0) || ''}
                {userState?.lastName?.at(0) || ''}
              </span>
            </AvatarFallback>
          </Avatar>
          <Button
            className='w-[60px] rounded-full absolute top-[17px] right-[15px]'
            type='button'
            onClick={handleAddComment}
            disabled={isPending}
            loading={isPending}
            text='Post'
          />
        </div>
      </div>
    </div>
  );
};

export default BillComments;
