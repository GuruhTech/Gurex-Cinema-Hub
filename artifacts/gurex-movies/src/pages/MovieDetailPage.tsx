import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import {
  Play, Star, Clock, Calendar, Globe, BookmarkCheck, Bookmark,
  Heart, ChevronLeft, Users, Award, Film, ExternalLink
} from "lucide-react";
import { Link } from "wouter";
import {
  tmdb, getImageUrl, formatVoteAverage, formatRuntime, formatDate, getYear,
  getRatingColor, watchlist, favorites, ratings
} from "@/lib/tmdb";
import TrailerModal from "@/components/TrailerModal";
import MovieRow from "@/components/MovieRow";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function MovieDetailPage() {
  const { id } = useParams<{ id: string }>();
  const movieId = parseInt(id || "0");
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [userRating, setUserRating] = useState<number | null>(() => ratings.get_(movieId, "movie"));
  const [isBookmarked, setIsBookmarked] = useState(() => watchlist.has(movieId, "movie"));
  const [isFavorited, setIsFavorited] = useState(() => favorites.has(movieId, "movie"));
  const [showAllCast, setShowAllCast] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "cast" | "reviews" | "similar">("overview");

  const { data: movie, isLoading, error } = useQuery({
    queryKey: ["movie", movieId],
    queryFn: () => tmdb.movies.details(movieId),
    enabled: !!movieId,
  });

  if (isLoading) return <LoadingSpinner size="lg" />;
  if (error || !movie) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-2xl font-bold text-muted-foreground">Movie not found</p>
        <Link href="/"><button className="mt-4 text-primary hover:underline">Go Home</button></Link>
      </div>
    </div>
  );

  const trailer = (movie as any).videos?.results?.find(
    (v: any) => v.type === "Trailer" && v.site === "YouTube"
  );

  const cast = (movie as any).credits?.cast || [];
  const recommendations = (movie as any).recommendations?.results || [];
  const similar = (movie as any).similar?.results || [];
  const reviews = (movie as any).reviews?.results || [];
  const displayedCast = showAllCast ? cast : cast.slice(0, 12);

  const handleBookmark = () => {
    if (isBookmarked) {
      watchlist.remove(movieId, "movie");
    } else {
      watchlist.add({
        id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path,
        vote_average: movie.vote_average,
        media_type: "movie",
        release_date: movie.release_date,
      });
    }
    setIsBookmarked(!isBookmarked);
  };

  const handleFavorite = () => {
    if (isFavorited) {
      favorites.remove(movieId, "movie");
    } else {
      favorites.add({
        id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path,
        vote_average: movie.vote_average,
        media_type: "movie",
        release_date: movie.release_date,
      });
    }
    setIsFavorited(!isFavorited);
  };

  const handleRate = (r: number) => {
    setUserRating(r);
    ratings.set(movieId, "movie", r);
  };

  const director = (movie as any).credits?.crew?.find((c: any) => c.job === "Director");

  return (
    <div className="min-h-screen">
      {trailerKey && (
        <TrailerModal
          videoKey={trailerKey}
          title={movie.title}
          onClose={() => setTrailerKey(null)}
        />
      )}

      {/* Backdrop */}
      <div className="relative h-[60vh] md:h-[70vh] overflow-hidden">
        {movie.backdrop_path && (
          <img
            src={getImageUrl(movie.backdrop_path, "original")}
            alt={movie.title}
            className="w-full h-full object-cover object-top"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        <div className="absolute inset-0 bg-black/30" />

        {/* Back button */}
        <Link href="/">
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
              {movie.poster_path ? (
                <img
                  src={getImageUrl(movie.poster_path, "w500")}
                  alt={movie.title}
                  className="w-full h-auto"
                />
              ) : (
                <div className="aspect-[2/3] bg-muted flex items-center justify-center">
                  <Film size={48} className="text-muted-foreground" />
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
            {/* Genres */}
            {movie.genres && (
              <div className="flex flex-wrap gap-2 mb-3">
                {movie.genres.map((g) => (
                  <span key={g.id} className="genre-tag px-3 py-1 rounded-full text-xs font-semibold">
                    {g.name}
                  </span>
                ))}
              </div>
            )}

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-foreground mb-2">
              {movie.title}
            </h1>
            {movie.tagline && (
              <p className="text-muted-foreground italic text-lg mb-4">"{movie.tagline}"</p>
            )}

            {/* Stats */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                <Star size={20} className="text-yellow-400" fill="currentColor" />
                <span className={`text-xl font-bold ${getRatingColor(movie.vote_average)}`}>
                  {formatVoteAverage(movie.vote_average)}
                </span>
                <span className="text-muted-foreground text-sm">/ 10</span>
                <span className="text-muted-foreground text-xs">({movie.vote_count.toLocaleString()} votes)</span>
              </div>
              {movie.runtime > 0 && (
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Clock size={16} />
                  <span className="text-sm">{formatRuntime(movie.runtime)}</span>
                </div>
              )}
              {movie.release_date && (
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Calendar size={16} />
                  <span className="text-sm">{formatDate(movie.release_date)}</span>
                </div>
              )}
              {movie.original_language && (
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Globe size={16} />
                  <span className="text-sm uppercase">{movie.original_language}</span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3 mb-8">
              {trailer && (
                <button
                  onClick={() => setTrailerKey(trailer.key)}
                  className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-bold px-6 py-3 rounded-full transition-all duration-200 hover:scale-105 glow-primary"
                >
                  <Play size={18} fill="white" />
                  Play Trailer
                </button>
              )}
              <button
                onClick={handleBookmark}
                className={`flex items-center gap-2 glass px-5 py-3 rounded-full font-semibold transition-all duration-200 hover:scale-105 ${
                  isBookmarked ? "text-primary border-primary/40" : "text-foreground"
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
              {movie.homepage && (
                <a
                  href={movie.homepage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 glass px-5 py-3 rounded-full font-semibold hover:scale-105 transition-all duration-200"
                >
                  <ExternalLink size={18} />
                  Website
                </a>
              )}
            </div>

            {/* Extra info */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-card border border-border">
              {director && (
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Director</p>
                  <p className="text-sm font-semibold">{director.name}</p>
                </div>
              )}
              {movie.status && (
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Status</p>
                  <p className="text-sm font-semibold">{movie.status}</p>
                </div>
              )}
              {movie.budget > 0 && (
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Budget</p>
                  <p className="text-sm font-semibold">${(movie.budget / 1_000_000).toFixed(0)}M</p>
                </div>
              )}
              {movie.revenue > 0 && (
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Revenue</p>
                  <p className="text-sm font-semibold">${(movie.revenue / 1_000_000).toFixed(0)}M</p>
                </div>
              )}
              {movie.production_countries?.length > 0 && (
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Country</p>
                  <p className="text-sm font-semibold">{movie.production_countries[0]?.name}</p>
                </div>
              )}
              {movie.original_title !== movie.title && (
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Original Title</p>
                  <p className="text-sm font-semibold">{movie.original_title}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 border-b border-border overflow-x-auto">
          {(["overview", "cast", "reviews", "similar"] as const).map((tab) => (
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

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="mb-12">
            <p className="text-foreground/80 text-base leading-relaxed mb-6 max-w-3xl">{movie.overview}</p>

            {/* Production Companies */}
            {movie.production_companies?.length > 0 && (
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3">Production</h3>
                <div className="flex flex-wrap gap-3">
                  {movie.production_companies.map((c) => (
                    <div key={c.id} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-card border border-border">
                      {c.logo_path ? (
                        <img
                          src={getImageUrl(c.logo_path, "w92")}
                          alt={c.name}
                          className="h-5 object-contain filter invert opacity-70"
                        />
                      ) : (
                        <span className="text-xs text-muted-foreground font-medium">{c.name}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
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

        {activeTab === "reviews" && (
          <div className="mb-12 space-y-4 max-w-3xl">
            {reviews.length === 0 ? (
              <p className="text-muted-foreground">No reviews yet.</p>
            ) : (
              reviews.map((review: any) => (
                <div key={review.id} className="p-5 rounded-xl bg-card border border-border">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-sm font-bold text-primary">{review.author[0]?.toUpperCase()}</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{review.author}</p>
                      {review.author_details?.rating && (
                        <div className="flex items-center gap-1">
                          <Star size={11} className="text-yellow-400" fill="currentColor" />
                          <span className="text-xs text-muted-foreground">{review.author_details.rating}/10</span>
                        </div>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground ml-auto">
                      {formatDate(review.created_at)}
                    </span>
                  </div>
                  <p className="text-sm text-foreground/80 leading-relaxed line-clamp-5">{review.content}</p>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "similar" && (
          <div className="mb-12">
            {recommendations.length > 0 && (
              <MovieRow
                title="Recommended"
                items={recommendations}
                mediaType="movie"
              />
            )}
            {similar.length > 0 && (
              <MovieRow
                title="Similar Movies"
                items={similar}
                mediaType="movie"
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
