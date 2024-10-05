"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMoviesByYear = getMoviesByYear;
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
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
function getMoviesByYear(year_1) {
    return __awaiter(this, arguments, void 0, function* (year, page = 1) {
        try {
            const discoverResponse = yield axios_1.default.get(`${BASE_URL}/discover/movie`, {
                params: {
                    api_key: API_KEY,
                    language: 'en-US',
                    sort_by: 'popularity.desc',
                    page: page,
                    primary_release_year: year
                }
            });
            const movies = yield Promise.all(discoverResponse.data.results.map((movie) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const creditsResponse = yield axios_1.default.get(`${BASE_URL}/movie/${movie.id}/credits`, {
                        params: { api_key: API_KEY }
                    });
                    const editors = creditsResponse.data.crew
                        .filter((member) => member.known_for_department === 'Editing')
                        .map((editor) => editor.name);
                    return {
                        title: movie.title,
                        release_date: new Date(movie.release_date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            timeZone: 'UTC'
                        }),
                        vote_average: movie.vote_average,
                        editors
                    };
                }
                catch (error) {
                    console.error(`Error fetching credits for movie ${movie.id}:`, error);
                    return {
                        title: movie.title,
                        release_date: new Date(movie.release_date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            timeZone: 'UTC'
                        }),
                        vote_average: movie.vote_average,
                        editors: []
                    };
                }
            })));
            return movies;
        }
        catch (error) {
            console.error('Error fetching movies:', error);
            throw error;
        }
    });
}
// Example usage
if (require.main === module) {
    ;
    (() => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const movies = yield getMoviesByYear('2019', 1); // Fetch page 1 of movies for 2019
            console.log(JSON.stringify(movies, null, 2));
        }
        catch (error) {
            console.error('Error:', error);
        }
    }))();
}
