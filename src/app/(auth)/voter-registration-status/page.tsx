'use client';

import { useRouter } from 'next/navigation';
import * as React from 'react';

import { Button } from '@/components/ui/button';

import VoterStatusRed from '@/../public/svg/auth/voter-status-red.svg';

export default function VoterRegistrationStatus() {
  const router = useRouter();

  return (
    <div className='m-auto h-screen md:m-0 py-[50px] md:pt-[109px] md:pl-[81px] max-w-[440px] px-10 md:px-0 flex flex-col'>
      <div className='body grow'>
        <h1 className='text-2xl font-semibold '>Voter Registration Status</h1>
        <hr className='h-[2px] my-4 bg-gray-100 border-0 rounded dark:bg-gray-700 ' />
        <VoterStatusRed className='w-[80px] h-[80px] mx-auto' />
        <p className='text-base font-semibold text-center mt-[20px]'>
          You were not found in our database as a registered voter.
        </p>
        <p className='text-sm font-normal text-muted-foreground text-center mt-[12px]'>
          If this information is incorrect, please check with your state's voter
          registration office
        </p>

        <p className='text-xs font-normal text-muted-foreground text-center mt-[51px]'>
          You will receive a black verification badge when you verify your
          identity. You will receive a gold badge when you verify your identity
          and voter registration status.
        </p>
      </div>

      <div className='flex justify-between gap-3'>
        <Button
          className='w-full rounded-full mt-[40px] md:mt-[80px]'
          type='button'
          disabled={false}
          variant='outline'
          text='Register to Vote'
          loading={false}
          onClick={() => router.push('/register-vote')}
        />
        <Button
          className='w-full rounded-full mt-[40px] md:mt-[80px]'
          type='button'
          disabled={false}
          text='Continue'
          loading={false}
          onClick={() => router.push('/bills')}
        />
      </div>
    </div>
  );
}
