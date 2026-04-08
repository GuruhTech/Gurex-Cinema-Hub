import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import MovieCard from "@/components/MovieCard";
import GenreFilter from "@/components/GenreFilter";
import { SkeletonCard } from "@/components/LoadingSpinner";
import { tmdb } from "@/lib/tmdb";
import { SortAsc } from "lucide-react";

const SORT_OPTIONS = [
  { value: "popularity.desc", label: "Most Popular" },
  { value: "vote_average.desc", label: "Highest Rated" },
  { value: "first_air_date.desc", label: "Newest" },
  { value: "vote_count.desc", label: "Most Voted" },
];

const FILTER_OPTIONS = [
  { value: "popular", label: "Popular" },
  { value: "top_rated", label: "Top Rated" },
  { value: "on_air", label: "On Air" },
  { value: "airing_today", label: "Airing Today" },
];

export default function TVPage() {
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState("popularity.desc");
  const [filter, setFilter] = useState<string>("popular");
  const [page, setPage] = useState(1);

  const { data: genres } = useQuery({
    queryKey: ["tv-genres"],
    queryFn: () => tmdb.tv.genres(),
  });

  const { data: shows, isLoading } = useQuery({
    queryKey: ["discover-tv", selectedGenre, sortBy, filter, page],
    queryFn: () => {
      if (!selectedGenre) {
        if (filter === "popular") return tmdb.tv.popular(page);
        if (filter === "top_rated") return tmdb.tv.topRated(page);
        if (filter === "on_air") return tmdb.tv.onAir(page);
        if (filter === "airing_today") return tmdb.tv.airingToday(page);
      }
      return tmdb.tv.byGenre(selectedGenre!, page);
    },
  });

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1 h-8 rounded-full bg-primary" />
            <h1 className="text-3xl sm:text-4xl font-black">TV Shows</h1>
          </div>
          <p className="text-muted-foreground ml-4">Explore the best TV shows from around the world</p>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {FILTER_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => { setFilter(opt.value); setSelectedGenre(null); setPage(1); }}
              className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                filter === opt.value && !selectedGenre
                  ? "bg-primary text-white glow-primary"
                  : "bg-card border border-border hover:bg-muted"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Genre Filter */}
        {genres?.genres && (
          <div className="mb-8">
            <GenreFilter
              genres={genres.genres}
              selected={selectedGenre}
              onChange={(id) => { setSelectedGenre(id); setPage(1); }}
            />
          </div>
        )}

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
              {shows?.results.map((show) => (
                <div key={show.id} className="flex justify-center">
                  <MovieCard item={show} mediaType="tv" size="sm" showType={false} />
                </div>
              ))}
            </div>

            {/* Pagination */}
            {shows && shows.total_pages > 1 && (
              <div className="flex items-center justify-center gap-3 mt-12">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="px-5 py-2 rounded-full bg-card border border-border text-sm font-medium disabled:opacity-40 hover:bg-muted transition-colors"
                >
                  Previous
                </button>
                <div className="flex gap-2">
                  {Array.from({ length: Math.min(5, shows.total_pages) }, (_, i) => {
                    const p = Math.max(1, page - 2) + i;
                    if (p > shows.total_pages) return null;
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
                  disabled={page >= shows.total_pages}
                  onClick={() => setPage((p) => Math.min(shows.total_pages, p + 1))}
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
