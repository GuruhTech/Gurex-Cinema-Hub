import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearch } from "wouter";
import MovieCard from "@/components/MovieCard";
import GenreFilter from "@/components/GenreFilter";
import LoadingSpinner, { SkeletonCard } from "@/components/LoadingSpinner";
import { tmdb } from "@/lib/tmdb";
import { Filter, SortAsc } from "lucide-react";

const SORT_OPTIONS = [
  { value: "popularity.desc", label: "Most Popular" },
  { value: "vote_average.desc", label: "Highest Rated" },
  { value: "release_date.desc", label: "Newest" },
  { value: "revenue.desc", label: "Highest Grossing" },
  { value: "vote_count.desc", label: "Most Voted" },
];

export default function MoviesPage() {
  const search = useSearch();
  const params = new URLSearchParams(search);
  const defaultGenre = params.get("genre") ? parseInt(params.get("genre")!) : null;

  const [selectedGenre, setSelectedGenre] = useState<number | null>(defaultGenre);
  const [sortBy, setSortBy] = useState("popularity.desc");
  const [page, setPage] = useState(1);

  const { data: genres } = useQuery({
    queryKey: ["movie-genres"],
    queryFn: () => tmdb.movies.genres(),
  });

  const { data: movies, isLoading } = useQuery({
    queryKey: ["discover-movies", selectedGenre, sortBy, page],
    queryFn: () =>
      tmdb.movies.discover({
        ...(selectedGenre ? { with_genres: selectedGenre } : {}),
        sort_by: sortBy,
        page,
        "vote_count.gte": 50,
      }),
  });

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1 h-8 rounded-full bg-primary" />
            <h1 className="text-3xl sm:text-4xl font-black">Movies</h1>
          </div>
          <p className="text-muted-foreground ml-4">Discover thousands of movies from every genre</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          {/* Sort */}
          <div className="flex items-center gap-2">
            <SortAsc size={18} className="text-primary flex-shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
              className="bg-card border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          {/* Filter count */}
          {selectedGenre && (
            <button
              onClick={() => setSelectedGenre(null)}
              className="text-xs text-primary border border-primary/30 px-3 py-1.5 rounded-full hover:bg-primary/10 transition-colors"
            >
              Clear genre filter
            </button>
          )}
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
              {movies?.results.map((movie) => (
                <div key={movie.id} className="flex justify-center">
                  <MovieCard item={movie} mediaType="movie" size="sm" showType={false} />
                </div>
              ))}
            </div>

            {/* Pagination */}
            {movies && movies.total_pages > 1 && (
              <div className="flex items-center justify-center gap-3 mt-12">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="px-5 py-2 rounded-full bg-card border border-border text-sm font-medium disabled:opacity-40 hover:bg-muted transition-colors"
                >
                  Previous
                </button>
                <div className="flex gap-2">
                  {Array.from({ length: Math.min(5, movies.total_pages) }, (_, i) => {
                    const p = Math.max(1, page - 2) + i;
                    if (p > movies.total_pages) return null;
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
                  disabled={page >= movies.total_pages}
                  onClick={() => setPage((p) => Math.min(movies.total_pages, p + 1))}
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
