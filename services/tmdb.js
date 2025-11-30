import { API_KEY, BASE_URL } from "../constants";

const fetchFromTMDB = async (endpoint, params = {}) => {
  const url = new URL(`${BASE_URL}${endpoint}`);
  url.searchParams.append("api_key", API_KEY);
  url.searchParams.append("language", "en-US");

  Object.keys(params).forEach((key) =>
    url.searchParams.append(key, params[key])
  );

  try {
    const response = await fetch(url.toString());

    if (!response.ok) {
      let errorMessage = `Error fetching data: ${response.status} ${response.statusText}`;
      try {
        const errorBody = await response.json();
        if (errorBody.status_message) {
          errorMessage = `TMDB API Error: ${errorBody.status_message}`;
        }
      } catch (e) {
        // Fallback to default error message if JSON parse fails
      }
      throw new Error(errorMessage);
    }

    return response.json();
  } catch (error) {
    throw error;
  }
};

export const getTrendingDaily = () => fetchFromTMDB("/trending/movie/day");
export const getTrendingWeekly = (page = 1) =>
  fetchFromTMDB("/trending/movie/week", { page: page.toString() });
export const getUpcoming = () => fetchFromTMDB("/movie/upcoming");
export const searchMovies = (query, page = 1, year) => {
  const params = { query, page: page.toString(), include_adult: "false" };
  if (year) params.primary_release_year = year;
  return fetchFromTMDB("/search/movie", params);
};
export const getMovieDetails = (id) => fetchFromTMDB(`/movie/${id}`);
export const getMovieVideos = (id) => fetchFromTMDB(`/movie/${id}/videos`);
export const getGenres = () => fetchFromTMDB("/genre/movie/list");
