'use client';

import { Button, buttonVariants } from '@/components/ui/button';
import PlayVideoModal from './PlayVideoModal';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Element } from '../utils/types';
import ScoreCircle from './ScoreCircle';
import { existsInWatchlist } from '../utils/action';

interface iAppProps {
  title: string;
  overview: string;
  movieId: number;
  year: string;
  score: number;
  mediaType: string;
  imagePath: string;
}

export function MovieCard({
  movieId,
  overview,
  title,
  year,
  mediaType,
  score,
  imagePath,
}: iAppProps) {
  const [open, setOpen] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [watchList, setWatchList] = useState(false)

  const handleClick = async () => {
    const watchList = await existsInWatchlist(movieId)
    setOpen(true);
    if(watchList.exists){
      setVideoUrl(watchList.youtubeString as string)
      setWatchList(true)
      return
    }
    setWatchList(false)
    const data = await fetch(
      `https://api.themoviedb.org/3/${
        mediaType === 'tv' ? 'tv' : 'movie'
      }/${movieId}?api_key=${
        process.env.NEXT_PUBLIC_TMDB_API
      }&language=en-US&append_to_response=videos`
    )
      .then((response) => response.json())
      .catch((err) => console.log(err.message));

    if (data?.videos) {
      const index = data.videos.results.findIndex(
        (element: Element) => element.type === 'Trailer'
      );
      setVideoUrl(
        `https://www.youtube.com/watch?v=${data.videos?.results[index]?.key}`
      );
    }
  };

  return (
    <>
      <div
        className="relative h-28 min-w-[180px] md:h-36 md:min-w-[260px]"
        onClick={() => handleClick()}
      >
        <div className="right-1 top-1 md:right-2 md:top-2 absolute z-10"></div>
        <div className="absolute top-0 right-0 p-2">
          <ScoreCircle score={score} />
        </div>
        <div className="p-3 absolute bottom-0 left-0">
          <h1 className="font-bold text-lg line-clamp-1">{title}</h1>
          <p className="text-xs">{year}</p>
        </div>
      </div>
      <PlayVideoModal
        key={movieId}
        title={title}
        overview={overview}
        state={open}
        changeState={setOpen}
        date={year}
        youtubeString={videoUrl}
        movieId={movieId}
        voteAverage={score}
        mediaType={mediaType as string}
        imagePath={imagePath}
        watchList={watchList}
        setWatchList={setWatchList}
      />
    </>
  );
}
