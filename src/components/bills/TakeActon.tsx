'use client';
import { useQuery } from '@tanstack/react-query';
import { Search } from 'lucide-react';
import { Phone } from 'lucide-react';
import { PenTool } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { LiaChalkboardTeacherSolid } from 'react-icons/lia';
import { useRecoilState } from 'recoil';
import { toast } from 'sonner';

import { cn } from '@/lib/utils';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import DropdownRaw from '@/components/utils/DropdownRaw';

import { userAtom } from '@/store/user.atom';

import { getMyOfficials, getPetitionDetails } from '@/apis/bills';

const TakeAction = (props: any) => {
  const { billId, billType } = props;
  const [{ selectedOfficial }, setUserState] = useRecoilState(userAtom);

  // eslint-disable-next-line unused-imports/no-unused-vars
  const [activeTab, setActiveTab] = React.useState('federal');
  const [activeParentTab, setActiveParentTab] = React.useState('research');
  const [open, onOpenChange] = React.useState(false);

  const { data: myOfficials } = useQuery({
    queryKey: ['get-my-officials-take-action'],
    queryFn: () => getMyOfficials(),
    refetchOnWindowFocus: false,
  });

  const onSelectContactOfficial = (e: any, value: string) => {
    e.preventDefault();
    navigator.clipboard.writeText(value).then(() => {
      toast(`Contact info "${value}" copied to the clipboard.`, {
        description: '',
        duration: 3000,
      });
      onOpenChange(false);
    });
  };

  const { data: petitionData, isPending } = useQuery({
    queryKey: ['get-petition-data'],
    queryFn: () =>
      getPetitionDetails({
        billId,
        billType: billType,
      }).then((res) => {
        const voteYayOrNay = res.bill.vote[0].voteType;
        setUserState((prev) => ({
          ...prev,
          consentGiven: res.userSignConsent || false,
          selectedBillVote: voteYayOrNay,
        }));
        return res;
      }),
    refetchOnWindowFocus: false,
    enabled: billId ? true : false,
  });

  React.useEffect(() => {
    setUserState((prev) => ({ ...prev, currentPageName: 'Take Action' }));
  }, [setUserState]);

  return (
    <div className='max-w-[886px] mt-[48px] md:mt-4 '>
      <div className='flex flex-wrap justify-between gap-4 md:px-4 px-2'>
        <ActionCard
          icon={Search}
          title='Research My Officials'
          active={activeParentTab === 'research'}
          onClick={() => setActiveParentTab('research')}
        />
        <ActionCard
          icon={Phone}
          title='Contact My Officials'
          active={activeParentTab === 'contact'}
          onClick={() => setActiveParentTab('contact')}
        />
        {billId && !isPending && (
          <ActionCard
            icon={PenTool}
            iconClassName='h-6 w-6 text-[#63667b] rotate-[43deg]'
            title='Sign Petition'
            url={`take-action/sign-petition?bill_type=${billType}&bill_name=${petitionData?.bill?.billTitle || null}`}
            openInNewTab={false}
            isDisabled={false}
          />
        )}
        <ActionCard
          icon={LiaChalkboardTeacherSolid}
          title='Political Training'
          iconClassName='h-7 w-7'
          url='https://learn.truepoliticsusa.org/'
          openInNewTab={true}
        />
      </div>
      <hr className='h-px mt-9  bg-gray-200 border-0 dark:bg-gray-700' />

      <div className='flex flex-col gap-3 px-4 md:h-[calc(100vh_-_316px)] overflow-auto'>
        <p className='text-sm text-muted-foreground font-semibold pl-4 py-2  border-b border-gray-300'>
          House of Representatives
        </p>
        {myOfficials?.data[activeTab]?.house?.map((official: any) => (
          <DropdownRaw
            key={official.id}
            trigger={
              <ContactCard
                avatarUrl=''
                id={official.id}
                fallBackText={official.firstName[0] + official.lastName[0]}
                name={official.firstName + ' ' + official.lastName}
                role='Senator'
                politicalView={official.party}
                place={official.state}
                activeParentTab={activeParentTab}
                setUserState={setUserState}
                official={official}
              />
            }
            onSelectDropdownItem={onSelectContactOfficial}
            options={{
              emails: official.emails || [],
              phones: official.phones || [],
            }}
            open={
              activeParentTab === 'contact' &&
              open &&
              selectedOfficial?.id === official.id
            }
            onOpenChange={onOpenChange}
          />
        ))}
        <p className='text-sm text-muted-foreground font-semibold pl-4 py-2  border-b border-gray-300'>
          Senate
        </p>
        {myOfficials?.data[activeTab]?.senate?.map((official: any) => (
          <ContactCard
            key={official.id}
            id={official.id}
            avatarUrl=''
            fallBackText={official.firstName[0] + official.lastName[0]}
            name={official.firstName + ' ' + official.lastName}
            role='Senator'
            politicalView={official.party}
            place={official.state}
            activeParentTab={activeParentTab}
            setUserState={setUserState}
          />
        ))}
      </div>
    </div>
  );
};

export default TakeAction;

interface ActionCardProps {
  icon: any;
  title: string;
  iconClassName?: string;
  active?: boolean;
  onClick?: () => void;
  url?: string | null;
  openInNewTab?: boolean;
  isDisabled?: boolean;
}

const ActionCard = (props: ActionCardProps) => {
  const {
    icon: Icon,
    title,
    iconClassName,
    active,
    onClick,
    url,
    openInNewTab,
    isDisabled,
  } = props;
  return (
    <Link
      href={url ? url : '#'}
      target={openInNewTab ? '_blank' : '_self'}
      className={cn(
        'flex flex-col gap-2 w-full lg:w-[48%] p-4 bg-gray-200 hover:bg-gray-400 hover:text-white rounded-2xl cursor-pointer',
        {
          'bg-black text-white': active,
          'opacity-50 hover:bg-gray-200 cursor-default hover:text-black':
            isDisabled,
        },
      )}
    >
      <div onClick={onClick}>
        <Icon
          className={cn('h-6 w-6 text-[#63667b]', iconClassName)}
          style={{ color: 'inherit' }}
        />
        <span className='text-sm'>{title}</span>
      </div>
    </Link>
  );
};

interface ContactCardProps {
  avatarUrl: string;
  fallBackText: string;
  name: string;
  role: string;
  politicalView: string;
  place: string;
  activeParentTab?: string;
  official?: any;
  setUserState?: any;
  id: string;
}

export const ContactCard = (props: ContactCardProps) => {
  const {
    avatarUrl,
    fallBackText,
    politicalView,
    role,
    place,
    name,
    activeParentTab,
    official,
    setUserState,
    id,
  } = props;

  const onClickContactCard = () => {
    setUserState((prev: any) => ({ ...prev, selectedOfficial: official }));
  };

  const renderRoute = () => {
    if (activeParentTab === 'contact') {
      return '#';
    }
    return `/account?name=${name}&id=${id}`;
  };

  return (
    <Link href={renderRoute()}>
      <div
        className='flex gap-2 bg-white hover:bg-gray-200 w-full p-2 rounded-xl'
        onClick={onClickContactCard}
      >
        <Avatar>
          <AvatarImage src={avatarUrl} />
          <AvatarFallback className='text-muted-foreground'>
            {fallBackText}
          </AvatarFallback>
        </Avatar>
        <div className='flex flex-col items-start gap-0'>
          <p className='text-sm font-medium'>{name}</p>
          <p className='text-sm text-muted-foreground'>
            {role} | {politicalView} | {place}
          </p>
        </div>
      </div>
    </Link>
  );
};
