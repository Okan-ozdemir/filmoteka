import React, { useState, useEffect } from 'react';
import { Search, X, AlertTriangle } from 'lucide-react';
import Hero from '../components/Hero';
import MovieCard from '../components/MovieCard';
import MovieModal from '../components/MovieModal';
import Pagination from '../components/Pagination';
import Loader from '../components/Loader';
import { getTrendingDaily, getTrendingWeekly, searchMovies, getGenres } from '../services/tmdb';

const Catalog = () => {
  const [heroMovie, setHeroMovie] = useState(null);
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingList, setLoadingList] = useState(false);
  const [error, setError] = useState(null);

  // Search State
  const [query, setQuery] = useState(''); // Input value
  const [year, setYear] = useState(''); // Input value

  // Submitted Search State (used for actual fetching)
  const [submittedQuery, setSubmittedQuery] = useState('');
  const [submittedYear, setSubmittedYear] = useState('');

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const [selectedMovieId, setSelectedMovieId] = useState(null);

  // Initial Load (Hero + Genres)
  useEffect(() => {
    const init = async () => {
      try {
        const [daily, genresRes] = await Promise.all([
          getTrendingDaily(),
          getGenres()
        ]);
        if (daily.results && daily.results.length > 0) {
           setHeroMovie(daily.results[0]);
        }
        if (genresRes.genres) {
           setGenres(genresRes.genres);
        }
        setLoading(false);
      } catch (e) {
        // Silent failure for init
        setLoading(false);
      }
    };
    init();
  }, []);

  // Fetch Logic triggered by page or submitted search params changes
  useEffect(() => {
    if (!loading) {
        fetchMovies(page, submittedQuery, submittedYear);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, submittedQuery, submittedYear, loading]);

  const fetchMovies = async (currentPage, searchQuery, searchYear) => {
    setLoadingList(true);
    setError(null);
    try {
      let res;
      if (searchQuery.trim() === '') {
        // Fetch Trending Weekly if no search query
        res = await getTrendingWeekly(currentPage);
      } else {
        // Search Movies
        res = await searchMovies(searchQuery, currentPage, searchYear);
      }
      setMovies(res.results || []);
      setTotalPages(res.total_pages || 0);
    } catch (error) {
      setError("Failed to fetch movies. Please check your network.");
      setMovies([]);
    } finally {
      setLoadingList(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSubmittedQuery(query);
    setSubmittedYear(year);
    setPage(1); // Reset to page 1 on new search
  };

  const clearSearch = () => {
    setQuery('');
    setYear('');
    setSubmittedQuery('');
    setSubmittedYear('');
    setPage(1);
  };

  // Generate years for select
  const currentYear = new Date().getFullYear();
  const years = Array.from({length: 50}, (_, i) => currentYear - i);

  return (
    <>
      <Hero movie={heroMovie} loading={loading} />

      <div className="container mx-auto px-4 py-8">
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md mb-8 flex flex-col md:flex-row gap-4 items-center border border-gray-100 dark:border-gray-700">
          <div className="relative flex-grow w-full">
            <input
              type="text"
              placeholder="Search for a movie..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-4 pr-10 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none transition-all"
            />
            {query && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-500 transition-colors"
                aria-label="Clear search"
              >
                <X size={20} />
              </button>
            )}
          </div>

          <div className="w-full md:w-auto">
             <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full md:w-32 py-3 px-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none cursor-pointer"
             >
                <option value="">Year</option>
                {years.map(y => <option key={y} value={y}>{y}</option>)}
             </select>
          </div>

          <button
            type="submit"
            className="w-full md:w-auto px-8 py-3 bg-orange-500 text-white font-bold rounded-lg hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/30 flex items-center justify-center gap-2"
          >
            <Search size={20} />
            Search
          </button>
        </form>

        {/* Error Banner */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-8 flex items-center gap-3 text-red-700 dark:text-red-400">
            <AlertTriangle size={24} />
            <p className="font-medium">{error}</p>
          </div>
        )}

        {/* Results */}
        {loadingList ? <Loader /> : (
            <>
                {movies.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {movies.map(movie => (
                            <MovieCard
                                key={movie.id}
                                movie={movie}
                                genres={genres}
                                onClick={setSelectedMovieId}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <p className="text-xl text-gray-500 dark:text-gray-400">
                           {error ? "No results due to error." : (
                               <>
                                OOPS... We are very sorry!<br />
                                We don't have any results due to your search.
                               </>
                           )}
                        </p>
                    </div>
                )}
            </>
        )}

        {/* Pagination */}
        {movies.length > 0 && (
             <Pagination
                currentPage={page}
                totalPages={totalPages > 500 ? 500 : totalPages} // TMDB max page limit
                onPageChange={setPage}
             />
        )}
      </div>

      {selectedMovieId && (
        <MovieModal
            movieId={selectedMovieId}
            onClose={() => setSelectedMovieId(null)}
        />
      )}
    </>
  );
};

export default Catalog;