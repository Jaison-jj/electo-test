import { useParams } from 'next/navigation';
import { useRouter as useNpRouter } from 'next-nprogress-bar';
import React from 'react';

import { Button } from '@/components/ui/button';
import Modal from '@/components/utils/Modal';

import WarningIcon from '@/../public/svg/warning.svg';

interface VerifyVoterRegWarningModalProps {
  isOpen: boolean;
  setIsOpen: any;
  onClickSkip: any;
}

const VerifyVoterRegWarningModal = (props: VerifyVoterRegWarningModalProps) => {
  const { isOpen, setIsOpen, onClickSkip } = props;
  const router = useNpRouter();
  const { id } = useParams();

  const onClickProceed = () => {
    setIsOpen(false);
    router.push(`/bills/${id}`);
  };

  return (
    <Modal
      contentClassName='md:max-w-[450px]'
      isOpen={isOpen}
      preventOutsideClick
      setIsOpen={setIsOpen}
      renderContent={
        <div className='flex flex-col   items-center gap-4 font-poppins'>
          <WarningIcon className='max-w-[120px] max-h-[120px]' />
          <h3 className='font-semibold text-base'>Verify Voter Registration</h3>
          <p className='text-muted-foreground text-center text-xs'>
            Placeholder text commonly used to demonstrate the visual form of a
            document or a typeface without relying on meaningful content.
          </p>
          <div className='w-full flex gap-2'>
            <Button
              className='w-full rounded-full mt-2'
              text='Proceed'
              onClick={onClickProceed}
            />
            <Button
              className='w-full rounded-full mt-2'
              variant='outline'
              type='button'
              text='Skip'
              onClick={onClickSkip}
            />
          </div>
        </div>
      }
    />
  );
};

export default VerifyVoterRegWarningModal;
