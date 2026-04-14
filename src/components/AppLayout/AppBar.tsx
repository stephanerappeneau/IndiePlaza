import React, { useCallback, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import clsx from 'clsx';
import { IconButton } from '@/components/AppLayout/IconButton';

const BLOG_URL = 'https://medium.com/indie-plaza';
const ABOUT_PATH = '/about';
const PUBLISHER_QUEST_PATH = '/tools/publisher-quest';

export const AppBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = useCallback(() => setIsOpen((prev) => !prev), []);

  return (
    <nav className="sticky top-0 z-50 flex items-start justify-between flex-wrap pt-4 pb-2 px-2 bg-white transition-all duration-300 ease-in-out shadow-lg">
      <Link href="/" className="flex items-end gap-2 font-bold text-2xl">
        <Image
          src="/assets/Logo.png"
          alt="Logo indie plaza"
          width={200}
          height={100}
          loading="lazy"
        />
      </Link>

      <div className="block grid lg:hidden">
        <IconButton
          className="flex items-center px-3 py-2"
          src="/assets/Menu.svg"
          alt="menu"
          handleClick={toggleMenu}
        />
      </div>

      <div
        className={clsx({
          'w-full flex inline-block justify-center lg:flex lg:items-center lg:w-auto lg:relative lg:right-2':
            true,
          hidden: !isOpen,
          block: isOpen,
        })}
      >
        <div className="flex text-sm lg:flex lg:items-center">
          <div className="flex lg:order-1">
            <Link
              href={ABOUT_PATH}
              className="block mt-4 lg:inline-block lg:mt-0 mr-4 navbar-link hover:text-orange-500 duration-75 cursor-pointer font-semibold text-base text-light-black"
            >
              About
            </Link>
            <a
              href={BLOG_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="block mt-4 lg:inline-block lg:mt-0 mr-4 navbar-link hover:text-orange-500 duration-75 cursor-pointer font-semibold text-base text-light-black"
            >
              Blog
            </a>
            <Link
              href={PUBLISHER_QUEST_PATH}
              className="block mt-4 lg:inline-block lg:mt-0 mr-4 navbar-link hover:text-orange-500 duration-75 cursor-pointer font-semibold text-base text-light-black"
            >
              Publisher Quest
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};
