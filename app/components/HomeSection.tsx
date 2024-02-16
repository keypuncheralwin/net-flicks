import { getAllMedia } from '../utils/action';
import { HomePageData } from '../utils/types';
import HomeCarousel from './HomeCarousel';

export default async function HomeSection() {
  const data: HomePageData = await getAllMedia();
  return (
    <>
      <HomeCarousel data={data.trendingNow} title={'Trending'} />
      <HomeCarousel data={data.topRated} title={'Top Rated'} />
      <HomeCarousel data={data.comedyMovies} title={'Comedy'} />
      <HomeCarousel data={data.actionMovies} title={'Action'} />
    </>
  );
}
