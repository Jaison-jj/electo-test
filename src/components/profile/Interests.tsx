'use client';

import { useMutation } from '@tanstack/react-query';
import React from 'react';
import { toast } from 'sonner';

import { interests } from '@/lib/constants';
import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';

import { saveInterests } from '@/apis/user';

const Interests = (props: any) => {
  const { onClickCancelEdit, userInterests, editMode, refetchProfile } = props;
  const [selectedInterests, setSelectedInterests] = React.useState<string[]>([
    ...userInterests,
  ]);

  const onSelect = (interest: string) => {
    const includes = selectedInterests.includes(interest);
    if (includes) {
      setSelectedInterests(
        selectedInterests.filter((item) => item !== interest),
      );
      return;
    }
    setSelectedInterests([...selectedInterests, interest]);
  };

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: any) => saveInterests(data),
    onSuccess: (res: any) => {
      toast(res.message, {
        description: '',
        duration: 1000,
        action: {
          label: 'Close',
          onClick: () => null,
        },
      });
      refetchProfile();
      onClickCancelEdit();
    },
    onError(err: any) {
      toast(err.response.data.error, {
        description: '',
        duration: 3000,
        action: {
          label: 'Close',
          onClick: () => null,
        },
      });
    },
  });

  return editMode === 'interests' ? (
    <div>
      <div className='flex flex-wrap gap-2'>
        {interests.map((item, index) => (
          <span
            key={index}
            onClick={() => onSelect(item)}
            className={cn(
              'px-2 py-2  cursor-pointer border border-gray-500 rounded-2xl text-xs md:text-sm text-gray-500',
              {
                'border-black': selectedInterests.includes(item),
                'text-black': selectedInterests.includes(item),
              },
            )}
          >
            {item}
          </span>
        ))}
      </div>
      <div className='flex gap-2'>
        <Button
          className='w-full rounded-full mt-[20px]'
          type='button'
          disabled={isPending || selectedInterests.length < 3}
          text='Update'
          loading={isPending}
          onClick={() => mutate({ interests: selectedInterests })}
        />
        <Button
          className='w-full rounded-full mt-[20px]'
          type='button'
          variant='outline'
          text='Cancel'
          onClick={onClickCancelEdit}
        />
      </div>
    </div>
  ) : (
    <div className='flex flex-wrap gap-2'>
      {userInterests?.map((item: string, index: number) => (
        <span
          key={index}
          onClick={() => onSelect(item)}
          className={cn(
            'px-2 border-black text-black py-1 border rounded-2xl text-xs md:text-sm',
          )}
        >
          {item}
        </span>
      ))}
      {!userInterests?.length && (
        <span className='text-muted-foreground text-center text-sm'>
          No Interests are Added.
        </span>
      )}
    </div>
  );
};

export default Interests;
