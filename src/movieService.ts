import axios from 'axios'
import dotenv from 'dotenv'
import {
    Movie,
    DiscoverMovieResponse,
    DiscoverMovie,
    CreditsResponse,
    CrewMember
} from './movieServiceTypes'

dotenv.config()

const API_KEY = process.env.TMDB_API_KEY
const BASE_URL = 'https://api.themoviedb.org/3'

if (!API_KEY) {
    throw new Error('TMDB_API_KEY is not defined in the environment variables.')
}


/**
 * Fetched editor imformation of Movie.
 * @param movieId The movieId to fetch editor information for.
 * @returns Promise<string[]>
 */
async function getEditors(movieId: number): Promise<string[]> {
    try {
        const creditsResponse = await axios.get<CreditsResponse>(
            `${BASE_URL}/movie/${movieId}/credits`,
            {
                params: { api_key: API_KEY }
            }
        )

        return creditsResponse.data.crew
            .filter(
                (member: CrewMember) =>
                    member.known_for_department === 'Editing'
            )
            .map((editor: CrewMember) => editor.name)

        
    } catch (error) {
        console.error(
            `Error fetching credits for movie ${movieId}:`,
            error
        )
        return []
    }
}

/**
 * Sets editor imformation of Movie.
 * @param movie The movie to set editor information for.
 * @returns Promise<Movie[]>
 */
async function setMovieEditors(movie: DiscoverMovie): Promise<Movie> {
    const editors = await getEditors(movie.id)

    return {
        title: movie.title,
        release_date: new Date(
            movie.release_date
        ).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            timeZone: 'UTC'
        }),
        vote_average: movie.vote_average,
        editors
    }
}


/**
 * Fetch movies by a year and page number.
 * @param year The year to fetch movies for.
 * @param page The page number for paginated results.
 * @returns Promise<Movie[]>
 */
export async function getMoviesByYear(
    year: number,
    page: number = 1
): Promise<Movie[]> {
    try {
        const movieResponse = await axios.get<DiscoverMovieResponse>(
            `${BASE_URL}/discover/movie`,
            {
                params: {
                    api_key: API_KEY,
                    language: 'en-US',
                    sort_by: 'popularity.desc',
                    page: page,
                    primary_release_year: year
                }
            }
        )

        let moviePromiseArray = movieResponse.data.results.map(movie => setMovieEditors(movie))

        return await Promise.all(moviePromiseArray)
    } catch (error) {
        console.error('Error fetching movies:', error)
        throw error
    }
}
