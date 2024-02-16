'use client';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import Image from 'next/image';
import { useRef, useState } from 'react';
import { Movie } from '../utils/types';
import { MovieCard } from './MovieCard';
import SkeletonLoader from './SkeletonLoader';

type HomeCarouselProps = {
  data: Movie[] | null | undefined;
  title: string;
};

export default function HomeCarousel({ data, title }: HomeCarouselProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [isMoved, setIsMoved] = useState(false);

  if (!data) {
    return <SkeletonLoader title={title} />;
  }

  const handleClick = (direction: string) => {
    setIsMoved(true);
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;

      const scrollTo =
        direction === 'left'
          ? scrollLeft - clientWidth / 1.5
          : scrollLeft + clientWidth / 1.5;
      rowRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <div className=" relative space-y-0.5 md:space-y-0.5 mt-20 -mb-[120px]">
      <h2 className="absolute top-0 p-1 left-0 cursor-pointer text-2xl font-semibold text-[#e5e5e5] transition duration-200 hover:text-white z-20">
        {title}
      </h2>
      <div className="relative">
        <ChevronLeftIcon
          className={`absolute top-0 bottom-0 left-2 z-40 m-auto h-9 w-9 cursor-pointer transition hover:scale-125 ${
            !isMoved && 'hidden'
          }`}
          onClick={() => handleClick('left')}
        />

        <div
          ref={rowRef}
          className="flex h-60 items-center space-x-3.5 overflow-hidden scrollbar-hide md:space-x-4"
        >
          {data.map((movie, index) => (
            <div
              key={movie.id}
              className="relative h-28 min-w-[180px] cursor-pointer transition duration-200 ease-out md:h-36 md:min-w-[260px] hover:scale-110 hover:z-10"
            >
              <Image
                src={`https://image.tmdb.org/t/p/w500${
                  movie.backdrop_path || movie.poster_path
                }`}
                alt="Movie"
                className="rounded-sm object-cover md:rounded"
                layout="fill"
              />
              {/* Overlay that appears on hover */}
              <div className="absolute inset-0 bg-black bg-opacity-0 flex items-center justify-center opacity-0 transition-opacity duration-500 ease-in-out hover:bg-opacity-50 hover:opacity-100">
                <MovieCard
                  movieId={movie.id}
                  overview={movie.overview}
                  title={movie?.title || movie?.original_name}
                  year={movie?.release_date || movie.first_air_date}
                  mediaType={movie.media_type as string}
                  score={movie.vote_average}
                  imagePath={`https://image.tmdb.org/t/p/w500${
                    movie.backdrop_path || movie.poster_path
                  }`}
                />
              </div>
            </div>
          ))}
        </div>

        <ChevronRightIcon
          className={`absolute top-0 bottom-0 right-2 z-40 m-auto h-9 w-9 cursor-pointer transition hover:scale-125`}
          onClick={() => handleClick('right')}
        />
      </div>
    </div>
  );
}
