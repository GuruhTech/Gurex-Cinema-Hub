import { useState } from "react";
import { Link } from "wouter";
import { Star, Bookmark, BookmarkCheck, Heart, Play, Clock } from "lucide-react";
import { getImageUrl, formatVoteAverage, getRatingColor, getYear, watchlist, favorites, watchLater } from "@/lib/tmdb";
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
  const [isWatchLater, setIsWatchLater] = useState(() => watchLater.has(item.id, type));
  const [imageLoaded, setImageLoaded] = useState(false);
  const voteAverage = item.vote_average ?? 0;

  const sizeClasses = {
    sm: "w-32 sm:w-36",
    md: "w-40 sm:w-44",
    lg: "w-48 sm:w-52",
  };

  const posterSize = size === "sm" ? "w185" : "w342";

  const sharedItem = {
    id: item.id,
    title,
    poster_path: item.poster_path,
    vote_average: item.vote_average,
    media_type: type,
    ...(isMovie(item) ? { release_date: item.release_date } : { first_air_date: (item as TVShow).first_air_date }),
  };

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isBookmarked) {
      watchlist.remove(item.id, type);
    } else {
      watchlist.add(sharedItem);
    }
    setIsBookmarked(!isBookmarked);
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isFavorited) {
      favorites.remove(item.id, type);
    } else {
      favorites.add(sharedItem);
    }
    setIsFavorited(!isFavorited);
  };

  const handleWatchLater = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isWatchLater) {
      watchLater.remove(item.id, type);
    } else {
      watchLater.add(sharedItem);
    }
    setIsWatchLater(!isWatchLater);
  };

  return (
    <Link href={`/${type}/${item.id}`}>
      <div className={`${sizeClasses[size]} flex-shrink-0 cursor-pointer group movie-card`}>
        {/* Floating glass card */}
        <div
          className="relative rounded-2xl overflow-hidden aspect-[2/3] floating-card"
          style={{
            background: "rgba(20, 22, 30, 0.6)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.6), 0 2px 8px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)",
          }}
        >
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

          {/* Glass overlay on hover */}
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
                  title="Add to Favorites"
                >
                  <Heart size={13} fill={isFavorited ? "currentColor" : "none"} />
                </button>
                <button
                  onClick={handleBookmark}
                  className={`p-1.5 rounded-full glass transition-all duration-200 hover:scale-110 ${isBookmarked ? "text-primary" : "text-white"}`}
                  title="Add to Watchlist"
                >
                  {isBookmarked ? <BookmarkCheck size={13} /> : <Bookmark size={13} />}
                </button>
                <button
                  onClick={handleWatchLater}
                  className={`p-1.5 rounded-full glass transition-all duration-200 hover:scale-110 ${isWatchLater ? "text-blue-400" : "text-white"}`}
                  title="Watch Later"
                >
                  <Clock size={13} fill={isWatchLater ? "currentColor" : "none"} />
                </button>
              </div>
            </div>

            {/* Play button center */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center transform scale-75 group-hover:scale-100 transition-transform duration-300"
                style={{
                  background: "rgba(255,107,53,0.9)",
                  boxShadow: "0 0 24px rgba(255,107,53,0.5)",
                }}
              >
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

          {/* HD badge */}
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-0 transition-opacity">
            <div className="px-1.5 py-0.5 rounded-md bg-blue-500/80 backdrop-blur-sm">
              <span className="text-white text-[9px] font-black tracking-wider">HD</span>
            </div>
          </div>

          {/* Watch Later indicator */}
          {isWatchLater && (
            <div className="absolute bottom-2 right-2">
              <div className="p-1 rounded-full bg-blue-500/80 backdrop-blur-sm">
                <Clock size={9} className="text-white" fill="currentColor" />
              </div>
            </div>
          )}

          {/* Card inner glow on hover */}
          <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            style={{
              background: "linear-gradient(135deg, rgba(255,107,53,0.05) 0%, transparent 60%)",
              boxShadow: "inset 0 0 30px rgba(255,107,53,0.08)",
            }}
          />
        </div>

        {/* Title below */}
        <div className="mt-2.5 px-1">
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
