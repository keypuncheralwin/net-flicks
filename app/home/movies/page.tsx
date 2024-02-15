import HomeCarousel from '@/app/components/HomeCarousel';
import { getAllMovies } from '@/app/utils/action';

export default async function MoviesPage() {
  const data = await getAllMovies();
  return (
    <div className="px-2 md:px-0">
      <h1 className="text-3xl font-bold pt-10 -mb-[50px]">
        Grab some popcorn for these Movies!
      </h1>
      <HomeCarousel data={data.trendingMovies} title={'Trending'} />
      <HomeCarousel data={data.comedyMovies} title={'Comedy'} />
      <HomeCarousel data={data.horrorMovies} title={'Horror'} />
      <HomeCarousel data={data.topRatedMovies} title={'Top Rated'} />
      <HomeCarousel data={data.documentariesMovies} title={'Documentaries'} />
    </div>
  );
}
