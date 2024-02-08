// For testing purposees only

import { NextRequest } from 'next/server';
import prisma from '@/app/utils/db';

export async function DELETE(request: NextRequest) {
  const email = request.nextUrl.searchParams.get('email');
  if (!email) {
    return new Response('No Email found', {
      status: 404,
    });
  }

  try {
    const user = await prisma?.user.findUnique({
      where: { email: email },
      select: { id: true },
    });

    if (!user) {
      return new Response('User not found', { status: 404 });
    }

    await prisma?.account.deleteMany({
      where: { userId: user.id },
    });
    await prisma?.session.deleteMany({
      where: { userId: user.id },
    });
    await prisma?.user.delete({
      where: { email: email },
    });

    return new Response('User and all related records deleted successfully', {
      status: 200,
    });
  } catch (error) {
    // Pass error.message in the response
    return new Response(
      JSON.stringify({ error: 'User deletion failed', message: error.message }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}

export async function GET(request: NextRequest) {
  const email = request.nextUrl.searchParams.get('email');
  if (!email) {
    return new Response('No Email specified', {
      status: 400,
    });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: email },
      include: {
        accounts: true, // Include related accounts
        sessions: true, // Include related sessions
      },
    });

    if (!user) {
      return new Response('User not found', { status: 404 });
    }

    return new Response(JSON.stringify(user), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: 'Error fetching user data',
        message: error.message,
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