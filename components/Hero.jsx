import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Info } from 'lucide-react';
import { getMovieVideos } from '../services/tmdb';
import { IMAGE_ORIGINAL_URL } from '../constants';
import MovieModal from './MovieModal';

const Hero = ({ movie, loading }) => {
  const navigate = useNavigate();
  const [trailerKey, setTrailerKey] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (movie) {
      getMovieVideos(movie.id)
        .then(data => {
          const trailer = data.results.find(v => v.type === 'Trailer' && v.site === 'YouTube');
          setTrailerKey(trailer ? trailer.key : null);
        })
        .catch(() => setTrailerKey(null));
    }
  }, [movie]);

  if (loading) {
    return <div className="w-full h-[60vh] md:h-[80vh] bg-gray-200 dark:bg-gray-800 animate-pulse" />;
  }

  // Fallback if no movie provided
  if (!movie) {
    return (
      <div className="relative w-full h-[60vh] md:h-[80vh] bg-gray-900 flex items-center justify-center text-center px-4 overflow-hidden">
        <img
          src="https://picsum.photos/1920/1080?blur=5"
          className="absolute inset-0 w-full h-full object-cover opacity-30"
          alt="Default Hero"
        />
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">Let's make your own cinema</h1>
          <p className="text-gray-300 text-lg md:text-xl mb-8">Is it a guide for your personal movie library? Yes, it is! Save movies, watch trailers, and explore trends.</p>
          <button
            onClick={() => navigate('/catalog')}
            className="px-8 py-3 bg-orange-500 text-white font-bold rounded-full hover:bg-orange-600 transition-all shadow-lg hover:shadow-orange-500/30"
          >
            Get Started
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[60vh] md:h-[80vh] overflow-hidden group">
      {/* Background Image */}
      <div className="absolute inset-0">
         <img
            src={movie.backdrop_path ? `${IMAGE_ORIGINAL_URL}${movie.backdrop_path}` : 'https://picsum.photos/1920/1080?blur=5'}
            alt={movie.title}
            className="w-full h-full object-cover"
            onError={(e) => { e.target.src = 'https://picsum.photos/1920/1080?blur=5'; }}
         />
         <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent"></div>
         <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">{movie.title}</h1>

          <div className="flex items-center gap-4 mb-6">
            <span className="bg-orange-500 text-white px-3 py-1 rounded text-sm font-bold shadow-sm">{movie.vote_average.toFixed(1)}</span>
            <span className="text-gray-300 font-medium">{new Date(movie.release_date).getFullYear()}</span>
          </div>

          <p className="text-gray-300 text-base md:text-lg mb-8 line-clamp-3 md:line-clamp-4 leading-relaxed">
            {movie.overview}
          </p>

          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => setShowTrailer(true)}
              className="flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-full font-bold hover:bg-orange-600 transition-all shadow-lg hover:shadow-orange-500/30"
            >
              <Play size={20} fill="currentColor" />
              Watch Trailer
            </button>
            <button
               onClick={() => setShowDetails(true)}
               className="flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm text-white border border-white/30 rounded-full font-bold hover:bg-white/20 transition-all"
            >
              <Info size={20} />
              More Details
            </button>
          </div>
        </div>
      </div>

      {/* Trailer Modal */}
      {showTrailer && (
        <div className="fixed inset-0 z-[70] bg-black/90 flex items-center justify-center p-4" onClick={() => setShowTrailer(false)}>
           <div className="relative w-full max-w-5xl aspect-video bg-black rounded-xl overflow-hidden shadow-2xl">
             {trailerKey ? (
               <iframe
                src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`}
                title="Movie Trailer"
                className="w-full h-full"
                allow="autoplay; encrypted-media"
                allowFullScreen
               ></iframe>
             ) : (
               <div className="w-full h-full flex items-center justify-center text-white flex-col gap-4">
                 <p className="text-xl">Sorry, no trailer available for this movie.</p>
                 <button onClick={() => setShowTrailer(false)} className="text-orange-500 hover:underline">Close</button>
               </div>
             )}
           </div>
        </div>
      )}

      {/* Details Modal */}
      {showDetails && (
        <MovieModal movieId={movie.id} onClose={() => setShowDetails(false)} />
      )}
    </div>
  );
};

export default Hero;