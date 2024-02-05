import { Dialog, DialogContent } from '@/components/ui/dialog';
import { CheckCircle2, PlusCircle } from 'lucide-react';
import React, { useState } from 'react';
import ReactPlayer from 'react-player/youtube';
import { addToWatchlist, removeFromWatchlist } from '../utils/action';

interface iAppProps {
  title: string;
  overview: string;
  state: boolean;
  changeState: any;
  date: string;
  movieId: number;
  imagePath: string;
  mediaType: string;
  voteAverage: number;
  youtubeString: string;
  watchList: boolean;
  setWatchList: (value:boolean) => void;
}

export default function PlayVideoModal({
  changeState,
  overview,
  state,
  title,
  youtubeString,
  date,
  movieId,
  imagePath,
  mediaType,
  voteAverage,
  watchList,
  setWatchList
}: iAppProps) {

  const addToWatchList = async () => {
    const add = await addToWatchlist({
      mediaType,
      date,
      movieId,
      imagePath,
      voteAverage,
      title,
      overview,
      youtubeString,
    });

    if(add.success){
      setWatchList(true)
    }
  };
  const removeFromWatchList = async () => {
    const remove = await removeFromWatchlist(movieId)
    if(remove.success){
      setWatchList(false)
    }
  }
  return (
    <Dialog open={state} onOpenChange={() => changeState(!state)}>
      <DialogContent className="p-0 w-full max-w-4xl h-auto overflow-hidden rounded-lg bg-black">
        {/* Video player */}
        <div className="relative" style={{ paddingTop: '60%' }}>
          <ReactPlayer
            url={youtubeString}
            className="react-player absolute top-0 left-0"
            width="100%"
            height="100%"
            playing
            muted={true}
            controls={false}
            config={{
              playerVars: {
                modestbranding: 1,
                controls: 0,
                showinfo: 0,
                iv_load_policy: 3, // This parameter disables annotations
              },
            }}
          />
        </div>
        <div className="p-4 z-20 bg-opacity-80">
          <div className="flex">
            <div className=" flex flex-col pb-2">
              <strong className="text-lg pr-2">{title}</strong>
              <span className="text-xs">{date}</span>
            </div>
            {watchList ? <CheckCircle2 onClick={removeFromWatchList} className=" h-7 w-7 text-gray-500 hover:text-white cursor-pointer" /> :
            <PlusCircle
            onClick={addToWatchList}
            className="h-7 w-7 text-gray-500 hover:text-white cursor-pointer"
          />}
          </div>

          <p className="text-sm text-white">{overview}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
