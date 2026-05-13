import { useQuery } from "@tanstack/react-query";
import MovieCard from "@/components/MovieCard";
import { SkeletonCard } from "@/components/LoadingSpinner";
import { guruhtech } from "@/lib/guruhtech";
import { Trophy } from "lucide-react";

export default function TopRatedPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["ranking-page"],
    queryFn: () => guruhtech.ranking(),
  });

  const { data: hot } = useQuery({
    queryKey: ["hot-top"],
    queryFn: () => guruhtech.hot(),
  });

  const items = [...(data?.subjectList ?? []), ...(hot?.subjectList ?? [])].filter(
    (item, idx, arr) => arr.findIndex((x) => x.subjectId === item.subjectId) === idx
  );

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2.5 rounded-xl bg-amber-600/15 border border-amber-600/20">
            <Trophy size={22} className="text-amber-400" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">Top Rated</h1>
            <p className="text-sm text-white/40 mt-0.5">Highest ranked content</p>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-4">
            {Array.from({ length: 24 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-4">
            {items.map((item, idx) => (
              <div key={item.subjectId} className="relative">
                {idx < 10 && (
                  <div className="absolute -top-1 -left-1 z-20 w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center text-[10px] font-black text-black shadow-lg shadow-amber-500/30">
                    {idx + 1}
                  </div>
                )}
                <MovieCard item={item} size="sm" />
              </div>
            ))}
          </div>
        )}

        {!isLoading && items.length === 0 && (
          <div className="text-center py-20 text-white/30">
            <Trophy size={40} className="mx-auto mb-3 opacity-30" />
            <p>No top-rated content available</p>
          </div>
        )}
      </div>
    </div>
  );
}
