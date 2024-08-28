import React from 'react';

import { Button } from '@/components/ui/button';
import Modal from '@/components/utils/Modal';

import VotingDoneIcon from '@/../public/svg/voting-done.svg';

interface ChangeVoteModalProps {
  isOpen: boolean;
  setIsOpen: any;
  handleChangeVote: (vote: string) => void;
  isDisabled: boolean;
}

const ChangeVoteModal = (props: ChangeVoteModalProps) => {
  const { isOpen, setIsOpen, handleChangeVote, isDisabled } = props;

  return (
    <Modal
      contentClassName='md:max-w-[450px]'
      isOpen={isOpen}
      preventOutsideClick
      setIsOpen={setIsOpen}
      renderContent={
        <div className='flex flex-col   items-center gap-4 font-poppins'>
          <VotingDoneIcon className='max-w-[120px] max-h-[120px]' />
          <h3 className='font-semibold text-base'>Change Vote</h3>
          <p className='text-muted-foreground text-center text-sm'>
            Cast your vote below to vote this bill again.
          </p>
          <div className='w-full flex flex-col gap-2'>
            <Button
              className='w-full rounded-full mt-2 bg-green-300'
              type='button'
              text='YAY'
              onClick={() => handleChangeVote('agree')}
              disabled={isDisabled}
            />
            <Button
              className='w-full rounded-full mt-2 bg-red-300'
              type='button'
              text='NAY'
              onClick={() => handleChangeVote('disagree')}
              disabled={isDisabled}
            />
          </div>
        </div>
      }
    />
  );
};

export default ChangeVoteModal;
