import { useQuery } from "@tanstack/react-query";
import HeroSection from "@/components/HeroSection";
import MovieRow from "@/components/MovieRow";
import { SkeletonHero, SkeletonRow } from "@/components/LoadingSpinner";
import { xcasper } from "@/lib/xcasper";
import { Flame, Star, Tv, Film, Trophy } from "lucide-react";
import { Link } from "wouter";

export default function HomePage() {
  const { data: trendingMovies, isLoading } = useQuery({
    queryKey: ["trending-movies"],
    queryFn: () => xcasper.trending.movies(0, 18),
  });

  const { data: trendingTV } = useQuery({
    queryKey: ["trending-tv"],
    queryFn: () => xcasper.trending.tv(0, 18),
  });

  const { data: trendingAll } = useQuery({
    queryKey: ["trending-all"],
    queryFn: () => xcasper.trending.all(0, 24),
  });

  const { data: hot } = useQuery({
    queryKey: ["hot"],
    queryFn: () => xcasper.hot(),
  });

  const { data: ranking } = useQuery({
    queryKey: ["ranking"],
    queryFn: () => xcasper.ranking(),
  });

  const heroItems = trendingAll?.subjectList ?? trendingMovies?.subjectList ?? [];

  return (
    <div className="min-h-screen">
      {isLoading ? <SkeletonHero /> : heroItems.length ? <HeroSection items={heroItems} /> : null}

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        {/* Category Quick Links */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-12">
          {[
            { href: "/trending", label: "Trending Now", icon: Flame, from: "from-violet-700", to: "to-purple-600" },
            { href: "/movies", label: "All Movies", icon: Film, from: "from-indigo-700", to: "to-blue-600" },
            { href: "/tv", label: "TV Shows", icon: Tv, from: "from-pink-700", to: "to-rose-600" },
            { href: "/top-rated", label: "Top Rated", icon: Star, from: "from-amber-600", to: "to-orange-600" },
          ].map(({ href, label, icon: Icon, from, to }) => (
            <Link key={href} href={href}>
              <div className={`relative overflow-hidden rounded-2xl p-5 cursor-pointer group bg-gradient-to-br ${from} ${to} hover:scale-[1.03] transition-transform duration-300`}>
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                <div className="absolute -bottom-3 -right-3 opacity-10">
                  <Icon size={64} className="text-white" />
                </div>
                <Icon size={26} className="text-white mb-2.5 relative z-10 drop-shadow-md" />
                <p className="text-white font-bold text-sm relative z-10 drop-shadow-sm">{label}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Rows */}
        {isLoading ? (
          <>
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
          </>
        ) : (
          <>
            {trendingMovies?.subjectList?.length ? (
              <MovieRow
                title="Trending Movies"
                icon={<Flame size={18} />}
                items={trendingMovies.subjectList}
                viewAllHref="/trending"
              />
            ) : null}

            {trendingTV?.subjectList?.length ? (
              <MovieRow
                title="Trending TV Shows"
                icon={<Tv size={18} />}
                items={trendingTV.subjectList}
                viewAllHref="/tv"
              />
            ) : null}

            {hot?.subjectList?.length ? (
              <MovieRow
                title="Hot Right Now"
                icon={<Flame size={18} />}
                items={hot.subjectList}
                viewAllHref="/trending"
              />
            ) : null}

            {ranking?.subjectList?.length ? (
              <MovieRow
                title="Top Rankings"
                icon={<Trophy size={18} />}
                items={ranking.subjectList}
                viewAllHref="/top-rated"
                size="lg"
              />
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}
