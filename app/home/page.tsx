import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import React from 'react';
import { authOptions } from '../utils/auth';
import FeaturedVideo from '../components/FeaturedVideo';
import HomeCarousel from '../components/HomeCarousel';
import { getAllMedia, getFeaturedMedia } from '../utils/action';
import { HomePageData } from '../utils/types';

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  const data: HomePageData = await getAllMedia();
  const featuredData = await getFeaturedMedia();

  if (!session) {
    return redirect('/login');
  }
  return (
    <div className="p-5 lg:p-0">
      <FeaturedVideo data={featuredData.featuredItem} />
      <HomeCarousel data={data.trendingNow} title={'Trending'} />
      <HomeCarousel data={data.topRated} title={'Top Rated'} />
      <HomeCarousel data={data.comedyMovies} title={'Comedy'} />
      <HomeCarousel data={data.actionMovies} title={'Action'} />
    </div>
  );
}
