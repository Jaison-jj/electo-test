'use client';

import { motion, useCycle } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { useRecoilState } from 'recoil';

import { SIDE_NAV_ITEMS } from '@/lib/constants';
import { cn } from '@/lib/utils';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import { userAtom } from '@/store/user.atom';

// import SampleProfilePic from '@/../public/images/auth/profilePicUpload.png';
import DownArrow from '@/../public/images/downArrow.png';
import CompanyLogoNew from '@/../public/svg/logoHeaderNew.svg';

type MenuItemWithSubMenuProps = {
  item: any;
  toggleOpen: () => void;
};

const sidebar = {
  open: (height = 1000) => ({
    clipPath: `circle(${height * 2 + 200}px at 100% 0)`,
    transition: {
      type: 'spring',
      stiffness: 20,
      restDelta: 2,
    },
  }),
  closed: {
    clipPath: 'circle(0px at 100% 0)',
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 40,
    },
  },
};

const HeaderMobile = () => {
  const [userState] = useRecoilState(userAtom);

  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  // const pathname = usePathname();
  const containerRef = useRef(null);
  const { height } = useDimensions(containerRef);
  const [isOpen, toggleOpen] = useCycle(false, true);
  const [openSubmenus, setOpenSubmenus] = useState<any>({});

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

  const renderSubMenu = (subMenu: any) => {
    return (
      <ul className='submenu '>
        {subMenu.map((subItem: any, index: any) => (
          <li
            key={index}
            onClick={(e) => toggleSubMenu(e, subItem.path)}
            className=' bg-[#f7f7f8]'
          >
            {/* <MenuItem> */}
            <Link
              href={subItem.submenu ? '#' : subItem.path}
              className={cn('flex justify-between gap-2 pl-10 pr-2 py-2')}
            >
              <span
                className={cn('text-black', {
                  'text-[#63667B]': subItem.textColor,
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
            {/* </MenuItem> */}
            {subItem.children && (
              <div className=''>{renderSubMenu(subItem.children)}</div>
            )}
          </li>
        ))}
      </ul>
    );
  };

  if (!hydrated) return null;

  return (
    <motion.nav
      initial={false}
      animate={isOpen ? 'open' : 'closed'}
      custom={height}
      className={`fixed inset-0 z-50 w-full md:hidden  ${isOpen ? '' : 'max-h-[48px] '}`}
      ref={containerRef}
    >
      <motion.div
        className='absolute inset-0 right-0  bg-white z-10'
        variants={sidebar}
      />

      <motion.ul
        variants={variants}
        className={cn(
          ' absolute grid  px-10  py-8 max-h-screen overflow-y-auto z-50 no-scrollbar',
          {
            'hidden z-50 fixed': !isOpen,
          },
        )}
      >
        {/* {SIDE_NAV_ITEMS.map((item, idx) => {
          return (
            <div key={idx}>
              {item.submenu ? (
                <MenuItemWithSubMenu item={item} toggleOpen={toggleOpen} />
              ) : (
                <MenuItem>
                  <Link
                    href={item.path}
                    onClick={() => toggleOpen()}
                    className={`flex w-full text-sm ${
                      item.path === pathname ? 'font-bold' : ''
                    }`}
                  >
                    {item.title}
                  </Link>
                </MenuItem>
              )}
            </div>
          )
        })} */}

        <motion.div variants={sidebar} className=' flex flex-col gap-2 '>
          <Avatar className='flex items-center w-10 h-10   z-0'>
            <AvatarImage
              src={`${process.env.BASE_URL}/${userState.image}`}
              alt='sponsor'
            />
            <AvatarFallback>
              <span className='text-muted-foreground uppercase'>
                {userState?.firstName?.at(0) || ''}
                {userState?.lastName?.at(0) || ''}
              </span>
            </AvatarFallback>
          </Avatar>
          <p className='font-semibold text-base'>
            {userState.firstName} {userState.lastName}
          </p>
          <p className='font-normal text-sm text-muted-foreground'>
            {userState.userName}
          </p>
          <p className='text-white font-normal text-sm bg-black text-center py-[10px] rounded-md w-[223px]'>
            Elector Score 308
          </p>
        </motion.div>
        <hr className='h-[1px] my-[17px] bg-gray-100 border-1 rounded dark:bg-gray-700' />

        {SIDE_NAV_ITEMS.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.li
              variants={MenuItemVariants}
              key={index}
              onClick={(e) => toggleSubMenu(e, item.path)}
              className=''
            >
              <Link
                href={item.submenu ? '#' : item.path}
                onClick={() => toggleOpen()}
                className={cn(
                  'flex gap-3 items-center justify-between  px-2 py-2',
                )}
                prefetch
              >
                <div className='flex gap-3 items-center'>
                  {Icon && (
                    <Icon
                      className={cn('w-[24px] h-[24px] text-[#63667B]', {})}
                    />
                  )}
                  {item.title}
                </div>
                {item.children && (
                  <ChevronDown
                    className={`w-[24px] h-[24px] text-muted-foreground `}
                  />
                )}
              </Link>

              {item.children && renderSubMenu(item.children)}
            </motion.li>
          );
        })}

        {/* <MenuItem>
          <Link
            href={'/bills'}
            onClick={() => toggleOpen()}
            className={`flex w-full text-sm ${
              '/bills' === pathname ? 'font-bold' : ''
            }`}
          >
            Bills
          </Link>
        </MenuItem> */}
      </motion.ul>
      <div
        className={cn(
          'h-12 w-full flex justify-between items-center bg-white px-4',
        )}
      >
        <Link href='/profile'>
          <Avatar className='flex items-center lg:w-10 w-8 lg:h-10 h-8 z-0'>
            <AvatarImage
              src={`${process.env.BASE_URL}/${userState.image}`}
              alt='avatar'
            />
            <AvatarFallback>
              <span className='text-muted-foreground uppercase'>
                {userState.firstName?.at(0) || ''}
                {userState.lastName?.at(0) || ''}
              </span>
            </AvatarFallback>
          </Avatar>
        </Link>
        {/* <Link href='/bills' className='font-syncopate text-lg font-semibold'>
          Electo
        </Link> */}
        <Link href='/bills' className=''>
          <CompanyLogoNew className='w-[110px] h-[25px]' />
        </Link>

        <MenuToggle toggle={toggleOpen} />
      </div>
    </motion.nav>
  );
};

export default HeaderMobile;

const MenuToggle = ({ toggle }: { toggle: any }) => (
  <button
    onClick={toggle}
    className='pointer-events-auto z-30' //absolute right-4 top-[14px] z-30
  >
    <svg width='23' height='23' viewBox='0 0 23 23'>
      <Path
        variants={{
          closed: { d: 'M 2 2.5 L 20 2.5' },
          open: { d: 'M 3 16.5 L 17 2.5' },
        }}
      />
      <Path
        d='M 2 9.423 L 20 9.423'
        variants={{
          closed: { opacity: 1 },
          open: { opacity: 0 },
        }}
        transition={{ duration: 0.1 }}
      />
      <Path
        variants={{
          closed: { d: 'M 2 16.346 L 20 16.346' },
          open: { d: 'M 3 2.5 L 17 16.346' },
        }}
      />
    </svg>
  </button>
);

const Path = (props: any) => (
  <motion.path
    fill='transparent'
    strokeWidth='2'
    stroke='hsl(0, 0%, 18%)'
    strokeLinecap='round'
    {...props}
  />
);

const MenuItem = ({
  className,
  children,
}: {
  className?: string;
  children?: ReactNode;
}) => {
  return (
    <motion.li variants={MenuItemVariants} className={className}>
      {children}
    </motion.li>
  );
};

// eslint-disable-next-line unused-imports/no-unused-vars
const MenuItemWithSubMenu: React.FC<MenuItemWithSubMenuProps> = ({
  item,
  toggleOpen,
}) => {
  const pathname = usePathname();
  const [subMenuOpen, setSubMenuOpen] = useState(false);

  return (
    <>
      <MenuItem>
        <button
          className='flex w-full text-sm'
          onClick={() => setSubMenuOpen(!subMenuOpen)}
        >
          <div className='flex flex-row justify-between items-center'>
            <span
              className={`${pathname.includes(item.path) ? 'font-bold' : ''}`}
            >
              {item.title}
            </span>
            <div
              className={`${subMenuOpen && 'rotate-180 '} transition ease-in-out duration-300`}
            >
              <Image src={DownArrow} alt='' width={24} height={24} />
            </div>
          </div>
        </button>
      </MenuItem>
      <div className='mt-1 ml-2 flex flex-col space-y-2'>
        {subMenuOpen && (
          <>
            {item.children?.map((subItem: any, subIdx: any) => {
              return (
                <MenuItem key={subIdx}>
                  <Link
                    href={subItem.path}
                    onClick={() => toggleOpen()}
                    className={` ${
                      subItem.path === pathname ? 'font-bold' : ''
                    }`}
                  >
                    {subItem.title}
                  </Link>
                </MenuItem>
              );
            })}
          </>
        )}
      </div>
    </>
  );
};

const MenuItemVariants = {
  open: {
    y: 0,
    opacity: 1,
    transition: {
      y: { stiffness: 1000, velocity: -100 },
    },
  },
  closed: {
    y: 50,
    opacity: 0,
    transition: {
      y: { stiffness: 1000 },
      duration: 0.02,
    },
  },
};

const variants = {
  open: {
    transition: { staggerChildren: 0.02, delayChildren: 0.15 },
  },
  closed: {
    transition: { staggerChildren: 0.01, staggerDirection: -1 },
  },
};

const useDimensions = (ref: any) => {
  const dimensions = useRef({ width: 0, height: 0 });

  useEffect(() => {
    if (ref.current) {
      dimensions.current.width = ref.current.offsetWidth;
      dimensions.current.height = ref.current.offsetHeight;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref]);

  return dimensions.current;
};
