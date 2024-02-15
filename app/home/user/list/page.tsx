'use client';
import React, { useEffect, useState } from 'react';
import { MovieCard } from '@/app/components/MovieCard';
import Image from 'next/image';
import { AddToWatchlistParams } from '@/app/utils/types';

export default function Watchlist() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const updateWatchlist = (movieId: number) => {
    setData(
      data.filter((item: AddToWatchlistParams) => item.movieId !== movieId)
    );
  };

  useEffect(() => {
    async function fetchWatchlist() {
      setLoading(true);
      try {
        // Update the URL to include the email as a query parameter
        const response = await fetch(`/api/watchlist`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const watchlist = await response.json();
        setData(watchlist.watchlist || []);
      } catch (error) {
        console.error('Failed to fetch the watchlist: ', error);
      } finally {
        setLoading(false);
      }
    }

    fetchWatchlist();
  }, []);

  if (loading) {
    return <div>Loading your watchlist...</div>;
  }

  if (data.length === 0) {
    return <div>Your watchlist is empty.</div>;
  }

  return (
    <div className="px-2 sm:px-0">
      <h1 className="text-3xl font-bold pt-10 mb-10">My WatchList</h1>
      <div className="md:flex md:flex-wrap sm:gap-4 mt-5 grid grid-cols-2">
        {data.map((movie: AddToWatchlistParams) => (
          <div
            key={movie.movieId}
            className="relative h-28 min-w-[180px] cursor-pointer transition duration-200 ease-out md:h-36 md:min-w-[260px] hover:scale-110 hover:z-10"
            style={{ padding: '0 10px' }}
          >
            <Image
              src={`https://image.tmdb.org/t/p/w500${movie.imagePath}`}
              alt="Movie"
              className="rounded-sm object-cover md:rounded p-2 md:p-0"
              layout="fill"
              objectFit="contain"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 flex items-center justify-center opacity-0 transition-opacity duration-500 ease-in-out hover:bg-opacity-50 hover:opacity-100">
              <MovieCard
                movieId={movie.movieId}
                overview={movie.overview}
                title={movie.title}
                year={movie.date}
                mediaType={movie.mediaType as string}
                score={movie.voteAverage}
                imagePath={`https://image.tmdb.org/t/p/w500${movie.imagePath}`}
                updateWatchlist={updateWatchlist}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
