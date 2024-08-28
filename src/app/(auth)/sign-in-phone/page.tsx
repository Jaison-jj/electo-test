'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as Yup from 'yup';

import { firebaseAnalytics } from '@/lib/helper';

import { Button } from '@/components/ui/button';
import PhoneInputWithCountrySelect from '@/components/utils/PhoneInputWithCountrySelect';

import PhoneOtpIcon from '@/../public/images/auth/phoneOtpIcon.png';
import { resendOtp, signInPhone, verifyOtp } from '@/apis/auth';

const Modal = dynamic(() => import('@/components/utils/Modal'), {
  ssr: true,
});
// const PhoneInput = dynamic(() => import('@/components/ui/PhoneInput'));
const OTP = dynamic(() => import('@/components/utils/OTP'));

type PhoneSignForm = {
  phone: string;
};

const schema = Yup.object().shape({
  phone: Yup.string().required('Phone is required!'),
  otp: Yup.string(),
});

export default function SignIn() {
  const router = useRouter();

  const [isOpen, setIsOpen] = React.useState(false);
  const [otp, setOtp] = React.useState('');
  const [hasOtherFormErrors, setHasOtherFormErrors] = React.useState(false);
  const [showResendBtn, setShowResendButton] = React.useState(false);

  const {
    control,
    handleSubmit,
    getValues,
    setError,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      phone: '',
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (payload: { phoneNumber: string }) =>
      signInPhone(payload),
    onSuccess: (_res: any) => {
      setShowResendButton(true);
      setIsOpen(true);
    },
    onError(err: any) {
      setError('phone', {
        type: 'custom',
        message: err?.response?.data?.message,
      });
    },
  });

  const { mutate: mutateResendOtp, isPending: isPendingMutateOtp } =
    useMutation({
      mutationFn: async (payload: { phoneNumber: string }) =>
        resendOtp(payload),
      onSuccess: (res: any) => {
        toast(res.message, {
          description: '',
          action: {
            label: 'Close',
            onClick: () => null,
          },
        });
      },
      onError(err: any) {
        setError('phone', {
          type: 'custom',
          message: err?.response?.data?.message,
        });
      },
    });

  const onClickResendOtp = () => {
    const reqData: any = {
      type: 'phone',
      emailOrPhoneNumber: getValues('phone').replace(/^\+\d+\s|\D/g, ''),
    };
    mutateResendOtp(reqData);
  };

  const onSubmitLogin = (data: PhoneSignForm) => {
    if (hasOtherFormErrors) return;

    const reqData = {
      phoneNumber: data.phone.replace(/^\+\d+\s|\D/g, ''),
    };
    mutate(reqData);
  };

  const { mutate: mutateOtp, isPending: isPendingOtp } = useMutation({
    mutationFn: async (payload: { otp: any }) => verifyOtp(payload),
    onSuccess: (res: any) => {
      toast(res.message, {
        description: '',
        action: {
          label: 'Close',
          onClick: () => null,
        },
      });
      setIsOpen(false);
      router.push('/bills');
      firebaseAnalytics('login', {
        method: 'phone',
        success: true,
      });
    },
    onError(err: any) {
      setError('otp', { type: 'custom', message: err.response.data.message });
      setShowResendButton(true);
      firebaseAnalytics('login', {
        method: 'phone',
        success: false,
      });
    },
  });

  const onCompleteOtp = () => {
    const reqData = {
      otp: otp,
      type: 'phone',
      emailOrPhoneNumber: getValues('phone').replace(/^\+\d+\s|\D/g, ''),
    };
    mutateOtp(reqData);
  };

  return (
    <div className='m-auto h-screen md:m-0 pt-[55px] md:pt-[109px] md:pl-[81px] max-w-[440px] px-10 md:px-0'>
      <ArrowLeft
        className='h-6 w-6'
        role='button'
        onClick={() => router.back()}
      />
      <form
        onSubmit={handleSubmit(onSubmitLogin)}
        className='flex w-full flex-col gap-1 mt-20 md:mt-48'
      >
        <h1 className='text-2xl font-semibold pb-[40px] md:pb-[78px]'>
          Sign in
        </h1>
        <div className='h-[85px]'>
          <Controller
            control={control}
            name='phone'
            render={({ field }) => (
              // <PhoneInput
              //   placeholder=''
              //   className='rounded-xl'
              //   type='text'
              //   label='Phone'
              //   error={errors.phone?.message}
              //   {...field}
              // />
              <>
                <PhoneInputWithCountrySelect
                  setHasOtherFormErrors={setHasOtherFormErrors}
                  className='rounded-xl'
                  showError={false}
                  {...field}
                />
                <p className='text-xs text-red-500 py-1'>
                  {errors.phone?.message}
                </p>
              </>
            )}
          />
        </div>

        <Button
          className='w-full rounded-full mt-2'
          type='submit'
          disabled={
            isPending || hasOtherFormErrors || !getValues('phone')?.length
          }
          loading={isPending}
          text='Get OTP'
        />
      </form>

      <Modal
        renderContent={
          <div className='flex flex-col justify-center items-center gap-5 p-4'>
            <Image
              src={PhoneOtpIcon}
              alt='otp'
              width={76}
              height={94}
              className=''
            />
            <h3>Verify Your Phone</h3>
            <p className='text-muted-foreground'>
              You will get an OTP via SMS on{' '}
              <span className='text-black'>{getValues('phone')}</span>
            </p>

            <OTP value={otp} onChange={setOtp} onComplete={onCompleteOtp} />
            <p className='text-red-600 text-xs'>{errors?.otp?.message}</p>

            <div className='flex flex-col gap-2 w-full'>
              <Button
                className='rounded-full mt-2 w-full'
                type='button'
                onClick={onCompleteOtp}
                disabled={isPendingOtp || !otp}
                text='Verify'
                loading={isPendingOtp}
              />
              {showResendBtn && (
                <Button
                  className='rounded-full mt-2 w-full'
                  type='button'
                  variant='outline'
                  onClick={onClickResendOtp}
                  disabled={false}
                  text='Resend OTP'
                  loading={isPendingMutateOtp}
                >
                  Resend OTP
                </Button>
              )}
            </div>
          </div>
        }
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />
    </div>
  );
}
