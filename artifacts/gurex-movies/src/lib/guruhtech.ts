const BASE = "https://movieapi.xcasper.space/api";

const HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  Accept: "application/json",
  Referer: "https://movieapi.xcasper.space/",
};

async function apiFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`, { headers: HEADERS });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  const json = await res.json();
  if (!json.success) throw new Error(json.error ?? "Unknown error");
  return json.data as T;
}

export interface CoverImage {
  url: string;
  width: number;
  height: number;
  blurHash?: string;
  avgHueLight?: string;
  avgHueDark?: string;
}

export interface Subject {
  subjectId: string;
  subjectType: 1 | 2; // 1=movie, 2=tv
  title: string;
  description: string;
  releaseDate: string;
  duration: number;
  genre: string;
  cover: CoverImage;
  stills: CoverImage | null;
  imdbRatingValue: string;
  imdbRatingCount: number;
  detailPath: string;
  countryName: string;
  subtitles: string;
  staffList: StaffMember[];
  hasResource: boolean;
  trailer?: string | null;
  corner?: string;
  postTitle?: string;
  ops?: string;
}

export interface StaffMember {
  staffId: string;
  name: string;
  role: string;
  avatar?: CoverImage | null;
}

export interface SubjectListResponse {
  subjectList: Subject[];
  total?: number;
}

export interface DetailResponse {
  subject: Subject;
  related?: Subject[];
  seasonList?: Season[];
}

export interface RichDetailResponse extends Subject {
  staffList: StaffMember[];
  seasonList?: Season[];
  episodeList?: Episode[];
}

export interface Season {
  seasonId: string;
  seasonNumber: number;
  title: string;
  episodeCount: number;
  releaseDate: string;
  cover?: CoverImage | null;
}

export interface Episode {
  episodeId: string;
  episodeNumber: number;
  title: string;
  duration: number;
  cover?: CoverImage | null;
}

export interface SearchSuggest {
  subjectId: string;
  title: string;
  cover?: CoverImage;
  subjectType: 1 | 2;
  detailPath: string;
}

export interface StreamInfo {
  url: string;
  quality?: string;
  format?: string;
}

export interface PlayResponse {
  streamList?: StreamInfo[];
  url?: string;
  subtitleList?: { language: string; url: string }[];
}

export interface HomepageResponse {
  topPickList: Subject[];
  homeList: { title: string; subjectList: Subject[] }[];
  platformList?: { name: string; uploadBy?: string }[];
  banner?: Subject | null;
}

export const guruhtech = {
  trending: {
    movies: (page = 0, perPage = 18) =>
      apiFetch<SubjectListResponse>(
        `/trending?type=movie&page=${page}&perPage=${perPage}`
      ),
    tv: (page = 0, perPage = 18) =>
      apiFetch<SubjectListResponse>(
        `/trending?type=tv&page=${page}&perPage=${perPage}`
      ),
    all: (page = 0, perPage = 18) =>
      apiFetch<SubjectListResponse>(`/trending?page=${page}&perPage=${perPage}`),
  },

  browse: {
    movies: (params: { genre?: string; page?: number; perPage?: number } = {}) =>
      apiFetch<SubjectListResponse>(
        `/browse?subjectType=1&genre=${params.genre ?? ""}&page=${params.page ?? 1}&perPage=${params.perPage ?? 20}`
      ),
    tv: (params: { genre?: string; page?: number; perPage?: number } = {}) =>
      apiFetch<SubjectListResponse>(
        `/browse?subjectType=2&genre=${params.genre ?? ""}&page=${params.page ?? 1}&perPage=${params.perPage ?? 20}`
      ),
  },

  hot: () => apiFetch<SubjectListResponse>(`/hot`),
  ranking: () => apiFetch<SubjectListResponse>(`/ranking`),
  homepage: () => apiFetch<HomepageResponse>(`/homepage`),

  search: {
    query: (keyword: string, page = 1, perPage = 20, subjectType?: 1 | 2) =>
      apiFetch<SubjectListResponse>(
        `/search?keyword=${encodeURIComponent(keyword)}&page=${page}&perPage=${perPage}${subjectType ? `&subjectType=${subjectType}` : ""}`
      ),
    suggest: (keyword: string) =>
      apiFetch<{ suggestList: SearchSuggest[] }>(
        `/search/suggest?keyword=${encodeURIComponent(keyword)}`
      ),
    popular: () => apiFetch<{ keywords: string[] }>(`/popular-search`),
  },

  detail: (subjectId: string) =>
    apiFetch<DetailResponse>(`/detail?subjectId=${subjectId}`),

  richDetail: (subjectId: string) =>
    apiFetch<RichDetailResponse>(`/rich-detail?subjectId=${subjectId}`),

  recommend: (subjectId: string, page = 1, perPage = 10) =>
    apiFetch<SubjectListResponse>(
      `/recommend?subjectId=${subjectId}&page=${page}&perPage=${perPage}`
    ),

  play: (subjectId: string) =>
    apiFetch<PlayResponse>(`/play?subjectId=${subjectId}`),

  stream: (subjectId: string) =>
    apiFetch<PlayResponse>(`/bff/stream?subjectId=${subjectId}`),
};

// LocalStorage helpers
export type SavedItem = {
  subjectId: string;
  title: string;
  coverUrl: string;
  imdbRatingValue: string;
  subjectType: 1 | 2;
  releaseDate: string;
  detailPath: string;
  genre: string;
  addedAt: string;
};

function storageList(key: string) {
  return {
    get: (): SavedItem[] => {
      try {
        return JSON.parse(localStorage.getItem(key) || "[]");
      } catch {
        return [];
      }
    },
    add: (item: Omit<SavedItem, "addedAt">) => {
      const list = storageList(key).get();
      if (!list.find((i) => i.subjectId === item.subjectId)) {
        list.unshift({ ...item, addedAt: new Date().toISOString() });
        localStorage.setItem(key, JSON.stringify(list));
      }
    },
    remove: (subjectId: string) => {
      const list = storageList(key)
        .get()
        .filter((i) => i.subjectId !== subjectId);
      localStorage.setItem(key, JSON.stringify(list));
    },
    has: (subjectId: string) =>
      storageList(key)
        .get()
        .some((i) => i.subjectId === subjectId),
  };
}

export const savedWatchlist = storageList("guruhtech_watchlist");
export const savedFavorites = storageList("guruhtech_favorites");
export const savedWatchLater = storageList("guruhtech_watch_later");

export function subjectToSaved(s: Subject): Omit<SavedItem, "addedAt"> {
  return {
    subjectId: s.subjectId,
    title: s.title,
    coverUrl: s.cover?.url ?? "",
    imdbRatingValue: s.imdbRatingValue ?? "0",
    subjectType: s.subjectType,
    releaseDate: s.releaseDate ?? "",
    detailPath: s.detailPath ?? "",
    genre: s.genre ?? "",
  };
}

export function getYear(dateStr: string): string {
  if (!dateStr) return "";
  return new Date(dateStr).getFullYear().toString();
}

export function formatGenres(genre: string): string[] {
  if (!genre) return [];
  return genre.split(",").map((g) => g.trim()).filter(Boolean);
}

export function getRatingColor(val: string | number | undefined | null): string {
  const v = typeof val === "string" ? parseFloat(val) : (val ?? 0);
  if (!v || isNaN(v)) return "text-muted-foreground";
  if (v >= 7.5) return "text-emerald-400";
  if (v >= 6.0) return "text-yellow-400";
  if (v >= 4.0) return "text-orange-400";
  return "text-red-400";
}

export function getTrailerEmbed(trailerUrl: string | null | undefined): string | null {
  if (!trailerUrl) return null;
  const ytMatch = trailerUrl.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/
  );
  if (ytMatch) return `https://www.youtube-nocookie.com/embed/${ytMatch[1]}?autoplay=1&rel=0`;
  if (trailerUrl.includes("youtube-nocookie.com") || trailerUrl.includes("youtube.com/embed")) {
    return trailerUrl;
  }
  return trailerUrl;
}

export const GENRES_MOVIE = [
  "Action","Adventure","Animation","Comedy","Crime","Documentary",
  "Drama","Family","Fantasy","History","Horror","Music","Mystery",
  "Romance","Science Fiction","Thriller","War","Western",
];

export const GENRES_TV = [
  "Action","Adventure","Animation","Comedy","Crime","Documentary",
  "Drama","Family","Fantasy","Kids","Mystery","Reality","Romance",
  "Sci-Fi","Thriller","War",
];
