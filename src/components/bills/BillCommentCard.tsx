import React from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// import VerifiedGold from '@/../public/svg/verified-gold.svg';
import VerifiedBlack from '@/../public/svg/verified-black.svg';

interface BillCommentCardProps {
  timeOfComment: string;
  profilePicture: string;
  commentText: string;
  isVerified: boolean;
  username: string;
  time: string;
}

const BillCommentCard = (props: BillCommentCardProps) => {
  const { time, commentText, username, profilePicture } = props;
  return (
    <div className=' md:max-w-[320px] flex gap-3'>
      <Avatar className='flex items-center lg:w-10 w-8 lg:h-10 h-8'>
        <AvatarImage
          src={`${process.env.BASE_URL}/${profilePicture}`}
          alt='sponsor'
        />
        <AvatarFallback>
          {' '}
          <span className='text-muted-foreground uppercase'>
            {username[0] || ''}
            {username[1] || ''}
          </span>
        </AvatarFallback>
      </Avatar>
      <div className='flex flex-col gap-2'>
        <div className='text-muted-foreground text-xs lg:text-sm flex items-center gap-2'>
          <p className=''>{username}</p>
          <VerifiedBlack className='w-3 h-3' />
          <span className='text-xs'>{time}</span>
        </div>
        <p className='text-xs lg:text-sm'>{commentText}</p>
      </div>
    </div>
  );
};

export default BillCommentCard;
