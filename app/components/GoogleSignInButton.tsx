'use client';

import { Button } from '@/components/ui/button';
import { signIn } from 'next-auth/react';
import Image from 'next/image';
import GooogleIcon from '../../public/google.svg';

export default function GoogleSignInButton() {
  return (
    <Button onClick={() => signIn('google')} variant="outline">
      <Image src={GooogleIcon} alt="Google icon" className="w-6 h-6 mr-2" />
      Sign in with Google
    </Button>
  );
}
