import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import React from 'react';
import { authOptions } from '../utils/auth';
import MovieVideo from '../components/MovieVideo';
import HomeCarousel from '../components/HomeCarousel';
import { getAllMedia} from '../utils/action';
import { HomePageData } from '../utils/types';

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  const data: HomePageData = await getAllMedia();

  if (!session) {
    return redirect('/login');
  }
  return (
    <div className="p-5 lg:p-0">
      <MovieVideo />
      <HomeCarousel data={data.trendingNow} title={'Trending'} />
    </div>
  );
}
