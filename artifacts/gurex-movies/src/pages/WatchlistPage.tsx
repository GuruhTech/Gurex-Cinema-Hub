import { useState } from "react";
import { Link } from "wouter";
import { Bookmark, Trash2, Film, Tv } from "lucide-react";
import { watchlist, getImageUrl, formatVoteAverage, getRatingColor, getYear } from "@/lib/tmdb";
import type { WatchlistItem } from "@/lib/tmdb";
import MovieCard from "@/components/MovieCard";

export default function WatchlistPage() {
  const [items, setItems] = useState<WatchlistItem[]>(() => watchlist.get());
  const [filter, setFilter] = useState<"all" | "movie" | "tv">("all");

  const filtered = items.filter((i) => filter === "all" || i.media_type === filter);

  const remove = (id: number, mediaType: "movie" | "tv") => {
    watchlist.remove(id, mediaType);
    setItems(watchlist.get());
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1 h-8 rounded-full bg-primary" />
            <h1 className="text-3xl sm:text-4xl font-black flex items-center gap-2">
              <Bookmark size={32} className="text-primary" />
              My Watchlist
            </h1>
          </div>
          <p className="text-muted-foreground ml-4">{items.length} item{items.length !== 1 ? "s" : ""} saved</p>
        </div>

        {/* Filter */}
        <div className="flex gap-2 mb-8">
          {(["all", "movie", "tv"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-5 py-2 rounded-full text-sm font-semibold capitalize transition-all duration-200 ${
                filter === f
                  ? "bg-primary text-white glow-primary"
                  : "bg-card border border-border hover:bg-muted"
              }`}
            >
              {f === "all" ? "All" : f === "movie" ? "Movies" : "TV Shows"}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-24">
            <Bookmark size={56} className="mx-auto text-muted-foreground/30 mb-4" />
            <p className="text-xl font-semibold text-muted-foreground">Your watchlist is empty</p>
            <p className="text-muted-foreground mt-2">Start adding movies and shows you want to watch</p>
            <Link href="/">
              <button className="mt-6 bg-primary text-white px-6 py-3 rounded-full font-semibold hover:bg-primary/90 transition-colors">
                Browse Content
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((item) => (
              <div key={`${item.id}-${item.media_type}`} className="flex gap-3 p-4 rounded-xl bg-card border border-border group hover:border-primary/40 transition-all duration-200">
                <Link href={`/${item.media_type}/${item.id}`}>
                  <div className="w-16 flex-shrink-0 rounded-lg overflow-hidden cursor-pointer">
                    {item.poster_path ? (
                      <img
                        src={getImageUrl(item.poster_path, "w185")}
                        alt={item.title}
                        className="w-full aspect-[2/3] object-cover hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="aspect-[2/3] bg-muted flex items-center justify-center">
                        {item.media_type === "movie" ? <Film size={20} className="text-muted-foreground" /> : <Tv size={20} className="text-muted-foreground" />}
                      </div>
                    )}
                  </div>
                </Link>
                <div className="flex-1 min-w-0">
                  <Link href={`/${item.media_type}/${item.id}`}>
                    <h3 className="font-bold text-sm line-clamp-2 hover:text-primary cursor-pointer transition-colors">
                      {item.title}
                    </h3>
                  </Link>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs font-semibold ${getRatingColor(item.vote_average)}`}>
                      ★ {formatVoteAverage(item.vote_average)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {getYear(item.release_date || item.first_air_date || "")}
                    </span>
                    <span className={`text-xs px-1.5 py-0.5 rounded font-semibold uppercase ${
                      item.media_type === "movie" ? "bg-blue-500/20 text-blue-400" : "bg-purple-500/20 text-purple-400"
                    }`}>
                      {item.media_type}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Added {new Date(item.added_at).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => remove(item.id, item.media_type)}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-red-400 hover:bg-red-400/10 transition-all duration-200 opacity-0 group-hover:opacity-100 flex-shrink-0 self-start"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
