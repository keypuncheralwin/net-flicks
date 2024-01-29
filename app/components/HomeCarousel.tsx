'use client';
import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { MovieCard } from './MovieCard';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';

type HomeCarouselProps = {
  data: any;
  title: string
};

export default function HomeCarousel({ data, title }: HomeCarouselProps) {
  const datas = [...data, ...data, ...data]; // Duplicated the array 3 times
  const rowRef = useRef<HTMLDivElement>(null);
  const [isMoved, setIsMoved] = useState(false);

  const handleClick = (direction: string) => {
    setIsMoved(true);
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollTo =
        direction === 'left'
          ? scrollLeft - clientWidth
          : scrollLeft + clientWidth;
      rowRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <div className="h-40 space-y-0.5 md:space-y-2">
      <h2 className="w-56 cursor-pointer text-sm font-semibold text-[#e5e5e5] transition duration-200 hover:text-white md:text-2xl">
        {title}
      </h2>
      <div className="relative md:-ml-2">
        <ChevronLeftIcon
          className={`absolute top-0 bottom-0 left-2 z-40 m-auto h-9 w-9 cursor-pointer transition hover:scale-125 ${
            !isMoved && 'hidden'
          }`}
          onClick={() => handleClick('left')}
        />

        <div
          ref={rowRef}
          className="flex items-center space-x-0.5 overflow-hidden scrollbar-hide md:space-x-2.5 md:p-2"
        >
          {datas.map((movie, index) => (
            <div
              key={movie.id}
              className="relative h-28 min-w-[180px] cursor-pointer transition duration-200 ease-out md:h-36 md:min-w-[260px] hover:scale-110 hover:z-10"
            >
              <Image
                src={movie.imageString}
                alt="Movie"
                className="rounded-sm object-cover md:rounded"
                layout="fill"
              />
              {/* Overlay that appears on hover */}
              <div className="absolute inset-0 bg-black bg-opacity-0 flex items-center justify-center opacity-0 transition-opacity duration-500 ease-in-out hover:bg-opacity-50 hover:opacity-100">
                <MovieCard
                  movieId={movie.id}
                  overview={movie.overview}
                  title={movie.title}
                  youtubeUrl={movie.youtubeString}
                  watchList={movie.WatchLists.length > 0}
                  age={movie.age}
                  time={movie.duration}
                  year={movie.release}
                  wachtListId={movie.WatchLists[0]?.id}
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
