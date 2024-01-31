import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import React from 'react';
import GoogleSignInButton from '@/app/components/GoogleSignInButton';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/utils/auth';
import { redirect } from 'next/navigation';
import AuthForm from '@/app/components/AuthForm';

export default async function Login() {
  const session = await getServerSession(authOptions);
  if (session) {
    return redirect('/home');
  }
  return (
    <div className="rounded-2xl bg-black/80 py-10 px-6 w-96 h-96">
      <div className='p-2'>
      <AuthForm authType="login" />
      </div>
      <div className="text-gray-500 text-sm mt-2 p-2">
        New to Neflix?{' '}
        <Link className="text-white hover:underline" href="/sign-up">
          Sign up now!
        </Link>
      </div>
      <div className="flex w-full justify-center items-center gap-x-3 mt-6">
        <GoogleSignInButton />
      </div>
    </div>
  );
}
