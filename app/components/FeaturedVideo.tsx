import Image from 'next/image';
import { FeaturedMedia } from '../utils/types';
import FeaturedSection from './FeaturedSection';

type FeaturedProps = {
  data: FeaturedMedia | undefined | null;
};

export default async function FeaturedVideo({ data }: FeaturedProps) {
  if (!data) {
    console.log('No featured data');
    return null;
  }
  const { imagePath, videoSource, title, overview } = data;

  return (
    <div className="h-[40vh] w-full flex justify-start items-center">
      <video
        poster={imagePath}
        autoPlay
        muted
        loop
        src={videoSource}
        className=" w-full absolute top-0 left-0 h-[80vh] object-cover -z-10 brightness-[60%] hidden lg:block lg:-mt-[135px] "
      ></video>
      <div className="lg:hidden absolute top-0 left-0 w-full h-[60vh] -z-10">
        <Image
          src={`https://image.tmdb.org/t/p/original${imagePath}`}
          alt="Featured Movie"
          layout="fill"
          objectFit="cover"
          className="brightness-[50%]"
        />
      </div>

      <div className="absolute w-[90%] lg:w-[40%] mx-auto">
        <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-bold">
          {title}
        </h1>
        <p className="text-white text-lg mt-5 line-clamp-3">{overview}</p>
        <div className="flex gap-x-3 mt-4">
          <FeaturedSection data={data} />
        </div>
      </div>
    </div>
  );
}
