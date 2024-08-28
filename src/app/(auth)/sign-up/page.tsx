'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from '@tanstack/react-query';
import { sub } from 'date-fns';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter as useNpRouter } from 'next-nprogress-bar';
import * as React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useRecoilState } from 'recoil';
import { toast } from 'sonner';
import * as Yup from 'yup';

import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import CheckboxInput from '@/components/ui/CheckboxInput';
import PasswordInput from '@/components/ui/PasswordInput';
// import PhoneInput from '@/components/ui/PhoneInput';
import TextInput from '@/components/ui/TextInput';
import NewDatePicker from '@/components/utils/NewDatePicker';
import PhoneInputWithCountrySelect from '@/components/utils/PhoneInputWithCountrySelect';
import SelectWithDropdown from '@/components/utils/SelectWithDropdown';

import { authState } from '@/store/auth.atom';

import { updateProfileImage } from '@/apis/user';
import PlacesAutocompleteInput from '@/app/(auth)/places/page';

const ProfilePicUploader = dynamic(
  () => import('@/components/utils/ProfilePicUploader'),
);

export type TRegisterForm = {
  image: File | null;
  firstName: string;
  lastName: string;
  username: string;
  dob: null | Date | any;
  gender: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
  zipCode: string;
  isRegisteredVoter?: boolean;
  isPrivacyPolicyRead: undefined | boolean;

  streetAddress: string;
  apartment: string;
  city: string;
  state: string;
  streetNumber: number;
  streetName: string;
};

export default function SignUp() {
  const router = useNpRouter();

  const [authStateValue, setAuthStateValue] = useRecoilState(authState);
  const [isRegisteredVoter, setRegisteredVoter] = React.useState(
    authStateValue.isRegisteredVoter || false,
  );
  const [hasOtherFormErrors, setHasOtherFormErrors] = React.useState(false);
  const [address, setAddress] = React.useState('');

  const signUpSchema = Yup.object()
    .shape({
      image: Yup.mixed().notRequired(),

      firstName: Yup.string()
        .required('First name is required!')
        .matches(/^(?=.*[a-zA-Z0-9])[a-zA-Z0-9]*$/, {
          message:
            'First name must be a string, number, or a combination of both!',
        }),
      lastName: Yup.string()
        .required('Last name is required!')
        .matches(/^(?=.*[a-zA-Z0-9])[a-zA-Z0-9]*$/, {
          message:
            'Last name must be a string, number, or a combination of both!',
        }),
      username: authStateValue.isSocialAuth
        ? Yup.string()
        : Yup.string()
            .required('User name is required!')
            .matches(/^[^\s]+$/, { message: 'Must not contain white spaces!' }),
      dob: Yup.date().required('Date of birth is required'),
      gender: Yup.string().required('Gender is required!'),
      phone: authStateValue.isSocialAuth
        ? Yup.string()
        : Yup.string().required('Phone is required!'),
      // .matches(/^\(\d{3}\)-\d{3}-\d{4}$/, {
      //   message: 'Phone number should be 10 digits!',
      // })
      email: Yup.string()
        .required('Email is required!')
        .matches(/^((\S+)@(\S+)\.(\S+))$/, {
          message: 'Please enter a valid email address.',
          excludeEmptyString: false,
        }),
      password: authStateValue.isSocialAuth
        ? Yup.string()
        : Yup.string()
            .required('Password is required!')
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
      confirmPassword: authStateValue.isSocialAuth
        ? Yup.string()
        : Yup.string()
            .required('Confirm password is required!')
            .test(
              'passwords-match',
              'Passwords do not match',
              function (value) {
                return this.parent.password === value;
              },
            ),

      streetAddress: Yup.string().required('Street address is required!'),
      apartment: Yup.string(),
      city: Yup.string().required('City is required!'),
      state: Yup.string().required('State is required!'),

      zipCode: Yup.string()
        .matches(/^\d{5}$/, 'Invalid ZIP code format')
        .matches(/^\d+$/, 'ZIP code must contain only numbers')
        .required('ZIP code is required'),
      isPrivacyPolicyRead: Yup.boolean().oneOf(
        [true],
        'You must accept the terms and conditions',
      ),
    })
    .test(
      'both-numeric',
      'First name and last name cannot both be only numbers',
      function (value) {
        const { firstName, lastName } = value;
        const onlyNumbers = /^[0-9]+$/;
        if (onlyNumbers.test(firstName) && onlyNumbers.test(lastName)) {
          return this.createError({
            path: 'firstName',
            message: 'First name and last name cannot both be only numbers',
          });
        }
        return true;
      },
    );

  const {
    control,
    watch,
    setError,
    setValue,
    handleSubmit,
    clearErrors,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(signUpSchema),
    defaultValues: {
      image: authStateValue.image,
      firstName: authStateValue.firstName || '',
      lastName: authStateValue.lastName || '',
      username: authStateValue.username || '',
      dob: authStateValue.dob
        ? new Date(authStateValue.dob as any)
        : (null as any),
      gender: authStateValue.gender || '',
      phone: authStateValue.phone || '',
      email: authStateValue.email || '',
      password: authStateValue.password || '',
      confirmPassword: authStateValue.confirmPassword || '',
      zipCode: authStateValue.zipCode || '',
      isPrivacyPolicyRead: authStateValue.isPrivacyPolicyRead || false,

      streetAddress: authStateValue.streetAddress || '',
      apartment: authStateValue.apartment || '',
      city: authStateValue.city || '',
      state: authStateValue.state || '',
    },
  });

  const watchIsPrivacyPolicyRead = watch('isPrivacyPolicyRead');

  /**
   * Data is persisted in store and sent with api in the about-you page
   * @param data form field values and isRegisteredVoter
   */
  const onSubmitLogin = (data: TRegisterForm) => {
    if (hasOtherFormErrors) {
      setError('phone', { message: 'Invalid phone number format' });
      return;
    }

    setAuthStateValue((prev) => ({
      ...prev,
      image: data.image,
      firstName: data.firstName,
      lastName: data.lastName,
      username: data.username,
      dob: data.dob,
      gender: data.gender,
      phone: data.phone,
      email: data.email,
      password: data.password,
      confirmPassword: data.confirmPassword,
      isRegisteredVoter: isRegisteredVoter,
      isPrivacyPolicyRead: watchIsPrivacyPolicyRead,

      streetAddress: data.streetAddress,
      apartment: data.apartment,
      city: data.city,
      state: data.state,
      zipCode: data.zipCode,
    }));
    router.push('/about-you');
  };

  const dobMaxDate = sub(new Date(), {
    years: 12,
  });

  const onSelectAddress = (place: any) => {
    setValue('streetAddress', place.formatted_address);
    const city = place.address_components.find((component: any) =>
      component.types.includes('locality'),
    )?.long_name;

    const state = place.address_components.find((component: any) =>
      component.types.includes('administrative_area_level_1'),
    )?.short_name;

    const zip = place.address_components.find((component: any) =>
      component.types.includes('postal_code'),
    )?.long_name;

    const streetNumber = place.address_components.find((component: any) =>
      component.types.includes('street_number'),
    )?.long_name;

    const streetName = place.address_components.find((component: any) =>
      component.types.includes('route'),
    )?.long_name;

    if (!city) {
      setError('city', { message: 'Address do not have city!' });
    } else {
      setValue('city', city);
      clearErrors('streetAddress');
      clearErrors('city');
    }

    if (!state) {
      setError('state', { message: 'Address do not have state!' });
    } else {
      setValue('state', state);
      clearErrors('state');
    }

    if (!zip) {
      setError('zipCode', { message: 'Address do not have zip code!' });
    } else {
      setValue('zipCode', zip);
      clearErrors('zipCode');
    }

    if (streetName && streetNumber) {
      setAuthStateValue((prev) => ({
        ...prev,
        streetName,
        streetNumber,
      }));
    }

    if (place?.geometry?.location) {
      setAuthStateValue((prev) => ({
        ...prev,
        latitude: place?.geometry?.location?.lat(),
        longitude: place?.geometry?.location?.lng(),
      }));
    }
  };

  const onClickSinInPageNavigate = () => {
    setAuthStateValue({} as any);
  };

  const { mutate: mutateProfilePicUpdate } = useMutation({
    mutationFn: async (payload: any) => updateProfileImage(payload),
    onSuccess: (res: any) => {
      toast(res?.message);
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

  const updateProfileImageForSocialSignIn = React.useCallback(
    (img: File) => {
      if (!authStateValue.isSocialAuth) return;
      const formData = new FormData();
      formData.append('image', img);
      mutateProfilePicUpdate(formData);
    },
    [authStateValue.isSocialAuth, mutateProfilePicUpdate],
  );

  React.useEffect(() => {
    if (authStateValue.streetAddress) {
      setAddress(authStateValue.streetAddress);
    }
  }, [authStateValue.streetAddress]);

  return (
    <div className='m-auto md:m-0 pt-[55px]  md:pt-[109px] md:pl-[81px] max-w-[440px] px-10 md:px-0 pb-8 '>
      <h1 className='text-2xl font-semibold'>Create Account</h1>
      <hr className='h-[2px] my-4 bg-gray-100 border-0 rounded dark:bg-gray-700' />
      <form
        onSubmit={handleSubmit(onSubmitLogin as any)}
        className='flex w-full flex-col gap-3'
      >
        <div className='mx-auto'>
          <Controller
            control={control}
            name='image'
            render={({ field }) => (
              <ProfilePicUploader
                onUploadComplete={updateProfileImageForSocialSignIn}
                onChange={field.onChange}
                value={
                  authStateValue.isSocialAuth
                    ? `${process.env.BASE_URL}/${field.value}`
                    : ''
                }
              />
            )}
          />
        </div>
        <h1 className='text-md font-normal my-2'>Basic Details</h1>
        <div className='flex gap-2 flex-col md:flex-row'>
          <Controller
            control={control}
            name='firstName'
            render={({ field }) => (
              <TextInput
                disabled={authStateValue.isSocialAuth}
                requiredField={true}
                placeholder=''
                className='rounded-xl'
                type='text'
                label='First Name'
                error={errors.firstName?.message}
                {...field}
              />
            )}
          />

          <Controller
            control={control}
            name='lastName'
            render={({ field }) => (
              <TextInput
                disabled={authStateValue.isSocialAuth}
                requiredField
                placeholder=''
                className='rounded-xl'
                type='text'
                label='Last Name'
                error={errors.lastName?.message}
                {...field}
              />
            )}
          />
        </div>
        <Controller
          control={control}
          name='username'
          render={({ field }) => (
            <TextInput
              requiredField={authStateValue.isSocialAuth ? false : true}
              placeholder=''
              className='rounded-xl'
              type='text'
              label='Username'
              error={errors.username?.message}
              {...field}
            />
          )}
        />
        <div className='flex flex-col gap-4 md:flex-row'>
          <Controller
            control={control}
            name='dob'
            render={({ field }) => (
              <div className='flex flex-col gap-2 md:w-1/2'>
                <label className='font-normal text-sm text-muted-foreground'>
                  Date of Birth<span className='text-red-600'>*</span>
                </label>
                <NewDatePicker
                  className='rounded-xl'
                  maxDate={dobMaxDate}
                  showIcon
                  {...field}
                />
                {errors.dob && (
                  <p className='text-red-600 text-xs'>{errors.dob.message}</p>
                )}
              </div>
            )}
          />

          <Controller
            control={control}
            name='gender'
            render={({ field }) => (
              <div className='flex flex-col gap-1'>
                <SelectWithDropdown
                  requiredField
                  value={field.value}
                  onChange={field.onChange}
                  className='min-w-[169px]'
                  inputLabel='Gender'
                  listClassName='top-[72px]'
                  options={[
                    { value: 'male', label: 'Male' },
                    { value: 'female', label: 'Female' },
                    { value: 'other', label: 'Other' },
                  ]}
                />
                {errors.gender && (
                  <p className='text-red-600 text-xs'>
                    {errors.gender.message}
                  </p>
                )}
              </div>
            )}
          />
        </div>
        <Controller
          control={control}
          name='email'
          render={({ field }) => (
            <TextInput
              disabled={authStateValue.isSocialAuth}
              requiredField
              placeholder=''
              className='rounded-xl'
              type='text'
              label='Email'
              error={errors.email?.message}
              {...field}
            />
          )}
        />
        {/* <Controller
          control={control}
          name='phone'
          render={({ field }) => (
            <PhoneInput
              requiredField
              placeholder=''
              className='rounded-xl'
              type='text'
              label='Phone Number'
              error={errors.phone?.message}
              {...field}
            />
          )}
        /> */}

        <div
          className={cn('flex flex-col gap-2', {
            hidden: authStateValue.isSocialAuth,
          })}
        >
          <Controller
            control={control}
            name='phone'
            render={({ field }) => (
              <div>
                <PhoneInputWithCountrySelect
                  setHasOtherFormErrors={setHasOtherFormErrors}
                  showError={false}
                  className='rounded-xl mb-2'
                  {...field}
                />
                <p className='text-red-600 text-xs'>{errors.phone?.message}</p>
              </div>
            )}
          />

          <Controller
            control={control}
            name='password'
            render={({ field }) => (
              <PasswordInput
                requiredField
                className='rounded-xl'
                label='Password'
                error={errors.password?.message}
                {...field}
              />
            )}
          />
          <Controller
            control={control}
            name='confirmPassword'
            render={({ field }) => (
              <PasswordInput
                requiredField
                className='rounded-xl'
                label='Confirm Password'
                error={errors.confirmPassword?.message}
                {...field}
              />
            )}
          />
        </div>

        <div className='flex flex-col gap-1'>
          <PlacesAutocompleteInput
            label='Street address'
            placeholder=''
            onSelectPlace={onSelectAddress}
            requiredField
            address={address}
            setAddress={setAddress}
          />
          <p className='text-xs text-red-500'>
            {errors.streetAddress?.message}
          </p>
        </div>

        <Controller
          control={control}
          name='apartment'
          render={({ field }) => (
            <TextInput
              className='rounded-xl'
              label='Apart, suite, etc (optional)'
              error={errors.apartment?.message}
              {...field}
            />
          )}
        />

        <Controller
          control={control}
          name='city'
          render={({ field }) => (
            <TextInput
              disabled
              requiredField
              className='rounded-xl'
              label='City'
              error={errors.city?.message}
              {...field}
            />
          )}
        />

        <Controller
          control={control}
          name='state'
          render={({ field }) => (
            <TextInput
              disabled
              requiredField
              className='rounded-xl'
              label='State'
              error={errors.state?.message}
              {...field}
            />
          )}
        />

        <Controller
          control={control}
          name='zipCode'
          render={({ field }) => (
            <TextInput
              disabled
              requiredField
              className='rounded-xl'
              label='Zip code'
              error={errors.zipCode?.message}
              {...field}
            />
          )}
        />
        <>
          <label className='font-normal text-sm text-muted-foreground'>
            Are you a registered voter?
            <span className='text-red-600 text-xs'>*</span>
          </label>

          <div className='flex gap-2'>
            <Button
              className={`w-full rounded-xl ${isRegisteredVoter && 'border-black'}`}
              type='button'
              variant='outline'
              onClick={() => setRegisteredVoter(true)}
              text='Yes'
            />
            <Button
              className={`w-full rounded-xl ${!isRegisteredVoter && 'border-black'}`}
              type='button'
              variant='outline'
              onClick={() => setRegisteredVoter(false)}
              text='No'
            />
          </div>
        </>
        <Controller
          control={control}
          name='isPrivacyPolicyRead'
          render={({ field }) => (
            <div className='flex flex-col gap-1'>
              <CheckboxInput
                {...field}
                defaultChecked={authStateValue.isPrivacyPolicyRead}
                renderlabel={
                  <span className='text-muted-foreground font-normal text-sm'>
                    I agree to the{' '}
                    <Link
                      href='#'
                      // target='_blank'
                      prefetch
                      className='text-black underline'
                    >
                      terms and conditions.
                    </Link>{' '}
                    <span className='text-red-600 text-xs'>*</span>
                  </span>
                }
              />
              {errors.isPrivacyPolicyRead?.message && (
                <p className='text-red-600 text-xs'>
                  {errors.isPrivacyPolicyRead?.message}
                </p>
              )}
            </div>
          )}
        />
        <Button
          className='w-full rounded-full mt-2'
          type='submit'
          disabled={!watchIsPrivacyPolicyRead}
          text='Sign Up'
          loading={false}
        />
      </form>

      <p className='text-muted-foreground font-normal text-sm text-center mt-8'>
        Already have an account?{' '}
        <Link
          href='/sign-in'
          onClick={onClickSinInPageNavigate}
          className='text-black underline'
          prefetch
        >
          <strong>Sign in</strong>
        </Link>
      </p>
    </div>
  );
}
