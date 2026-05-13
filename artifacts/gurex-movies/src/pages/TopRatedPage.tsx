import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import MovieCard from "@/components/MovieCard";
import { SkeletonCard } from "@/components/LoadingSpinner";
import { tmdb } from "@/lib/tmdb";
import { Star } from "lucide-react";

export default function TopRatedPage() {
  const [mediaType, setMediaType] = useState<"movie" | "tv">("movie");
  const [page, setPage] = useState(1);

  const { data: movies, isLoading: loadingMovies } = useQuery({
    queryKey: ["top-rated-movies", page],
    queryFn: () => tmdb.movies.topRated(page),
    enabled: mediaType === "movie",
  });

  const { data: tv, isLoading: loadingTV } = useQuery({
    queryKey: ["top-rated-tv", page],
    queryFn: () => tmdb.tv.topRated(page),
    enabled: mediaType === "tv",
  });

  const isLoading = loadingMovies || loadingTV;
  const data = mediaType === "movie" ? movies : tv;

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1 h-8 rounded-full bg-primary" />
            <h1 className="text-3xl sm:text-4xl font-black flex items-center gap-2">
              <Star size={32} className="text-yellow-400" fill="currentColor" />
              Top Rated
            </h1>
          </div>
          <p className="text-muted-foreground ml-4">The highest rated content of all time</p>
        </div>

        {/* Toggle */}
        <div className="flex gap-2 mb-8">
          {(["movie", "tv"] as const).map((mt) => (
            <button
              key={mt}
              onClick={() => { setMediaType(mt); setPage(1); }}
              className={`px-6 py-2.5 rounded-full text-sm font-bold capitalize transition-all duration-200 ${
                mediaType === mt
                  ? "bg-primary text-white glow-primary"
                  : "bg-card border border-border hover:bg-muted"
              }`}
            >
              {mt === "movie" ? "Movies" : "TV Shows"}
            </button>
          ))}
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-4">
            {Array.from({ length: 20 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-4">
              {data?.results.map((item, idx) => (
                <div key={item.id} className="flex justify-center relative">
                  {/* Rank badge for top 3 */}
                  {page === 1 && idx < 3 && (
                    <div className={`absolute -top-2 -left-2 z-20 w-7 h-7 rounded-full flex items-center justify-center text-xs font-black text-white ${
                      idx === 0 ? "bg-yellow-500" : idx === 1 ? "bg-gray-400" : "bg-amber-700"
                    }`}>
                      {idx + 1}
                    </div>
                  )}
                  <MovieCard item={item} mediaType={mediaType} size="sm" showType={false} />
                </div>
              ))}
            </div>

            {/* Pagination */}
            {data && data.total_pages > 1 && (
              <div className="flex items-center justify-center gap-3 mt-12">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="px-5 py-2 rounded-full bg-card border border-border text-sm font-medium disabled:opacity-40 hover:bg-muted transition-colors"
                >
                  Previous
                </button>
                <div className="flex gap-2">
                  {Array.from({ length: Math.min(5, data.total_pages) }, (_, i) => {
                    const p = Math.max(1, page - 2) + i;
                    if (p > data.total_pages) return null;
                    return (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`w-9 h-9 rounded-full text-sm font-bold transition-all ${
                          p === page
                            ? "bg-primary text-white glow-primary"
                            : "bg-card border border-border hover:bg-muted"
                        }`}
                      >
                        {p}
                      </button>
                    );
                  })}
                </div>
                <button
                  disabled={page >= data.total_pages}
                  onClick={() => setPage((p) => Math.min(data.total_pages, p + 1))}
                  className="px-5 py-2 rounded-full bg-card border border-border text-sm font-medium disabled:opacity-40 hover:bg-muted transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
