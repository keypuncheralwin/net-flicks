import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import FeaturedVideo from '../components/FeaturedVideo';
import HomeSection from '../components/HomeSection';
import SkeletonLoader from '../components/SkeletonLoader';
import { getFeaturedMedia } from '../utils/action';
import { authOptions } from '../utils/auth';

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  const featuredData = await getFeaturedMedia();
  const titles = ['Trending', 'Top Rated', 'Comedy', 'Action'];
  if (!session) {
    return redirect('/login');
  }
  return (
    <div className="p-5 lg:p-0">
      <FeaturedVideo data={featuredData.featuredItem} />
      <Suspense
        fallback={titles.map((title, index) => (
          <SkeletonLoader title={title} key={index} />
        ))}
      >
        <HomeSection />
      </Suspense>
    </div>
  );
}
