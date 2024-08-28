'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useState } from 'react';

import { cn } from '@/lib/utils';

import ProfilePicUploadImage from '@/../public/images/auth/profilePicUpload.png';
import CloseIcon from '@/../public/svg/AddIconProfilePic.svg';

const UpdateProfileImageModal = dynamic(
  () => import('@/components/profile/UpdateProfileImageModal'),
);

type TProfilePicUploader = {
  onChange: (file: any) => void;
  onUploadComplete?: (file: any) => void;
  value?: string;
};

const ProfilePicUploader = (props: TProfilePicUploader) => {
  const { value, onChange, onUploadComplete } = props;

  const [image, setImage] = useState(value || null);
  const [isOpenEditProfileImage, setIsOpenEditProfileImage] = useState(false);

  const handleClick = () => {
    setIsOpenEditProfileImage(true);
  };

  const onClickRemoveImage = () => {
    setImage(null);
    onChange(null);
  };

  const getCroppedImage = (imgBlob: any) => {
    setImage(imgBlob);
  };

  const getCroppedImageFile = async (imgFile: File) => {
    await onChange(imgFile);
    setIsOpenEditProfileImage(false);
    onUploadComplete && onUploadComplete(imgFile);
  };

  return (
    <div className='relative h-[70px] w-[70px] md:h-[120px] md:w-[120px]'>
      <Image
        src={image ?? ProfilePicUploadImage}
        width={120}
        height={120}
        alt='profile-pic'
        priority
        className={cn(`profile-pic-upload-image w-full h-full object-cover`, {
          'rounded-full  w-full h-full object-cover': image,
        })}
        onClick={handleClick}
      />

      {image && (
        <CloseIcon
          className='h-[25px] w-[25px] md:h-[30px] md:w-[30px] absolute bottom-0 right-0 rotate-45 cursor-pointer'
          onClick={onClickRemoveImage}
        />
      )}
      <UpdateProfileImageModal
        isOpen={isOpenEditProfileImage}
        setIsOpen={setIsOpenEditProfileImage}
        getCroppedImage={getCroppedImage}
        getCroppedImageFile={getCroppedImageFile}
      />
    </div>
  );
};

export default ProfilePicUploader;
