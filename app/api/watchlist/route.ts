// pages/api/watchlist.js
import { authOptions } from '@/app/utils/auth';
import prisma from '@/app/utils/db';
import { getServerSession } from 'next-auth';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    console.error('No session or user email found');
    return new Response('Authentication required', { status: 401 });
  }

  try {
    const watchlistItems = await prisma.watchList.findMany({
      where: {
        userId: session.user.email,
      },
    });

    if (!watchlistItems) {
      return new Response('Watchlist not found', { status: 404 });
    }

    return new Response(
      JSON.stringify({ success: true, watchlist: watchlistItems }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error: any) {
    console.error('Error retrieving watchlist items:', error);
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Failed to retrieve watchlist items',
        error: error.message,
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}
