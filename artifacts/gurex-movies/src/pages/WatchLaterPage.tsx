import { useState, useEffect } from "react";
import { Clock, Trash2, Film, Tv } from "lucide-react";
import { Link } from "wouter";
import { watchLater, getImageUrl, formatVoteAverage, getRatingColor, getYear } from "@/lib/tmdb";
import type { WatchlistItem } from "@/lib/tmdb";

export default function WatchLaterPage() {
  const [items, setItems] = useState<WatchlistItem[]>([]);

  useEffect(() => {
    setItems(watchLater.get());
  }, []);

  const removeItem = (id: number, mediaType: "movie" | "tv") => {
    watchLater.remove(id, mediaType);
    setItems(watchLater.get());
  };

  const clearAll = () => {
    items.forEach((i) => watchLater.remove(i.id, i.media_type));
    setItems([]);
  };

  const movies = items.filter((i) => i.media_type === "movie");
  const tvShows = items.filter((i) => i.media_type === "tv");

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-screen-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
            <Clock size={20} className="text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-foreground">Watch Later</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {items.length} {items.length === 1 ? "item" : "items"} saved
            </p>
          </div>
        </div>
        {items.length > 0 && (
          <button
            onClick={clearAll}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-destructive/10 hover:bg-destructive/20 text-destructive text-sm font-medium transition-colors border border-destructive/20"
          >
            <Trash2 size={15} />
            Clear All
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <div className="w-20 h-20 rounded-full bg-blue-500/10 flex items-center justify-center mb-5 border border-blue-500/20">
            <Clock size={36} className="text-blue-400/50" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">Nothing saved yet</h2>
          <p className="text-muted-foreground text-sm max-w-xs mb-6">
            Tap the clock icon on any movie or TV show card to save it for later.
          </p>
          <Link href="/movies">
            <button className="px-6 py-2.5 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary/90 transition-colors">
              Browse Movies
            </button>
          </Link>
        </div>
      ) : (
        <div className="space-y-10">
          {/* Movies */}
          {movies.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-4">
                <Film size={18} className="text-primary" />
                <h2 className="text-lg font-bold">Movies</h2>
                <span className="text-xs text-muted-foreground px-2 py-0.5 rounded-full bg-card border border-border">{movies.length}</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {movies.map((item) => (
                  <WatchLaterCard key={`${item.id}-movie`} item={item} onRemove={removeItem} />
                ))}
              </div>
            </section>
          )}

          {/* TV Shows */}
          {tvShows.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-4">
                <Tv size={18} className="text-primary" />
                <h2 className="text-lg font-bold">TV Shows</h2>
                <span className="text-xs text-muted-foreground px-2 py-0.5 rounded-full bg-card border border-border">{tvShows.length}</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {tvShows.map((item) => (
                  <WatchLaterCard key={`${item.id}-tv`} item={item} onRemove={removeItem} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}

function WatchLaterCard({ item, onRemove }: { item: WatchlistItem; onRemove: (id: number, type: "movie" | "tv") => void }) {
  const date = item.release_date || item.first_air_date || "";
  const voteAverage = item.vote_average ?? 0;

  return (
    <div className="group relative">
      <Link href={`/${item.media_type}/${item.id}`}>
        <div
          className="relative rounded-xl overflow-hidden aspect-[2/3] cursor-pointer"
          style={{
            background: "rgba(20,22,30,0.6)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.6), 0 2px 8px rgba(0,0,0,0.4)",
            transition: "transform 0.3s ease, box-shadow 0.3s ease",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.transform = "translateY(-6px) scale(1.02)";
            (e.currentTarget as HTMLElement).style.boxShadow = "0 20px 60px rgba(0,0,0,0.8), 0 0 20px rgba(59,130,246,0.2)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.transform = "";
            (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 32px rgba(0,0,0,0.6), 0 2px 8px rgba(0,0,0,0.4)";
          }}
        >
          {item.poster_path ? (
            <img
              src={getImageUrl(item.poster_path, "w342")}
              alt={item.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="absolute inset-0 bg-muted flex items-center justify-center">
              <Clock size={32} className="text-muted-foreground" />
            </div>
          )}

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
            <div>
              <div className={`text-sm font-bold ${getRatingColor(voteAverage)}`}>
                ★ {formatVoteAverage(voteAverage)}
              </div>
              {date && <div className="text-xs text-white/60">{getYear(date)}</div>}
            </div>
          </div>

          {/* Badge */}
          <div className="absolute top-2 left-2">
            <span className="text-xs font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-blue-500/80 backdrop-blur-sm text-white">
              {item.media_type === "movie" ? "Movie" : "TV"}
            </span>
          </div>
        </div>
      </Link>

      {/* Remove button */}
      <button
        onClick={() => onRemove(item.id, item.media_type)}
        className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 border border-white/10 text-white/70 hover:text-red-400 hover:bg-black opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 z-10"
        title="Remove"
      >
        <Trash2 size={12} />
      </button>

      <div className="mt-2 px-0.5">
        <p className="text-sm font-semibold line-clamp-1 group-hover:text-primary transition-colors">{item.title}</p>
        {date && <p className="text-xs text-muted-foreground mt-0.5">{getYear(date)}</p>}
      </div>
    </div>
  );
}
