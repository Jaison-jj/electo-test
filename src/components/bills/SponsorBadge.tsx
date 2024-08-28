import React from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
const SponsorBadge = (props: any) => {
  const { image, name } = props;
  return (
    <div className='font-poppins flex gap-2 items-center border border-gray-200 rounded-3xl w-fit h-fit p-1'>
      <Avatar className='flex items-center w-8 h-8'>
        <AvatarImage src={image} alt='sponsor' />
        <AvatarFallback>
          {name[0] || ''}
          {name[1] || ''}
        </AvatarFallback>
      </Avatar>
      <p className='text-sm pr-1'>{name}</p>
    </div>
  );
};

export default SponsorBadge;
