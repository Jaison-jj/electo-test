'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { ArrowLeft, Loader2 } from 'lucide-react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useRouter as useNpRouter } from 'next-nprogress-bar';
import React from 'react';
import { useEffect, useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { Controller, useForm } from 'react-hook-form';
import { useRecoilState } from 'recoil';
import { toast } from 'sonner';
import * as Yup from 'yup';

import {
  firebaseAnalytics,
  formatDateAPIpayload,
  sysPhone,
} from '@/lib/helper';

import { Button } from '@/components/ui/button';

import { authState } from '@/store/auth.atom';

import PhoneOtpIcon from '@/../public/images/auth/phoneOtpIcon.png';
import { resendOtp, signUp, verifyOtp } from '@/apis/auth';
import { changeEmail, changePhone, updateProfile } from '@/apis/user';

const Modal = dynamic(() => import('@/components/utils/Modal'), {
  ssr: false,
});
import Link from 'next/link';

import { cn } from '@/lib/utils';

import PhoneInput from '@/components/ui/PhoneInput';
import TextInput from '@/components/ui/TextInput';
import OTP from '@/components/utils/OTP';
import SelectWithDropdown from '@/components/utils/SelectWithDropdown';

const schema = Yup.object().shape({
  maritalStatus: Yup.string().required('Required Field!'),
  children: Yup.number()
    .transform((value, originalValue) => {
      if (originalValue === '' || isNaN(originalValue)) {
        return null;
      }
      return value;
    })
    .nullable()
    .min(0, 'Must be zero or greater.')
    .required('Required field'),
  employmentStatus: Yup.string().required('Required Field!'),
  educationLevel: Yup.string().required('Required Field!'),
  jobIndustry: Yup.string().required('Required Field!'),
  race: Yup.string().required('Required Field!'),
  veteran: Yup.string().required('Required Field!'),
  politicalViews: Yup.string().required('Required Field!'),
  otp: Yup.string(),
});

export default function AboutYou() {
  const router = useNpRouter();

  // eslint-disable-next-line unused-imports/no-unused-vars
  const [authStateValue, setAuthStateValue] = useRecoilState(authState);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      maritalStatus: authStateValue.maritalStatus || '',
      children: 0,
      employmentStatus: authStateValue.employmentStatus || '',
      educationLevel: authStateValue.levelOfEducation || '',
      jobIndustry: authStateValue.jobIndustry || '',
      race: authStateValue.race || '',
      veteran: authStateValue.veteran || '',
      politicalViews: authStateValue.politicalViews || '',
    },
  });

  const [isOpen, setIsOpen] = useState(false);
  const [verifyMode, setVerifyMode] = useState('phone');
  const [editMode, setEditMode] = useState(false);
  const [editValue, setEditValue] = useState('');
  const [otp, setOtp] = useState('');
  const [userId, setUserId] = useState<string>('');
  const [recaptcha, setRecaptcha] = useState<string | null | undefined>('');
  const [hydrated, setHydrated] = useState(false);

  const onInputChangeEditVerifyMethod = (e: any) => {
    if (verifyMode === 'phone') {
      return setEditValue(e);
    }
    setEditValue(e.target.value);
  };

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: any) => signUp(data),
    onSuccess: (res: any) => {
      setUserId(res.userId);
      setIsOpen(true);
    },
    onError(err: any) {
      toast(err.response.data.message || err.response.data.errors, {
        description: '',
        duration: 3000,
        action: {
          label: 'Close',
          onClick: () => null,
        },
      });
    },
  });

  const { mutate: mutateUpdateProfile } = useMutation({
    mutationFn: async (data: any) => updateProfile(data),
    onSuccess: (res: any) => {
      setUserId(res.userId);
      router.push('/interests');
    },
    onError(err: any) {
      toast(err.response.data.message || err.response.data.errors, {
        description: '',
        duration: 3000,
        action: {
          label: 'Close',
          onClick: () => null,
        },
      });
    },
  });

  const onSubmitLogin = (data: any) => {
    const formData: any = new FormData();
    formData.append('firstName', authStateValue.firstName);
    formData.append('lastName', authStateValue.lastName);
    formData.append('userName', authStateValue.username);
    formData.append('email', authStateValue.email);
    formData.append('phoneNumber', authStateValue?.phone?.replace('+', ''));

    formData.append(
      'dateOfBirth',
      formatDateAPIpayload(authStateValue.dob || null),
    );
    formData.append('gender', authStateValue.gender);
    formData.append('password', authStateValue.password);
    formData.append('confirmPassword', authStateValue.confirmPassword);
    formData.append('zip', authStateValue.zipCode);
    formData.append('isRegisteredVoter', authStateValue.isRegisteredVoter);
    formData.append('streetAddress', authStateValue.streetAddress);
    formData.append('apartment', authStateValue.apartment || null);
    formData.append('streetName', authStateValue.streetName);
    formData.append('streetNumber', authStateValue.streetNumber);
    formData.append('city', authStateValue.city);
    formData.append('state', authStateValue.state);
    formData.append('latitude', authStateValue.latitude);
    formData.append('longitude', authStateValue.longitude);
    //
    data.maritalStatus && formData.append('maritalStatus', data.maritalStatus);
    formData.append('children', data.children);
    data.employmentStatus &&
      formData.append('employmentStatus', data.employmentStatus);
    data.educationLevel &&
      formData.append('levelOfEducation', data.educationLevel);
    data.jobIndustry && formData.append('jobIndustry', data.jobIndustry);
    data.race && formData.append('race', data.race);
    data.politicalViews &&
      formData.append('politicalViews', data.politicalViews);
    formData.append('veteran', data.veteran === 'Yes' ? true : false);

    if (authStateValue.image) {
      formData.append('image', authStateValue.image);
    }

    setAuthStateValue((prev) => ({
      ...prev,
      maritalStatus: data.maritalStatus || '',
      children: data.children,
      employmentStatus: data.employmentStatus || '',
      levelOfEducation: data.educationLevel || '',
      jobIndustry: data.jobIndustry || '',
      race: data.race || '',
      veteran: data.veteran || '',
      politicalViews: data.politicalViews || '',
    }));

    if (authStateValue.socialSignOnMode?.length) {
      const reqData = {
        maritalStatus: data.maritalStatus,
        children: data.children,
        employmentStatus: data.employmentStatus,
        levelOfEducation: data.educationLevel,
        jobIndustry: data.jobIndustry,
        race: data.race,
        politicalViews: data.politicalViews,
        veteran: data.veteran === 'Yes' ? true : false,

        streetAddress: authStateValue.streetAddress,
        apartment: authStateValue.apartment,
        streetName: authStateValue.streetName,
        streetNumber: authStateValue.streetNumber,
        city: authStateValue.city,
        state: authStateValue.state,
        latitude: authStateValue.latitude.toString(),
        longitude: authStateValue.longitude.toString(),
      };
      setVerifyMode('email');
      mutateUpdateProfile(reqData);
      return;
    }

    mutate(formData);
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
      setAuthStateValue((prev) => ({
        ...prev,
        id: res.user.id,
        isNewUser: true,
      }));
      if (authStateValue.verification === 'not-verified') {
        setAuthStateValue({
          id: res.user.id,
          firstName: '',
          lastName: '',
          username: '',
          dob: null as any,
          gender: '',
          phone: '',
          email: '',
          password: '',
          confirmPassword: '',
          zipCode: '',
          isRegisteredVoter: false,
          isPrivacyPolicyRead: false,
          image: null,
          maritalStatus: '',
          children: 0,
          employmentStatus: '',
          levelOfEducation: '',
          jobIndustry: '',
          race: '',
          veteran: '',
          politicalViews: '',
          interests: [],
          verification: '',
          ...authStateValue,
        });
      }
      setIsOpen(false);
      router.push('/interests');
      //signUp analytics
      firebaseAnalytics('sign_up', {
        method: 'email',
      });
    },
    onError(err: any) {
      toast('Error!', {
        description: err.response.data.message,
        duration: 3000,
        classNames: { content: '', description: '' },
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
      type: verifyMode,
      emailOrPhoneNumber:
        verifyMode === 'phone'
          ? authStateValue.phone.replace(/^\+\d+\s|\D/g, '')
          : authStateValue.email,
    };
    mutateOtp(reqData);
  };

  const { mutate: mutateOtpVerifyMethod, isPending: isPendingOtpVerifyMethod } =
    useMutation({
      mutationFn: async (payload: any) =>
        verifyMode === 'phone' ? changePhone(payload) : changeEmail(payload),
      onSuccess: (res: any) => {
        setAuthStateValue((prev) => ({
          ...prev,
          phone: editValue,
          email: res.email ? res.email : authStateValue.email,
        }));
        toast('Change OTP verification method', {
          description: res.message,
          duration: 3000,
          action: {
            label: 'Close',
            onClick: () => null,
          },
        });
        setEditMode(false);
        setEditValue('');
      },
      onError(err: any) {
        toast(err.response.data.message || err.response.data.errors, {
          description: '',
          duration: 3000,
          action: {
            label: 'Close',
            onClick: () => null,
          },
        });
      },
    });

  const onClickConfirmEdit = () => {
    const reqData: any = {
      userId: userId,
    };
    if (verifyMode === 'phone') {
      reqData.phoneNumber = editValue.replace(/^\+\d+\s|\D/g, '');
    } else {
      reqData.email = editValue;
    }
    mutateOtpVerifyMethod(reqData);
  };

  const { mutate: mutateVerifyVia, isPending: isPendingVerifyViaEmail } =
    useMutation({
      mutationFn: async (payload: any) => resendOtp(payload),
      onSuccess: (res: any) => {
        toast('Change OTP verification method', {
          description: res.message,
          duration: 3000,
          action: {
            label: 'Close',
            onClick: () => null,
          },
        });

        if (verifyMode === 'phone') {
          setVerifyMode('email');
        } else {
          setVerifyMode('phone');
        }
        setEditMode(false);
      },
      onError(err: any) {
        toast(err.response.data.message || err.response.data.errors, {
          description: '',
          duration: 3000,
          action: {
            label: 'Close',
            onClick: () => null,
          },
        });
      },
    });

  const onClickVerifyViaEmail = () => {
    const reqData = {
      type: 'email',
      emailOrPhoneNumber: authStateValue.email,
    };
    mutateVerifyVia(reqData);
  };

  const onClickVerifyViaPhone = () => {
    const reqData = {
      type: 'phone',
      emailOrPhoneNumber: authStateValue.phone.replace(/^\+\d+\s|\D/g, ''),
    };
    mutateVerifyVia(reqData);
  };

  const { mutate: mutateSendOtpAgain, isPending: isPendingSendOtpAgain } =
    useMutation({
      mutationFn: async (payload: any) => resendOtp(payload),
      onSuccess: (res: any) => {
        toast(res.message, {
          description: '',
          duration: 3000,
          action: {
            label: 'Close',
            onClick: () => null,
          },
        });
      },
      onError(err: any) {
        toast(err.response.data.message || err.response.data.errors, {
          description: '',
          duration: 3000,
          action: {
            label: 'Close',
            onClick: () => null,
          },
        });
      },
    });

  const sendOtpAgain = React.useCallback(() => {
    const reqData: any = {
      type: verifyMode,
      emailOrPhoneNumber:
        verifyMode === 'phone'
          ? authStateValue?.phone?.replace(/^\+\d+\s|\D/g, '')
          : authStateValue.email,
    };
    mutateSendOtpAgain(reqData);
  }, [
    authStateValue.email,
    authStateValue?.phone,
    mutateSendOtpAgain,
    verifyMode,
  ]);

  const onChangeRecaptcha = (data: string | null | undefined) => {
    setRecaptcha(data);
  };

  const onClickGoBack = () => {
    if (!authStateValue.isSocialAuth) {
      router.back();
      return;
    }

    setAuthStateValue((prev) => ({
      ...prev,
      isSocialAuth: false, //this might cause some issue with social sign in
      phone: '',
      email: '',
    }));
    Cookies.remove('electo_u_tok');
  };

  useEffect(() => {
    if (
      authStateValue.verification === 'not-verified' &&
      !authStateValue.isSocialAuth &&
      (authStateValue?.phone?.length || authStateValue?.email?.length)
    ) {
      sendOtpAgain();
      setIsOpen(true);
    }
  }, [
    authStateValue?.email,
    authStateValue.isSocialAuth,
    authStateValue?.phone,
    authStateValue.verification,
    sendOtpAgain,
  ]);

  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) return null;

  return (
    <div className='m-auto md:m-0 py-[40px] md:pt-[60px] md:pl-[81px] max-w-[440px] px-10 md:px-0'>
      <ArrowLeft
        className='h-6 w-6  rounded-full box-content mb-6'
        role='button'
        onClick={onClickGoBack}
      />
      <h1
        className={cn('text-2xl font-semibold', {
          hidden: authStateValue.verification === 'not-verified',
        })}
      >
        Create Account
      </h1>
      <hr className='h-[2px] my-4 bg-gray-100 border-0 rounded dark:bg-gray-700 mb-8' />
      <form
        onSubmit={handleSubmit(onSubmitLogin)}
        className={cn('flex w-full flex-col gap-3', {
          hidden: authStateValue.verification === 'not-verified',
        })}
      >
        <h1 className='text-md font-normal my-2'>About you</h1>

        <div className='flex gap-2 flex-col md:flex-row'>
          <Controller
            control={control}
            name='maritalStatus'
            render={({ field }) => (
              <div className='flex flex-col gap-1'>
                <SelectWithDropdown
                  requiredField
                  value={field.value}
                  onChange={field.onChange}
                  className='min-w-[169px]'
                  inputLabel='Marital Status'
                  listClassName='top-[72px]'
                  options={[
                    { value: 'single', label: 'Single' },
                    { value: 'married', label: 'Married' },
                    { value: 'divorced', label: 'Divorced' },
                    { value: 'widowed', label: 'Widowed' },
                    { value: 'separated', label: 'Separated' },
                  ]}
                />
                {errors.maritalStatus && (
                  <p className='text-red-600 text-xs'>
                    {errors.maritalStatus.message}
                  </p>
                )}
              </div>
            )}
          />

          <Controller
            control={control}
            name='children'
            render={({ field }) => (
              <TextInput
                placeholder=''
                className='rounded-xl'
                type='number'
                label='Children'
                min={0}
                error={errors.children?.message}
                {...field}
              />
            )}
          />
        </div>

        <Controller
          control={control}
          name='employmentStatus'
          render={({ field }) => (
            <div className='flex flex-col gap-1'>
              <SelectWithDropdown
                requiredField
                value={field.value}
                onChange={field.onChange}
                className='min-w-[169px]'
                inputLabel='Employment Status'
                listClassName='top-[72px]'
                options={[
                  { value: 'employed', label: 'Employed' },
                  { value: 'unemployed', label: 'Unemployed' },
                  { value: 'selfEmployed', label: 'Self-employed' },
                  { value: 'student', label: 'Student' },
                  { value: 'retired', label: 'Retired' },
                ]}
              />
              {errors.employmentStatus && (
                <p className='text-red-600 text-xs'>
                  {errors.employmentStatus.message}
                </p>
              )}
            </div>
          )}
        />

        <Controller
          control={control}
          name='educationLevel'
          render={({ field }) => (
            <div className='flex flex-col gap-1'>
              <SelectWithDropdown
                requiredField
                value={field.value}
                onChange={field.onChange}
                className='min-w-[169px]'
                inputLabel='Level of Education'
                listClassName='top-[72px]'
                options={[
                  { value: 'highSchool', label: 'High School' },
                  { value: 'tradeSchool', label: 'Trade School' },
                  { value: 'college', label: 'College' },
                  { value: 'graduate', label: 'Graduate' },
                  { value: 'other', label: 'Other' },
                ]}
              />
              {errors.educationLevel && (
                <p className='text-red-600 text-xs'>
                  {errors.educationLevel.message}
                </p>
              )}
            </div>
          )}
        />

        <Controller
          control={control}
          name='jobIndustry'
          render={({ field }) => (
            <div className='flex flex-col gap-1'>
              <SelectWithDropdown
                requiredField
                value={field.value}
                onChange={field.onChange}
                className='min-w-[169px]'
                inputLabel='Job Industry'
                listClassName='top-[72px]'
                options={[
                  {
                    value: 'informationTechnology',
                    label: 'Information Technology',
                  },
                  { value: 'finance', label: 'Finance' },
                  { value: 'manufacturing', label: 'Manufacturing' },
                  { value: 'retail', label: 'Retail' },
                  { value: 'hospitality', label: 'Hospitality' },
                  { value: 'marketing', label: 'Marketing' },
                  { value: 'government', label: 'Government' },
                  { value: 'construction', label: 'Construction' },
                  {
                    value: 'media/Entertainment',
                    label: 'Media/Entertainment',
                  },
                  { value: 'nonprofit', label: 'Non-profit' },
                  { value: 'other', label: 'Other' },
                ]}
              />
              {errors.jobIndustry && (
                <p className='text-red-600 text-xs'>
                  {errors.jobIndustry.message}
                </p>
              )}
            </div>
          )}
        />

        <Controller
          control={control}
          name='race'
          render={({ field }) => (
            <div className='flex flex-col gap-1'>
              <SelectWithDropdown
                requiredField
                value={field.value}
                onChange={field.onChange}
                className='min-w-[169px]'
                inputLabel='Race'
                listClassName='top-[72px]'
                options={[
                  { value: 'white', label: 'White' },
                  { value: 'black', label: 'Black' },
                  { value: 'asian', label: 'Asian' },
                  { value: 'hispanicAsian', label: 'Hispanic Asian' },
                  { value: 'mena', label: 'MENA' },
                ]}
              />
              {errors.race && (
                <p className='text-red-600 text-xs'>{errors.race.message}</p>
              )}
            </div>
          )}
        />

        <Controller
          control={control}
          name='veteran'
          render={({ field }) => (
            <div className='flex flex-col gap-1'>
              <SelectWithDropdown
                requiredField
                value={field.value}
                onChange={field.onChange}
                className='min-w-[169px]'
                inputLabel='Veteran'
                listClassName='top-[72px]'
                options={[
                  { value: 'Yes', label: 'Yes' },
                  { value: 'No', label: 'No' },
                ]}
              />
              {errors.veteran && (
                <p className='text-red-600 text-xs'>{errors.veteran.message}</p>
              )}
            </div>
          )}
        />

        <Controller
          control={control}
          name='politicalViews'
          render={({ field }) => (
            <div className='flex flex-col gap-1'>
              <SelectWithDropdown
                requiredField
                value={field.value}
                onChange={field.onChange}
                className='min-w-[169px]'
                inputLabel='Political Views'
                listClassName='top-[72px]'
                options={[
                  { value: 'democrat', label: 'Democrat' },
                  { value: 'republican', label: 'Republican' },
                  { value: 'independent', label: 'Independent' },
                  { value: 'other', label: 'Other' },
                ]}
              />
              {errors.politicalViews && (
                <p className='text-red-600 text-xs'>
                  {errors.politicalViews.message}
                </p>
              )}
            </div>
          )}
        />
        <p className='text-black text-xs'>
          Providing this information will enhance your experience.
        </p>
        <Button
          className='w-full rounded-full mt-2'
          type='submit'
          disabled={isPending}
          text='Continue'
          loading={isPending}
        />
      </form>

      {/* OTP verification Modal */}
      <Modal
        setIsOpen={setIsOpen}
        isOpen={isOpen}
        preventOutsideClick
        contentClassName={
          authStateValue.verification === 'not-verified' ? 'hideCloseIcon' : ''
        }
        renderContent={
          <div className='flex flex-col justify-center items-center gap-3 p-4 pointer-events-auto'>
            <Image
              src={PhoneOtpIcon}
              alt='otp'
              width={76}
              height={94}
              className=''
            />
            <h3>Verify Your Account</h3>
            <p className='text-muted-foreground'>
              {`We have sent you a one time password to your ${verifyMode === 'phone' ? 'phone' : 'email'}.`}
            </p>
            <p>
              {verifyMode === 'phone'
                ? `${sysPhone(authStateValue.phone)}`
                : authStateValue.email}
              <span
                className='underline cursor-pointer pl-2'
                onClick={() => setEditMode(true)}
              >
                Edit
              </span>
            </p>

            {editMode && (
              <div className='flex gap-2 items-center'>
                {verifyMode === 'phone' ? (
                  <PhoneInput
                    placeholder='Phone'
                    className='rounded-xl'
                    type='text'
                    value={editValue}
                    onChange={onInputChangeEditVerifyMethod as any}
                  />
                ) : (
                  verifyMode === 'email' && (
                    <TextInput
                      placeholder='Email'
                      className='rounded-xl'
                      type='email'
                      value={editValue}
                      onChange={onInputChangeEditVerifyMethod as any}
                    />
                  )
                )}
                <Button
                  className='w-1/5 rounded-md p-1 text-xs h-8'
                  type='button'
                  disabled={
                    verifyMode === 'email'
                      ? !editValue || isPendingOtpVerifyMethod
                      : isPendingOtpVerifyMethod
                  }
                  text='Confirm'
                  loading={false}
                  onClick={onClickConfirmEdit}
                />
                <Button
                  className=' rounded-md px-2 text-xs h-8'
                  type='button'
                  variant='outline'
                  text='X'
                  onClick={() => setEditMode(false)}
                />
              </div>
            )}

            {!editMode && (
              <>
                <OTP value={otp} onChange={setOtp} />
                <p className='text-red-600 text-xs'>{errors?.otp?.message}</p>
              </>
            )}
            <div className='flex gap-1 items-center'>
              <p className='text-muted-foreground'>Didn't receive code ?</p>

              <div className='flex gap-2 items-center h-8'>
                <button
                  className='underline cursor-pointer'
                  onClick={sendOtpAgain}
                >
                  {`Resend (${verifyMode})`}
                </button>
                {isPendingSendOtpAgain && (
                  <Loader2 className='animate-spin h-4 w-4' />
                )}
              </div>
            </div>

            {/* CAPTCHA - https://clerk.com/blog/implementing-recaptcha-in-react*/}
            <ReCAPTCHA
              sitekey={process.env.RECAPTCHA_SITE_KEY as any}
              onChange={onChangeRecaptcha}
            />

            {!authStateValue?.socialSignOnMode?.length && (
              <div className='flex gap-2 items-center h-8'>
                <button
                  className='underline cursor-pointer'
                  onClick={
                    verifyMode === 'phone'
                      ? onClickVerifyViaEmail
                      : onClickVerifyViaPhone
                  }
                >
                  {verifyMode === 'phone'
                    ? 'Verify via Email'
                    : 'Verify via Phone'}
                </button>
                {isPendingVerifyViaEmail && (
                  <Loader2 className='animate-spin h-4 w-4' />
                )}
              </div>
            )}
            <Button
              className='w-full rounded-full mt-2'
              type='button'
              disabled={otp.length !== 6 || isPendingOtp || !recaptcha}
              text='Verify'
              loading={isPendingOtp}
              onClick={onCompleteOtp}
            />
          </div>
        }
      />
      <p className={cn('text-muted-foreground font-normal text-sm  mt-4', {})}>
        Already have an account?{' '}
        <Link href='/sign-in' className='text-black underline' prefetch>
          <strong>Sign in</strong>
        </Link>
      </p>
    </div>
  );
}
