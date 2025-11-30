import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { getMovieDetails, getGenres } from '../services/tmdb';
import { IMAGE_BASE_URL } from '../constants';

const MovieModal = ({ movieId, onClose, onLibraryUpdate }) => {
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isInLibrary, setIsInLibrary] = useState(false);
  const [genresMap, setGenresMap] = useState({});

  useEffect(() => {
    // Pre-fetch genres for mapping if needed, though usually detail endpoint has them
    getGenres().then(res => {
      const map = {};
      res.genres.forEach(g => map[g.id] = g.name);
      setGenresMap(map);
    });
  }, []);

  useEffect(() => {
    if (movieId) {
      setLoading(true);
      getMovieDetails(movieId)
        .then(data => {
          setMovie(data);
          checkLibraryStatus(data.id);
        })
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [movieId]);

  // Handle ESC and Click Outside
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (movieId) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [movieId, onClose]);

  const checkLibraryStatus = (id) => {
    const library = JSON.parse(localStorage.getItem('myLibrary') || '[]');
    const exists = library.some((m) => m.id === id);
    setIsInLibrary(exists);
  };

  const toggleLibrary = () => {
    if (!movie) return;
    const library = JSON.parse(localStorage.getItem('myLibrary') || '[]');
    let newLibrary;

    if (isInLibrary) {
      newLibrary = library.filter((m) => m.id !== movie.id);
    } else {
      newLibrary = [...library, movie];
    }

    localStorage.setItem('myLibrary', JSON.stringify(newLibrary));
    setIsInLibrary(!isInLibrary);
    if (onLibraryUpdate) onLibraryUpdate();
  };

  if (!movieId) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden relative shadow-2xl flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white/80 dark:bg-black/50 rounded-full text-gray-800 dark:text-white hover:text-orange-500 transition-colors"
        >
          <X size={24} />
        </button>

        {loading ? (
          <div className="w-full h-96 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
          </div>
        ) : movie ? (
          <>
            <div className="w-full md:w-2/5 h-64 md:h-auto relative shrink-0">
              <img
                src={movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : 'https://picsum.photos/500/750'}
                alt={movie.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="w-full md:w-3/5 p-6 md:p-8 flex flex-col h-full overflow-hidden">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 uppercase leading-tight">{movie.title}</h2>

              <div className="grid grid-cols-[120px_1fr] gap-y-3 gap-x-4 mb-6 text-sm md:text-base shrink-0">
                <span className="text-gray-500 dark:text-gray-400 font-medium">Vote / Votes</span>
                <span className="text-gray-900 dark:text-white flex items-center">
                  <span className="bg-orange-500 text-white px-2 py-0.5 rounded text-xs font-bold leading-none">{movie.vote_average.toFixed(1)}</span>
                  <span className="mx-1 text-gray-500 dark:text-gray-400">/</span>
                  <span className="bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white px-2 py-0.5 rounded text-xs font-bold leading-none">{movie.vote_count}</span>
                </span>

                <span className="text-gray-500 dark:text-gray-400 font-medium">Popularity</span>
                <span className="text-gray-900 dark:text-white font-bold">{movie.popularity.toFixed(1)}</span>

                <span className="text-gray-500 dark:text-gray-400 font-medium">Original Title</span>
                <span className="text-gray-900 dark:text-white uppercase font-bold break-words">{movie.title}</span>

                <span className="text-gray-500 dark:text-gray-400 font-medium">Genre</span>
                <span className="text-gray-900 dark:text-white font-medium">
                  {movie.genres?.map(g => g.name).join(', ') || movie.genre_ids?.map(id => genresMap[id]).filter(Boolean).join(', ')}
                </span>
              </div>

              <div className="flex-grow flex flex-col overflow-hidden mb-6">
                <h3 className="uppercase text-sm font-semibold text-gray-900 dark:text-white mb-2">About</h3>
                <div className="overflow-y-auto pr-2 custom-scrollbar">
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm md:text-base">
                    {movie.overview}
                  </p>
                </div>
              </div>

              <button
                onClick={toggleLibrary}
                className={`w-full sm:w-auto px-8 py-3 rounded uppercase font-medium text-sm transition-all shadow-lg shrink-0 ${
                  isInLibrary
                    ? 'bg-transparent border border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white'
                    : 'bg-orange-500 text-white hover:bg-orange-600 border border-transparent'
                }`}
              >
                {isInLibrary ? 'Remove from My Library' : 'Add to My Library'}
              </button>
            </div>
          </>
        ) : (
            <div className="p-10 text-center">Failed to load movie details.</div>
        )}
      </div>
    </div>
  );
};

export default MovieModal;