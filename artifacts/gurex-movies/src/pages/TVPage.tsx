import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import MovieCard from "@/components/MovieCard";
import GenreFilter from "@/components/GenreFilter";
import { SkeletonCard } from "@/components/LoadingSpinner";
import { xcasper, GENRES_TV } from "@/lib/xcasper";
import { Tv } from "lucide-react";

export default function TVPage() {
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["browse-tv", selectedGenre],
    queryFn: () => xcasper.browse.tv({ genre: selectedGenre ?? "", page: 1, perPage: 24 }),
  });

  const { data: trending } = useQuery({
    queryKey: ["trending-tv-browse"],
    queryFn: () => xcasper.trending.tv(0, 24),
    enabled: !selectedGenre,
  });

  const items = data?.subjectList ?? trending?.subjectList ?? [];

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-xl bg-pink-600/15 border border-pink-600/20">
            <Tv size={22} className="text-pink-400" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">TV Shows</h1>
            <p className="text-sm text-white/40 mt-0.5">Browse all TV series</p>
          </div>
        </div>

        <GenreFilter
          genres={GENRES_TV}
          selected={selectedGenre}
          onSelect={setSelectedGenre}
        />

        {isLoading ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-4">
            {Array.from({ length: 24 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-4">
            {items.map((item) => (
              <MovieCard key={item.subjectId} item={item} size="sm" />
            ))}
          </div>
        )}

        {!isLoading && items.length === 0 && (
          <div className="text-center py-20 text-white/30">
            <Tv size={40} className="mx-auto mb-3 opacity-30" />
            <p>No TV shows found for this filter</p>
          </div>
        )}
      </div>
    </div>
  );
}
