import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Hero from '../components/Hero';
import MovieCard from '../components/MovieCard';
import MovieModal from '../components/MovieModal';
import { getTrendingDaily, getGenres } from '../services/tmdb';

const Library = () => {
  const [heroMovie, setHeroMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [libraryMovies, setLibraryMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenreId, setSelectedGenreId] = useState('all');

  // Load More logic
  const [visibleCount, setVisibleCount] = useState(9);

  const [selectedMovieId, setSelectedMovieId] = useState(null);

  useEffect(() => {
    const init = async () => {
      try {
        const [daily, genresRes] = await Promise.all([
          getTrendingDaily(),
          getGenres()
        ]);
        setHeroMovie(daily.results[0]);
        setGenres(genresRes.genres);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    init();
    loadLibrary();
  }, []);

  const loadLibrary = () => {
    const stored = localStorage.getItem('myLibrary');
    if (stored) {
      const parsed = JSON.parse(stored);
      setLibraryMovies(parsed);
      // Re-apply filter if needed, but easier to just reset filter on reload or keep sync
    }
  };

  // Effect to handle filtering when genre or library changes
  useEffect(() => {
    let filtered = libraryMovies;
    if (selectedGenreId !== 'all') {
      const id = parseInt(selectedGenreId);
      filtered = libraryMovies.filter(m => {
          // Check genre_ids (from list) or genres (from details)
          const hasGenreId = m.genre_ids?.includes(id);
          const hasGenreObj = m.genres?.some(g => g.id === id);
          return hasGenreId || hasGenreObj;
      });
    }
    setFilteredMovies(filtered);
    // Note: Do not reset visibleCount here if we want to keep scroll position,
    // but typically filtering resets the view.
    if (selectedGenreId !== 'all') {
        setVisibleCount(9);
    }
  }, [selectedGenreId, libraryMovies]);

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 9);
  };

  const refreshLibrary = () => {
    loadLibrary();
  };

  return (
    <>
      <Hero movie={heroMovie} loading={loading} />

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">My Library</h2>

            {libraryMovies.length > 0 && (
                <div className="w-full md:w-64">
                    <select
                        value={selectedGenreId}
                        onChange={(e) => setSelectedGenreId(e.target.value)}
                        className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none cursor-pointer"
                    >
                        <option value="all">All Genres</option>
                        {genres.map(g => (
                            <option key={g.id} value={g.id}>{g.name}</option>
                        ))}
                    </select>
                </div>
            )}
        </div>

        {filteredMovies.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredMovies.slice(0, visibleCount).map(movie => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  genres={genres}
                  onClick={setSelectedMovieId}
                />
              ))}
            </div>

            {visibleCount < filteredMovies.length && (
              <div className="text-center mt-12">
                <button
                  onClick={handleLoadMore}
                  className="px-8 py-3 bg-orange-500 text-white font-bold rounded-full hover:bg-orange-600 transition-all shadow-lg"
                >
                  Load More
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20 bg-gray-50 dark:bg-gray-800/50 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700">
            <p className="text-xl text-gray-500 dark:text-gray-400 mb-4">
              OOPS... We are very sorry!<br />
              {libraryMovies.length === 0 ? "You don't have any movies in your library yet." : "No movies found with this genre."}
            </p>
            {libraryMovies.length === 0 && (
                <a href="#/catalog" className="text-orange-500 hover:underline font-medium text-lg">
                    Search for movies
                </a>
            )}
          </div>
        )}
      </div>

      {selectedMovieId && (
        <MovieModal
          movieId={selectedMovieId}
          onClose={() => setSelectedMovieId(null)}
          onLibraryUpdate={refreshLibrary}
        />
      )}
    </>
  );
};

export default Library;