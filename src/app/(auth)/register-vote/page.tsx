import Link from 'next/link';
import * as React from 'react';

import { Button } from '@/components/ui/button';

const links = [
  {
    state: 'Alabama',
    href: 'https://www.sos.alabama.gov/alabama-votes/voter/register-to-vote',
  },
  {
    state: 'Alaska',
    href: 'https://www.elections.alaska.gov/Core/voterregistration.php',
  },
  {
    state: 'Arizona',
    href: 'https://azsos.gov/elections/voting-election/register-vote-or-update-your-current-voter-information',
  },
  {
    state: 'Arkansas',
    href: 'https://www.sos.arkansas.gov/elections/voter-information/voter-registration-information',
  },
  {
    state: 'California',
    href: 'https://registertovote.ca.gov/',
  },
  {
    state: 'Colorado',
    href: 'https://www.sos.state.co.us/voter/pages/pub/olvr/verifyNewVoter.xhtml',
  },
  {
    state: 'Connecticut',
    href: 'https://portal.ct.gov/SOTS/Election-Services/Voter-Information/Voter-Registration-Information',
  },
  {
    state: 'Delaware',
    href: 'https://elections.delaware.gov/voter/votereg.shtml',
  },
  {
    state: 'Florida',
    href: 'https://registertovoteflorida.gov/home',
  },
  {
    state: 'Georgia',
    href: 'https://mvp.sos.ga.gov/s/',
  },
  {
    state: 'Hawaii',
    href: 'https://olvr.hawaii.gov/%28S%28vb2rcnebimyjdjcs5q22kazp%29%29/Default.aspx',
  },
  {
    state: 'Idaho',
    href: 'https://elections.sos.idaho.gov/ElectionLink/ElectionLink/ApplicationInstructions.aspx',
  },
  {
    state: 'Illinois',
    href: 'https://ova.elections.il.gov/',
  },
  {
    state: 'Indiana',
    href: 'https://indianavoters.in.gov/',
  },
  {
    state: 'Iowa',
    href: 'https://sos.iowa.gov/elections/voterinformation/voterregistration.html',
  },
  {
    state: 'Kansas',
    href: 'https://www.kdor.ks.gov/apps/voterreg/home/index',
  },
  {
    state: 'Kentucky',
    href: 'https://elect.ky.gov/registertovote/Pages/default.aspx',
  },
  {
    state: 'Louisiana',
    href: 'https://www.sos.la.gov/ElectionsAndVoting/RegisterToVote/Pages/default.aspx',
  },
  {
    state: 'Maine',
    href: 'https://www.maine.gov/sos/cec/elec/voter-info/votreg.html',
  },
  {
    state: 'Maryland',
    href: 'https://www.elections.maryland.gov/voter_registration/index.html',
  },
  {
    state: 'Massachusetts',
    href: 'https://www.sec.state.ma.us/divisions/elections/voter-resources/registering-to-vote.htm',
  },
  {
    state: 'Michigan',
    href: 'https://www.michigan.gov/sos/elections/voting/register-to-vote',
  },
  {
    state: 'Minnesota',
    href: 'https://www.sos.state.mn.us/elections-voting/register-to-vote/',
  },
  {
    state: 'Mississippi',
    href: 'https://www.sos.ms.gov/voter-id/register',
  },
  {
    state: 'Missouri',
    href: 'https://www.sos.mo.gov/elections/goVoteMissouri/register',
  },
  {
    state: 'Montana',
    href: 'https://sosmt.gov/elections/',
  },
  {
    state: 'Nebraska',
    href: 'https://sos.nebraska.gov/elections/registering-vote',
  },
  {
    state: 'Nevada',
    href: 'https://www.nvsos.gov/sos/elections/voters/registering-to-vote',
  },
  {
    state: 'New Hampshire',
    href: 'https://www.sos.nh.gov/elections/register-vote',
  },
  {
    state: 'New Jersey',
    href: 'https://nj.gov/state/elections/voter-registration.shtml',
  },
  {
    state: 'New Mexico',
    href: 'https://www.sos.nm.gov/voting-and-elections/voter-information-portal-nmvote-org/voter-registration-information/',
  },
  {
    state: 'New York',
    href: 'https://dmv.ny.gov/more-info/electronic-voter-registration-application',
  },
  {
    state: 'North Carolina',
    href: 'https://www.ncsbe.gov/registering/how-register',
  },
  {
    state: 'North Dakota',
    href: 'https://vip.sos.nd.gov/PortalListDetails.aspx?ptlhPKID=79&ptlPKID=7',
  },
  {
    state: 'Ohio',
    href: 'https://olvr.ohiosos.gov/',
  },
  {
    state: 'Oklahoma',
    href: 'https://oklahoma.gov/elections/voter-registration/register-to-vote.html',
  },
  {
    state: 'Oregon',
    href: 'https://sos.oregon.gov/voting/Pages/registration.aspx?lang=en',
  },
  {
    state: 'Pennsylvania',
    href: 'https://www.vote.pa.gov/Register-to-Vote/Pages/How-to-Register-to-Vote.aspx',
  },
  {
    state: 'Rhode Island',
    href: 'https://vote.sos.ri.gov/Home/RegistertoVote?ActiveFlag=1',
  },
  {
    state: 'South Carolina',
    href: 'https://scvotes.gov/voters/register-to-vote/',
  },
  {
    state: 'South Dakota',
    href: 'https://sdsos.gov/elections-voting/voting/register-to-vote/default.aspx',
  },
  {
    state: 'Tennessee',
    href: 'https://sos.tn.gov/elections/guides/how-to-register-to-vote',
  },
  {
    state: 'Texas',
    href: 'https://www.votetexas.gov/register-to-vote/index.html',
  },
  {
    state: 'Utah',
    href: 'https://secure.utah.gov/voterreg/index.html',
  },
  {
    state: 'Vermont',
    href: 'https://sos.vermont.gov/elections/voters/registration/',
  },
  {
    state: 'Virginia',
    href: 'https://vote.elections.virginia.gov/VoterInformation/Lookup/status',
  },
  {
    state: 'Washington',
    href: 'https://voter.votewa.gov/portal2023/login.aspx',
  },
  {
    state: 'West Virginia',
    href: 'https://ovr.sos.wv.gov/Register/Landing',
  },
  {
    state: 'Wisconsin',
    href: 'https://myvote.wi.gov/en-us/Register-To-Vote',
  },
  {
    state: 'Wyoming',
    href: 'https://sos.wyo.gov/Elections/State/RegisteringToVote.aspx',
  },
  {
    state: 'Washington DC',
    href: 'https://www.dcboe.org/voters/register-to-vote/register-update-voter-registration',
  },
];

export default function RegisterVote() {
  return (
    <div className='m-auto  md:m-0 py-[50px] md:pt-[109px] md:pl-[81px] max-w-[600px] px-10 md:px-0 flex flex-col'>
      <div className=''>
        <h1 className='text-2xl font-semibold '>Voter ID Registration</h1>
        <hr className='h-[2px] my-4 bg-gray-100 border-0 rounded dark:bg-gray-700 ' />

        <p className='text-xs md:text-sm pb-4'>
          As you are not currently registered to vote, you may choose to click
          on the link corresponding to your state from the list below to
          officially register as a voter. Please note that this registration is
          optional and not required to use the Electo App.
        </p>

        <div className='flex flex-col gap-2 h-[calc(100vh_-_410px)] overflow-auto'>
          {links.map((link: any, index) => (
            <Link
              href={link.href}
              key={index}
              target='_blank'
              className='w-fit'
            >
              <p className='text-sm  '>
                {index + 1}.{' '}
                <span className='underline text-blue-600'>{link.state}</span>
              </p>
            </Link>
          ))}
        </div>
      </div>

      <div className='flex justify-between gap-3 w-full mt-[40px]'>
        <Link href='bills' className='w-full'>
          <Button
            className='w-full rounded-full '
            type='button'
            text='Continue'
          />
        </Link>
      </div>
    </div>
  );
}
