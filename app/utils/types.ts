export interface Genre {
  id: number;
  name: string;
}

export interface HomePageData {
  netflixOriginals: Movie[];
  trendingNow: Movie[];
  topRated: Movie[];
  actionMovies: Movie[];
  comedyMovies: Movie[];
  horrorMovies: Movie[];
  romanceMovies: Movie[];
  documentaries: Movie[];
}

export interface Movie {
  title: string;
  backdrop_path: string;
  media_type?: string;
  release_date?: string;
  first_air_date: string;
  genre_ids: number[];
  id: number;
  name: string;
  origin_country: string[];
  original_language: string;
  original_name: string;
  overview: string;
  popularity: number;
  poster_path: string;
  vote_average: number;
  vote_count: number;
}

export type AddToWatchlistParams = {
  movieId: number;
  title: string;
  imagePath: string;
  mediaType: string | null;
  date: string;
  overview: string;
  voteAverage: number;
  youtubeString: string;
};

export type FeaturedMedia = {
  id: number;
  movieId: number;
  title: string;
  imagePath: string;
  mediaType: string | null | undefined;
  date: string;
  overview: string;
  voteAverage: number;
  youtubeString: string;
  videoSource: string;
} | null;

export interface YoutubeVideoResult {
  key: string;
  type: string;
}
export interface Element {
  type:
    | 'Bloopers'
    | 'Featurette'
    | 'Behind the Scenes'
    | 'Clip'
    | 'Trailer'
    | 'Teaser';
}
