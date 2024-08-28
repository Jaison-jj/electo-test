import { useMutation } from '@tanstack/react-query';
import Image from 'next/image';
import React, { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import Modal from '@/components/utils/Modal';
import OTP from '@/components/utils/OTP';
import PhoneInputWithCountrySelect from '@/components/utils/PhoneInputWithCountrySelect';

import PhoneOtpIcon from '@/../public/images/auth/phoneOtpIcon.png';
import { verifyOtp } from '@/apis/auth';
import { changePhone } from '@/apis/user';

interface UpdatePhoneNumberModalProps {
  isOpen: boolean;
  setIsOpen: any;
  userId: string;
  refetchProfile: () => void;
}

const UpdatePhoneNumberModal = (props: UpdatePhoneNumberModalProps) => {
  const { isOpen, setIsOpen, userId, refetchProfile } = props;

  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [field, setField] = useState('phone');
  const [hasOtherFormErrors, setHasOtherFormErrors] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationFn: async (payload: any) => changePhone(payload),
    onSuccess: (res: any) => {
      toast(res.message, {
        description: '',
        duration: 3000,
        action: {
          label: 'Close',
          onClick: () => null,
        },
      });
      setField('otp');
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

  const onSubmitPhoneNumber = () => {
    const reqData = {
      userId: userId,
      phoneNumber: phone.replace('+', ''),
    };
    mutate(reqData);
  };

  const { mutate: mutateOtp, isPending: isPendingOtp } = useMutation({
    mutationFn: async (payload: any) => verifyOtp(payload),
    onSuccess: (res: any) => {
      toast(res.message, {
        description: '',
        action: {
          label: 'Close',
          onClick: () => null,
        },
      });
      setIsOpen(false);
      refetchProfile();
    },
    onError(err: any) {
      toast('Error!', {
        description: err.response.data.message,
        duration: 3000,
        action: {
          label: 'Close',
          onClick: () => null,
        },
      });
    },
  });

  const onCompleteOtp = () => {
    const reqData = {
      otp: otp,
      type: 'phone',
      emailOrPhoneNumber: phone.replace('+', ''),
    };
    mutateOtp(reqData);
  };

  return (
    <Modal
      isOpen={isOpen}
      preventOutsideClick
      setIsOpen={setIsOpen}
      renderContent={
        <div className='flex flex-col   items-center gap-4 font-poppins'>
          <Image
            src={PhoneOtpIcon}
            alt='otp'
            width={76}
            height={94}
            className=''
          />
          <h3 className='font-semibold text-base'>Change Phone Number</h3>
          <p className='text-muted-foreground text-center text-sm'>
            Please enter your new phone number to get the OTP for the
            verification of the phone number.
          </p>

          {field === 'phone' && (
            <PhoneInputWithCountrySelect
              className='rounded-lg'
              value={phone}
              onChange={setPhone}
              setHasOtherFormErrors={setHasOtherFormErrors}
              showError={false}
            />
          )}

          {field === 'otp' && (
            <div>
              <p className='text-center text-muted-foreground mb-3'>OTP</p>
              <OTP value={otp} onChange={setOtp} onComplete={onCompleteOtp} />
            </div>
          )}

          <div className='w-full flex gap-2'>
            <Button
              className='w-full rounded-full mt-2'
              type='button'
              disabled={
                isPending ||
                isPendingOtp ||
                (field === 'phone' && !phone) ||
                hasOtherFormErrors
              }
              onClick={onSubmitPhoneNumber}
              text='Submit'
              loading={isPending || isPendingOtp}
            />
            <Button
              className='w-full rounded-full mt-2'
              variant='outline'
              type='button'
              text='Cancel'
              onClick={() => setIsOpen(false)}
            />
          </div>
        </div>
      }
    />
  );
};

export default UpdatePhoneNumberModal;
