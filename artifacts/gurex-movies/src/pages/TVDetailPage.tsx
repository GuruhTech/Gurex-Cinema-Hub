import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import {
  Play, Star, Clock, Calendar, Globe, BookmarkCheck, Bookmark,
  Heart, ChevronLeft, Users, Tv, Tv2
} from "lucide-react";
import { Link } from "wouter";
import {
  tmdb, getImageUrl, formatVoteAverage, formatDate,
  getRatingColor, watchlist, favorites, ratings
} from "@/lib/tmdb";
import TrailerModal from "@/components/TrailerModal";
import StreamModal from "@/components/StreamModal";
import MovieRow from "@/components/MovieRow";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function TVDetailPage() {
  const { id } = useParams<{ id: string }>();
  const tvId = parseInt(id || "0");
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [streaming, setStreaming] = useState(false);
  const [streamSeason, setStreamSeason] = useState(1);
  const [streamEpisode, setStreamEpisode] = useState(1);
  const [userRating, setUserRating] = useState<number | null>(() => ratings.get_(tvId, "tv"));
  const [isBookmarked, setIsBookmarked] = useState(() => watchlist.has(tvId, "tv"));
  const [isFavorited, setIsFavorited] = useState(() => favorites.has(tvId, "tv"));
  const [showAllCast, setShowAllCast] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "cast" | "seasons" | "similar">("overview");

  const { data: show, isLoading, error } = useQuery({
    queryKey: ["tv", tvId],
    queryFn: () => tmdb.tv.details(tvId),
    enabled: !!tvId,
  });

  if (isLoading) return <LoadingSpinner size="lg" />;
  if (error || !show) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-2xl font-bold text-muted-foreground">Show not found</p>
        <Link href="/tv"><button className="mt-4 text-primary hover:underline">Browse TV Shows</button></Link>
      </div>
    </div>
  );

  const trailer = (show as any).videos?.results?.find(
    (v: any) => v.type === "Trailer" && v.site === "YouTube"
  );

  const cast = (show as any).credits?.cast || [];
  const recommendations = (show as any).recommendations?.results || [];
  const similar = (show as any).similar?.results || [];
  const displayedCast = showAllCast ? cast : cast.slice(0, 12);

  const handleBookmark = () => {
    if (isBookmarked) {
      watchlist.remove(tvId, "tv");
    } else {
      watchlist.add({
        id: show.id,
        title: show.name,
        poster_path: show.poster_path,
        vote_average: show.vote_average,
        media_type: "tv",
        first_air_date: show.first_air_date,
      });
    }
    setIsBookmarked(!isBookmarked);
  };

  const handleFavorite = () => {
    if (isFavorited) {
      favorites.remove(tvId, "tv");
    } else {
      favorites.add({
        id: show.id,
        title: show.name,
        poster_path: show.poster_path,
        vote_average: show.vote_average,
        media_type: "tv",
        first_air_date: show.first_air_date,
      });
    }
    setIsFavorited(!isFavorited);
  };

  const handleRate = (r: number) => {
    setUserRating(r);
    ratings.set(tvId, "tv", r);
  };

  const mainSeasons = show.seasons?.filter((s) => s.season_number > 0) || [];

  return (
    <div className="min-h-screen">
      {streaming && (
        <StreamModal
          tmdbId={tvId}
          title={show.name}
          mediaType="tv"
          totalSeasons={mainSeasons.length || 1}
          initialSeason={streamSeason}
          initialEpisode={streamEpisode}
          onClose={() => setStreaming(false)}
        />
      )}
      {trailerKey && (
        <TrailerModal
          videoKey={trailerKey}
          title={show.name}
          onClose={() => setTrailerKey(null)}
        />
      )}

      {/* Backdrop */}
      <div className="relative h-[60vh] md:h-[70vh] overflow-hidden">
        {show.backdrop_path && (
          <img
            src={getImageUrl(show.backdrop_path, "original")}
            alt={show.name}
            className="w-full h-full object-cover object-top"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        <div className="absolute inset-0 bg-black/30" />

        <Link href="/tv">
          <button className="absolute top-20 left-6 flex items-center gap-2 glass px-4 py-2 rounded-full text-sm font-medium hover:bg-white/10 transition-all duration-200">
            <ChevronLeft size={18} />
            Back
          </button>
        </Link>
      </div>

      {/* Main Content */}
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 -mt-48 md:-mt-64 relative z-10">
        <div className="flex flex-col md:flex-row gap-8 mb-10">
          {/* Poster */}
          <div className="flex-shrink-0">
            <div className="w-48 sm:w-56 md:w-64 mx-auto md:mx-0 rounded-2xl overflow-hidden shadow-2xl ring-2 ring-border">
              {show.poster_path ? (
                <img
                  src={getImageUrl(show.poster_path, "w500")}
                  alt={show.name}
                  className="w-full h-auto"
                />
              ) : (
                <div className="aspect-[2/3] bg-muted flex items-center justify-center">
                  <Tv size={48} className="text-muted-foreground" />
                </div>
              )}
            </div>
            {/* User Rating */}
            <div className="mt-4 text-center">
              <p className="text-xs text-muted-foreground mb-2">Your Rating</p>
              <div className="flex justify-center gap-1">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((r) => (
                  <button
                    key={r}
                    onClick={() => handleRate(r)}
                    className={`text-lg transition-all duration-150 hover:scale-125 ${
                      userRating && r <= userRating ? "text-yellow-400" : "text-muted-foreground/40"
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>
              {userRating && (
                <p className="text-xs text-primary mt-1 font-semibold">Your rating: {userRating}/10</p>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="flex-1 min-w-0">
            {show.genres && (
              <div className="flex flex-wrap gap-2 mb-3">
                {show.genres.map((g) => (
                  <span key={g.id} className="genre-tag px-3 py-1 rounded-full text-xs font-semibold">
                    {g.name}
                  </span>
                ))}
              </div>
            )}

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-foreground mb-2">
              {show.name}
            </h1>
            {show.tagline && (
              <p className="text-muted-foreground italic text-lg mb-4">"{show.tagline}"</p>
            )}

            <div className="flex flex-wrap items-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                <Star size={20} className="text-yellow-400" fill="currentColor" />
                <span className={`text-xl font-bold ${getRatingColor(show.vote_average)}`}>
                  {formatVoteAverage(show.vote_average)}
                </span>
                <span className="text-muted-foreground text-sm">/ 10</span>
              </div>
              {show.number_of_seasons > 0 && (
                <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
                  <Tv size={16} />
                  <span>{show.number_of_seasons} Season{show.number_of_seasons > 1 ? "s" : ""}</span>
                </div>
              )}
              {show.number_of_episodes > 0 && (
                <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
                  <span>{show.number_of_episodes} Episodes</span>
                </div>
              )}
              {show.first_air_date && (
                <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
                  <Calendar size={16} />
                  <span>{formatDate(show.first_air_date)}</span>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-3 mb-8">
              {/* Watch Now button */}
              <button
                onClick={() => setStreaming(true)}
                className="flex items-center gap-2 text-white font-black px-7 py-3.5 rounded-full transition-all duration-200 hover:scale-105"
                style={{
                  background: "linear-gradient(135deg, #ff6b35, #e85d2e)",
                  boxShadow: "0 0 30px rgba(255,107,53,0.4), 0 4px 20px rgba(255,107,53,0.2)",
                }}
              >
                <Play size={20} fill="white" />
                Watch Now
              </button>
              {trailer && (
                <button
                  onClick={() => setTrailerKey(trailer.key)}
                  className="flex items-center gap-2 glass text-white font-bold px-6 py-3.5 rounded-full transition-all duration-200 hover:scale-105 hover:bg-white/10"
                >
                  <Tv2 size={18} />
                  Play Trailer
                </button>
              )}
              <button
                onClick={handleBookmark}
                className={`flex items-center gap-2 glass px-5 py-3 rounded-full font-semibold transition-all duration-200 hover:scale-105 ${
                  isBookmarked ? "text-primary" : "text-foreground"
                }`}
              >
                {isBookmarked ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
                {isBookmarked ? "Watchlisted" : "Watchlist"}
              </button>
              <button
                onClick={handleFavorite}
                className={`flex items-center gap-2 glass px-5 py-3 rounded-full font-semibold transition-all duration-200 hover:scale-105 ${
                  isFavorited ? "text-red-400" : "text-foreground"
                }`}
              >
                <Heart size={18} fill={isFavorited ? "currentColor" : "none"} />
                {isFavorited ? "Favorited" : "Favorite"}
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-card border border-border">
              {show.status && (
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Status</p>
                  <p className="text-sm font-semibold">{show.status}</p>
                </div>
              )}
              {show.type && (
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Type</p>
                  <p className="text-sm font-semibold">{show.type}</p>
                </div>
              )}
              {show.networks?.length > 0 && (
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Network</p>
                  <p className="text-sm font-semibold">{show.networks[0].name}</p>
                </div>
              )}
              {show.episode_run_time?.length > 0 && (
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Episode Length</p>
                  <p className="text-sm font-semibold">{show.episode_run_time[0]}m</p>
                </div>
              )}
              {show.created_by?.length > 0 && (
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Created By</p>
                  <p className="text-sm font-semibold">{show.created_by.map((c) => c.name).join(", ")}</p>
                </div>
              )}
              {show.original_language && (
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Language</p>
                  <p className="text-sm font-semibold uppercase">{show.original_language}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 border-b border-border overflow-x-auto">
          {(["overview", "cast", "seasons", "similar"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-3 text-sm font-semibold capitalize whitespace-nowrap transition-all duration-200 border-b-2 ${
                activeTab === tab
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === "overview" && (
          <div className="mb-12">
            <p className="text-foreground/80 text-base leading-relaxed max-w-3xl">{show.overview}</p>
          </div>
        )}

        {activeTab === "cast" && (
          <div className="mb-12">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {displayedCast.map((member: any) => (
                <div key={member.id} className="text-center group">
                  <div className="w-20 h-20 mx-auto rounded-full overflow-hidden bg-card border-2 border-border group-hover:border-primary transition-colors">
                    {member.profile_path ? (
                      <img
                        src={getImageUrl(member.profile_path, "w185")}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Users size={24} className="text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <p className="text-xs font-semibold mt-2 line-clamp-1">{member.name}</p>
                  <p className="text-xs text-muted-foreground line-clamp-1">{member.character}</p>
                </div>
              ))}
            </div>
            {cast.length > 12 && (
              <button
                onClick={() => setShowAllCast(!showAllCast)}
                className="mt-6 text-primary hover:underline text-sm font-semibold"
              >
                {showAllCast ? "Show less" : `Show all ${cast.length} cast members`}
              </button>
            )}
          </div>
        )}

        {activeTab === "seasons" && (
          <div className="mb-12 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {mainSeasons.map((season) => (
              <div key={season.id} className="rounded-xl overflow-hidden bg-card border border-border group card-hover">
                {season.poster_path ? (
                  <img
                    src={getImageUrl(season.poster_path, "w342")}
                    alt={season.name}
                    className="w-full aspect-[2/3] object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="aspect-[2/3] bg-muted flex items-center justify-center">
                    <Tv size={32} className="text-muted-foreground" />
                  </div>
                )}
                <div className="p-3">
                  <p className="text-sm font-bold line-clamp-1">{season.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{season.episode_count} episodes</p>
                  {season.air_date && (
                    <p className="text-xs text-muted-foreground">{new Date(season.air_date).getFullYear()}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "similar" && (
          <div className="mb-12">
            {recommendations.length > 0 && (
              <MovieRow title="Recommended" items={recommendations} mediaType="tv" />
            )}
            {similar.length > 0 && (
              <MovieRow title="Similar Shows" items={similar} mediaType="tv" />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
