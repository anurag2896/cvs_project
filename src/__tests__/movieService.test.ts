import { getMoviesByYear } from '../movieService';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('movieService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return formatted movies with editors', async () => {
    const mockDiscoverResponse = {
      data: {
        results: [
          { id: 1, title: 'Test Movie', release_date: '2019-01-01', vote_average: 8.5 },
        ],
      },
    };

    const mockCreditsResponse = {
      data: {
        crew: [
          { known_for_department: 'Editing', name: 'Editor 1' },
          { known_for_department: 'Editing', name: 'Editor 2' },
          { known_for_department: 'Directing', name: 'Director 1' },
        ],
      },
    };

    mockedAxios.get.mockImplementation((url) => {
      if (url.includes('/discover/movie')) {
        return Promise.resolve(mockDiscoverResponse);
      } else if (url.includes('/movie/')) {
        return Promise.resolve(mockCreditsResponse);
      }
      return Promise.reject(new Error('Not found'));
    });

    const result = await getMoviesByYear('2019', 1);
    expect(result).toEqual([
      {
        title: 'Test Movie',
        release_date: 'January 1, 2019',
        vote_average: 8.5,
        editors: ['Editor 1', 'Editor 2'],
      },
    ]);
  });

  it('should handle API errors gracefully', async () => {
    mockedAxios.get.mockRejectedValue(new Error('API Error'));

    await expect(getMoviesByYear('2019', 1)).rejects.toThrow('API Error');
  });

  it('should handle missing editors gracefully', async () => {
    const mockDiscoverResponse = {
      data: {
        results: [
          { id: 1, title: 'No Editor Movie', release_date: '2019-03-01', vote_average: 6.5 },
        ],
      },
    };

    const mockCreditsResponse = {
      data: {
        crew: [{ known_for_department: 'Directing', name: 'Director 1' }],
      },
    };

    mockedAxios.get.mockImplementation((url) => {
      if (url.includes('/discover/movie')) {
        return Promise.resolve(mockDiscoverResponse);
      } else if (url.includes('/movie/')) {
        return Promise.resolve(mockCreditsResponse);
      }
      return Promise.reject(new Error('Not found'));
    });

    const result = await getMoviesByYear('2019', 1);
    expect(result[0].editors).toEqual([]);
  });

  it('should handle credits API failure gracefully', async () => {
    const mockDiscoverResponse = {
      data: {
        results: [
          { id: 1, title: 'API Error Movie', release_date: '2019-04-01', vote_average: 7.0 },
        ],
      },
    };

    mockedAxios.get.mockImplementation((url) => {
      if (url.includes('/discover/movie')) {
        return Promise.resolve(mockDiscoverResponse);
      } else if (url.includes('/movie/')) {
        return Promise.reject(new Error('Credits API Error'));
      }
      return Promise.reject(new Error('Not found'));
    });

    const result = await getMoviesByYear('2019', 1);
    expect(result[0].editors).toEqual([]);
  });
});
