import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import React from 'react';
import ReactPlayer from 'react-player/youtube';

interface iAppProps {
  title: string;
  overview: string;
  youtubeUrl: string;
  state: boolean;
  changeState: any;
  release: number;
  age: number;
  duration: number;
}

export default function PlayVideoModal({
  changeState,
  overview,
  state,
  title,
  youtubeUrl,
  age,
  duration,
  release,
}: iAppProps) {
  return (
    <Dialog
      open={state}
      onOpenChange={() => changeState(!state)}
    >
      <DialogContent className="p-0 w-full max-w-4xl h-auto overflow-hidden rounded-lg bg-black">
        {/* Video player */}
        <div className="relative" style={{ paddingTop: '60%' }}>
          <ReactPlayer
            url={youtubeUrl}
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
        <strong className="text-lg">{title}</strong>
          <div className="flex items-center text-white mb-4 pt-2">
            <span className="text-sm pr-2">{release}</span>
            <span className="text-sm border py-0.5 px-1 border-gray-200 rounded">
              {age}+
            </span>
            <span className="text-sm pl-2 ">{duration}h</span>
          </div>
          <p className="text-sm text-white">{overview}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
