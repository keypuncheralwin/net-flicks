import { NextRequest, NextResponse } from 'next/server';
import ytdl from 'ytdl-core';
import { UploadApiResponse, v2 as cloudinary } from 'cloudinary';
import { Movie } from '@/app/utils/types';
import prisma from '@/app/utils/db';
import { fetchYouTubeTrailerUrl } from '@/app/utils/helpers';

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API;
const BASE_URL = 'https://api.themoviedb.org/3';

export async function POST(request: NextRequest) {
  // Extract movieId from the request
  const movieId = request.nextUrl.searchParams.get('movieId');
  const mediaType = request.nextUrl.searchParams.get('mediaType');
  if (!movieId || !mediaType) {
    return new Response(
      JSON.stringify({ error: 'Movie ID and Media Type are required' }),
      {
        status: 400,
      }
    );
  }

  try {
    // Fetch movie details from TMDb
    const movieResponse = await fetch(
      `${BASE_URL}/${mediaType}/${movieId}?api_key=${API_KEY}`
    );
    const movieData: Movie = await movieResponse.json();

    // Assume logic to extract YouTube URL from movieData.videos
    const youtubeUrl = await fetchYouTubeTrailerUrl(
      parseInt(movieId),
      mediaType
    );
    if (!youtubeUrl) throw new Error('Failed to get youtube url');

    // Use ytdl-core to download and upload the trailer to Cloudinary
    const info = await ytdl.getInfo(youtubeUrl);
    const format = info.formats.find(
      (format) =>
        format.qualityLabel === '1080p' && format.hasVideo && !format.hasAudio
    );
    if (!format) throw new Error('1080p video-only format not found');

    const movieName = movieData.title || movieData.original_name;
    const customFileName = movieName
      .split(/\s+|[^a-zA-Z0-9]/)
      .filter(Boolean)
      .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
      .join('');
    const cloudinaryUpload: UploadApiResponse = await new Promise(
      (resolve, reject) => {
        const videoStream = ytdl.downloadFromInfo(info, { format });
        const cloudinaryStream = cloudinary.uploader.upload_stream(
          {
            resource_type: 'video',
            public_id: `featured/${customFileName}`,
          },
          (error, result?: UploadApiResponse) => {
            // Note the optional result here
            if (error) {
              reject(error);
            } else if (!result) {
              reject(
                new Error('Cloudinary upload resulted in undefined response')
              );
            } else {
              resolve(result); // result is now guaranteed to be not undefined
            }
          }
        );

        videoStream.pipe(cloudinaryStream);
      }
    );

    // Update the database with movie details including Cloudinary and YouTube URLs
    await prisma.featured.create({
      data: {
        movieId: parseInt(movieId),
        title: movieData.title || movieData.original_name,
        imagePath: movieData.poster_path || movieData.backdrop_path,
        mediaType: 'movie',
        date: movieData.release_date || movieData.first_air_date,
        overview: movieData.overview,
        voteAverage: movieData.vote_average,
        youtubeString: youtubeUrl,
        videoSource: cloudinaryUpload.url,
      },
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Movie added to db and uploaded to Cloudinary.',
        url: cloudinaryUpload.url,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('Error processing request:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to process request',
        message: error.message,
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
