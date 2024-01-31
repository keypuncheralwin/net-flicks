import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import GooogleIcon from '../../../public/google.svg';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/utils/auth';
import { redirect } from 'next/navigation';
import AuthForm from '@/app/components/AuthForm';

export default async function SignUp() {
  const session = await getServerSession(authOptions);
  if (session) {
    return redirect('/home');
  }
  return (
    <div className="rounded-2xl bg-black/80 py-10 px-6 w-96 h-96">
      <AuthForm authType="sign-up" />

      <div className="text-gray-500 text-sm mt-2">
        Already Have a account?{'  '}
        <Link className="text-white hover:underline" href="/login">
          Log in now!
        </Link>
      </div>
      <div className="flex w-full justify-center items-center gap-x-3 mt-6">
        <Button variant="outline">
          <Image src={GooogleIcon} alt="Google icon" className="w-6 h-6 mr-2" />
          Sign in with Google
        </Button>
      </div>
    </div>
  );
}
