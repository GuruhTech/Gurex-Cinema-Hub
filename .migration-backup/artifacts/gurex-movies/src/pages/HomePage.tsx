import { useQuery } from "@tanstack/react-query";
import HeroSection from "@/components/HeroSection";
import MovieRow from "@/components/MovieRow";
import { SkeletonHero, SkeletonRow } from "@/components/LoadingSpinner";
import { tmdb } from "@/lib/tmdb";
import { Flame, TrendingUp, Star, Clock, Tv, Film } from "lucide-react";
import { Link } from "wouter";

export default function HomePage() {
  const { data: trending, isLoading: loadingTrending } = useQuery({
    queryKey: ["trending-movies"],
    queryFn: () => tmdb.movies.trending("week"),
  });

  const { data: popular } = useQuery({
    queryKey: ["popular-movies"],
    queryFn: () => tmdb.movies.popular(),
  });

  const { data: topRated } = useQuery({
    queryKey: ["top-rated-movies"],
    queryFn: () => tmdb.movies.topRated(),
  });

  const { data: nowPlaying } = useQuery({
    queryKey: ["now-playing"],
    queryFn: () => tmdb.movies.nowPlaying(),
  });

  const { data: upcoming } = useQuery({
    queryKey: ["upcoming-movies"],
    queryFn: () => tmdb.movies.upcoming(),
  });

  const { data: trendingTV } = useQuery({
    queryKey: ["trending-tv"],
    queryFn: () => tmdb.tv.trending("week"),
  });

  const { data: popularTV } = useQuery({
    queryKey: ["popular-tv"],
    queryFn: () => tmdb.tv.popular(),
  });

  const { data: allTrending } = useQuery({
    queryKey: ["trending-all"],
    queryFn: () => tmdb.trending.all("day"),
  });

  return (
    <div className="min-h-screen">
      {/* Hero */}
      {loadingTrending ? (
        <SkeletonHero />
      ) : trending?.results ? (
        <HeroSection movies={trending.results} />
      ) : null}

      {/* Main Content */}
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        {/* Category Quick Links */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-12">
          {[
            { href: "/trending", label: "Trending Now", icon: Flame, color: "from-orange-600 to-red-600" },
            { href: "/movies", label: "All Movies", icon: Film, color: "from-blue-600 to-indigo-600" },
            { href: "/tv", label: "TV Shows", icon: Tv, color: "from-purple-600 to-pink-600" },
            { href: "/top-rated", label: "Top Rated", icon: Star, color: "from-yellow-600 to-orange-600" },
          ].map(({ href, label, icon: Icon, color }) => (
            <Link key={href} href={href}>
              <div className={`relative overflow-hidden rounded-xl p-5 cursor-pointer group card-hover bg-gradient-to-br ${color}`}>
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                <Icon size={28} className="text-white mb-2 relative z-10" />
                <p className="text-white font-bold text-sm relative z-10">{label}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Rows */}
        {loadingTrending ? (
          <>
            <SkeletonRow />
            <SkeletonRow />
          </>
        ) : (
          <>
            {trending?.results && (
              <MovieRow
                title="Trending Movies"
                items={trending.results}
                mediaType="movie"
                viewAllHref="/trending"
              />
            )}
            {nowPlaying?.results && (
              <MovieRow
                title="Now Playing"
                items={nowPlaying.results}
                mediaType="movie"
                viewAllHref="/movies?filter=now_playing"
              />
            )}
            {popular?.results && (
              <MovieRow
                title="Popular Movies"
                items={popular.results}
                mediaType="movie"
                viewAllHref="/movies"
              />
            )}
            {trendingTV?.results && (
              <MovieRow
                title="Trending TV Shows"
                items={trendingTV.results}
                mediaType="tv"
                viewAllHref="/tv"
              />
            )}
            {topRated?.results && (
              <MovieRow
                title="Top Rated Movies"
                items={topRated.results}
                mediaType="movie"
                viewAllHref="/top-rated"
                size="lg"
              />
            )}
            {upcoming?.results && (
              <MovieRow
                title="Coming Soon"
                items={upcoming.results}
                mediaType="movie"
                viewAllHref="/movies?filter=upcoming"
              />
            )}
            {popularTV?.results && (
              <MovieRow
                title="Popular TV Shows"
                items={popularTV.results}
                mediaType="tv"
                viewAllHref="/tv"
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
