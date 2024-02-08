const API_KEY = process.env.NEXT_PUBLIC_TMDB_API;
const BASE_URL = 'https://api.themoviedb.org/3';

export const homePageRequests = {
  trending: `${BASE_URL}/trending/all/week?api_key=${API_KEY}&language=en-US`,
  netflixOriginals: `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_networks=213`,
  topRated: `${BASE_URL}/movie/top_rated?api_key=${API_KEY}&language=en-US`,
  actionMovies: `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=en-US&with_genres=28`,
  comedyMovies: `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=en-US&with_genres=35`,
  horrorMovies: `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=en-US&with_genres=27`,
  romanceMovies: `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=en-US&with_genres=10749`,
  documentaries: `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=en-US&with_genres=99`,
};

export const tvRequests = {
  trendingTv: `${BASE_URL}/trending/tv/week?api_key=${API_KEY}&language=en-US`,
  topRatedTv: `${BASE_URL}/tv/top_rated?api_key=${API_KEY}&language=en-US`,
  comedyTv: `${BASE_URL}/discover/tv?api_key=${API_KEY}&language=en-US&with_genres=35`,
  dramaTv: `${BASE_URL}/discover/tv?api_key=${API_KEY}&language=en-US&with_genres=18`,
  documentaryTv: `${BASE_URL}/discover/tv?api_key=${API_KEY}&language=en-US&with_genres=99`,
};

export const movieRequests = {
  trendingMovies: `${BASE_URL}/trending/movie/week?api_key=${API_KEY}&language=en-US`,
  topRatedMovies: `${BASE_URL}/movie/top_rated?api_key=${API_KEY}&language=en-US`,
  comedyMovies: `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=en-US&with_genres=35`,
  horrorMovies: `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=en-US&with_genres=27`,
  documentariesMovies: `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=en-US&with_genres=99`,
};