import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Play, Info, Star, Clock, Calendar, ChevronLeft, ChevronRight, Bookmark, BookmarkCheck } from "lucide-react";
import { getImageUrl, formatVoteAverage, formatRuntime, getYear, watchlist } from "@/lib/tmdb";
import type { Movie } from "@/lib/tmdb";

interface HeroSectionProps {
  movies: Movie[];
}

export default function HeroSection({ movies }: HeroSectionProps) {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const featured = movies.slice(0, 8);

  useEffect(() => {
    const timer = setInterval(() => {
      goToNext();
    }, 7000);
    return () => clearInterval(timer);
  }, [current, featured.length]);

  const goToNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrent((c) => (c + 1) % featured.length);
      setIsTransitioning(false);
    }, 300);
  };

  const goToPrev = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrent((c) => (c - 1 + featured.length) % featured.length);
      setIsTransitioning(false);
    }, 300);
  };

  if (!featured.length) return null;

  const movie = featured[current];
  const [bookmarked, setBookmarked] = useState(false);

  const handleBookmark = () => {
    if (bookmarked) {
      watchlist.remove(movie.id, "movie");
    } else {
      watchlist.add({
        id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path,
        vote_average: movie.vote_average,
        media_type: "movie",
        release_date: movie.release_date,
      });
    }
    setBookmarked(!bookmarked);
  };

  return (
    <div className="relative w-full h-[85vh] min-h-[560px] max-h-[800px] overflow-hidden">
      {/* Background images with transition */}
      {featured.map((m, i) => (
        <div
          key={m.id}
          className={`absolute inset-0 transition-opacity duration-700 ${
            i === current ? "opacity-100" : "opacity-0"
          }`}
        >
          {m.backdrop_path && (
            <img
              src={getImageUrl(m.backdrop_path, "original")}
              alt={m.title}
              className="w-full h-full object-cover object-center"
            />
          )}
          {/* Multiple gradient overlays for cinematic look */}
          <div className="hero-gradient absolute inset-0" />
          <div className="hero-gradient-bottom absolute inset-0" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
          <div className="absolute inset-0 bg-black/20" />
        </div>
      ))}

      {/* Content */}
      <div
        className={`absolute inset-0 flex items-end pb-20 px-6 sm:px-10 lg:px-16 transition-all duration-500 ${
          isTransitioning ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
        }`}
      >
        <div className="max-w-2xl">
          {/* Label */}
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">Featured</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-tight mb-3 drop-shadow-2xl">
            {movie.title}
          </h1>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <div className="flex items-center gap-1.5 rating-badge px-2.5 py-1 rounded-full">
              <Star size={14} fill="white" className="text-white" />
              <span className="text-white text-sm font-bold">{formatVoteAverage(movie.vote_average)}</span>
            </div>
            {movie.release_date && (
              <div className="flex items-center gap-1.5 text-white/70 text-sm">
                <Calendar size={14} />
                <span>{getYear(movie.release_date)}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5 text-white/70 text-sm">
              <span className="uppercase font-semibold text-primary/80 tracking-wide">{movie.original_language.toUpperCase()}</span>
            </div>
          </div>

          {/* Overview */}
          <p className="text-white/75 text-sm sm:text-base leading-relaxed mb-6 line-clamp-3 max-w-xl">
            {movie.overview}
          </p>

          {/* Actions */}
          <div className="flex items-center gap-3 flex-wrap">
            <Link href={`/movie/${movie.id}`}>
              <button className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-bold px-6 py-3 rounded-full transition-all duration-200 hover:scale-105 glow-primary">
                <Play size={18} fill="white" />
                Watch Now
              </button>
            </Link>
            <Link href={`/movie/${movie.id}`}>
              <button className="flex items-center gap-2 glass text-white font-semibold px-6 py-3 rounded-full hover:bg-white/10 transition-all duration-200">
                <Info size={18} />
                More Info
              </button>
            </Link>
            <button
              onClick={handleBookmark}
              className={`p-3 rounded-full glass transition-all duration-200 hover:scale-110 ${bookmarked ? "text-primary border-primary/50" : "text-white"}`}
            >
              {bookmarked ? <BookmarkCheck size={20} /> : <Bookmark size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Navigation arrows */}
      <button
        onClick={goToPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full glass hover:bg-white/10 transition-all duration-200 hover:scale-110"
      >
        <ChevronLeft size={22} className="text-white" />
      </button>
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full glass hover:bg-white/10 transition-all duration-200 hover:scale-110"
      >
        <ChevronRight size={22} className="text-white" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
        {featured.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`transition-all duration-300 rounded-full ${
              i === current
                ? "w-8 h-2 bg-primary"
                : "w-2 h-2 bg-white/40 hover:bg-white/70"
            }`}
          />
        ))}
      </div>

      {/* Side thumbnails (desktop) */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-3">
        {featured.slice(0, 5).map((m, i) => (
          <button
            key={m.id}
            onClick={() => setCurrent(i)}
            className={`relative w-16 h-24 rounded-lg overflow-hidden transition-all duration-300 ${
              i === current ? "ring-2 ring-primary scale-110 opacity-100" : "opacity-50 hover:opacity-80"
            }`}
          >
            {m.poster_path && (
              <img
                src={getImageUrl(m.poster_path, "w185")}
                alt={m.title}
                className="w-full h-full object-cover"
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
