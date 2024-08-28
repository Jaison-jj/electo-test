import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from '@tanstack/react-query';
import Image from 'next/image';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as Yup from 'yup';

import { Button } from '@/components/ui/button';
import TextInput from '@/components/ui/TextInput';
import Modal from '@/components/utils/Modal';
import OTP from '@/components/utils/OTP';

import PhoneOtpIcon from '@/../public/images/auth/phoneOtpIcon.png';
import { verifyOtp } from '@/apis/auth';
import { changeEmail } from '@/apis/user';

interface UpdateEmailModalProps {
  isOpen: boolean;
  setIsOpen: any;
  userId: string;
  refetchProfile: () => void;
}

const schema = Yup.object().shape({
  email: Yup.string()
    .required('Email is required!')
    .matches(/^((\S+)@(\S+)\.(\S+))$/, {
      message: 'Please enter a valid email address.',
      excludeEmptyString: false,
    }),
});

const UpdateEmailModal = (props: UpdateEmailModalProps) => {
  const { isOpen, setIsOpen, userId, refetchProfile } = props;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: '',
    },
  });

  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [field, setField] = useState('email');

  const { mutate, isPending } = useMutation({
    mutationFn: async (payload: any) => changeEmail(payload),
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

  const onSubmitEmail = () => {
    const reqData = {
      userId: userId,
      email: email,
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
      type: 'email',
      emailOrPhoneNumber: email,
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
          <h3 className='font-semibold text-base'>Change Email</h3>
          <p className='text-muted-foreground text-center text-sm'>
            Please enter your new email address below. An OTP (One-Time
            Password) will be sent to this email for the purpose of
            verification.
          </p>

          <form
            onSubmit={handleSubmit(onSubmitEmail)}
            className='w-full flex flex-col gap-3 items-center'
          >
            {field === 'email' && (
              <TextInput
                {...register('email')}
                value={email}
                onChange={(value) => setEmail(value.target.value)}
                error={errors.email?.message}
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
                type='submit'
                disabled={isPending || isPendingOtp}
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
          </form>
        </div>
      }
    />
  );
};

export default UpdateEmailModal;
