import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import MovieCard from "@/components/MovieCard";
import { SkeletonCard } from "@/components/LoadingSpinner";
import { xcasper } from "@/lib/xcasper";
import { Flame, Film, Tv } from "lucide-react";

type Tab = "all" | "movies" | "tv";

export default function TrendingPage() {
  const [tab, setTab] = useState<Tab>("all");

  const { data: all, isLoading: loadingAll } = useQuery({
    queryKey: ["trending-all-page"],
    queryFn: () => xcasper.trending.all(0, 24),
  });
  const { data: movies, isLoading: loadingMovies } = useQuery({
    queryKey: ["trending-movies-page"],
    queryFn: () => xcasper.trending.movies(0, 24),
  });
  const { data: tv, isLoading: loadingTV } = useQuery({
    queryKey: ["trending-tv-page"],
    queryFn: () => xcasper.trending.tv(0, 24),
  });

  const items =
    tab === "movies"
      ? movies?.subjectList ?? []
      : tab === "tv"
      ? tv?.subjectList ?? []
      : all?.subjectList ?? [];

  const loading = tab === "movies" ? loadingMovies : tab === "tv" ? loadingTV : loadingAll;

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2.5 rounded-xl bg-primary/15 border border-primary/20">
            <Flame size={22} className="text-primary" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">Trending Now</h1>
            <p className="text-sm text-white/40 mt-0.5">What everyone's watching right now</p>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex gap-2 mb-8 mt-6">
          {([
            { key: "all", label: "All", icon: Flame },
            { key: "movies", label: "Movies", icon: Film },
            { key: "tv", label: "TV Shows", icon: Tv },
          ] as { key: Tab; label: string; icon: React.ComponentType<{ size: number }> }[]).map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                tab === key
                  ? "bg-primary text-white shadow-lg shadow-primary/30"
                  : "glass text-white/60 hover:text-white hover:bg-white/8"
              }`}
            >
              <Icon size={14} />
              {label}
            </button>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-8 gap-4">
            {Array.from({ length: 24 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-8 gap-4">
            {items.map((item) => (
              <MovieCard key={item.subjectId} item={item} size="sm" />
            ))}
          </div>
        )}

        {!loading && items.length === 0 && (
          <div className="text-center py-20 text-white/30">
            <Flame size={40} className="mx-auto mb-3 opacity-30" />
            <p>No trending content found</p>
          </div>
        )}
      </div>
    </div>
  );
}
