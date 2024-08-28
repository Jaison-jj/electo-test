'use client';

/* eslint-disable unused-imports/no-unused-imports */
import {
  BookOpenText,
  Calendar,
  CheckCircleIcon,
  CircleUserRound,
  Globe,
  MapPin,
  ShieldQuestion,
  SquareUserRound,
  Vote,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect } from 'react';
import { LiaChalkboardTeacherSolid } from 'react-icons/lia';

import { firebaseAnalytics } from '@/lib/helper';

import AbsenteeAndEarlyVoting from '@/../public/images/election-center/absentee-early-voting.png';
import BallotTemplate from '@/../public/images/election-center/ballot-template.png';
import BecomeApollWorker from '@/../public/images/election-center/become-a-poll-worker.png';
import ElectionOfficialDirectory from '@/../public/images/election-center/election-official-directory.png';
import OverseasVoters from '@/../public/images/election-center/overseas-voters.png';
import RegisterToVote from '@/../public/images/election-center/register-t-vote.png';
import UpcomingElections from '@/../public/images/election-center/upcoming elections.png';
import ValidFormsOfId from '@/../public/images/election-center/valid-forms-of-id.png';
import VoterRegistrationStatus from '@/../public/images/election-center/voter-registration-status.png';
import WhereToVote from '@/../public/images/election-center/where-to-vote.png';

const tabs = [
  {
    title: 'Upcoming Elections',
    icon: <Calendar className='w-6 h-6' />,
    backDrop: UpcomingElections,
    alt: 'UpcomingElections',
    href: 'https://ballotpedia.org/Sample_Ballot_Lookup',
  },
  {
    title: 'Where to Vote',
    icon: <MapPin className='w-6 h-6' />,
    backDrop: WhereToVote,
    alt: 'WhereToVote',
    href: 'https://www.nass.org/can-i-vote/find-your-polling-place',
  },
  {
    title: 'Ballot Template',
    icon: <Vote className='w-6 h-6' />,
    backDrop: BallotTemplate,
    alt: 'BallotTemplate',
    href: 'https://ballotpedia.org/Sample_Ballot_Lookup',
  },
  {
    title: 'Voter Registration Status',
    icon: <CircleUserRound className='w-6 h-6' />,
    backDrop: VoterRegistrationStatus,
    alt: 'VoterRegistrationStatus',
    href: 'https://www.nass.org/can-I-vote/voter-registration-status',
  },
  {
    title: 'Register to Vote',
    icon: <CheckCircleIcon className='w-6 h-6' />,
    backDrop: RegisterToVote,
    alt: 'RegisterToVote',
    href: 'https://www.nass.org/can-i-vote/register-to-vote',
  },
  {
    title: 'Valid Forms of ID',
    icon: <BookOpenText className='w-6 h-6' />,
    backDrop: ValidFormsOfId,
    alt: 'ValidFormsOfId',
    href: 'https://www.nass.org/can-i-vote/valid-forms-id',
  },
  {
    title: 'Absentee & Early Voting',
    icon: <ShieldQuestion className='w-6 h-6' />,
    backDrop: AbsenteeAndEarlyVoting,
    alt: 'AbsenteeAndEarlyVoting',
    href: 'https://www.nass.org/can-i-vote/absentee-early-voting',
  },
  {
    title: 'Overseas Voters',
    icon: <Globe className='w-6 h-6' />,
    backDrop: OverseasVoters,
    alt: 'OverseasVoters',
    href: 'https://www.fvap.gov/',
  },
  {
    title: 'Become a Poll Worker',
    icon: <LiaChalkboardTeacherSolid className='w-6 h-6' />,
    backDrop: BecomeApollWorker,
    alt: 'BecomeApollWorker',
    href: 'https://www.nass.org/can-i-vote/become-a-poll-worker',
  },
  {
    title: 'Election Official Directory',
    icon: <SquareUserRound className='w-6 h-6' />,
    backDrop: ElectionOfficialDirectory,
    alt: 'ElectionOfficialDirectory',
    href: 'https://www.usvotefoundation.org/election-offices',
  },
];

const ElectionCenter = () => {
  useEffect(() => {
    firebaseAnalytics('page_view');
  }, []);

  return (
    <div className='p-4 grid grid-cols-2 gap-4 mt-[40px] md:mt-0'>
      <title>Election Center</title>
      {tabs.map((tab: any) => (
        <Link
          href={tab.href}
          target='_blank'
          key={tab.title}
          className='w-full md:w-[250px] h-[110px] border border-gray 
        rounded-2xl 
        flex 
        justify-between 
        items-center 
        hover:bg-black
        hover:text-white
        group'
        >
          <div className='pl-4 flex flex-col gap-4'>
            {tab.icon}
            <p className='font-poppins'>{tab.title}</p>
          </div>
          <Image
            src={tab.backDrop}
            alt='backDrop'
            width={50}
            height={70}
            className='opacity-5 group-hover:invert group-hover:opacity-100'
          />
        </Link>
      ))}
    </div>
  );
};

export default ElectionCenter;
