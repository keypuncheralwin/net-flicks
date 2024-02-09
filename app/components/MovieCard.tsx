'use client';
import PlayVideoModal from './PlayVideoModal';
import { useState } from 'react';
import ScoreCircle from './ScoreCircle';
import { existsInWatchlist } from '../utils/action';
import { fetchYouTubeTrailerUrl } from '../utils/helpers';

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
  const [watchList, setWatchList] = useState(false);

  const handleClick = async () => {
    const watchList = await existsInWatchlist(movieId);
    setOpen(true);
    console.log(imagePath);
    if (watchList.exists) {
      setVideoUrl(watchList.youtubeString as string);
      setWatchList(true);
      return;
    }
    setWatchList(false);
    const youtubeUrl = await fetchYouTubeTrailerUrl(movieId, mediaType);
    if (youtubeUrl) {
      setVideoUrl(youtubeUrl);
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
