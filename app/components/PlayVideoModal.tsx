import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import {
  CheckCircle2,
  PauseCircle,
  PlayCircle,
  PlusCircle,
  Volume2,
  VolumeX,
} from 'lucide-react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
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
  setWatchList: (value: boolean) => void;
  updateWatchlist?: (movieId: number) => void;
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
  setWatchList,
  updateWatchlist,
}: iAppProps) {
  const pathName = usePathname();
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(true);
  const { toast } = useToast();

  const togglePlay = () => {
    setPlaying(!playing);
  };

  const toggleMute = () => {
    setMuted(!muted);
  };
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

    if (add.success) {
      setWatchList(true);
      toast({
        title: 'Added to watchlist',
        description: title + ' is now in your watchlist',
      });
    } else {
      toast({
        title: 'Error',
        description: 'Failed to add to watchlist',
        variant: 'destructive',
      });
    }
  };
  const removeFromWatchList = async () => {
    const remove = await removeFromWatchlist(movieId, pathName);
    if (remove.success) {
      setWatchList(false);
      toast({
        title: 'Removed from watchlist',
        description: title + ' is no longer in your watchlist',
      });
      if (updateWatchlist) {
        updateWatchlist(movieId);
      }
    } else {
      toast({
        title: 'Error',
        description: 'Failed to remove ' + title + ' from your watchlist',
        variant: 'destructive',
      });
    }
  };
  return (
    <Dialog open={state} onOpenChange={() => changeState(!state)}>
      <DialogContent className="p-0 w-full max-w-4xl h-auto overflow-hidden rounded-lg bg-black">
        {/* Video player */}
        <div className="relative" style={{ paddingTop: '60%' }}>
          {youtubeString ? (
            <ReactPlayer
              url={youtubeString}
              className="react-player absolute top-0 left-0"
              width="100%"
              height="100%"
              playing={playing}
              muted={muted}
              controls={false}
              config={{
                playerVars: {
                  modestbranding: 1,
                  controls: 0,
                  showinfo: 0,
                  iv_load_policy: 3,
                },
              }}
            />
          ) : (
            <div className="absolute top-0 left-0 w-full h-full">
              <Image
                src={imagePath.replace('/w500/', '/original/')}
                alt="Movie Poster"
                layout="fill"
                objectFit="cover" // Adjust as needed
              />
            </div>
          )}
          {/* Control Buttons */}
          <div className="absolute bottom-4 left-4 flex items-center space-x-4">
            {' '}
            {youtubeString && (
              <>
                <button onClick={togglePlay}>
                  {playing ? (
                    <PauseCircle className="h-7 w-7 text-gray-500 hover:text-white cursor-pointer" />
                  ) : (
                    <PlayCircle className="h-7 w-7 text-gray-500 hover:text-white cursor-pointer" />
                  )}
                </button>
                {/* Mute/Unmute Button */}
                <button onClick={toggleMute}>
                  {muted ? (
                    <VolumeX className="h-7 w-7 text-gray-500 hover:text-white cursor-pointer" />
                  ) : (
                    <Volume2 className="h-7 w-7 text-gray-500 hover:text-white cursor-pointer" />
                  )}
                </button>
              </>
            )}
          </div>
        </div>

        <div className="p-4 z-20 bg-opacity-80">
          <div className="flex">
            <div className=" flex flex-col pb-2">
              <strong className="text-lg pr-2">{title}</strong>
              <span className="text-xs">{date}</span>
            </div>
            {watchList ? (
              <CheckCircle2
                onClick={removeFromWatchList}
                className=" h-7 w-7 text-gray-500 hover:text-white cursor-pointer"
              />
            ) : (
              <PlusCircle
                onClick={addToWatchList}
                className="h-7 w-7 text-gray-500 hover:text-white cursor-pointer"
              />
            )}
          </div>

          <p className="pb-5 text-sm text-white">{overview}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
