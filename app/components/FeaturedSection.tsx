'use client';

import { Button } from '@/components/ui/button';
import { PlayCircle } from 'lucide-react';
import { useState } from 'react';
import { existsInWatchlist } from '../utils/action';
import { FeaturedMedia } from '../utils/types';
import PlayVideoModal from './PlayVideoModal';
import ScoreCircle from './ScoreCircle';

interface FeaturedSectionProps {
  data: FeaturedMedia | null;
}

export default function FeaturedSection(props: FeaturedSectionProps) {
  const [open, setOpen] = useState(false);
  const [watchList, setWatchList] = useState(false);

  if (!props.data) {
    return null;
  }
  const {
    imagePath,
    title,
    overview,
    youtubeString,
    movieId,
    date,
    voteAverage,
    mediaType,
  } = props.data;

  const handleClick = async () => {
    const watchList = await existsInWatchlist(movieId);
    setOpen(true);
    if (watchList.exists) {
      setWatchList(true);
      return;
    }
    setWatchList(false);
  };

  return (
    <>
      <Button onClick={handleClick} className="text-lg font-medium">
        <PlayCircle className="mr-2 h-6 w-6" /> Play
      </Button>
      <div>
        <ScoreCircle score={voteAverage} />
      </div>
      <PlayVideoModal
        key={movieId}
        title={title}
        overview={overview}
        state={open}
        changeState={setOpen}
        date={date}
        youtubeString={youtubeString}
        movieId={movieId}
        voteAverage={voteAverage}
        mediaType={mediaType as string}
        imagePath={imagePath}
        watchList={watchList}
        setWatchList={setWatchList}
      />
    </>
  );
}
