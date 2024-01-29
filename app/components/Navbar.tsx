'use client';

import Image from 'next/image';
import Link from 'next/link';
import Logo from '../../public/netflicks_logo.png';
import { Bell, Search } from 'lucide-react';
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
  { name: 'Recently Added', href: '/home/recent' },
  { name: 'My List', href: '/home/user/list' },
];

export default function Navbar() {
  const pathName = usePathname();
  const [hasScrolled, setHasScrolled] = useState(false);

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
        <ul className="lg:flex gap-x-4 ml-14 hidden">
          {links.map((link, idx) => (
            <div key={idx}>
              {pathName === link.href ? (
                <li>
                  <Link
                    href={link.href}
                    className="text-white font-semibold underline text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ) : (
                <li>
                  <Link
                    className="text-gray-300 font-normal text-sm"
                    href={link.href}
                  >
                    {link.name}
                  </Link>
                </li>
              )}
            </div>
          ))}
        </ul>
      </div>
      <div className="flex items-center gap-x-8">
        <Search className="w-5 h-5 text-gray-300 cursor-pointer" />
        <Bell className="h-5 w-5 text-gray-300 cursor-pointer" />
        <UserNav />
      </div>
    </div>
  );
}
