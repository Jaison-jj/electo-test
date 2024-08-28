'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from '@tanstack/react-query';
import { sub } from 'date-fns';
import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useRecoilState } from 'recoil';
import { toast } from 'sonner';

import { editProfileSchema } from '@/lib/formSchemas';
import { formatDateAPIpayload } from '@/lib/helper';

import { Button } from '@/components/ui/button';
import TextInput from '@/components/ui/TextInput';
import NewDatePicker from '@/components/utils/NewDatePicker';
import SelectWithDropdown from '@/components/utils/SelectWithDropdown';

import { authState } from '@/store/auth.atom';

import { updateProfile } from '@/apis/user';
import PlacesAutocompleteInput from '@/app/(auth)/places/page';

const dobMaxDate = sub(new Date(), {
  years: 12,
});

const EditProfile = (props: any) => {
  const { setEditMode, userProfile, refetchProfile } = props;
  // debugger
  const [authStateValue, setAuthStateValue] = useRecoilState(authState);
  const [address, setAddress] = React.useState('');

  const [isRegisteredVoter, setRegisteredVoter] = React.useState(
    userProfile.isRegisteredVoter || false,
  );
  const {
    control,
    handleSubmit,
    setError,
    setValue,
    clearErrors,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(editProfileSchema),
    defaultValues: {
      firstName: userProfile.firstName || '',
      lastName: userProfile.lastName || '',
      username: userProfile.userName || '',
      dob: userProfile.dateOfBirth
        ? new Date(userProfile.dateOfBirth)
        : (null as any),
      gender: userProfile.gender,
      // phone: userProfile.phoneNumber || '',
      // email: userProfile.email || '',
      // password: '',
      // confirmPassword: '',
      zipCode: userProfile.zip || '',
      maritalStatus: userProfile.maritalStatus,
      children: userProfile.children,
      employmentStatus: userProfile.employmentStatus,
      educationLevel: userProfile.levelOfEducation,
      jobIndustry: userProfile.jobIndustry,
      race: userProfile.race,
      veteran: userProfile.veteran ? 'Yes' : 'No',
      politicalViews: userProfile.politicalViews,

      apartment: userProfile.apartment,
      city: userProfile.city,
      state: userProfile.state,
      streetAddress: userProfile.streetAddress,
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (payload: any) => updateProfile(payload),
    onSuccess: () => {
      refetchProfile();
      setEditMode('');
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

  const onSubmit = (data: any) => {
    const reqData = {
      firstName: data.firstName,
      lastName: data.lastName,
      userName: data.username,
      // email: data.email,
      // phoneNumber: data.phone.replace(/^\+\d+\s|\D/g, ''),
      dateOfBirth: formatDateAPIpayload(data.dob),
      gender: data.gender,
      // password: data.password,
      // confirmPassword: data.confirmPassword,
      maritalStatus: data.maritalStatus,
      children: data.children,
      employmentStatus: data.employmentStatus,
      levelOfEducation: data.educationLevel,
      jobIndustry: data.jobIndustry,
      race: data.race,
      veteran: data.veteran === 'Yes' ? true : false,
      politicalViews: data.politicalViews,
      isRegisteredVoter: isRegisteredVoter,

      streetAddress: data.streetAddress,
      apartment: data.apartment || null,
      city: data.city,
      state: data.state,

      streetName: authStateValue.streetName || userProfile.streetName,
      streetNumber: authStateValue.streetNumber || userProfile.streetNumber,
      latitude: authStateValue.latitude.toString() || userProfile.latitude,
      longitude: authStateValue.longitude.toString() || userProfile.longitude,
      zip: authStateValue.zipCode || userProfile.zip,
    };

    mutate(reqData);
  };

  const onSelectAddress = (place: any) => {
    reset({ city: '', state: '', zipCode: '' });

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
      setValue('zipCode', zip?.toString());
      clearErrors('zipCode');
    }

    if (streetName && streetNumber) {
      setAuthStateValue((prev) => ({
        ...prev,
        streetAddress: place.formatted_address,
        streetName,
        streetNumber,
        zipCode: zip?.toString(),
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

  useEffect(() => {
    setAddress(userProfile.streetAddress);
  }, [userProfile.streetAddress]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit as any)}
      className='flex w-full flex-col gap-3  '
    >
      <div className='flex gap-2 flex-col md:flex-row px-2'>
        <Controller
          control={control}
          name='firstName'
          render={({ field }) => (
            <TextInput
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

      <div className='px-2'>
        <Controller
          control={control}
          name='username'
          render={({ field }) => (
            <TextInput
              requiredField={true}
              placeholder=''
              className='rounded-xl'
              type='text'
              label='Username'
              error={errors.username?.message}
              {...field}
            />
          )}
        />
      </div>

      <div className='flex flex-col gap-2 md:flex-row px-2'>
        <Controller
          control={control}
          name='dob'
          render={({ field }) => (
            <div className='flex flex-col gap-2 md:w-1/2'>
              <label className='font-normal text-sm text-muted-foreground'>
                Date of birth<span className='text-red-600'>*</span>
              </label>
              <NewDatePicker
                className='rounded-xl'
                maxDate={dobMaxDate}
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
            <div className='flex flex-col gap-1 md:w-1/2'>
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
                <p className='text-red-600 text-xs'>{errors.gender.message}</p>
              )}
            </div>
          )}
        />
      </div>

      <div className='px-2 flex flex-col gap-4'>
        {/* <Controller
          control={control}
          name='email'
          render={({ field }) => (
            <TextInput
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

        <Controller
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

        {/* <Controller
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
        /> */}

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
      </div>

      <div className='px-2'>
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
      </div>

      <div className='px-2'>
        <div className='flex gap-2 flex-col md:flex-row w-full'>
          <Controller
            control={control}
            name='maritalStatus'
            render={({ field }) => (
              <div className='flex flex-col gap-1 w-full'>
                <SelectWithDropdown
                  value={field.value}
                  onChange={field.onChange}
                  className='min-w-[169px] w-full'
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
                className='rounded-xl w-full'
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

        <div className='flex gap-2 mt-4'>
          <Button
            className='w-full rounded-full mt-2'
            type='submit'
            disabled={false}
            text='Update'
            loading={isPending}
          />
          <Button
            className='w-full rounded-full mt-2'
            variant='outline'
            type='button'
            text='Cancel'
            onClick={() => setEditMode('')}
          />
        </div>
      </div>
    </form>
  );
};

export default EditProfile;
