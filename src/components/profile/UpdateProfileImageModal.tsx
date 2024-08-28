'use client';

import React, { useState } from 'react';
import Cropper from 'react-easy-crop';
import { toast } from 'sonner';

import 'react-easy-crop/react-easy-crop.css';

import { blobToFile, getCroppedImg } from '@/lib/imageCropperHelpers';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Modal from '@/components/utils/Modal';

interface UpdateProfileImageModalProps {
  isOpen: boolean;
  setIsOpen: any;
  isLoading?: boolean;
  getCroppedImage?: (img: string | null) => void;
  getCroppedImageFile?: (img: File) => void;
}

const UpdateProfileImageModal = (props: UpdateProfileImageModalProps) => {
  const { isOpen, setIsOpen, getCroppedImageFile, getCroppedImage, isLoading } =
    props;

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [rawImage, setRawImage] = useState<string | null>(null);

  const handleImageUpload = (e: any) => {
    const image = e.target?.files[0];
    setRawImage(URL.createObjectURL(image));
  };

  const handleCancelClick = () => {
    setRawImage(null);
    setIsOpen(false);
  };

  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);

  const onCropComplete = (croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const showCroppedImage = async () => {
    try {
      const croppedImageBlob = await getCroppedImg(
        rawImage,
        croppedAreaPixels,
        rotation,
      );
      blobToFile(croppedImageBlob, 'sample').then((file) => {
        // setCroppedFile(croppedImageBlob);
        // return the cropped file
        getCroppedImageFile && getCroppedImageFile(file);
        getCroppedImage && getCroppedImage(croppedImageBlob);
        setRawImage(null);
      });
      setCroppedImage(croppedImage);
    } catch (e) {
      toast('Something went wrong!');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      preventOutsideClick
      setIsOpen={setIsOpen}
      renderContent={
        <div className='flex flex-col gap-3 font-poppins pt-6'>
          <div className='grid w-full items-center gap-3'>
            <Label htmlFor='picture' className='text-xl'>
              Crop Image
            </Label>
            <Input
              id='picture'
              accept='image/png, image/jpeg'
              type='file'
              className='w-full'
              onChange={handleImageUpload}
            />
          </div>

          <div className='crop-container font-poppins min-h-[400px] flex items-center'>
            {rawImage ? (
              <Cropper
                image={rawImage as any}
                crop={crop}
                zoom={zoom}
                aspect={4 / 4}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
                objectFit='contain'
                disableAutomaticStylesInjection
                rotation={rotation}
                onRotationChange={setRotation}
                classes={{
                  containerClassName: 'containerClass',
                }}
              />
            ) : (
              <h4 className='text-muted-foreground font-normal text-base text-center'>
                No Image chosen, please choose an image of type jpeg/png to crop
                and upload.
              </h4>
            )}
          </div>

          <div className='flex gap-4'>
            <Button
              className='w-full rounded-full mt-2 font-poppins'
              type='button'
              disabled={!rawImage || isLoading}
              loading={isLoading}
              onClick={showCroppedImage}
              text='Save'
            />
            <Button
              className='w-full rounded-full mt-2 font-poppins'
              type='button'
              text='Cancel'
              variant='outline'
              onClick={handleCancelClick}
            />
          </div>
        </div>
      }
    />
  );
};

export default UpdateProfileImageModal;
