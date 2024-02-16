'use client';
import HomeCarousel from '@/app/components/HomeCarousel';
import SkeletonLoader from '@/app/components/SkeletonLoader';
import { getAllTv } from '@/app/utils/action';
import { Movie } from '@/app/utils/types';
import { useEffect, useState } from 'react';

interface TvData {
  trendingTv: Movie[];
  topRatedTv: Movie[];
  comedyTv: Movie[];
  dramaTv: Movie[];
  documentaryTv: Movie[];
}
const TvPage = () => {
  const [data, setData] = useState<TvData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const titles = ['Trending', 'Comedy', 'Drama', 'Top Rated', 'Documentaries'];

  useEffect(() => {
    const fetchData = async () => {
      const tvData = await getAllTv();
      setData(tvData);
      setIsLoading(false);
    };

    fetchData();
  }, []);

  return (
    <div className="px-2 md:px-0">
      <h1 className="text-3xl font-bold pt-10 mb-[-50px]">
        Ready to channel surf?
      </h1>
      {isLoading ? (
        titles.map((title, index) => (
          <div key={index}>
            <SkeletonLoader key={index} title={title} />
          </div>
        ))
      ) : (
        <>
          <HomeCarousel data={data?.trendingTv} title={'Trending'} />
          <HomeCarousel data={data?.comedyTv} title={'Comedy'} />
          <HomeCarousel data={data?.dramaTv} title={'Drama'} />
          <HomeCarousel data={data?.topRatedTv} title={'Top Rated'} />
          <HomeCarousel data={data?.documentaryTv} title={'Documentaries'} />
        </>
      )}
    </div>
  );
};

export default TvPage;
