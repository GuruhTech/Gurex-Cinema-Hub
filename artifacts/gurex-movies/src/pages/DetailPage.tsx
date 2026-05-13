import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import {
  Play, Star, Calendar, Globe, BookmarkCheck, Bookmark,
  Heart, ChevronLeft, Tv, Film, Users, ArrowUpRight, Clock
} from "lucide-react";
import {
  xcasper, type Subject,
  getYear, formatGenres, getRatingColor,
  savedWatchlist, savedFavorites, savedWatchLater, subjectToSaved,
} from "@/lib/xcasper";
import LoadingSpinner from "@/components/LoadingSpinner";
import MovieRow from "@/components/MovieRow";
import StreamModal from "@/components/StreamModal";

export default function DetailPage() {
  const params = useParams<{ detailPath: string }>();
  const detailPath = params.detailPath ?? "";

  const [streaming, setStreaming] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "cast" | "related">("overview");
  const [showAllCast, setShowAllCast] = useState(false);

  const { data: trendingAll } = useQuery({
    queryKey: ["trending-all-detail"],
    queryFn: () => xcasper.trending.all(0, 20),
  });

  const matchItem = trendingAll?.subjectList?.find(
    (s) => s.detailPath === detailPath
  );

  const subjectId = matchItem?.subjectId ?? "";

  const { data: richDetail, isLoading, error } = useQuery({
    queryKey: ["rich-detail", subjectId],
    queryFn: () => xcasper.richDetail(subjectId),
    enabled: !!subjectId,
  });

  const { data: recommended } = useQuery({
    queryKey: ["recommend", subjectId],
    queryFn: () => xcasper.recommend(subjectId),
    enabled: !!subjectId,
  });

  const subject: Subject | null = (richDetail as any) ?? matchItem ?? null;

  const [bookmarked, setBookmarked] = useState(() => subjectId ? savedWatchlist.has(subjectId) : false);
  const [favorited, setFavorited] = useState(() => subjectId ? savedFavorites.has(subjectId) : false);
  const [watchLater, setWatchLater] = useState(() => subjectId ? savedWatchLater.has(subjectId) : false);

  const toggleBookmark = () => {
    if (!subject) return;
    const s = subjectToSaved(subject);
    if (bookmarked) savedWatchlist.remove(subject.subjectId);
    else savedWatchlist.add(s);
    setBookmarked(!bookmarked);
  };
  const toggleFavorite = () => {
    if (!subject) return;
    const s = subjectToSaved(subject);
    if (favorited) savedFavorites.remove(subject.subjectId);
    else savedFavorites.add(s);
    setFavorited(!favorited);
  };
  const toggleWatchLater = () => {
    if (!subject) return;
    const s = subjectToSaved(subject);
    if (watchLater) savedWatchLater.remove(subject.subjectId);
    else savedWatchLater.add(s);
    setWatchLater(!watchLater);
  };

  if (!subjectId && !isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <p className="text-2xl font-bold text-muted-foreground mb-4">Content not found</p>
          <p className="text-white/40 text-sm mb-6">This title couldn't be located in our database.</p>
          <Link href="/">
            <button className="btn-primary px-6 py-3 rounded-full text-white font-semibold">
              Back to Home
            </button>
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading && !matchItem) return <LoadingSpinner size="lg" />;

  if (!subject) return (
    <div className="min-h-screen flex items-center justify-center pt-20">
      <div className="text-center">
        <p className="text-2xl font-bold text-muted-foreground mb-4">Content not found</p>
        <Link href="/"><button className="btn-primary px-6 py-3 rounded-full text-white font-semibold">Go Home</button></Link>
      </div>
    </div>
  );

  const isTV = subject.subjectType === 2;
  const genres = formatGenres(subject.genre);
  const rating = subject.imdbRatingValue ? parseFloat(subject.imdbRatingValue) : 0;
  const backdropUrl = subject.stills?.url || subject.cover?.url || "";
  const staffList = (richDetail as any)?.staffList ?? [];
  const displayedCast = showAllCast ? staffList : staffList.slice(0, 12);

  return (
    <>
      {streaming && subject.subjectId && (
        <StreamModal
          subjectId={subject.subjectId}
          title={subject.title}
          onClose={() => setStreaming(false)}
        />
      )}

      <div className="min-h-screen">
        {/* Backdrop */}
        <div className="relative w-full h-[60vh] min-h-[400px] max-h-[600px] overflow-hidden">
          {backdropUrl && (
            <img
              src={backdropUrl}
              alt={subject.title}
              className="w-full h-full object-cover object-center"
              style={{ filter: "brightness(0.4) saturate(1.1)" }}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-transparent" />

          {/* Back button */}
          <Link href="/">
            <button className="absolute top-20 left-4 sm:left-8 flex items-center gap-2 glass px-3 py-2 rounded-full text-white/80 hover:text-white text-sm transition-all hover:bg-white/10">
              <ChevronLeft size={16} />
              Back
            </button>
          </Link>
        </div>

        {/* Content */}
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 -mt-48 relative z-10">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Poster */}
            <div className="flex-shrink-0 w-44 sm:w-56 lg:w-64">
              <div className="aspect-[2/3] rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black/80 ring-1 ring-primary/20">
                {subject.cover?.url && (
                  <img src={subject.cover.url} alt={subject.title} className="w-full h-full object-cover" />
                )}
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 pt-4">
              {/* Type + Country */}
              <div className="flex items-center gap-2 mb-3">
                <span className={`flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${isTV ? "type-badge-tv" : "type-badge-movie"}`}>
                  {isTV ? <Tv size={11} /> : <Film size={11} />}
                  {isTV ? "TV Series" : "Movie"}
                </span>
                {subject.countryName && (
                  <span className="text-xs text-white/40 flex items-center gap-1">
                    <Globe size={11} />
                    {subject.countryName}
                  </span>
                )}
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
                {subject.title}
              </h1>

              {/* Meta row */}
              <div className="flex flex-wrap items-center gap-3 mb-5">
                {rating > 0 && (
                  <div className="flex items-center gap-1.5 rating-badge px-2.5 py-1.5 rounded-full">
                    <Star size={13} fill="white" className="text-white" />
                    <span className={`text-sm font-black ${getRatingColor(rating)}`}>{rating.toFixed(1)}</span>
                    {subject.imdbRatingCount > 0 && (
                      <span className="text-white/60 text-xs">({subject.imdbRatingCount.toLocaleString()})</span>
                    )}
                  </div>
                )}
                {subject.releaseDate && (
                  <div className="flex items-center gap-1.5 text-white/60 text-sm">
                    <Calendar size={13} />
                    {getYear(subject.releaseDate)}
                  </div>
                )}
                {subject.duration > 0 && (
                  <div className="flex items-center gap-1.5 text-white/60 text-sm">
                    <Clock size={13} />
                    {Math.floor(subject.duration / 60)}h {subject.duration % 60}m
                  </div>
                )}
              </div>

              {/* Genres */}
              {genres.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-5">
                  {genres.map((g) => (
                    <span key={g} className="genre-tag text-xs font-medium px-3 py-1 rounded-full">{g}</span>
                  ))}
                </div>
              )}

              {/* Description */}
              {subject.description && (
                <p className="text-white/70 text-sm sm:text-base leading-relaxed mb-6 max-w-2xl">
                  {subject.description}
                </p>
              )}

              {/* Actions */}
              <div className="flex items-center gap-3 flex-wrap mb-6">
                <button
                  onClick={() => setStreaming(true)}
                  className="btn-primary flex items-center gap-2.5 text-white font-bold px-7 py-3.5 rounded-full shadow-lg"
                >
                  <Play size={17} fill="white" />
                  Watch Now
                </button>
                <button
                  onClick={toggleBookmark}
                  className={`flex items-center gap-2 glass px-4 py-3.5 rounded-full text-sm font-medium transition-all ${bookmarked ? "text-primary border-primary/40 border" : "text-white/70 hover:text-white"}`}
                >
                  {bookmarked ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
                  {bookmarked ? "Saved" : "Save"}
                </button>
                <button
                  onClick={toggleFavorite}
                  className={`p-3.5 rounded-full glass transition-all hover:scale-110 ${favorited ? "text-red-400" : "text-white/60 hover:text-white"}`}
                >
                  <Heart size={18} fill={favorited ? "currentColor" : "none"} />
                </button>
                <button
                  onClick={toggleWatchLater}
                  className={`p-3.5 rounded-full glass transition-all hover:scale-110 ${watchLater ? "text-yellow-400" : "text-white/60 hover:text-white"}`}
                >
                  <Clock size={18} />
                </button>
              </div>

              {/* Subtitles */}
              {subject.subtitles && (
                <div className="text-xs text-white/30">
                  <span className="text-white/50 font-medium">Available subtitles: </span>
                  {subject.subtitles.split(",").slice(0, 8).join(", ")}
                  {subject.subtitles.split(",").length > 8 && ` +${subject.subtitles.split(",").length - 8} more`}
                </div>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-10">
            <div className="flex gap-1 border-b border-white/8 mb-6">
              {(["overview", "cast", "related"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2.5 text-sm font-semibold capitalize transition-all border-b-2 -mb-px ${
                    activeTab === tab
                      ? "text-white border-primary"
                      : "text-white/40 border-transparent hover:text-white/70"
                  }`}
                >
                  {tab === "cast" ? "Cast & Crew" : tab}
                </button>
              ))}
            </div>

            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="max-w-3xl">
                {subject.description ? (
                  <p className="text-white/70 text-base leading-relaxed mb-6">{subject.description}</p>
                ) : (
                  <p className="text-white/30 text-sm italic">No description available.</p>
                )}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {subject.releaseDate && (
                    <div>
                      <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Release Date</p>
                      <p className="text-sm text-white/80">{subject.releaseDate}</p>
                    </div>
                  )}
                  {subject.countryName && (
                    <div>
                      <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Country</p>
                      <p className="text-sm text-white/80">{subject.countryName}</p>
                    </div>
                  )}
                  {subject.genre && (
                    <div>
                      <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Genres</p>
                      <p className="text-sm text-white/80">{subject.genre}</p>
                    </div>
                  )}
                  {subject.imdbRatingValue && (
                    <div>
                      <p className="text-xs text-white/40 uppercase tracking-wider mb-1">IMDb Rating</p>
                      <p className={`text-sm font-bold ${getRatingColor(subject.imdbRatingValue)}`}>
                        ★ {subject.imdbRatingValue} / 10
                      </p>
                    </div>
                  )}
                  {subject.subtitles && (
                    <div className="col-span-2">
                      <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Subtitles</p>
                      <p className="text-sm text-white/60 line-clamp-2">{subject.subtitles.replace(/,/g, ", ")}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Cast Tab */}
            {activeTab === "cast" && (
              <div>
                {staffList.length > 0 ? (
                  <>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                      {displayedCast.map((staff: any) => (
                        <div key={staff.staffId} className="text-center group">
                          <div className="w-16 h-16 mx-auto rounded-full overflow-hidden bg-card border border-white/8 mb-2">
                            {staff.avatar?.url ? (
                              <img src={staff.avatar.url} alt={staff.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Users size={24} className="text-white/20" />
                              </div>
                            )}
                          </div>
                          <p className="text-xs font-semibold text-white/80 line-clamp-1">{staff.name}</p>
                          {staff.role && <p className="text-xs text-white/40 line-clamp-1">{staff.role}</p>}
                        </div>
                      ))}
                    </div>
                    {staffList.length > 12 && (
                      <button
                        onClick={() => setShowAllCast(!showAllCast)}
                        className="mt-5 text-sm text-primary hover:text-primary/80 transition-colors"
                      >
                        {showAllCast ? "Show Less" : `Show All ${staffList.length} Members`}
                      </button>
                    )}
                  </>
                ) : (
                  <p className="text-white/30 text-sm italic">No cast information available.</p>
                )}
              </div>
            )}

            {/* Related Tab */}
            {activeTab === "related" && (
              <div>
                {recommended?.subjectList?.length ? (
                  <MovieRow title="You May Also Like" items={recommended.subjectList} />
                ) : (
                  <p className="text-white/30 text-sm italic">No recommendations available.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
