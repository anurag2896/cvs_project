import axios from 'axios';
import dotenv from 'dotenv';
import {
  Movie,
  DiscoverMovieResponse,
  DiscoverMovie,
  CreditsResponse,
  CrewMember,
} from './movieServiceTypes';

dotenv.config();

const API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

if (!API_KEY) {
  throw new Error('TMDB_API_KEY is not defined in the environment variables.');
}

/**
 * Fetch movies by a given year and page.
 * @param year The year to fetch movies for.
 * @param page The page number for paginated results.
 * @returns Promise<Movie[]>
 */
export async function getMoviesByYear(year: string, page: number = 1): Promise<Movie[]> {
  try {
    const discoverResponse = await axios.get<DiscoverMovieResponse>(`${BASE_URL}/discover/movie`, {
      params: {
        api_key: API_KEY,
        language: 'en-US',
        sort_by: 'popularity.desc',
        page: page,
        primary_release_year: year,
      },
    });

    const movies: Movie[] = await Promise.all(
      discoverResponse.data.results.map(async (movie: DiscoverMovie) => {
        try {
          const creditsResponse = await axios.get<CreditsResponse>(`${BASE_URL}/movie/${movie.id}/credits`, {
            params: { api_key: API_KEY },
          });

          const editors = creditsResponse.data.crew
            .filter((member: CrewMember) => member.known_for_department === 'Editing')
            .map((editor: CrewMember) => editor.name);

          return {
            title: movie.title,
            release_date: new Date(movie.release_date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              timeZone: 'UTC',
            }),
            vote_average: movie.vote_average,
            editors,
          };
        } catch (error) {
          console.error(`Error fetching credits for movie ${movie.id}:`, error);
          return {
            title: movie.title,
            release_date: new Date(movie.release_date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            }),
            vote_average: movie.vote_average,
            editors: [],
          };
        }
      })
    );

    return movies;
  } catch (error) {
    console.error('Error fetching movies:', error);
    throw error;
  }
}

// Example usage
if (require.main === module) {
  (async () => {
    try {
      const movies = await getMoviesByYear('2019', 1); // Fetch page 1 of movies for 2019
      console.log(JSON.stringify(movies, null, 2));
    } catch (error) {
      console.error('Error:', error);
    }
  })();
}
