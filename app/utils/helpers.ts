import { YoutubeVideoResult } from './types';

/**
 * Validates an email address using a regular expression.
 * @param email - The email address to validate.
 * @returns true if the email is valid, false otherwise.
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Checks if a name is not empty.
 * @param name - The name to check.
 * @returns true if the name is not empty, false otherwise.
 */
export function isNotEmpty(name: string): boolean {
  return name.trim().length > 0;
}

/**
 * Fetches the YouTube trailer URL for a given movie or TV show from TMDb.
 *
 * @param {number} movieId - The ID of the movie or TV show.
 * @param {string} mediaType - The type of the media, either 'tv' for TV shows or 'movie' for movies.
 * @returns {Promise<string|null>} A promise that resolves to the YouTube trailer URL if found, or null otherwise.
 */
export async function fetchYouTubeTrailerUrl(movieId: number, mediaType?: string): Promise<string | null> {
  const API_KEY = process.env.NEXT_PUBLIC_TMDB_API;
  const BASE_URL = 'https://api.themoviedb.org/3';

  async function fetchTrailerUrl(type: string): Promise<string | null> {
    try {
      const url = `${BASE_URL}/${type}/${movieId}?api_key=${API_KEY}&language=en-US&append_to_response=videos`;
      const response = await fetch(url);
      const data = await response.json();

      if (data?.videos?.results?.length > 0) {
        const trailer = data.videos.results.find((video: any) => video.type === 'Trailer');
        if (trailer) {
          return `https://www.youtube.com/watch?v=${trailer.key}`;
        }
      }
    } catch (error) {
      console.error(`Error fetching YouTube trailer URL for ${type}:`, error);
      return null;
    }
    return null;
  }

  if (!mediaType) {
    // If mediaType is undefined, try 'movie' first, then 'tv'
    const movieTrailerUrl = await fetchTrailerUrl('movie');
    if (movieTrailerUrl) return movieTrailerUrl;

    const tvTrailerUrl = await fetchTrailerUrl('tv');
    if (tvTrailerUrl) return tvTrailerUrl;

    return null; // Return null if no trailer found for both types
  } else {
    // If mediaType is defined, use it directly
    return await fetchTrailerUrl(mediaType);
  }
}

