import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import React from 'react';
import { authOptions } from '../utils/auth';
import MovieVideo from '../components/MovieVideo';
import HomeCarousel from '../components/HomeCarousel';
import { getMedia } from '../utils/action';

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  const data = await getMedia('tv', session?.user?.email as string);

  if (!session) {
    return redirect('/login');
  }
  return (
    <div className="p-5 lg:p-0">
      <MovieVideo />
      <HomeCarousel data={data} title={'TV'} />
    </div>
  );
}
