import { useState } from "react";
import { Link } from "wouter";
import { Star, Bookmark, BookmarkCheck, Heart, Play } from "lucide-react";
import { getImageUrl, formatVoteAverage, getRatingColor, getYear, watchlist, favorites } from "@/lib/tmdb";
import type { Movie, TVShow } from "@/lib/tmdb";

interface MovieCardProps {
  item: Movie | TVShow;
  mediaType?: "movie" | "tv";
  size?: "sm" | "md" | "lg";
  showType?: boolean;
}

function isMovie(item: Movie | TVShow): item is Movie {
  return "title" in item;
}

export default function MovieCard({ item, mediaType, size = "md", showType = true }: MovieCardProps) {
  const type = mediaType || (isMovie(item) ? "movie" : "tv");
  const title = isMovie(item) ? item.title : (item as TVShow).name;
  const date = isMovie(item) ? item.release_date : (item as TVShow).first_air_date;

  const [isBookmarked, setIsBookmarked] = useState(() => watchlist.has(item.id, type));
  const [isFavorited, setIsFavorited] = useState(() => favorites.has(item.id, type));
  const [imageLoaded, setImageLoaded] = useState(false);
  const voteAverage = item.vote_average ?? 0;

  const sizeClasses = {
    sm: "w-32 sm:w-36",
    md: "w-40 sm:w-44",
    lg: "w-48 sm:w-52",
  };

  const posterSize = size === "sm" ? "w185" : "w342";

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isBookmarked) {
      watchlist.remove(item.id, type);
    } else {
      watchlist.add({
        id: item.id,
        title,
        poster_path: item.poster_path,
        vote_average: item.vote_average,
        media_type: type,
        ...(isMovie(item) ? { release_date: item.release_date } : { first_air_date: (item as TVShow).first_air_date }),
      });
    }
    setIsBookmarked(!isBookmarked);
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isFavorited) {
      favorites.remove(item.id, type);
    } else {
      favorites.add({
        id: item.id,
        title,
        poster_path: item.poster_path,
        vote_average: item.vote_average,
        media_type: type,
        ...(isMovie(item) ? { release_date: item.release_date } : { first_air_date: (item as TVShow).first_air_date }),
      });
    }
    setIsFavorited(!isFavorited);
  };

  return (
    <Link href={`/${type}/${item.id}`}>
      <div
        className={`${sizeClasses[size]} flex-shrink-0 cursor-pointer group movie-card`}
      >
        <div className="relative rounded-xl overflow-hidden bg-card aspect-[2/3] card-hover">
          {/* Poster */}
          {item.poster_path ? (
            <>
              {!imageLoaded && <div className="absolute inset-0 skeleton" />}
              <img
                src={getImageUrl(item.poster_path, posterSize)}
                alt={title}
                className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${imageLoaded ? "opacity-100" : "opacity-0"}`}
                loading="lazy"
                onLoad={() => setImageLoaded(true)}
              />
            </>
          ) : (
            <div className="absolute inset-0 bg-muted flex items-center justify-center">
              <Play size={32} className="text-muted-foreground" />
            </div>
          )}

          {/* Overlay */}
          <div className="movie-overlay absolute inset-0 flex flex-col justify-between p-2.5">
            {/* Top actions */}
            <div className="flex justify-between items-start">
              {showType && (
                <span className="text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full glass text-primary">
                  {type === "movie" ? "Movie" : "TV"}
                </span>
              )}
              <div className="flex gap-1 ml-auto">
                <button
                  onClick={handleFavorite}
                  className={`p-1.5 rounded-full glass transition-all duration-200 hover:scale-110 ${isFavorited ? "text-red-400" : "text-white"}`}
                >
                  <Heart size={13} fill={isFavorited ? "currentColor" : "none"} />
                </button>
                <button
                  onClick={handleBookmark}
                  className={`p-1.5 rounded-full glass transition-all duration-200 hover:scale-110 ${isBookmarked ? "text-primary" : "text-white"}`}
                >
                  {isBookmarked ? <BookmarkCheck size={13} /> : <Bookmark size={13} />}
                </button>
              </div>
            </div>

            {/* Play button center */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="w-12 h-12 rounded-full bg-primary/90 flex items-center justify-center transform scale-75 group-hover:scale-100 transition-transform duration-300">
                <Play size={20} fill="white" className="text-white ml-0.5" />
              </div>
            </div>

            {/* Bottom info */}
            <div>
              <div className="flex items-center gap-1 mb-1">
                <Star size={11} className="text-yellow-400" fill="currentColor" />
                <span className={`text-xs font-bold ${getRatingColor(voteAverage)}`}>
                  {formatVoteAverage(voteAverage)}
                </span>
                {date && (
                  <span className="text-xs text-white/60 ml-auto">{getYear(date)}</span>
                )}
              </div>
            </div>
          </div>

          {/* Rating badge (always visible) */}
          <div className="absolute top-2 left-2 opacity-100 group-hover:opacity-0 transition-opacity">
            <div className="rating-badge px-1.5 py-0.5 rounded-md flex items-center gap-1">
              <Star size={10} fill="white" className="text-white" />
              <span className="text-white text-xs font-bold">{formatVoteAverage(voteAverage)}</span>
            </div>
          </div>
        </div>

        {/* Title below */}
        <div className="mt-2 px-0.5">
          <p className="text-sm font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
            {title}
          </p>
          {date && (
            <p className="text-xs text-muted-foreground mt-0.5">{getYear(date)}</p>
          )}
        </div>
      </div>
    </Link>
  );
}
