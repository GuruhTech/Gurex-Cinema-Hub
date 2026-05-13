import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearch } from "wouter";
import { Link } from "wouter";
import { Search, Film, Tv, User, Star } from "lucide-react";
import { tmdb, getImageUrl, formatVoteAverage, getRatingColor, getYear } from "@/lib/tmdb";
import { SkeletonCard } from "@/components/LoadingSpinner";
import MovieCard from "@/components/MovieCard";

export default function SearchPage() {
  const search = useSearch();
  const params = new URLSearchParams(search);
  const queryParam = params.get("q") || "";

  const [query, setQuery] = useState(queryParam);
  const [activeTab, setActiveTab] = useState<"all" | "movie" | "tv" | "person">("all");
  const [page, setPage] = useState(1);

  useEffect(() => {
    setQuery(queryParam);
    setPage(1);
  }, [queryParam]);

  const { data: results, isLoading } = useQuery({
    queryKey: ["search", query, activeTab, page],
    queryFn: () => {
      if (!query) return null;
      if (activeTab === "movie") return tmdb.search.movies(query, page);
      if (activeTab === "tv") return tmdb.search.tv(query, page);
      if (activeTab === "person") return tmdb.search.people(query, page);
      return tmdb.search.multi(query, page);
    },
    enabled: !!query,
  });

  const allResults = (results as any)?.results || [];
  const movieResults = allResults.filter((r: any) => r.media_type === "movie" || activeTab === "movie");
  const tvResults = allResults.filter((r: any) => r.media_type === "tv" || activeTab === "tv");
  const personResults = allResults.filter((r: any) => r.media_type === "person" || activeTab === "person");

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1 h-8 rounded-full bg-primary" />
            <h1 className="text-3xl sm:text-4xl font-black">Search</h1>
          </div>
          {query && (
            <p className="text-muted-foreground ml-4">
              Results for "<span className="text-foreground font-semibold">{query}</span>"
              {results && ` — ${(results as any).total_results?.toLocaleString()} results`}
            </p>
          )}
        </div>

        {/* Search bar */}
        <div className="relative max-w-2xl mb-8">
          <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setPage(1); }}
            placeholder="Search movies, TV shows, people..."
            className="w-full pl-12 pr-4 py-3.5 rounded-full bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-base transition-all"
          />
        </div>

        {!query ? (
          <div className="text-center py-24">
            <Search size={56} className="mx-auto text-muted-foreground/30 mb-4" />
            <p className="text-xl font-semibold text-muted-foreground">Search for movies, TV shows, or people</p>
          </div>
        ) : (
          <>
            {/* Tabs */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
              {(["all", "movie", "tv", "person"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => { setActiveTab(tab); setPage(1); }}
                  className={`px-5 py-2 rounded-full text-sm font-semibold capitalize whitespace-nowrap transition-all duration-200 flex items-center gap-1.5 ${
                    activeTab === tab
                      ? "bg-primary text-white glow-primary"
                      : "bg-card border border-border hover:bg-muted"
                  }`}
                >
                  {tab === "movie" && <Film size={14} />}
                  {tab === "tv" && <Tv size={14} />}
                  {tab === "person" && <User size={14} />}
                  {tab === "all" ? "All" : tab === "movie" ? "Movies" : tab === "tv" ? "TV Shows" : "People"}
                </button>
              ))}
            </div>

            {isLoading ? (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-4">
                {Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : allResults.length === 0 ? (
              <div className="text-center py-24">
                <p className="text-xl font-semibold text-muted-foreground">No results found for "{query}"</p>
                <p className="text-muted-foreground mt-2">Try a different search term</p>
              </div>
            ) : (
              <>
                {/* People */}
                {(activeTab === "all" || activeTab === "person") && personResults.length > 0 && (
                  <div className="mb-10">
                    <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                      <User size={18} className="text-primary" />
                      People
                    </h2>
                    <div className="flex gap-4 overflow-x-auto pb-2">
                      {personResults.map((person: any) => (
                        <div key={person.id} className="flex-shrink-0 w-28 text-center group">
                          <div className="w-20 h-20 mx-auto rounded-full overflow-hidden bg-card border-2 border-border group-hover:border-primary transition-colors">
                            {person.profile_path ? (
                              <img
                                src={getImageUrl(person.profile_path, "w185")}
                                alt={person.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-muted">
                                <User size={24} className="text-muted-foreground" />
                              </div>
                            )}
                          </div>
                          <p className="text-xs font-semibold mt-2 line-clamp-1">{person.name}</p>
                          <p className="text-xs text-muted-foreground">{person.known_for_department}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Movies */}
                {(activeTab === "all" || activeTab === "movie") && movieResults.length > 0 && (
                  <div className="mb-10">
                    {activeTab === "all" && (
                      <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <Film size={18} className="text-primary" />
                        Movies
                      </h2>
                    )}
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-4">
                      {movieResults.map((item: any) => (
                        <div key={item.id} className="flex justify-center">
                          <MovieCard item={item} mediaType="movie" size="sm" showType={false} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TV */}
                {(activeTab === "all" || activeTab === "tv") && tvResults.length > 0 && (
                  <div className="mb-10">
                    {activeTab === "all" && (
                      <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <Tv size={18} className="text-primary" />
                        TV Shows
                      </h2>
                    )}
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-4">
                      {tvResults.map((item: any) => (
                        <div key={item.id} className="flex justify-center">
                          <MovieCard item={item} mediaType="tv" size="sm" showType={false} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Pagination */}
                {results && (results as any).total_pages > 1 && (
                  <div className="flex items-center justify-center gap-3 mt-10">
                    <button
                      disabled={page <= 1}
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      className="px-5 py-2 rounded-full bg-card border border-border text-sm font-medium disabled:opacity-40 hover:bg-muted transition-colors"
                    >
                      Previous
                    </button>
                    <span className="text-sm text-muted-foreground">Page {page} of {(results as any).total_pages}</span>
                    <button
                      disabled={page >= (results as any).total_pages}
                      onClick={() => setPage((p) => p + 1)}
                      className="px-5 py-2 rounded-full bg-card border border-border text-sm font-medium disabled:opacity-40 hover:bg-muted transition-colors"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
