'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter as useNpRouter } from 'next-nprogress-bar';
import * as React from 'react';
import { useRecoilState } from 'recoil';
import { toast } from 'sonner';

import { interests } from '@/lib/constants';
import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';

import { authState } from '@/store/auth.atom';

import { saveInterests } from '@/apis/user';

export default function Interests() {
  const router = useNpRouter();
  const [, setAuthStateValue] = useRecoilState(authState);

  const [selectedInterests, setSelectedInterests] = React.useState<string[]>(
    [],
  );

  const onSelect = (interest: string) => {
    const includes = selectedInterests.includes(interest);
    if (includes) {
      setSelectedInterests(
        selectedInterests.filter((item) => item !== interest),
      );
      return;
    }
    setSelectedInterests([...selectedInterests, interest]);
  };

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: any) => saveInterests(data),
    onSuccess: (res: any) => {
      toast(res.message, {
        description: '',
        duration: 1000,
        action: {
          label: 'Close',
          onClick: () => null,
        },
      });
      setAuthStateValue((prev) => ({
        ...prev,
        id: '',
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
        socialSignOnMode: '',
      }));

      if (res?.isRegisteredVoter) return router.push('/bills');

      router.push('voter-registration-status');
    },
    onError(err: any) {
      // debugger
      toast(err.response.data.message, {
        // className: 'bg-red-300',
        description: '',
        duration: 3000,
        action: {
          label: 'Close',
          onClick: () => null,
        },
      });
    },
  });

  const onSubmit = () => {
    mutate({ interests: selectedInterests });
  };

  return (
    <div className='m-auto md:m-0 pt-[50px] md:pt-[109px] pb-5 md:pl-[81px] max-w-[440px] px-10 md:px-0'>
      <h1 className='text-2xl font-semibold '>Interests</h1>
      <hr className='h-[2px] my-4 bg-gray-100 border-0 rounded dark:bg-gray-700 ' />
      <p className='text-sm md:text-sm  my-3'>
        Select Topics of Interest{' '}
        <span className='text-muted-foreground text-xs'>
          {' '}
          ( Select at least 3 topics )
        </span>
      </p>
      <div className='flex gap-2 flex-wrap'>
        {interests.map((item, index) => (
          <span
            key={index}
            onClick={() => onSelect(item)}
            className={cn(
              'px-2 py-1 md:px-3 md:py-2 cursor-pointer border border-gray-500 rounded-2xl text-xs md:text-sm text-gray-500',
              {
                'border-black': selectedInterests.includes(item),
                'text-black': selectedInterests.includes(item),
              },
            )}
          >
            {item}
          </span>
        ))}
      </div>
      <Button
        className='w-full rounded-full mt-[20px]'
        type='button'
        disabled={isPending || selectedInterests.length < 3}
        text='Continue'
        loading={isPending}
        onClick={onSubmit}
      />
    </div>
  );
}
