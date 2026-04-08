import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import MovieCard from "@/components/MovieCard";
import { SkeletonCard } from "@/components/LoadingSpinner";
import { tmdb } from "@/lib/tmdb";
import { Flame } from "lucide-react";

export default function TrendingPage() {
  const [timeWindow, setTimeWindow] = useState<"day" | "week">("week");
  const [mediaType, setMediaType] = useState<"all" | "movie" | "tv">("all");

  const { data: trendingAll, isLoading: loadingAll } = useQuery({
    queryKey: ["trending-all", timeWindow],
    queryFn: () => tmdb.trending.all(timeWindow),
    enabled: mediaType === "all",
  });

  const { data: trendingMovies, isLoading: loadingMovies } = useQuery({
    queryKey: ["trending-movies", timeWindow],
    queryFn: () => tmdb.movies.trending(timeWindow),
    enabled: mediaType === "movie",
  });

  const { data: trendingTV, isLoading: loadingTV } = useQuery({
    queryKey: ["trending-tv", timeWindow],
    queryFn: () => tmdb.tv.trending(timeWindow),
    enabled: mediaType === "tv",
  });

  const isLoading = loadingAll || loadingMovies || loadingTV;
  const results =
    mediaType === "all"
      ? trendingAll?.results?.filter((r: any) => r.media_type !== "person") || []
      : mediaType === "movie"
      ? trendingMovies?.results || []
      : trendingTV?.results || [];

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1 h-8 rounded-full bg-primary" />
            <h1 className="text-3xl sm:text-4xl font-black flex items-center gap-2">
              <Flame size={32} className="text-primary" />
              Trending
            </h1>
          </div>
          <p className="text-muted-foreground ml-4">What everyone is watching right now</p>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          {/* Time window */}
          <div className="flex gap-2">
            {(["day", "week"] as const).map((tw) => (
              <button
                key={tw}
                onClick={() => setTimeWindow(tw)}
                className={`px-5 py-2 rounded-full text-sm font-semibold capitalize transition-all duration-200 ${
                  timeWindow === tw
                    ? "bg-primary text-white glow-primary"
                    : "bg-card border border-border hover:bg-muted"
                }`}
              >
                {tw === "day" ? "Today" : "This Week"}
              </button>
            ))}
          </div>

          {/* Media type */}
          <div className="flex gap-2">
            {(["all", "movie", "tv"] as const).map((mt) => (
              <button
                key={mt}
                onClick={() => setMediaType(mt)}
                className={`px-5 py-2 rounded-full text-sm font-semibold capitalize transition-all duration-200 ${
                  mediaType === mt
                    ? "bg-primary text-white glow-primary"
                    : "bg-card border border-border hover:bg-muted"
                }`}
              >
                {mt === "all" ? "All" : mt === "movie" ? "Movies" : "TV"}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-4">
            {Array.from({ length: 20 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-4">
            {results.map((item: any) => {
              const mt = item.media_type === "tv" ? "tv" : "movie";
              return (
                <div key={`${item.id}-${mt}`} className="flex justify-center">
                  <MovieCard
                    item={item}
                    mediaType={mediaType === "all" ? mt : mediaType}
                    size="sm"
                    showType={mediaType === "all"}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
