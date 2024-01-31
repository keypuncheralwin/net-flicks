'use server';

import { revalidatePath } from 'next/cache';
import prisma from './db';
import { getServerSession } from 'next-auth';
import { authOptions } from './auth';

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
          // Add other fields as required
        },
      });
      return { success: true, message: 'Successfully added name and email' };
    }
  } catch (error) {
    // Handle any other errors
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
  } catch (error) {
    // Handle any other errors
    return { success: false, message: 'An error occurred: ' + error.message };
  }
}

export async function addTowatchlist(formData: FormData) {
  'use server';

  const movieId = formData.get('movieId');
  const pathname = formData.get('pathname') as string;
  const session = await getServerSession(authOptions);

  const data = await prisma.watchList.create({
    data: {
      userId: session?.user?.email as string,
      movieId: Number(movieId),
    },
  });

  revalidatePath(pathname);
}

export async function deleteFromWatchlist(formData: FormData) {
  'use server';

  const watchlistId = formData.get('watchlistId') as string;
  const pathname = formData.get('pathname') as string;

  const data = await prisma.watchList.delete({
    where: {
      id: watchlistId,
    },
  });

  revalidatePath(pathname);
}

export async function getMedia(category: string, userId: string) {
  switch (category) {
    case 'tv': {
      const data = await prisma.movie.findMany({
        where: {
          category: 'show',
        },
        select: {
          age: true,
          duration: true,
          id: true,
          title: true,
          release: true,
          imageString: true,
          overview: true,
          youtubeString: true,
          WatchLists: {
            where: {
              userId: userId,
            },
          },
        },
      });
      return data;
    }
    case 'movies': {
      const data = await prisma.movie.findMany({
        where: {
          category: 'movie',
        },
        select: {
          age: true,
          duration: true,
          id: true,
          release: true,
          imageString: true,
          overview: true,
          youtubeString: true,
          title: true,
          WatchLists: {
            where: {
              userId: userId,
            },
          },
        },
      });

      return data;
    }
    case 'recent': {
      const data = await prisma.movie.findMany({
        where: {
          category: 'recent',
        },
        select: {
          age: true,
          duration: true,
          id: true,
          release: true,
          imageString: true,
          overview: true,
          youtubeString: true,
          title: true,
          WatchLists: {
            where: {
              userId: userId,
            },
          },
        },
      });

      return data;
    }
    default: {
      throw new Error();
    }
  }
}
