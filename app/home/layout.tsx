import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { ReactNode } from 'react';
import Navbar from '../components/Navbar';
import { authOptions } from '../utils/auth';

export default async function HomeLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return redirect('/login');
  }

  return (
    <>
      <Navbar userName={session?.user?.name} userEmail={session?.user?.email} />
      <main className="w-full mx-auto sm:px-6 lg:px-8">{children}</main>
    </>
  );
}
