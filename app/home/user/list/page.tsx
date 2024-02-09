import { MovieCard } from '@/app/components/MovieCard';
import { getWatchlistItems } from '@/app/utils/action';
import { authOptions } from '@/app/utils/auth';
import prisma from '@/app/utils/db';
import { getServerSession } from 'next-auth';
import Image from 'next/image';

export default async function Watchlist() {
  const watchlist = await getWatchlistItems();
  if (!watchlist.watchlist) {
    return null;
  }
  const data = watchlist.watchlist;
  return (
    <div className="px-2 md:px-0">
      <h1 className="text-3xl font-bold pt-10 mb-10">My WatchList</h1>
      {/* Updated to a flex container with wrap */}
      <div className="md:flex md:flex-wrap gap-4 mt-5 grid grid-cols-2">
        {data.map((movie) => (
          <div
            key={movie.id}
            className="relative h-28 min-w-[180px] cursor-pointer transition duration-200 ease-out md:h-36 md:min-w-[260px] hover:scale-110 hover:z-10"
            style={{ padding: '0 10px' }} // Adjust padding to control image size
          >
            <Image
              src={`https://image.tmdb.org/t/p/w500${movie.imagePath}`}
              alt="Movie"
              className="rounded-sm object-cover md:rounded p-2 md:p-0"
              layout="fill"
              objectFit="contain" // Adjust image fitting within its container
            />
            {/* Overlay that appears on hover */}
            <div className="absolute inset-0 bg-black bg-opacity-0 flex items-center justify-center opacity-0 transition-opacity duration-500 ease-in-out hover:bg-opacity-50 hover:opacity-100">
              <MovieCard
                movieId={movie.movieId}
                overview={movie.overview}
                title={movie.title}
                year={movie.date}
                mediaType={movie.mediaType as string}
                score={movie.voteAverage}
                imagePath={`https://image.tmdb.org/t/p/w500${movie.imagePath}`}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
