'use client';

import Cookies from 'js-cookie';
import { ChevronDown, LogOut } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRouter as useNpRouter } from 'next-nprogress-bar';
import React, { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';

import { SIDE_NAV_ITEMS } from '@/lib/constants';
import { cn } from '@/lib/utils';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import { authState } from '@/store/auth.atom';
import { userAtom } from '@/store/user.atom';

const Sidebar = () => {
  const pathname = usePathname();
  const router = useNpRouter();

  const [openSubmenus, setOpenSubmenus] = useState<any>({});
  const [user] = useRecoilState(userAtom);
  const [hydrated, setHydrated] = useState(false);
  const [authStateValue, setAuthStateValue] = useRecoilState(authState);

  // const [nonLinks,setNonLinks] = useState("")
  // const onClickMenuItem = (menu: string) => {
  //   if(nonLinks) return setNonLinks("")
  //   setNonLinks(menu)
  // };

  const toggleSubMenu = (e: any, path: string) => {
    e.stopPropagation();
    const menuItem = e.target.closest('li');
    if (!menuItem) return;

    const submenu = menuItem.querySelector('ul');
    if (!submenu) return;

    setOpenSubmenus((prevOpenSubmenus: any) => ({
      ...prevOpenSubmenus,
      [path]: !prevOpenSubmenus[path],
    }));

    if (submenu.style.display === 'none' || !submenu.style.display) {
      submenu.style.display = 'block';
    } else {
      submenu.style.display = 'none';
    }
  };

  const handleLogout = () => {
    Cookies.remove('electo_u_tok');
    setAuthStateValue(() => ({
      socialSignOnMode: '',
      isNewUser: false,
      isSocialAuth: false,
      ...authStateValue,
    }));

    router.push('/sign-in');
  };

  const renderProfileImage = () => {
    if (user?.image?.startsWith('https://lh3.googleusercontent.com')) {
      return user?.image;
    }
    if (user?.image && user?.image !== 'null') {
      return `${process.env.BASE_URL}/${user?.image}`;
    }

    return '';
  };

  const renderSubMenu = (subMenu: any) => {
    return (
      <ul className='submenu '>
        {subMenu.map((subItem: any, index: any) => (
          <li
            key={index}
            onClick={(e) => toggleSubMenu(e, subItem.path)}
            className=' bg-[#f7f7f8]'
          >
            <Link
              href={subItem.submenu ? '#' : subItem.path}
              className={cn(
                'flex justify-between gap-2 hover:bg-[#a8a8bb]  pl-10 pr-2 py-2',
                { 'bg-[#63667b] text-white ': subItem.path === pathname },
              )}
            >
              <span
                className={cn('text-black ', {
                  'text-[#63667B] pl-2': subItem.textColor,
                })}
              >
                {subItem.title}
              </span>
              {subItem.children && (
                <ChevronDown
                  className={`w-[24px] h-[24px] text-muted-foreground ${
                    openSubmenus[subItem.path] ? 'transform rotate-180' : ''
                  }`}
                />
              )}
            </Link>

            {subItem.children && (
              <div className=''>{renderSubMenu(subItem.children)}</div>
            )}
          </li>
        ))}
      </ul>
    );
  };

  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) return null;

  return (
    <div className=' hidden md:flex h-full md:h-[calc(100vh_-_160px)] md:w-[167px]  lg:w-[239px] bg-white flex-col w-full'>
      <div className=' flex flex-col gap-2 py-[8px] pt-6 md:pt-2'>
        <div className='h-[70px] w-[70px] md:h-[48px] md:w-[48px]'>
          <Link href='/profile'>
            {/* <Image
              src={renderProfileImage()}
              alt='profile-pic'
              width={48}
              height={48}
              className={cn(
                `profile-pic-upload-image w-full h-full object-cover`,
                {
                  'rounded-full  w-full h-full object-cover': user?.image,
                },
              )}
            /> */}
            <Avatar className=''>
              <AvatarImage src={renderProfileImage()} alt='sponsor' />
              <AvatarFallback>
                <span className='uppercase'>{`${user.firstName[0]}${user.firstName[1]}`}</span>
              </AvatarFallback>
            </Avatar>
          </Link>
        </div>
        <p className='font-semibold text-base'>
          {user.firstName} {user.lastName}
        </p>
        <p className='font-normal text-sm text-muted-foreground'>
          {user.userName}
        </p>
        <p className='text-white font-normal text-sm bg-black text-center py-[10px] rounded-md max-w-[223px]'>
          Elector Score {user?.score ?? 0}
        </p>
      </div>
      <hr className='h-[1px] my-[17px] bg-gray-100 border-1 rounded dark:bg-gray-700' />

      <ul
        className={cn(
          'flex flex-col text-sm md:max-screen md:overflow-auto no-scrollbar',
        )}
      >
        {SIDE_NAV_ITEMS.map((item, index) => {
          const Icon = item.icon;
          return (
            <li key={index} onClick={(e) => toggleSubMenu(e, item.path)}>
              <Link
                href={item.submenu ? '#' : item.path}
                className={cn(
                  'flex gap-3 items-center justify-between bg-white hover:bg-[#a8a8bb]  px-2 py-2',
                  { 'bg-[#63667b] text-white': item.path === pathname },
                )}
                prefetch
              >
                <div className='flex gap-3 items-center'>
                  {Icon && (
                    <Icon
                      className={cn('w-[24px] h-[24px] text-[#63667B]', {
                        ' text-white': item.path === pathname,
                      })}
                    />
                  )}
                  {item.title}
                </div>
                {item.children && (
                  <ChevronDown
                    className={`w-[24px] h-[24px] text-muted-foreground ${
                      openSubmenus[item.path] ? 'transform rotate-180' : ''
                    }`}
                  />
                )}
              </Link>
              {item.children && renderSubMenu(item.children)}
            </li>
          );
        })}
        <button onClick={handleLogout} className='flex items-center gap-3 p-2'>
          <LogOut className={cn('w-[24px] h-[24px] text-[#63667B]', {})} />
          <span>Logout</span>
        </button>
      </ul>

      <hr className='h-[1px] my-4 bg-gray-100 border-0 rounded dark:bg-gray-700' />
      <p className='font-normal text-sm text-muted-foreground'>
        © {new Date().getFullYear()} Electo
      </p>
    </div>
  );
};

export default Sidebar;
