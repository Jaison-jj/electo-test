import { CheckSquareIcon, MessageSquareText, Share2 } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

import NewTooltip from '@/components/utils/NewTooltip';

interface TrendingBillCardProps {
  id: number;
  rank: number;
  title: string;
  votes: number;
  comments: number;
  shares: number;
  identifier: string;
}

const TrendingBillCard = (props: TrendingBillCardProps) => {
  const { id, rank, title, votes, comments, shares, identifier } = props;

  return (
    <div className='flex gap-2 items-start w-full'>
      <p className='px-5 font-semibold text-sm'>{rank}</p>
      <div className='flex flex-col gap-2 border-b border-gray-2 pb-3 w-full'>
        <Link href={`bills/${id}`} className='py-1'>
          <p className='font-semibold text-sm'>{identifier}</p>
          <p className='text-sm'>{title}</p>
        </Link>

        <div className='flex gap-10 text-muted-foreground items-center'>
          <NewTooltip text={`Votes-${votes}`}>
            <div className='flex gap-2 items-center'>
              <CheckSquareIcon className='h-[20px] w-[20px]' />
              <span>{votes}</span>
            </div>
          </NewTooltip>
          <NewTooltip text={`Comments-${comments}`}>
            <div className='flex gap-2 items-center'>
              <MessageSquareText className='h-[20px] w-[20px]' />
              <span>{comments}</span>
            </div>
          </NewTooltip>
          <NewTooltip text={`Shares-${shares}`}>
            <div className='flex gap-2 items-center'>
              <Share2 className='h-[20px] w-[20px]' />
              <span>{shares}</span>
            </div>
          </NewTooltip>
        </div>
      </div>
    </div>
  );
};

export default TrendingBillCard;
