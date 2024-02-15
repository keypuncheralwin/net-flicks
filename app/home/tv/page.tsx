import HomeCarousel from '@/app/components/HomeCarousel';
import { getAllTv } from '@/app/utils/action';
import { authOptions } from '@/app/utils/auth';
import { getServerSession } from 'next-auth';

export default async function TvPage() {
  const session = await getServerSession(authOptions);
  const data = await getAllTv();
  return (
    <div className="px-2 md:px-0">
      <h1 className="text-3xl font-bold pt-10 -mb-[50px]">
        Ready to channel surf?
      </h1>
      <HomeCarousel data={data.trendingTv} title={'Trending'} />
      <HomeCarousel data={data.comedyTv} title={'Comedy'} />
      <HomeCarousel data={data.dramaTv} title={'Drama'} />
      <HomeCarousel data={data.topRatedTv} title={'Top Rated'} />
      <HomeCarousel data={data.documentaryTv} title={'Documentaries'} />
    </div>
  );
}
