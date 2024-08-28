import { CheckSquareIcon, MessageSquareText, Share2 } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { FaThumbsDown, FaThumbsUp } from 'react-icons/fa6';

import { addEllipsis } from '@/lib/helper';

import NextImage from '@/components/NextImage';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import NewTooltip from '@/components/utils/NewTooltip';

import AvatarPlaceholder from '@/../public/images/utils/avatar-placeholder.png';

interface BillCardProps {
  authors: any[];
  description: string;
  type: 'latest' | 'votingRecords';
  voted?: boolean;
  time: string;
  agreeVotes?: number;
  comments?: number;
  shares?: number;
  id?: string;
  billType?: string | null;
}

const BillCard = (props: BillCardProps) => {
  const {
    description,
    type,
    authors,
    voted,
    time,
    agreeVotes = 0,
    comments = 0,
    shares = 0,
    id,
    billType = 'federal',
  } = props;

  const renderBillAuthorsName = authors.length
    ? authors
        ?.map((author) => `${author?.firstName} ${author?.lastName} `)
        ?.join(', ')
    : 'no_name';

  return (
    <div className='flex gap-1 w-full md:max-w-[549px] md:gap-3 p-2 md:p-4 hover:bg-secondaryAsh border-b border-gray-200'>
      <div className='relative'>
        <Avatar>
          <AvatarImage src={authors[0]?.imageUrl} alt='author' />
          <AvatarFallback>
            {/* {authors[0]?.firstName[0] || ''}
            {authors[0]?.lastName[0] || ''} */}
            <NextImage
              width={100}
              height={100}
              src={AvatarPlaceholder}
              alt='author'
            />
          </AvatarFallback>
        </Avatar>
        {type === 'latest' && authors.length > 1 && (
          <>
            <Avatar className='absolute top-3 left-0 rounded-full border-2 border-white'>
              <AvatarImage src={authors[1]?.imageUrl} alt='author' />
              <AvatarFallback>
                <NextImage
                  width={100}
                  height={100}
                  src={AvatarPlaceholder}
                  alt='author'
                />
              </AvatarFallback>
            </Avatar>
            <p className='text-sm text-white absolute top-[18px] left-[6px] font-semibold drop-shadow-lg'>
              +2
            </p>
          </>
        )}
      </div>
      <div className='flex flex-col gap-2 text-sm'>
        <div className='text-muted-foreground flex gap-1 items-center'>
          <span className='block max-w-[150px] truncate'>
            {renderBillAuthorsName}
          </span>
          <span className='text-xs'>&#x2022; {time}</span>
        </div>
        <Link href={billType ? `/bills/${id}?bill_type=${billType}` : '#'}>
          <p className='text-black'>{addEllipsis(description)}</p>
        </Link>
        <div className='flex gap-10 text-muted-foreground items-center'>
          <NewTooltip text={`Votes-${agreeVotes}`}>
            <div className='flex gap-2 items-center'>
              <CheckSquareIcon className='h-[20px] w-[20px]' />
              <span>{agreeVotes}</span>
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
          {type === 'votingRecords' &&
            (voted ? (
              <FaThumbsUp
                className='h-[20px] w-[20px] ml-auto'
                fill='#77C388'
              />
            ) : (
              <FaThumbsDown
                className='h-[20px] w-[20px] ml-auto'
                fill='#EE7C7C'
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default BillCard;
