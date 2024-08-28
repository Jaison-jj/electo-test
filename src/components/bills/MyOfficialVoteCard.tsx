import { Clock } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface MyOfficialVoteCardProps {
  id: string;
  name: string;
  role: string;
  state: string;
  party: string;
  electoScore: number;
  voterMatchRate: number;
}

const MyOfficialVoteCard = (props: MyOfficialVoteCardProps) => {
  const { id, name, role, state, party, electoScore, voterMatchRate } = props;

  const fallBackImageText = name.split(' ');

  return (
    <Link
      href={`/account?name=${name}&id=${id}`}
      className='flex justify-between items-center hover:bg-gray-200 md:px-1 rounded-lg'
    >
      <div className='flex items-center gap-4'>
        <Avatar className='flex items-center w-8 h-8'>
          <AvatarImage src='' alt='sponsor' />
          <AvatarFallback>
            {fallBackImageText[0][0] + fallBackImageText[1][0]}
          </AvatarFallback>
        </Avatar>
        <div className='flex flex-col gap-1'>
          <div className='flex gap-1 text-xs md:text-sm'>
            <span className='text-black font-medium truncate'>{name}</span>
            <span>&#8226;</span>
            <span className='text-black text-[12px] truncate'>
              {role} | {party} | {state}
            </span>
          </div>
          <div className='flex gap-2 md:gap-4 text-xs'>
            <span>Elector Score : {electoScore}/100</span>
            <span>Voter Match Rate : {voterMatchRate}%</span>
          </div>
        </div>
      </div>
      <Clock className='h-6 w-6 text-gray-400 mr-2' />
    </Link>
  );
};

export default MyOfficialVoteCard;
