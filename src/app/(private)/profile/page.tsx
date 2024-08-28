'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { toast } from 'sonner';

import { firebaseAnalytics, formatDateUI, sysPhone } from '@/lib/helper';

import NextImage from '@/components/NextImage';
import Interests from '@/components/profile/Interests';

const UpdateEmailModal = dynamic(
  () => import('@/components/profile/UpdateEmailModal'),
);
const UpdatePhoneNumberModal = dynamic(
  () => import('@/components/profile/UpdatePhoneNumberModal'),
);
const UpdateProfileImageModal = dynamic(
  () => import('@/components/profile/UpdateProfileImageModal'),
);

import Loading from '@/components/utils/Loading';

import { userAtom } from '@/store/user.atom';

import ProfileAvatar from '@/../public/images/auth/profile-avatar-big.png';
import EditPencil from '@/../public/svg/edit-pencil.svg';
import EditProfileImageIcon from '@/../public/svg/edit-profile-img.svg';
import { getProfile, updateProfileImage } from '@/apis/user';

const EditProfile = dynamic(() => import('@/components/profile/EditProfile'));

const Profile = () => {
  const [editMode, setEditMode] = useState('');
  const [isOpenChangePhone, setIsOpenChangePhone] = useState(false);
  const [isOpenChangeEmail, setIsOpenChangeEmail] = useState(false);
  const [isOpenEditProfileImage, setIsOpenEditProfileImage] = useState(false);
  const [, setUserState] = useRecoilState(userAtom);

  const {
    data: profile,
    isFetching,
    refetch: refetchProfile,
  } = useQuery({
    queryKey: ['get-profile'],
    queryFn: getProfile,
    refetchOnWindowFocus: false,
  });

  const renderProfileImage = () => {
    const { image: profileImage, user } = profile || {};
    const { image: userImage } = user || {};

    if (profileImage?.length) return profileImage;
    if (!userImage) return ProfileAvatar;

    const isGoogleImage = userImage.startsWith(
      'https://lh3.googleusercontent.com',
    );
    const isFacebookImage = userImage.startsWith(
      'https://scontent-iad3-1.xx.fbcdn.net',
    );

    if (isGoogleImage || isFacebookImage) return userImage;

    return `${process.env.BASE_URL}/${userImage}` || ProfileAvatar;
  };

  const { mutate, isPending } = useMutation({
    mutationFn: async (payload: any) => updateProfileImage(payload),
    onSuccess: (res: any) => {
      toast(res.message, {
        description: '',
        duration: 3000,
      });
      // setUserState((prev) => ({ ...prev, image: res.image }));

      setIsOpenEditProfileImage(false);
      refetchProfile();
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

  const getCroppedImage = (img: any) => {
    const data = new FormData();
    data.append('image', img);
    mutate(data);
  };

  useEffect(() => {
    setUserState((prev) => ({ ...prev, currentPageName: 'Profile' }));
  }, [setUserState]);

  useEffect(() => {
    firebaseAnalytics('page_view');
  }, []);

  if (isFetching) return <Loading />;

  return (
    <div className='flex flex-col flex-1 w-full mt-[40px] md:mt-0'>
      <title>Profile</title>
      <div className='h-24 md:h-[190px] bg-[#F7F7F8] flex gap-3 items-center p-1 md:p-4'>
        <div className='relative'>
          <div className=' flex justify-center items-center'>
            <NextImage
              src={renderProfileImage()}
              alt='profile-img'
              className='md:w-full md:md:w-full  w-20  object-cover'
              height={160}
              width={160}
              unoptimized
            />
          </div>
          <EditProfileImageIcon
            role='button'
            onClick={() => setIsOpenEditProfileImage(true)}
            className='absolute bottom-1 right-1 h-5 w-5 cursor-pointer'
          />
        </div>
        <div>
          <h4 className='text-base font-semibold'>
            {profile?.user?.firstName} {profile?.user?.lastName}
          </h4>
          <p className='text-muted-foreground text-sm'>
            {profile?.user?.userName || '--'}
          </p>
        </div>
      </div>
      <div className='flex flex-col md:flex-row md:justify-between w-full'>
        {(editMode === '' || editMode === 'interests') && (
          <div className='md:w-[549px] md:h-[calc(100vh_-_271px)] overflow-auto'>
            <div className='flex justify-between items-center p-2 border-b border-r border-gray-200'>
              <h4 className='font-semibold'>Basic Information</h4>
              <EditPencil
                className='w-5 h-5 cursor-pointer'
                onClick={() => setEditMode('profile')}
              />
            </div>
            <div className='flex flex-col gap-4 p-2 md:p-4 border-r border-gray-200'>
              <div className='flex justify-between'>
                <p className='text-muted-foreground text-sm'>Date of Birth</p>
                <p className='text-sm'>
                  {profile?.user?.dateOfBirth &&
                    formatDateUI(profile?.user?.dateOfBirth, 'MM.dd.yyyy')}
                </p>
              </div>
              <div className='flex justify-between'>
                <p className='text-muted-foreground text-sm'>Gender</p>
                <p className='text-sm'>{profile?.user?.gender}</p>
              </div>
              <div className='flex justify-between'>
                <p className='text-muted-foreground text-sm'>Phone Number</p>
                <div className='flex gap-2'>
                  <p className='text-sm'>
                    {sysPhone(profile?.user?.phoneNumber)}
                  </p>
                  <EditPencil
                    className='w-5 h-5 cursor-pointer'
                    onClick={() => setIsOpenChangePhone(true)}
                  />
                </div>
              </div>
              <div className='flex justify-between'>
                <p className='text-muted-foreground text-sm'>Email</p>
                <div className='flex gap-2'>
                  <p className='text-sm'>{profile?.user?.email}</p>
                  <EditPencil
                    className='w-5 h-5 cursor-pointer'
                    onClick={() => setIsOpenChangeEmail(true)}
                  />
                </div>
              </div>

              <div className='flex justify-between'>
                <p className='text-muted-foreground text-sm'>
                  Apart, Suite, etc
                </p>
                <p className='text-sm'>{profile?.user?.apartment || '--'}</p>
              </div>
              <div className='flex justify-between'>
                <p className='text-muted-foreground text-sm'>Street Name</p>
                <p className='text-sm'>{profile?.user?.streetName || '--'}</p>
              </div>
              <div className='flex justify-between'>
                <p className='text-muted-foreground text-sm'>Street Number</p>
                <p className='text-sm'>{profile?.user?.streetNumber || '--'}</p>
              </div>
              <div className='flex justify-between'>
                <p className='text-muted-foreground text-sm'>City</p>
                <p className='text-sm'>{profile?.user?.city || '--'}</p>
              </div>
              <div className='flex justify-between'>
                <p className='text-muted-foreground text-sm'>State</p>
                <p className='text-sm'>{profile?.user?.state || '--'}</p>
              </div>
              <div className='flex justify-between'>
                <p className='text-muted-foreground text-sm'>Zip Code</p>
                <p className='text-sm'>{profile?.user?.zip || '--'}</p>
              </div>
              <div className='flex justify-between'>
                <p className='text-muted-foreground text-sm'>
                  Are you a registered voter?
                </p>
                <p className='text-sm'>
                  {profile?.user?.isRegisteredVoter ? 'Yes' : 'No'}
                </p>
              </div>
            </div>
            <div className='flex justify-between items-center p-2  border-b border-r border-gray-200'>
              <h4 className='font-semibold'>About You</h4>
            </div>
            {/* flex flex-col gap-4 p-2 border-r border-gray-200 md:h-[calc(100%_-_220px)] */}
            <div className='flex flex-col gap-4 p-2 md:p-4 border-r border-gray-200 md:h-[calc(100%_-_230px)]'>
              <div className='flex justify-between'>
                <p className='text-muted-foreground text-sm'>Marital Status</p>
                <p className='text-sm capitalize'>
                  {profile?.user?.maritalStatus}
                </p>
              </div>
              <div className='flex justify-between'>
                <p className='text-muted-foreground text-sm'>
                  Employment Status
                </p>
                <p className='text-sm capitalize'>
                  {profile?.user?.employmentStatus}
                </p>
              </div>
              <div className='flex justify-between'>
                <p className='text-muted-foreground text-sm'>
                  Level of Education
                </p>
                <p className='text-sm capitalize'>
                  {profile?.user?.levelOfEducation
                    ?.replace(/([A-Z])/g, ' $1')
                    ?.trim()}
                </p>
              </div>
              <div className='flex justify-between'>
                <p className='text-muted-foreground text-sm'>Job Industry</p>
                <p className='text-sm capitalize'>
                  {profile?.user?.jobIndustry
                    ?.replace(/([A-Z])/g, ' $1')
                    .trim()}
                </p>
              </div>
              <div className='flex justify-between'>
                <p className='text-muted-foreground text-sm'>Children</p>
                <p className='text-sm'>{profile?.user?.children}</p>
              </div>
              <div className='flex justify-between'>
                <p className='text-muted-foreground text-sm'>Race</p>
                <p className='text-sm capitalize'>
                  {profile?.user?.race?.replace(/([A-Z])/g, ' $1').trim()}
                </p>
              </div>
              <div className='flex justify-between'>
                <p className='text-muted-foreground text-sm'>Veteran</p>
                <p className='text-sm'>
                  {profile?.user?.veteran ? 'Yes' : 'No'}
                </p>
              </div>
              <div className='flex justify-between'>
                <p className='text-muted-foreground text-sm'>Political Views</p>
                <p className='text-sm capitalize'>
                  {profile?.user?.politicalViews}
                </p>
              </div>
            </div>
          </div>
        )}

        {editMode === 'profile' && (
          <div className='md:w-[549px]  md:h-[calc(100vh_-_271px)]  overflow-auto border-r border-gray-200'>
            <div className='flex justify-between items-center p-2 border-b border-gray-200'>
              <h4 className='font-semibold'>Edit profile</h4>
            </div>
            <div className='p-2'>
              <EditProfile
                setEditMode={setEditMode}
                refetchProfile={refetchProfile}
                userProfile={profile.user}
              />
            </div>
          </div>
        )}

        <div className='md:w-[352px]'>
          <div className='flex justify-between items-center p-2 border-b border-r border-gray-200'>
            <h4 className='font-semibold'>Interests</h4>
            <EditPencil
              className='w-5 h-5 cursor-pointer'
              onClick={() => setEditMode('interests')}
            />
          </div>
          <div className='pl-4 pt-4'>
            <Interests
              userInterests={profile?.user?.interests || []}
              onClickCancelEdit={() => setEditMode('')}
              editMode={editMode}
              refetchProfile={refetchProfile}
            />
          </div>
        </div>
      </div>
      <UpdatePhoneNumberModal
        isOpen={isOpenChangePhone}
        setIsOpen={setIsOpenChangePhone}
        userId={profile?.user?.id}
        refetchProfile={refetchProfile}
      />
      <UpdateEmailModal
        isOpen={isOpenChangeEmail}
        setIsOpen={setIsOpenChangeEmail}
        userId={profile?.user?.id}
        refetchProfile={refetchProfile}
      />

      <UpdateProfileImageModal
        isOpen={isOpenEditProfileImage}
        setIsOpen={setIsOpenEditProfileImage}
        isLoading={isPending}
        getCroppedImageFile={getCroppedImage}
      />
    </div>
  );
};

export default Profile;
