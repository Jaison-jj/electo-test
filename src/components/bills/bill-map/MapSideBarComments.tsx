'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import { intlFormatDistance } from 'date-fns';
import { X } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import React from 'react';
import { toast } from 'sonner';

import BillCommentCard from '@/components/bills/BillCommentCard';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import Loading from '@/components/utils/Loading';
import NoDataToDisplay from '@/components/utils/NoDataToDisplay';

import {
  commentFederalBill,
  commentStateBill,
  getFederalBillComments,
  getStateBillComments,
} from '@/apis/bills';

const MapSideBarComments = (props: any) => {
  const { setIsOpen, firstName, lastName, userImage, bill_type } = props;

  const scrollRef = React.useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const { id } = useParams();

  const [commentText, setCommentText] = React.useState('');

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  };

  const {
    data: comments,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ['get-bill-comments-map'],
    queryFn: async () => {
      const response =
        bill_type === 'state'
          ? await getStateBillComments({ billId: id })
          : await getFederalBillComments({ billId: id });
      scrollToBottom();
      return response.data;
    },
    refetchOnWindowFocus: false,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (payload: any) =>
      bill_type === 'state'
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
      billId: id,
      commentText,
    };
    mutate(reqData);
  };

  const onClickClose = () => {
    setIsOpen(false);
    router.replace(
      `/bills/${id}/${bill_type === 'federal' ? 'federal-map' : 'state-map'}?bill_type=${bill_type}`,
    );
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [comments]);

  // const arr = Array.from({ length: 20 }, (v, i) => i);

  return (
    <div className=''>
      <X
        role='button'
        className=' border border-black  px-1 py-1 rounded-2xl ml-auto text-xs m-2'
        onClick={onClickClose}
      />
      <p className='px-4 border-b border-gray-200 pb-6'>Comments</p>
      <div
        ref={scrollRef}
        className='h-[calc(100vh_-_248px)] overflow-auto pt-4 flex flex-col gap-2 px-2'
      >
        {isFetching && <Loading />}

        {!comments?.length && !isFetching && (
          <NoDataToDisplay text='No comments added yet!' />
        )}

        {!isFetching &&
          comments.map((item: any) => {
            const time = intlFormatDistance(
              new Date(item.timeOfComment),
              new Date(),
              { style: 'short' },
            );
            return (
              <BillCommentCard
                key={item?.timeOfComment}
                commentText={item?.commentText}
                isVerified={item?.isVerified}
                time={time}
                timeOfComment={item?.commentText}
                username={item?.username}
                profilePicture={item?.profilePicture}
              />
            );
          })}
      </div>

      <div className=' relative'>
        <textarea
          disabled={false}
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          className='relative bg-gray-100 w-full focus:outline-none text-sm  pl-[65px] pr-20 pt-6 h-[72px] rounded-xl md:rounded-none'
          placeholder='Post your comment...'
          maxLength={200}
        />
        <Avatar className='absolute top-[17px] left-[15px] flex items-center w-10 h-10'>
          <AvatarImage
            src={`${process.env.BASE_URL}/${userImage}`}
            alt='sponsor'
          />
          <AvatarFallback>
            <span className='text-muted-foreground uppercase'>
              {firstName} {lastName}
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
  );
};

export default MapSideBarComments;
