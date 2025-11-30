import React from 'react';
import { IMAGE_BASE_URL } from '../constants';
import { Star } from 'lucide-react';

const MovieCard = ({ movie, genres, onClick }) => {
  const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A';

  const movieGenres = movie.genre_ids
    ?.map(id => genres.find(g => g.id === id)?.name)
    .filter(Boolean)
    .slice(0, 2)
    .join(', ');

  return (
    <div
      className="group flex flex-col h-full cursor-pointer relative"
      onClick={() => onClick(movie.id)}
    >
      <div className="relative overflow-hidden rounded-xl shadow-lg bg-gray-800 aspect-[2/3] mb-3">
        <img
          src={movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : 'https://picsum.photos/300/450'}
          alt={movie.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <span className="bg-orange-500 text-white px-4 py-2 rounded-full font-bold text-sm transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                View Details
            </span>
        </div>
      </div>

      <div className="flex flex-col flex-grow">
        <h3 className="text-base md:text-lg font-bold text-gray-900 dark:text-white uppercase leading-tight mb-1 line-clamp-1 group-hover:text-orange-500 transition-colors">
            {movie.title}
        </h3>
        <div className="flex items-center justify-between text-sm mt-auto">
            <div className="text-orange-500 font-medium truncate pr-2">
                {movieGenres || 'Other'} <span className="text-gray-400 mx-1">|</span> <span className="text-orange-500">{releaseYear}</span>
            </div>

            <div className="flex items-center gap-1 shrink-0 bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">
                <Star size={10} className="text-orange-500 fill-orange-500" />
                <span className="text-xs font-bold text-gray-900 dark:text-white">{movie.vote_average.toFixed(1)}</span>
            </div>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;