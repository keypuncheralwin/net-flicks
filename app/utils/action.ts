'use server';

import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';
import { homePageRequests, movieRequests, tvRequests } from './apiCalls';
import { authOptions } from './auth';
import prisma from './db';
import { AddToWatchlistParams } from './types';

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
  } catch (error: any) {
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
  } catch (error: any) {
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
}: AddToWatchlistParams): Promise<{ success: boolean; message: string }> {
  'use server';

  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    console.error('No session or user email found');
    throw new Error('Authentication required');
  }

  console.log('Adding to watchlist with parameters:', {
    movieId,
    title,
    imagePath,
    mediaType,
    date,
    overview,
    voteAverage,
    youtubeString,
  });

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
    return { success: true, message: 'Movie added to watchlist successfully' };
  } catch (error) {
    console.error('Error adding to watchlist:', error);
    return { success: false, message: 'Failed to add movie to watchlist' };
  }
}

export async function removeFromWatchlist(
  movieId: number,
  pathName: string
): Promise<{ success: boolean; message: string }> {
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
    if (pathName.includes('list')) {
      revalidatePath(pathName);
    }
    if (result.count > 0) {
      // If one or more entries are deleted
      return {
        success: true,
        message: 'Movie removed from watchlist successfully',
      };
    } else {
      // If no entries are deleted (meaning the movie was not found in the watchlist for this user)
      return { success: false, message: 'Movie not found in watchlist' };
    }
  } catch (error) {
    console.error('Error removing from watchlist:', error);
    return {
      success: false,
      message: 'An error occurred while removing the movie from the watchlist',
    };
  }
}

export async function existsInWatchlist(
  movieId: number
): Promise<{ exists: boolean; youtubeString?: string }> {
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

export async function getWatchlistItems() {
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
    revalidatePath('/home/user/list');

    return {
      success: true,
      message: 'Watchlist items retrieved successfully',
      watchlist: watchlistItems,
    };
  } catch (error) {
    console.error('Error retrieving watchlist items:', error);
    return { success: false, message: 'Failed to retrieve watchlist items' };
  }
}

export async function getFeaturedMedia() {
  'use server';

  try {
    // Fetch all IDs from the Featured table
    const featuredIds = await prisma.featured.findMany({
      select: {
        id: true,
      },
    });

    if (featuredIds.length === 0) {
      console.error('No featured items found');
      return { success: false, message: 'No featured items found' };
    }

    // Generate a random index based on the number of entries
    const randomIndex = Math.floor(Math.random() * featuredIds.length);
    const randomId = featuredIds[randomIndex].id;

    // Fetch the full record for the randomly selected ID
    const randomFeaturedItem = await prisma.featured.findUnique({
      where: {
        id: randomId,
      },
    });

    return {
      success: true,
      message: 'Random featured item retrieved successfully',
      featuredItem: randomFeaturedItem,
    };
  } catch (error) {
    console.error('Error retrieving random featured item:', error);
    return {
      success: false,
      message: 'Failed to retrieve random featured item',
    };
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
    fetch(homePageRequests.netflixOriginals).then((res) => res.json()),
    fetch(homePageRequests.trending).then((res) => res.json()),
    fetch(homePageRequests.topRated).then((res) => res.json()),
    fetch(homePageRequests.actionMovies).then((res) => res.json()),
    fetch(homePageRequests.comedyMovies).then((res) => res.json()),
    fetch(homePageRequests.horrorMovies).then((res) => res.json()),
    fetch(homePageRequests.romanceMovies).then((res) => res.json()),
    fetch(homePageRequests.documentaries).then((res) => res.json()),
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

export const getAllTv = async () => {
  const [trendingTv, topRatedTv, comedyTv, dramaTv, documentaryTv] =
    await Promise.all([
      fetch(tvRequests.trendingTv).then((res) => res.json()),
      fetch(tvRequests.topRatedTv).then((res) => res.json()),
      fetch(tvRequests.comedyTv).then((res) => res.json()),
      fetch(tvRequests.dramaTv).then((res) => res.json()),
      fetch(tvRequests.documentaryTv).then((res) => res.json()),
    ]);

  return {
    trendingTv: trendingTv.results,
    topRatedTv: topRatedTv.results,
    comedyTv: comedyTv.results,
    dramaTv: dramaTv.results,
    documentaryTv: documentaryTv.results,
  };
};

export const getAllMovies = async () => {
  const [
    trendingMovies,
    topRatedMovies,
    comedyMovies,
    horrorMovies,
    documentariesMovies,
  ] = await Promise.all([
    fetch(movieRequests.trendingMovies).then((res) => res.json()),
    fetch(movieRequests.topRatedMovies).then((res) => res.json()),
    fetch(movieRequests.comedyMovies).then((res) => res.json()),
    fetch(movieRequests.horrorMovies).then((res) => res.json()),
    fetch(movieRequests.documentariesMovies).then((res) => res.json()),
  ]);

  return {
    trendingMovies: trendingMovies.results,
    topRatedMovies: topRatedMovies.results,
    comedyMovies: comedyMovies.results,
    horrorMovies: horrorMovies.results,
    documentariesMovies: documentariesMovies.results,
  };
};
