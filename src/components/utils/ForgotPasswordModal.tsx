import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from '@tanstack/react-query';
import { X } from 'lucide-react';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as Yup from 'yup';

import { Button } from '@/components/ui/button';
import PasswordInput from '@/components/ui/PasswordInput';
import Modal from '@/components/utils/Modal';

import PasswordWarning from '@/../public/svg/auth/password-warning.svg';
import { updatePassword } from '@/apis/user';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  setIsOpen: any;
}

type changePasswordForm = {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
};

const schema = Yup.object().shape({
  currentPassword: Yup.string().required('Old Password is required!'),
  newPassword: Yup.string()
    .required('New Password is required!')
    .min(8, 'Password must be at least 8 character long')
    .matches(
      RegExp('(.*[a-z].*)'),
      'Password should contain at least one lowercase character.',
    )
    .matches(
      RegExp('(.*[A-Z].*)'),
      'Password should contain at least one uppercase character.',
    )
    .matches(
      RegExp('(.*\\d.*)'),
      'Password should contain at least one number.',
    )
    .matches(
      RegExp('[!@#$%^&*(),.?":{}|<>]'),
      'Password should contain at least one special character.',
    ),
  confirmNewPassword: Yup.string()
    .required('Confirm password is required!')
    .test('passwords-match', 'Passwords do not match', function (value) {
      return this.parent.newPassword === value;
    }),
});

const ForgotPasswordModal = (props: ForgotPasswordModalProps) => {
  const { isOpen, setIsOpen } = props;

  const {
    control,
    // setError,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver<changePasswordForm>(schema),
    defaultValues: {},
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (payload: any) => updatePassword(payload),
    onSuccess: (res: any) => {
      toast.success(res?.message);
      setIsOpen(false);
    },
    onError(err: any) {
      toast.error(err.response.data.message, {
        duration: 1500,
      });
    },
  });

  const onSubmitChangePassword = (data: any) => {
    mutate({
      oldPassword: data.currentPassword,
      password: data.newPassword,
      confirmPassword: data.confirmNewPassword,
    });
  };

  const onClose = () => {
    setIsOpen(false);
    reset({});
  };

  return (
    <Modal
      contentClassName='p-0 pb-4 max-w-[446px] forgotPasswordClose border-0 !rounded-t-2xl'
      isOpen={isOpen}
      preventOutsideClick
      setIsOpen={setIsOpen}
      renderContent={
        <div className='font-poppins '>
          <div className='w-full bg-[#63667b] rounded-t-xl p-4 flex justify-between'>
            <p className='text-white'>Change password</p>
            <X className='h-6 w-6 text-white' role='button' onClick={onClose} />
          </div>
          <PasswordWarning className='w-20 h-20 m-auto my-10' />
          <form
            onSubmit={handleSubmit(onSubmitChangePassword as any)}
            className='flex w-full flex-col gap-3 px-4'
          >
            <Controller
              control={control}
              name='currentPassword'
              render={({ field }) => (
                <PasswordInput
                  requiredField
                  className='rounded-xl'
                  label='Old Password'
                  error={errors.currentPassword?.message}
                  {...field}
                />
              )}
            />
            <Controller
              control={control}
              name='newPassword'
              render={({ field }) => (
                <PasswordInput
                  requiredField
                  className='rounded-xl'
                  label='New Password'
                  error={errors.newPassword?.message}
                  {...field}
                />
              )}
            />
            <Controller
              control={control}
              name='confirmNewPassword'
              render={({ field }) => (
                <PasswordInput
                  requiredField
                  className='rounded-xl'
                  label='Confirm New Password'
                  error={errors.confirmNewPassword?.message}
                  {...field}
                />
              )}
            />
            <Button
              className='w-full rounded-full mt-2'
              type='submit'
              disabled={isPending}
              text='Update'
              loading={isPending}
            />
          </form>
        </div>
      }
    />
  );
};

export default ForgotPasswordModal;
