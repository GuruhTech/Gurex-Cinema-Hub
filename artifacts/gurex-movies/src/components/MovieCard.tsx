import { useState } from "react";
import { Link } from "wouter";
import { Star, Bookmark, BookmarkCheck, Heart, Play, Clock, Tv } from "lucide-react";
import {
  type Subject, getYear, getRatingColor,
  savedWatchlist, savedFavorites, savedWatchLater, subjectToSaved,
} from "@/lib/guruhtech";

interface MovieCardProps {
  item: Subject;
  size?: "sm" | "md" | "lg";
}

export default function MovieCard({ item, size = "md" }: MovieCardProps) {
  const [bookmarked, setBookmarked] = useState(() => savedWatchlist.has(item.subjectId));
  const [favorited, setFavorited] = useState(() => savedFavorites.has(item.subjectId));
  const [watchLater, setWatchLater] = useState(() => savedWatchLater.has(item.subjectId));
  const [imgLoaded, setImgLoaded] = useState(false);

  const isTV = item.subjectType === 2;
  const rating = item.imdbRatingValue ? parseFloat(item.imdbRatingValue) : 0;

  const sizeMap = { sm: "w-32 sm:w-36", md: "w-40 sm:w-44", lg: "w-48 sm:w-52" };

  const saved = subjectToSaved(item);

  const toggleBookmark = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    if (bookmarked) savedWatchlist.remove(item.subjectId);
    else savedWatchlist.add(saved);
    setBookmarked(!bookmarked);
  };
  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    if (favorited) savedFavorites.remove(item.subjectId);
    else savedFavorites.add(saved);
    setFavorited(!favorited);
  };
  const toggleWatchLater = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    if (watchLater) savedWatchLater.remove(item.subjectId);
    else savedWatchLater.add(saved);
    setWatchLater(!watchLater);
  };

  return (
    <Link href={`/detail/${item.detailPath}`}>
      <div className={`movie-card relative flex-shrink-0 cursor-pointer group ${sizeMap[size]}`}>
        {/* Poster */}
        <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-card border border-white/5">
          {!imgLoaded && <div className="absolute inset-0 skeleton" />}
          {item.cover?.url && (
            <img
              src={item.cover.url}
              alt={item.title}
              className={`floating-card w-full h-full object-cover transition-opacity duration-300 ${imgLoaded ? "opacity-100" : "opacity-0"}`}
              onLoad={() => setImgLoaded(true)}
            />
          )}

          {/* Overlay on hover */}
          <div className="movie-overlay absolute inset-0 rounded-xl">
            <div className="absolute bottom-0 left-0 right-0 p-2.5">
              <div className="flex items-center justify-between gap-1">
                <button
                  onClick={toggleBookmark}
                  className={`p-1.5 rounded-lg glass text-xs transition-all ${bookmarked ? "text-primary" : "text-white/70 hover:text-white"}`}
                >
                  {bookmarked ? <BookmarkCheck size={13} /> : <Bookmark size={13} />}
                </button>
                <button
                  onClick={toggleFavorite}
                  className={`p-1.5 rounded-lg glass text-xs transition-all ${favorited ? "text-red-400" : "text-white/70 hover:text-white"}`}
                >
                  <Heart size={13} fill={favorited ? "currentColor" : "none"} />
                </button>
                <button
                  onClick={toggleWatchLater}
                  className={`p-1.5 rounded-lg glass text-xs transition-all ${watchLater ? "text-yellow-400" : "text-white/70 hover:text-white"}`}
                >
                  <Clock size={13} />
                </button>
              </div>
            </div>
          </div>

          {/* Play button overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-12 h-12 rounded-full bg-primary/90 flex items-center justify-center shadow-lg shadow-primary/50 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
              <Play size={20} fill="white" className="text-white ml-0.5" />
            </div>
          </div>

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {rating > 0 && (
              <div className="flex items-center gap-1 rating-badge px-1.5 py-0.5 rounded-md">
                <Star size={10} fill="white" className="text-white" />
                <span className={`text-xs font-bold ${getRatingColor(rating)}`}>{rating.toFixed(1)}</span>
              </div>
            )}
          </div>
          <div className="absolute top-2 right-2">
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${isTV ? "type-badge-tv" : "type-badge-movie"}`}>
              {isTV ? <Tv size={9} className="inline mr-0.5" /> : null}{isTV ? "TV" : "Film"}
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="mt-2 px-0.5">
          <p className="text-sm font-semibold text-white/90 line-clamp-1 group-hover:text-white transition-colors">
            {item.title}
          </p>
          <div className="flex items-center gap-1.5 mt-0.5">
            {item.releaseDate && (
              <span className="text-xs text-white/40">{getYear(item.releaseDate)}</span>
            )}
            {item.genre && (
              <span className="text-xs text-white/30 truncate">
                · {item.genre.split(",")[0]}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
