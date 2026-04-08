const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p";
const ACCESS_TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyODZlOWUyNzI2MjIyZDRjOTQ5YTg2NWRkYWMyMzA3NiIsIm5iZiI6MTc3NTYwNzA3MC41OTAwMDAyLCJzdWIiOiI2OWQ1OWQxZWU5ZDA2Mjc3MDllZGY3NmYiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.8y65Em7j3_kuMB6d5ukJSflhUOq7GZKYG7NGgiDZ3a8";

export const IMAGE_SIZES = {
  poster: {
    small: "w185",
    medium: "w342",
    large: "w500",
    original: "original",
  },
  backdrop: {
    small: "w300",
    medium: "w780",
    large: "w1280",
    original: "original",
  },
  profile: {
    small: "w45",
    medium: "w185",
    large: "h632",
  },
} as const;

export function getImageUrl(path: string | null, size: string = "w500"): string {
  if (!path) return "";
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
}

async function tmdbFetch<T>(endpoint: string, params: Record<string, string | number> = {}): Promise<T> {
  const url = new URL(`${TMDB_BASE_URL}${endpoint}`);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, String(v)));

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`TMDB API error: ${res.status} ${res.statusText}`);
  }

  return res.json() as Promise<T>;
}

export interface Movie {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  genre_ids: number[];
  adult: boolean;
  original_language: string;
  video: boolean;
}

export interface TVShow {
  id: number;
  name: string;
  original_name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  genre_ids: number[];
  original_language: string;
}

export interface Genre {
  id: number;
  name: string;
}

export interface PaginatedResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export interface MovieDetails extends Movie {
  budget: number;
  revenue: number;
  runtime: number;
  status: string;
  tagline: string;
  genres: Genre[];
  production_companies: { id: number; name: string; logo_path: string | null }[];
  production_countries: { iso_3166_1: string; name: string }[];
  spoken_languages: { iso_639_1: string; name: string }[];
  homepage: string;
  imdb_id: string;
  belongs_to_collection: { id: number; name: string; poster_path: string; backdrop_path: string } | null;
}

export interface TVDetails extends TVShow {
  episode_run_time: number[];
  genres: Genre[];
  number_of_episodes: number;
  number_of_seasons: number;
  status: string;
  tagline: string;
  type: string;
  networks: { id: number; name: string; logo_path: string | null }[];
  seasons: Season[];
  created_by: { id: number; name: string; profile_path: string | null }[];
}

export interface Season {
  id: number;
  season_number: number;
  name: string;
  overview: string;
  episode_count: number;
  air_date: string;
  poster_path: string | null;
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
  known_for_department: string;
}

export interface CrewMember {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
}

export interface Credits {
  cast: CastMember[];
  crew: CrewMember[];
}

export interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
  published_at: string;
}

export interface PersonDetails {
  id: number;
  name: string;
  biography: string;
  birthday: string | null;
  deathday: string | null;
  place_of_birth: string | null;
  profile_path: string | null;
  known_for_department: string;
  popularity: number;
  also_known_as: string[];
}

export interface ReviewResult {
  id: string;
  author: string;
  author_details: { rating: number | null; avatar_path: string | null };
  content: string;
  created_at: string;
}

// Movie endpoints
export const tmdb = {
  movies: {
    trending: (timeWindow: "day" | "week" = "week") =>
      tmdbFetch<PaginatedResponse<Movie>>(`/trending/movie/${timeWindow}`),

    popular: (page = 1) =>
      tmdbFetch<PaginatedResponse<Movie>>("/movie/popular", { page }),

    topRated: (page = 1) =>
      tmdbFetch<PaginatedResponse<Movie>>("/movie/top_rated", { page }),

    nowPlaying: (page = 1) =>
      tmdbFetch<PaginatedResponse<Movie>>("/movie/now_playing", { page }),

    upcoming: (page = 1) =>
      tmdbFetch<PaginatedResponse<Movie>>("/movie/upcoming", { page }),

    details: (id: number) =>
      tmdbFetch<MovieDetails>(`/movie/${id}`, { append_to_response: "credits,videos,recommendations,reviews,similar,images" }),

    credits: (id: number) =>
      tmdbFetch<Credits>(`/movie/${id}/credits`),

    videos: (id: number) =>
      tmdbFetch<{ results: Video[] }>(`/movie/${id}/videos`),

    recommendations: (id: number, page = 1) =>
      tmdbFetch<PaginatedResponse<Movie>>(`/movie/${id}/recommendations`, { page }),

    similar: (id: number, page = 1) =>
      tmdbFetch<PaginatedResponse<Movie>>(`/movie/${id}/similar`, { page }),

    reviews: (id: number, page = 1) =>
      tmdbFetch<PaginatedResponse<ReviewResult>>(`/movie/${id}/reviews`, { page }),

    byGenre: (genreId: number, page = 1, sortBy = "popularity.desc") =>
      tmdbFetch<PaginatedResponse<Movie>>("/discover/movie", { with_genres: genreId, page, sort_by: sortBy }),

    discover: (params: Record<string, string | number> = {}) =>
      tmdbFetch<PaginatedResponse<Movie>>("/discover/movie", { sort_by: "popularity.desc", ...params }),

    genres: () =>
      tmdbFetch<{ genres: Genre[] }>("/genre/movie/list"),
  },

  tv: {
    trending: (timeWindow: "day" | "week" = "week") =>
      tmdbFetch<PaginatedResponse<TVShow>>(`/trending/tv/${timeWindow}`),

    popular: (page = 1) =>
      tmdbFetch<PaginatedResponse<TVShow>>("/tv/popular", { page }),

    topRated: (page = 1) =>
      tmdbFetch<PaginatedResponse<TVShow>>("/tv/top_rated", { page }),

    onAir: (page = 1) =>
      tmdbFetch<PaginatedResponse<TVShow>>("/tv/on_the_air", { page }),

    airingToday: (page = 1) =>
      tmdbFetch<PaginatedResponse<TVShow>>("/tv/airing_today", { page }),

    details: (id: number) =>
      tmdbFetch<TVDetails>(`/tv/${id}`, { append_to_response: "credits,videos,recommendations,reviews,similar" }),

    credits: (id: number) =>
      tmdbFetch<Credits>(`/tv/${id}/credits`),

    videos: (id: number) =>
      tmdbFetch<{ results: Video[] }>(`/tv/${id}/videos`),

    byGenre: (genreId: number, page = 1) =>
      tmdbFetch<PaginatedResponse<TVShow>>("/discover/tv", { with_genres: genreId, page, sort_by: "popularity.desc" }),

    genres: () =>
      tmdbFetch<{ genres: Genre[] }>("/genre/tv/list"),
  },

  search: {
    multi: (query: string, page = 1) =>
      tmdbFetch<PaginatedResponse<(Movie | TVShow) & { media_type: "movie" | "tv" | "person" }>>("/search/multi", { query, page }),

    movies: (query: string, page = 1) =>
      tmdbFetch<PaginatedResponse<Movie>>("/search/movie", { query, page }),

    tv: (query: string, page = 1) =>
      tmdbFetch<PaginatedResponse<TVShow>>("/search/tv", { query, page }),

    people: (query: string, page = 1) =>
      tmdbFetch<PaginatedResponse<PersonDetails & { known_for: Movie[] }>>("/search/person", { query, page }),
  },

  person: {
    details: (id: number) =>
      tmdbFetch<PersonDetails>(`/person/${id}`, { append_to_response: "movie_credits,tv_credits" }),

    movieCredits: (id: number) =>
      tmdbFetch<{ cast: Movie[]; crew: Movie[] }>(`/person/${id}/movie_credits`),
  },

  trending: {
    all: (timeWindow: "day" | "week" = "week") =>
      tmdbFetch<PaginatedResponse<(Movie | TVShow) & { media_type: string }>>(`/trending/all/${timeWindow}`),
  },
};

// Watchlist management (localStorage-based)
export type WatchlistItem = {
  id: number;
  title: string;
  poster_path: string | null;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  media_type: "movie" | "tv";
  added_at: string;
};

export const watchlist = {
  get: (): WatchlistItem[] => {
    try {
      return JSON.parse(localStorage.getItem("gurex_watchlist") || "[]");
    } catch {
      return [];
    }
  },
  add: (item: Omit<WatchlistItem, "added_at">) => {
    const list = watchlist.get();
    if (!list.find((i) => i.id === item.id && i.media_type === item.media_type)) {
      list.unshift({ ...item, added_at: new Date().toISOString() });
      localStorage.setItem("gurex_watchlist", JSON.stringify(list));
    }
  },
  remove: (id: number, mediaType: "movie" | "tv") => {
    const list = watchlist.get().filter((i) => !(i.id === id && i.media_type === mediaType));
    localStorage.setItem("gurex_watchlist", JSON.stringify(list));
  },
  has: (id: number, mediaType: "movie" | "tv") => {
    return watchlist.get().some((i) => i.id === id && i.media_type === mediaType);
  },
};

// Rating management (localStorage-based)
export const ratings = {
  get: (): Record<string, number> => {
    try {
      return JSON.parse(localStorage.getItem("gurex_ratings") || "{}");
    } catch {
      return {};
    }
  },
  set: (id: number, mediaType: "movie" | "tv", rating: number) => {
    const r = ratings.get();
    r[`${mediaType}_${id}`] = rating;
    localStorage.setItem("gurex_ratings", JSON.stringify(r));
  },
  get_: (id: number, mediaType: "movie" | "tv") => {
    return ratings.get()[`${mediaType}_${id}`] ?? null;
  },
};

// Favorites management
export const favorites = {
  get: (): WatchlistItem[] => {
    try {
      return JSON.parse(localStorage.getItem("gurex_favorites") || "[]");
    } catch {
      return [];
    }
  },
  add: (item: Omit<WatchlistItem, "added_at">) => {
    const list = favorites.get();
    if (!list.find((i) => i.id === item.id && i.media_type === item.media_type)) {
      list.unshift({ ...item, added_at: new Date().toISOString() });
      localStorage.setItem("gurex_favorites", JSON.stringify(list));
    }
  },
  remove: (id: number, mediaType: "movie" | "tv") => {
    const list = favorites.get().filter((i) => !(i.id === id && i.media_type === mediaType));
    localStorage.setItem("gurex_favorites", JSON.stringify(list));
  },
  has: (id: number, mediaType: "movie" | "tv") => {
    return favorites.get().some((i) => i.id === id && i.media_type === mediaType);
  },
};

// Watch Later management
export const watchLater = {
  get: (): WatchlistItem[] => {
    try {
      return JSON.parse(localStorage.getItem("gurex_watch_later") || "[]");
    } catch {
      return [];
    }
  },
  add: (item: Omit<WatchlistItem, "added_at">) => {
    const list = watchLater.get();
    if (!list.find((i) => i.id === item.id && i.media_type === item.media_type)) {
      list.unshift({ ...item, added_at: new Date().toISOString() });
      localStorage.setItem("gurex_watch_later", JSON.stringify(list));
    }
  },
  remove: (id: number, mediaType: "movie" | "tv") => {
    const list = watchLater.get().filter((i) => !(i.id === id && i.media_type === mediaType));
    localStorage.setItem("gurex_watch_later", JSON.stringify(list));
  },
  has: (id: number, mediaType: "movie" | "tv") => {
    return watchLater.get().some((i) => i.id === id && i.media_type === mediaType);
  },
};

export function formatRuntime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  return `${h}h ${m}m`;
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return "TBA";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export function getYear(dateStr: string): string {
  if (!dateStr) return "";
  return new Date(dateStr).getFullYear().toString();
}

export function formatVoteAverage(avg: number | undefined | null): string {
  if (avg == null || isNaN(avg)) return "N/A";
  return avg.toFixed(1);
}

export function getRatingColor(avg: number | undefined | null): string {
  if (avg == null || isNaN(avg)) return "text-muted-foreground";
  if (avg >= 7.5) return "text-green-400";
  if (avg >= 6.0) return "text-yellow-400";
  if (avg >= 4.0) return "text-orange-400";
  return "text-red-400";
}

export const MOVIE_GENRES: Record<number, string> = {
  28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy",
  80: "Crime", 99: "Documentary", 18: "Drama", 10751: "Family",
  14: "Fantasy", 36: "History", 27: "Horror", 10402: "Music",
  9648: "Mystery", 10749: "Romance", 878: "Sci-Fi", 10770: "TV Movie",
  53: "Thriller", 10752: "War", 37: "Western",
};

export const TV_GENRES: Record<number, string> = {
  10759: "Action & Adventure", 16: "Animation", 35: "Comedy", 80: "Crime",
  99: "Documentary", 18: "Drama", 10751: "Family", 10762: "Kids",
  9648: "Mystery", 10763: "News", 10764: "Reality", 10765: "Sci-Fi & Fantasy",
  10766: "Soap", 10767: "Talk", 10768: "War & Politics", 37: "Western",
};
