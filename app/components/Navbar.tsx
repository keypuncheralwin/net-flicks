'use client';

import Image from 'next/image';
import Link from 'next/link';
import Logo from '../../public/netflicks_logo.png';
import { Bell, ChevronDown, Search } from 'lucide-react';
import { usePathname } from 'next/navigation';
import UserNav from './UserNav';
import { useEffect, useState } from 'react';

interface linkProps {
  name: string;
  href: string;
}

const links: linkProps[] = [
  { name: 'Home', href: '/home' },
  { name: 'TV', href: '/home/tv' },
  { name: 'Movies', href: '/home/movies' },
  { name: 'My List', href: '/home/user/list' },
];

interface NavbarProps {
  userName?: string | null;
  userEmail?: string | null;
}

export default function Navbar(props: NavbarProps) {
  const pathName = usePathname();
  const [hasScrolled, setHasScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State to manage dropdown visibility

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 10) {
        setHasScrolled(true);
      } else {
        setHasScrolled(false);
      }
    };

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);

    // Clean up the event listener
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div
      className={`sticky top-0 z-50 w-full mx-auto items-center justify-between px-5 sm:px-6 py-5 lg:px-8 flex transition duration-300 ease-in-out ${hasScrolled ? 'bg-black bg-opacity-90' : 'bg-transparent'}`}
    >
      <div className="flex items-center">
        <Link href="/home" className="w-32">
          <Image src={Logo} alt="Netflix logo" priority />
        </Link>
        <div className="sm:hidden relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className=" pl-2 flex text-sm items-center text-gray-300"
          >
            Browse <ChevronDown className="w-4 h-4" />
          </button>
          {isDropdownOpen && (
            <ul className="absolute left-0 top-full bg-black w-40 mt-2 rounded-md shadow-lg">
              {links.map((link, idx) => (
                <li
                  key={idx}
                  className="border-b border-gray-700 last:border-b-0"
                >
                  <Link
                    href={link.href}
                    className={`block px-4 py-2 text-sm ${pathName === link.href ? 'text-white font-semibold' : 'text-gray-300 font-normal'}`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
        <ul className="hidden sm:flex gap-x-4 ml-14">
          {links.map((link, idx) => (
            <li key={idx}>
              <Link
                href={link.href}
                className={`${pathName === link.href ? 'text-white font-semibold underline' : 'text-gray-300 font-normal'} text-sm`}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex items-center gap-x-8">
        <Search className="w-5 h-5 text-gray-300 cursor-pointer" />
        <Bell className="h-5 w-5 text-gray-300 cursor-pointer" />
        <UserNav userName={props.userName} userEmail={props.userEmail} />
      </div>
    </div>
  );
}
