import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearch } from "wouter";
import { Search, Film, Tv } from "lucide-react";
import MovieCard from "@/components/MovieCard";
import { SkeletonCard } from "@/components/LoadingSpinner";
import { guruhtech } from "@/lib/guruhtech";

export default function SearchPage() {
  const search = useSearch();
  const params = new URLSearchParams(search);
  const initialQ = params.get("q") ?? "";
  const [query, setQuery] = useState(initialQ);
  const [debouncedQ, setDebouncedQ] = useState(initialQ);
  const [typeFilter, setTypeFilter] = useState<1 | 2 | undefined>(undefined);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQ(query), 500);
    return () => clearTimeout(t);
  }, [query]);

  const { data, isLoading } = useQuery({
    queryKey: ["search", debouncedQ, typeFilter],
    queryFn: () => guruhtech.search.query(debouncedQ, 1, 30, typeFilter),
    enabled: debouncedQ.trim().length > 0,
  });

  const items = data?.subjectList ?? [];

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-10">
          <div className="flex items-center gap-3 glass rounded-2xl px-5 py-4 border border-primary/20 focus-within:border-primary/50 transition-colors">
            <Search size={20} className="text-primary flex-shrink-0" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search movies, TV shows..."
              className="bg-transparent flex-1 text-white placeholder-white/30 outline-none text-base"
              autoFocus
            />
          </div>

          {/* Type filter */}
          {debouncedQ && (
            <div className="flex gap-2 mt-4 justify-center">
              {[
                { label: "All", val: undefined },
                { label: "Movies", val: 1 as const, icon: Film },
                { label: "TV Shows", val: 2 as const, icon: Tv },
              ].map(({ label, val, icon: Icon }) => (
                <button
                  key={label}
                  onClick={() => setTypeFilter(val)}
                  className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                    typeFilter === val
                      ? "bg-primary text-white shadow-lg shadow-primary/30"
                      : "glass text-white/60 hover:text-white"
                  }`}
                >
                  {Icon && <Icon size={13} />}
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Results */}
        {!debouncedQ && (
          <div className="text-center py-20 text-white/30">
            <Search size={40} className="mx-auto mb-3 opacity-30" />
            <p className="text-lg font-semibold mb-1">Discover Movies & Shows</p>
            <p className="text-sm">Type something to start searching</p>
          </div>
        )}

        {debouncedQ && isLoading && (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
            {Array.from({ length: 18 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {debouncedQ && !isLoading && items.length === 0 && (
          <div className="text-center py-20 text-white/30">
            <Search size={40} className="mx-auto mb-3 opacity-30" />
            <p className="text-lg font-semibold mb-1">No results</p>
            <p className="text-sm">Try a different keyword</p>
          </div>
        )}

        {debouncedQ && !isLoading && items.length > 0 && (
          <>
            <p className="text-sm text-white/40 mb-5">
              {items.length} result{items.length !== 1 ? "s" : ""} for{" "}
              <span className="text-white font-semibold">"{debouncedQ}"</span>
            </p>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-4">
              {items.map((item) => (
                <MovieCard key={item.subjectId} item={item} size="sm" />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
