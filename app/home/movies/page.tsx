'use client';
import HomeCarousel from '@/app/components/HomeCarousel';
import SkeletonLoader from '@/app/components/SkeletonLoader';
import { getAllMovies } from '@/app/utils/action';
import { Movie } from '@/app/utils/types';
import { useEffect, useState } from 'react';

interface MoviesData {
  trendingMovies: Movie[];
  topRatedMovies: Movie[];
  comedyMovies: Movie[];
  horrorMovies: Movie[];
  documentariesMovies: Movie[];
}

const MoviesPage = () => {
  const [data, setData] = useState<MoviesData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const titles = ['Trending', 'Comedy', 'Horror', 'Top Rated', 'Documentaries'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const moviesData = await getAllMovies();
        setData(moviesData);
      } catch (error) {
        console.error('Error fetching movies:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="px-2 md:px-0">
      <h1 className="text-3xl font-bold pt-10 mb-[-50px]">
        Grab some popcorn for these Movies!
      </h1>
      {isLoading ? (
        titles.map((title, index) => (
          <SkeletonLoader title={title} key={index} />
        ))
      ) : (
        <>
          <HomeCarousel data={data?.trendingMovies} title={'Trending'} />
          <HomeCarousel data={data?.comedyMovies} title={'Comedy'} />
          <HomeCarousel data={data?.horrorMovies} title={'Horror'} />
          <HomeCarousel data={data?.topRatedMovies} title={'Top Rated'} />
          <HomeCarousel
            data={data?.documentariesMovies}
            title={'Documentaries'}
          />
        </>
      )}
    </div>
  );
};

export default MoviesPage;
