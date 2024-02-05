import prisma from '@/app/utils/db';

export async function GET() {
  try {
    const streamingServices = await prisma.streamingService.findMany();
    return new Response(JSON.stringify(streamingServices), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Failed to fetch streaming services:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to fetch streaming services',
        message:
          error instanceof Error ? error.message : 'An unknown error occurred',
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
