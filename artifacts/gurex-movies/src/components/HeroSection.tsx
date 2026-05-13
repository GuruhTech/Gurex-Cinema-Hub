import { useState, useEffect, useCallback } from "react";
import { Link } from "wouter";
import { Play, Info, Star, Calendar, ChevronLeft, ChevronRight, Bookmark, BookmarkCheck, Tv } from "lucide-react";
import { type Subject, getYear, formatGenres, savedWatchlist, subjectToSaved } from "@/lib/xcasper";

interface HeroSectionProps {
  items: Subject[];
}

export default function HeroSection({ items }: HeroSectionProps) {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const featured = items.slice(0, 8);

  const goTo = useCallback((idx: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrent(idx);
      setIsTransitioning(false);
    }, 300);
  }, [isTransitioning]);

  const goNext = useCallback(() => goTo((current + 1) % featured.length), [current, featured.length, goTo]);
  const goPrev = useCallback(() => goTo((current - 1 + featured.length) % featured.length), [current, featured.length, goTo]);

  useEffect(() => {
    const t = setInterval(goNext, 8000);
    return () => clearInterval(t);
  }, [goNext]);

  if (!featured.length) return null;

  const item = featured[current];
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    setBookmarked(savedWatchlist.has(item.subjectId));
  }, [item.subjectId]);

  const toggleBookmark = () => {
    if (bookmarked) {
      savedWatchlist.remove(item.subjectId);
    } else {
      savedWatchlist.add(subjectToSaved(item));
    }
    setBookmarked(!bookmarked);
  };

  const genres = formatGenres(item.genre).slice(0, 3);
  const isTV = item.subjectType === 2;
  const bgImage = item.stills?.url || item.cover?.url || "";

  return (
    <div className="relative w-full h-[90vh] min-h-[580px] max-h-[820px] overflow-hidden">
      {/* Backgrounds */}
      {featured.map((f, i) => {
        const bg = f.stills?.url || f.cover?.url || "";
        return (
          <div
            key={f.subjectId}
            className={`absolute inset-0 transition-opacity duration-700 ${i === current ? "opacity-100" : "opacity-0"}`}
          >
            {bg && (
              <img
                src={bg}
                alt={f.title}
                className="w-full h-full object-cover object-center scale-105"
                style={{ filter: "brightness(0.55) saturate(1.15)" }}
              />
            )}
            <div className="hero-gradient absolute inset-0" />
            <div className="hero-gradient-bottom absolute inset-0" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
          </div>
        );
      })}

      {/* Content */}
      <div
        className={`absolute inset-0 flex items-end pb-24 px-6 sm:px-10 lg:px-16 transition-all duration-500 ${
          isTransitioning ? "opacity-0 translate-y-5" : "opacity-100 translate-y-0"
        }`}
      >
        <div className="max-w-2xl">
          {/* Type badge */}
          <div className="flex items-center gap-2 mb-4">
            <span className={`flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${
              isTV ? "type-badge-tv" : "type-badge-movie"
            }`}>
              {isTV ? <Tv size={11} /> : <Play size={11} />}
              {isTV ? "TV Series" : "Movie"}
            </span>
            {item.countryName && (
              <span className="text-xs text-white/50 font-medium">{item.countryName}</span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-tight mb-4 drop-shadow-2xl">
            {item.title}
          </h1>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            {item.imdbRatingValue && parseFloat(item.imdbRatingValue) > 0 && (
              <div className="flex items-center gap-1.5 rating-badge px-2.5 py-1 rounded-full">
                <Star size={13} fill="white" className="text-white" />
                <span className="text-white text-sm font-bold">{item.imdbRatingValue}</span>
              </div>
            )}
            {item.releaseDate && (
              <div className="flex items-center gap-1.5 text-white/60 text-sm">
                <Calendar size={13} />
                <span>{getYear(item.releaseDate)}</span>
              </div>
            )}
            {genres.map((g) => (
              <span key={g} className="text-xs text-white/50 border border-white/15 px-2 py-0.5 rounded-full">
                {g}
              </span>
            ))}
          </div>

          {/* Description */}
          {item.description && (
            <p className="text-white/70 text-sm sm:text-base leading-relaxed mb-6 line-clamp-3 max-w-xl">
              {item.description}
            </p>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3 flex-wrap">
            <Link href={`/detail/${item.detailPath}`}>
              <button className="btn-primary flex items-center gap-2.5 text-white font-bold px-7 py-3.5 rounded-full shadow-lg">
                <Play size={17} fill="white" />
                Watch Now
              </button>
            </Link>
            <Link href={`/detail/${item.detailPath}`}>
              <button className="flex items-center gap-2 glass text-white font-semibold px-6 py-3.5 rounded-full hover:bg-white/10 transition-all duration-200">
                <Info size={17} />
                More Info
              </button>
            </Link>
            <button
              onClick={toggleBookmark}
              className={`p-3.5 rounded-full glass transition-all duration-200 hover:scale-110 ${
                bookmarked ? "text-primary border border-primary/40" : "text-white/70 hover:text-white"
              }`}
            >
              {bookmarked ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
            </button>
          </div>
        </div>
      </div>

      {/* Nav arrows */}
      <button
        onClick={goPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full glass hover:bg-white/10 transition-all hover:scale-110"
      >
        <ChevronLeft size={22} className="text-white" />
      </button>
      <button
        onClick={goNext}
        className="absolute right-4 sm:right-36 top-1/2 -translate-y-1/2 p-3 rounded-full glass hover:bg-white/10 transition-all hover:scale-110"
      >
        <ChevronRight size={22} className="text-white" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
        {featured.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`transition-all duration-300 rounded-full ${
              i === current ? "w-8 h-2 bg-primary" : "w-2 h-2 bg-white/30 hover:bg-white/60"
            }`}
          />
        ))}
      </div>

      {/* Side thumbnails */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-2.5">
        {featured.slice(0, 5).map((f, i) => (
          <button
            key={f.subjectId}
            onClick={() => goTo(i)}
            className={`relative w-14 h-20 rounded-xl overflow-hidden transition-all duration-300 ${
              i === current ? "ring-2 ring-primary scale-110 opacity-100" : "opacity-40 hover:opacity-70"
            }`}
          >
            {f.cover?.url && (
              <img src={f.cover.url} alt={f.title} className="w-full h-full object-cover" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
