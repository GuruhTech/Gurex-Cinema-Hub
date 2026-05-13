import { useState, useEffect, useCallback } from "react";
import { Link } from "wouter";
import { Play, Info, Star, Calendar, ChevronLeft, ChevronRight, Bookmark, BookmarkCheck, Tv, Youtube } from "lucide-react";
import { type Subject, getYear, formatGenres, savedWatchlist, subjectToSaved } from "@/lib/guruhtech";
import StreamModal from "@/components/StreamModal";
import TrailerModal from "@/components/TrailerModal";

interface HeroSectionProps {
  items: Subject[];
}

export default function HeroSection({ items }: HeroSectionProps) {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  const featured = items.slice(0, 8);

  const goTo = useCallback((idx: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrent(idx);
      setIsTransitioning(false);
    }, 300);
  }, [isTransitioning]);

  const goNext = useCallback(() => {
    goTo((current + 1) % Math.max(featured.length, 1));
  }, [current, featured.length, goTo]);

  const goPrev = useCallback(() => {
    goTo((current - 1 + Math.max(featured.length, 1)) % Math.max(featured.length, 1));
  }, [current, featured.length, goTo]);

  useEffect(() => {
    if (streaming || showTrailer || featured.length === 0) return;
    const t = setInterval(goNext, 8000);
    return () => clearInterval(t);
  }, [goNext, streaming, showTrailer, featured.length]);

  useEffect(() => {
    if (featured.length === 0) return;
    const item = featured[Math.min(current, featured.length - 1)];
    if (item) {
      setBookmarked(savedWatchlist.has(item.subjectId));
      setStreaming(false);
      setShowTrailer(false);
    }
  }, [current, featured]);

  if (!featured.length) return null;

  const safeIdx = Math.min(current, featured.length - 1);
  const item = featured[safeIdx];
  if (!item) return null;

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
  const hasTrailer = !!item.trailer;

  return (
    <>
      {streaming && (
        <StreamModal subjectId={item.subjectId} title={item.title} subjectType={item.subjectType} onClose={() => setStreaming(false)} />
      )}
      {showTrailer && item.trailer && (
        <TrailerModal trailerUrl={item.trailer} title={item.title} onClose={() => setShowTrailer(false)} />
      )}

      <div className="relative w-full h-[92vh] min-h-[600px] max-h-[860px] overflow-hidden">
        {/* Backgrounds */}
        {featured.map((f, i) => {
          const bg = f.stills?.url || f.cover?.url || "";
          return (
            <div
              key={f.subjectId}
              className={`absolute inset-0 transition-opacity duration-700 ${i === safeIdx ? "opacity-100" : "opacity-0"}`}
            >
              {bg && (
                <img
                  src={bg}
                  alt={f.title}
                  className="w-full h-full object-cover object-top scale-[1.04]"
                  style={{ filter: "brightness(0.5) saturate(1.2)" }}
                />
              )}
              <div className="hero-gradient absolute inset-0" />
              <div className="hero-gradient-bottom absolute inset-0" />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-background/70 via-transparent to-transparent" />
            </div>
          );
        })}

        {/* Content */}
        <div
          className={`absolute inset-0 flex items-end pb-28 px-6 sm:px-12 lg:px-20 transition-all duration-500 ${
            isTransitioning ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
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
              {item.corner && (
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-red-600/80 text-white">{item.corner}</span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-[1.05] mb-4 drop-shadow-2xl tracking-tight">
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
              <p className="text-white/65 text-sm sm:text-base leading-relaxed mb-7 line-clamp-2 max-w-xl">
                {item.description}
              </p>
            )}

            {/* Actions */}
            <div className="flex items-center gap-3 flex-wrap">
              <button
                onClick={() => setStreaming(true)}
                className="btn-primary flex items-center gap-2.5 text-white font-bold px-7 py-3.5 rounded-xl shadow-lg text-sm"
              >
                <Play size={17} fill="white" />
                Play Now
              </button>

              {hasTrailer && (
                <button
                  onClick={() => setShowTrailer(true)}
                  className="flex items-center gap-2 glass text-white font-semibold px-5 py-3.5 rounded-xl hover:bg-white/10 transition-all duration-200 text-sm border border-white/15"
                >
                  <Youtube size={17} className="text-red-400" />
                  Trailer
                </button>
              )}

              <Link href={`/detail/${item.detailPath}`}>
                <button className="flex items-center gap-2 glass text-white font-semibold px-5 py-3.5 rounded-xl hover:bg-white/10 transition-all duration-200 text-sm border border-white/10">
                  <Info size={17} />
                  More Info
                </button>
              </Link>

              <button
                onClick={toggleBookmark}
                className={`p-3.5 rounded-xl glass transition-all duration-200 hover:scale-110 border ${
                  bookmarked ? "text-primary border-primary/40" : "text-white/70 hover:text-white border-white/10"
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
          className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full glass hover:bg-white/10 transition-all hover:scale-110 border border-white/10"
        >
          <ChevronLeft size={22} className="text-white" />
        </button>
        <button
          onClick={goNext}
          className="absolute right-4 sm:right-36 top-1/2 -translate-y-1/2 p-3 rounded-full glass hover:bg-white/10 transition-all hover:scale-110 border border-white/10"
        >
          <ChevronRight size={22} className="text-white" />
        </button>

        {/* Dots */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-2">
          {featured.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`transition-all duration-300 rounded-full ${
                i === safeIdx ? "w-8 h-2 bg-primary" : "w-2 h-2 bg-white/30 hover:bg-white/60"
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
                i === safeIdx ? "ring-2 ring-primary scale-110 opacity-100" : "opacity-35 hover:opacity-70"
              }`}
            >
              {f.cover?.url && (
                <img src={f.cover.url} alt={f.title} className="w-full h-full object-cover" />
              )}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
