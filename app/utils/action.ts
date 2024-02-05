'use server';

import { revalidatePath } from 'next/cache';
import prisma from './db';
import { getServerSession } from 'next-auth';
import { authOptions } from './auth';
import requests from './apiCalls';
import { AddToWatchlistParams, GetWatchlistResult } from './types';

export async function addNewUser(name: string, email: string) {
  'use server';
  try {
    // Check if a user with the given email already exists
    const existingUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (existingUser) {
      // If user exists, return an error message
      return { success: false, message: 'Email already exists' };
    } else {
      // If user does not exist, create a new user
      await prisma.user.create({
        data: {
          name: name,
          email: email,
        },
      });
      return { success: true, message: 'Successfully added name and email' };
    }
  } catch (error:any) {
    return { success: false, message: 'An error occurred: ' + error.message };
  }
}

export async function checkUserExists(email: string) {
  'use server';
  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    return {
      success: existingUser != null,
      message: existingUser ? 'Email exists' : 'Email does not exist',
    };
  } catch (error:any) {
    // Handle any other errors
    return { success: false, message: 'An error occurred: ' + error.message };
  }
}

export async function addToWatchlist({
  movieId,
  title,
  imagePath,
  mediaType,
  date,
  overview,
  voteAverage,
  youtubeString,
}: AddToWatchlistParams): Promise<{ success: boolean; message: string }>  {
  'use server';

  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    console.error('No session or user email found');
    throw new Error('Authentication required');
  }

  try {
    const newWatchlistEntry = await prisma.watchList.create({
      data: {
        userId: session.user.email,
        movieId,
        title,
        imagePath,
        mediaType,
        date,
        overview,
        voteAverage,
        youtubeString,
      },
    });

    console.log('New watchlist entry added:', newWatchlistEntry);
    return { success: true, message: 'Movie added to watchlist successfully'};
  } catch (error) {
    console.error('Error adding to watchlist:', error);
    return { success: false, message: 'Failed to add movie to watchlist' };
  }
}


export async function removeFromWatchlist(movieId: number): Promise<{ success: boolean; message: string }> {
  'use server';
  
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    console.error('No session or user email found');
    return { success: false, message: 'Authentication required' }; 
  }

  try {
    const userId = session.user.email; 

    // Delete the watchlist entry with the given userId and movieId
    const result = await prisma.watchList.deleteMany({
      where: {
        userId: userId,
        movieId: movieId,
      },
    });

    if (result.count > 0) {
      // If one or more entries are deleted
      return { success: true, message: 'Movie removed from watchlist successfully' };
    } else {
      // If no entries are deleted (meaning the movie was not found in the watchlist for this user)
      return { success: false, message: 'Movie not found in watchlist' };
    }
  } catch (error) {
    console.error('Error removing from watchlist:', error);
    return { success: false, message: 'An error occurred while removing the movie from the watchlist' };
  }
}

export async function existsInWatchlist(movieId: number): Promise<{ exists: boolean; youtubeString?: string }> {
  'use server';
  
  // Retrieve the session and consequently the user's email as their ID
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    console.error('No session or user email found');
    throw new Error('Authentication required'); // Or handle this case as needed
  }

  try {
    const userId = session.user.email;

    // Query the database to check for an existing watchlist entry with the given userId and movieId
    const watchlistEntry = await prisma.watchList.findFirst({
      where: {
        userId: userId,
        movieId: movieId,
      },
    });

    if (watchlistEntry) {
      // If an entry is found, return true and the youtubeString
      return { exists: true, youtubeString: watchlistEntry.youtubeString };
    } else {
      // If no entry is found, return false and no youtubeString
      return { exists: false };
    }
  } catch (error) {
    console.error('Error checking watchlist:', error);
    throw error;
  }
}

export async function getWatchlistItems(): Promise<GetWatchlistResult> {
  'use server';

  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    console.error('No session or user email found');
    return { success: false, message: 'Authentication required' };
  }

  try {
    const userId = session.user.email as string;
    const watchlistItems = await prisma.watchList.findMany({
      where: {
        userId: userId,
      },
    });

    return { 
      success: true, 
      message: 'Watchlist items retrieved successfully', 
      watchlist: watchlistItems 
    };
  } catch (error) {
    console.error('Error retrieving watchlist items:', error);
    return { success: false, message: 'Failed to retrieve watchlist items' };
  }
}


export const getAllMedia = async () => {
  const [
    netflixOriginals,
    trendingNow,
    topRated,
    actionMovies,
    comedyMovies,
    horrorMovies,
    romanceMovies,
    documentaries,
  ] = await Promise.all([
    fetch(requests.netflixOriginals).then((res) => res.json()),
    fetch(requests.trending).then((res) => res.json()),
    fetch(requests.topRated).then((res) => res.json()),
    fetch(requests.actionMovies).then((res) => res.json()),
    fetch(requests.comedyMovies).then((res) => res.json()),
    fetch(requests.horrorMovies).then((res) => res.json()),
    fetch(requests.romanceMovies).then((res) => res.json()),
    fetch(requests.documentaries).then((res) => res.json()),
  ]);

  return {
    netflixOriginals: netflixOriginals.results,
    trendingNow: trendingNow.results,
    topRated: topRated.results,
    actionMovies: actionMovies.results,
    comedyMovies: comedyMovies.results,
    horrorMovies: horrorMovies.results,
    romanceMovies: romanceMovies.results,
    documentaries: documentaries.results,
  };
};
