import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import React from 'react';
import { authOptions } from '../utils/auth';
import Navbar from '../components/Navbar';
import MovieVideo from '../components/MovieVideo';
import RecentlyAdded from '../components/RecentlyAdded';

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return redirect('/login');
  }
  return (
    <div className="p-5 lg:p-0">
      <MovieVideo />
      <h1 className="text-3xl font-bold ">Recently Added</h1>
      <RecentlyAdded />
    </div>
  );
}
