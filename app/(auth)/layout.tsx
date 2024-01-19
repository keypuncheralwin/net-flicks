import React, { ReactNode } from 'react';
import Image from 'next/image';
import BackgroundImage from '../../public/login_background.jpg';
import Logo from '../../public/netflicks_logo.png';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen w-screen flex-col bg-black items-center justify-center md:bg-transparent">
      <Image
        src={BackgroundImage}
        alt="background image"
        className="hidden sm:flex sm:object-cover -z-10 brightness-50"
        priority
        fill
      />

      <Image
        src={Logo}
        alt="Logo"
        width={220}
        height={220}
        priority
        className="object-contain pb-2"
      />
      {children}
    </div>
  );
}
