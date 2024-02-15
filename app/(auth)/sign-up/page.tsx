import AuthForm from '@/app/components/AuthForm';
import GoogleSignInButton from '@/app/components/GoogleSignInButton';
import { authOptions } from '@/app/utils/auth';
import { getServerSession } from 'next-auth';
import Link from 'next/link';
import { redirect } from 'next/navigation';

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
        <GoogleSignInButton />
      </div>
    </div>
  );
}
