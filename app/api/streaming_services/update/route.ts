import { NextRequest } from 'next/server';
import prisma from '@/app/utils/db';

interface TMDBProvider {
  provider_id: number;
  provider_name: string;
  logo_path: string;
}

interface TMDBProvidersResponse {
  results: TMDBProvider[];
}

export async function POST(request: NextRequest) {
  const apiKey = process.env.TMDB_API;
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: 'TMDB API Key is required.' }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  const providerNames = [
    'Netflix',
    'Hulu',
    'Apple TV',
    'Amazon Prime Video',
    'HBO Max',
    'BINGE',
    'Disney Plus',
  ];
  const providersUrl = `https://api.themoviedb.org/3/watch/providers/movie?api_key=${apiKey}`;

  try {
    const response = await fetch(providersUrl);
    if (!response.ok) throw new Error('Failed to fetch from TMDB API');
    const data: TMDBProvidersResponse = await response.json();

    for (const providerName of providerNames) {
      const provider = data.results.find(
        (p) => p.provider_name === providerName
      );

      if (provider) {
        // Update or insert the provider data
        await prisma.streamingService.upsert({
          where: { providerId: provider.provider_id },
          update: {
            name: provider.provider_name,
            logoPath: provider.logo_path,
          },
          create: {
            providerId: provider.provider_id,
            name: provider.provider_name,
            logoPath: provider.logo_path,
          },
        });
      }
    }

    return new Response(
      JSON.stringify({ message: 'Streaming services updated successfully' }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: 'Error updating streaming services',
        message: error.message,
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
