import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Hero from '../components/Hero';
import MovieCard from '../components/MovieCard';
import MovieModal from '../components/MovieModal';
import Loader from '../components/Loader';
import { getTrendingDaily, getTrendingWeekly, getUpcoming, getGenres } from '../services/tmdb';
import { IMAGE_ORIGINAL_URL } from '../constants';
import { AlertTriangle } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const [heroMovie, setHeroMovie] = useState(null);
  const [weeklyTrends, setWeeklyTrends] = useState([]);
  const [upcomingMovie, setUpcomingMovie] = useState(null);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const [isUpcomingInLib, setIsUpcomingInLib] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      const handleError = (err) => {
        // Suppress console log for production requirements
        setError(prev => prev || "We couldn't connect to the movie database. Please check your internet connection.");
        return { results: [], genres: [] };
      };

      const fetchDaily = getTrendingDaily().catch(handleError);
      const fetchWeekly = getTrendingWeekly().catch(handleError);
      const fetchUpcoming = getUpcoming().catch(handleError);
      const fetchGenres = getGenres().catch(handleError);

      try {
        const [daily, weekly, upcoming, genresRes] = await Promise.all([
          fetchDaily,
          fetchWeekly,
          fetchUpcoming,
          fetchGenres
        ]);

        if (daily && daily.results && daily.results.length > 0) {
            const randomHero = daily.results[Math.floor(Math.random() * daily.results.length)];
            setHeroMovie(randomHero);
        }

        // Weekly Trends (Take top 3)
        if (weekly && weekly.results && weekly.results.length > 0) {
            setWeeklyTrends(weekly.results.slice(0, 3));
        }

        // Upcoming This Month (Random)
        if (upcoming && upcoming.results && upcoming.results.length > 0) {
            const randomUpcoming = upcoming.results[Math.floor(Math.random() * upcoming.results.length)];
            setUpcomingMovie(randomUpcoming);
            if (randomUpcoming) {
                checkUpcomingLibStatus(randomUpcoming.id);
            }
        }

        if (genresRes && genresRes.genres) {
            setGenres(genresRes.genres);
        }

      } catch (error) {
        setError("A critical error occurred while loading data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const checkUpcomingLibStatus = (id) => {
    try {
        const lib = JSON.parse(localStorage.getItem('myLibrary') || '[]');
        const exists = lib.some((m) => m.id === id);
        setIsUpcomingInLib(exists);
    } catch (e) {
        // silent catch
    }
  };

  const toggleUpcomingLibrary = () => {
    if (!upcomingMovie) return;
    try {
        const lib = JSON.parse(localStorage.getItem('myLibrary') || '[]');
        let newLib;
        if (isUpcomingInLib) {
            newLib = lib.filter((m) => m.id !== upcomingMovie.id);
        } else {
            newLib = [...lib, upcomingMovie];
        }
        localStorage.setItem('myLibrary', JSON.stringify(newLib));
        setIsUpcomingInLib(!isUpcomingInLib);
    } catch (e) {
        // silent catch
    }
  };

  return (
    <>
      <Hero movie={heroMovie} loading={loading} />

      <div className="container mx-auto px-4 py-12 space-y-24">

        {/* Error Banner */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-center gap-3 text-red-700 dark:text-red-400">
            <AlertTriangle size={24} />
            <p className="font-medium">{error}</p>
          </div>
        )}

        {/* Weekly Trends */}
        <section>
          <div className="flex justify-between items-end mb-8 border-b border-gray-200 dark:border-gray-800 pb-4">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white uppercase tracking-wide">Weekly Trends</h2>
            <button
              onClick={() => navigate('/catalog')}
              className="text-orange-500 font-semibold hover:text-orange-600 text-sm md:text-base transition-colors"
            >
              See all
            </button>
          </div>

          {loading && weeklyTrends.length === 0 ? <Loader /> : (
            <>
              {weeklyTrends.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                  {weeklyTrends.map(movie => (
                    <MovieCard
                      key={movie.id}
                      movie={movie}
                      genres={genres}
                      onClick={setSelectedMovieId}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">
                  {error ? "Unable to load trends." : "No weekly trends available at the moment."}
                </p>
              )}
            </>
          )}
        </section>

        {/* Upcoming This Month */}
        {upcomingMovie && (
          <section className="relative">
             <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white uppercase tracking-wide mb-8">Upcoming this month</h2>

             <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
                {/* Image Section */}
                <div className="w-full md:w-[45%] lg:w-[40%] relative min-h-[400px]">
                   <img
                      src={upcomingMovie.poster_path ? `${IMAGE_ORIGINAL_URL}${upcomingMovie.poster_path}` : 'https://picsum.photos/600/900'}
                      alt={upcomingMovie.title}
                      className="absolute inset-0 w-full h-full object-cover"
                   />
                </div>

                {/* Info Section */}
                <div className="w-full md:w-[55%] lg:w-[60%] p-8 md:p-10 lg:p-12 flex flex-col justify-center relative">
                   {/* Background decoration */}
                   <div className="hidden dark:block absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

                   <h3 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-8 uppercase leading-tight">
                       {upcomingMovie.title}
                   </h3>

                   <div className="grid grid-cols-2 gap-x-8 gap-y-6 mb-8">
                      <div>
                          <span className="block text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">Release Date</span>
                          <span className="block text-orange-500 font-bold text-lg">{upcomingMovie.release_date}</span>
                      </div>
                      <div>
                          <span className="block text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">Vote / Votes</span>
                          <div className="flex items-center gap-1">
                             <span className="bg-white text-gray-900 px-2 py-0.5 rounded text-sm font-bold shadow-sm">{upcomingMovie.vote_average.toFixed(1)}</span>
                             <span className="text-gray-400">/</span>
                             <span className="bg-white/10 dark:bg-gray-700 dark:text-white px-2 py-0.5 rounded text-sm font-medium">{upcomingMovie.vote_count}</span>
                          </div>
                      </div>
                      <div>
                          <span className="block text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">Popularity</span>
                          <span className="block text-gray-900 dark:text-white font-bold">{upcomingMovie.popularity.toFixed(1)}</span>
                      </div>
                      <div>
                          <span className="block text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">Genre</span>
                          <span className="block text-gray-900 dark:text-white font-medium">{upcomingMovie.genre_ids?.map(id => genres.find(g => g.id === id)?.name).join(', ')}</span>
                      </div>
                   </div>

                   <div className="mb-10">
                       <span className="block text-gray-500 dark:text-gray-400 text-sm font-bold uppercase mb-3">About</span>
                       <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-base md:text-lg">
                           {upcomingMovie.overview}
                       </p>
                   </div>

                   <button
                      onClick={toggleUpcomingLibrary}
                      className={`relative overflow-hidden px-8 py-3.5 rounded-full font-bold uppercase text-sm tracking-wide transition-all duration-300 transform active:scale-95 ${
                        isUpcomingInLib
                          ? 'bg-transparent border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white'
                          : 'bg-orange-500 border-2 border-orange-500 text-white hover:bg-orange-600 hover:border-orange-600 shadow-xl shadow-orange-500/20'
                      }`}
                    >
                      {isUpcomingInLib ? 'Remove from My Library' : 'Add to My Library'}
                    </button>
                </div>
             </div>
          </section>
        )}
      </div>

      {selectedMovieId && (
        <MovieModal
          movieId={selectedMovieId}
          onClose={() => setSelectedMovieId(null)}
          onLibraryUpdate={() => {
             if(upcomingMovie && selectedMovieId === upcomingMovie.id) checkUpcomingLibStatus(upcomingMovie.id);
          }}
        />
      )}
    </>
  );
};

export default Home;