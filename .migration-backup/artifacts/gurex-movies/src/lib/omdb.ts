const OMDB_KEY = "1f871bfb";
const OMDB_BASE = "https://www.omdbapi.com";

export interface OmdbData {
  imdbID: string;
  Title: string;
  Year: string;
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Actors: string;
  Plot: string;
  Awards: string;
  BoxOffice: string;
  Country: string;
  Language: string;
  imdbRating: string;
  imdbVotes: string;
  Metascore: string;
  Ratings: Array<{ Source: string; Value: string }>;
  Response: string;
  Error?: string;
}

async function fetchOmdb(params: Record<string, string>): Promise<OmdbData | null> {
  try {
    const url = new URL(OMDB_BASE);
    url.searchParams.set("apikey", OMDB_KEY);
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
    const res = await fetch(url.toString());
    if (!res.ok) return null;
    const data = await res.json();
    if (data.Response === "False") return null;
    return data as OmdbData;
  } catch {
    return null;
  }
}

export const omdb = {
  byImdbId: (imdbId: string) => fetchOmdb({ i: imdbId }),
  byTitle: (title: string, year?: string) =>
    fetchOmdb({ t: title, ...(year ? { y: year } : {}) }),
};

export function getRottenTomatoesScore(omdbData: OmdbData): string | null {
  const rt = omdbData.Ratings?.find((r) => r.Source === "Rotten Tomatoes");
  return rt?.Value ?? null;
}

export function getMetacriticScore(omdbData: OmdbData): string | null {
  if (omdbData.Metascore && omdbData.Metascore !== "N/A") {
    return `${omdbData.Metascore}/100`;
  }
  const mc = omdbData.Ratings?.find((r) => r.Source === "Metacritic");
  return mc?.Value ?? null;
}
