import { useState, useEffect, useRef } from "react";
import { X, Maximize2, Server, ChevronDown, AlertCircle, Loader2, Tv, Film } from "lucide-react";

interface StreamModalProps {
  tmdbId: number;
  imdbId?: string | null;
  title: string;
  mediaType: "movie" | "tv";
  totalSeasons?: number;
  onClose: () => void;
  initialSeason?: number;
  initialEpisode?: number;
}

const MOVIE_SERVERS = [
  { id: "vidsrc1", label: "Server 1 (HD)", getUrl: (tmdb: number) => `https://vidsrc.to/embed/movie/${tmdb}` },
  { id: "vidsrc2", label: "Server 2", getUrl: (tmdb: number) => `https://vidsrc.me/embed/movie?tmdb=${tmdb}` },
  { id: "autoembed", label: "Server 3", getUrl: (tmdb: number) => `https://autoembed.cc/movie/tmdb/${tmdb}` },
  { id: "superembed", label: "Server 4", getUrl: (tmdb: number) => `https://multiembed.mov/?video_id=${tmdb}&tmdb=1` },
];

const TV_SERVERS = [
  { id: "vidsrc1", label: "Server 1 (HD)", getUrl: (tmdb: number, s: number, e: number) => `https://vidsrc.to/embed/tv/${tmdb}/${s}/${e}` },
  { id: "vidsrc2", label: "Server 2", getUrl: (tmdb: number, s: number, e: number) => `https://vidsrc.me/embed/tv?tmdb=${tmdb}&season=${s}&episode=${e}` },
  { id: "autoembed", label: "Server 3", getUrl: (tmdb: number, s: number, e: number) => `https://autoembed.cc/tv/tmdb/${tmdb}-${s}-${e}` },
];

export default function StreamModal({
  tmdbId, imdbId, title, mediaType, totalSeasons = 1, onClose, initialSeason = 1, initialEpisode = 1,
}: StreamModalProps) {
  const [serverIdx, setServerIdx] = useState(0);
  const [season, setSeason] = useState(initialSeason);
  const [episode, setEpisode] = useState(initialEpisode);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showServerMenu, setShowServerMenu] = useState(false);
  const [showEpisodeMenu, setShowEpisodeMenu] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const servers = mediaType === "movie" ? MOVIE_SERVERS : TV_SERVERS;

  const getSrc = () => {
    const srv = servers[serverIdx] ?? servers[0];
    if (mediaType === "movie") {
      return (srv as typeof MOVIE_SERVERS[0]).getUrl(tmdbId);
    }
    return (srv as typeof TV_SERVERS[0]).getUrl(tmdbId, season, episode);
  };

  const [src, setSrc] = useState(getSrc());

  const reload = () => {
    setLoading(true);
    setError(false);
    setSrc(getSrc());
  };

  useEffect(() => { reload(); }, [serverIdx, season, episode]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const toggleFullscreen = () => {
    if (!isFullscreen && containerRef.current) {
      containerRef.current.requestFullscreen?.().catch(() => setIsFullscreen(true));
    } else {
      document.exitFullscreen?.().catch(() => setIsFullscreen(false));
    }
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/95 backdrop-blur-md" />
      <div className="absolute w-[70vw] h-[40vh] rounded-full bg-primary/5 blur-3xl pointer-events-none" />

      <div
        ref={containerRef}
        className={`relative z-10 flex flex-col transition-all duration-300 ${
          isFullscreen ? "w-screen h-screen rounded-none" : "w-full max-w-6xl mx-4 sm:mx-6 rounded-2xl overflow-hidden"
        }`}
        style={{
          boxShadow: "0 0 100px rgba(255,107,53,0.12), 0 40px 120px rgba(0,0,0,0.95)",
          border: isFullscreen ? "none" : "1px solid rgba(255,255,255,0.08)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Control Bar */}
        <div
          className="flex items-center justify-between px-4 py-3 flex-shrink-0 z-20"
          style={{ background: "rgba(10,11,14,0.98)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        >
          {/* Left: Title + type */}
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg flex-shrink-0"
              style={{ background: "rgba(255,107,53,0.15)", border: "1px solid rgba(255,107,53,0.3)" }}
            >
              {mediaType === "movie" ? (
                <Film size={13} className="text-primary" />
              ) : (
                <Tv size={13} className="text-primary" />
              )}
              <span className="text-primary text-xs font-bold uppercase tracking-wider">
                {mediaType === "movie" ? "Movie" : "TV Show"}
              </span>
            </div>
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 flex-shrink-0">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              <span className="text-blue-400 text-xs font-black tracking-wider">HD</span>
            </div>
            <span className="text-white/80 text-sm font-semibold truncate hidden sm:block">{title}</span>
          </div>

          {/* Right: controls */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* TV: Season/Episode picker */}
            {mediaType === "tv" && (
              <div className="relative">
                <button
                  onClick={() => setShowEpisodeMenu(!showEpisodeMenu)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white/80 hover:text-white transition-colors"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
                >
                  S{String(season).padStart(2, "0")} E{String(episode).padStart(2, "0")}
                  <ChevronDown size={12} />
                </button>
                {showEpisodeMenu && (
                  <div
                    className="absolute right-0 top-full mt-1 rounded-xl overflow-hidden z-30 min-w-[200px]"
                    style={{ background: "rgba(15,16,20,0.98)", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 20px 60px rgba(0,0,0,0.8)" }}
                  >
                    <div className="p-3">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Season</p>
                      <div className="grid grid-cols-4 gap-1 mb-3">
                        {Array.from({ length: totalSeasons }, (_, i) => i + 1).map((s) => (
                          <button
                            key={s}
                            onClick={() => { setSeason(s); setEpisode(1); }}
                            className={`py-1.5 rounded-lg text-xs font-bold transition-colors ${
                              season === s ? "bg-primary text-white" : "bg-white/5 hover:bg-white/10 text-white/70"
                            }`}
                          >
                            S{s}
                          </button>
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Episode</p>
                      <div className="grid grid-cols-5 gap-1 max-h-32 overflow-y-auto">
                        {Array.from({ length: 24 }, (_, i) => i + 1).map((ep) => (
                          <button
                            key={ep}
                            onClick={() => { setEpisode(ep); setShowEpisodeMenu(false); }}
                            className={`py-1.5 rounded-lg text-xs font-bold transition-colors ${
                              episode === ep ? "bg-primary text-white" : "bg-white/5 hover:bg-white/10 text-white/70"
                            }`}
                          >
                            {ep}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Server picker */}
            <div className="relative">
              <button
                onClick={() => setShowServerMenu(!showServerMenu)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white/80 hover:text-white transition-colors"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
              >
                <Server size={12} />
                {servers[serverIdx]?.label}
                <ChevronDown size={12} />
              </button>
              {showServerMenu && (
                <div
                  className="absolute right-0 top-full mt-1 rounded-xl overflow-hidden z-30 min-w-[160px]"
                  style={{ background: "rgba(15,16,20,0.98)", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 20px 60px rgba(0,0,0,0.8)" }}
                >
                  {servers.map((srv, idx) => (
                    <button
                      key={srv.id}
                      onClick={() => { setServerIdx(idx); setShowServerMenu(false); }}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center gap-2 ${
                        idx === serverIdx ? "text-primary bg-primary/10" : "text-white/70 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <div className={`w-1.5 h-1.5 rounded-full ${idx === serverIdx ? "bg-primary" : "bg-white/20"}`} />
                      {srv.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-xl text-white/60 hover:text-white transition-all hover:bg-white/10"
              title="Fullscreen"
            >
              <Maximize2 size={15} />
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-white/60 hover:text-red-400 transition-all hover:bg-white/10"
            >
              <X size={15} />
            </button>
          </div>
        </div>

        {/* Video area */}
        <div className="relative aspect-video flex-shrink-0" style={{ background: "#000" }}>
          {/* Loading */}
          {loading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-black">
              <Loader2 size={40} className="text-primary animate-spin mb-3" />
              <p className="text-white/60 text-sm">Loading stream...</p>
              <p className="text-white/30 text-xs mt-1">{servers[serverIdx]?.label}</p>
            </div>
          )}

          {/* Error fallback */}
          {error && !loading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-black">
              <AlertCircle size={40} className="text-red-400 mb-3" />
              <p className="text-white font-semibold mb-1">Stream unavailable</p>
              <p className="text-white/50 text-sm mb-4">Try a different server</p>
              <div className="flex gap-2">
                {servers.map((srv, idx) => (
                  <button
                    key={srv.id}
                    onClick={() => { setServerIdx(idx); }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      idx === serverIdx ? "bg-primary text-white" : "bg-white/10 text-white/60 hover:bg-white/20"
                    }`}
                  >
                    {srv.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <iframe
            ref={iframeRef}
            key={src}
            src={src}
            title={`Stream: ${title}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            allowFullScreen
            className="w-full h-full"
            style={{ border: "none", display: "block" }}
            onLoad={() => setLoading(false)}
            onError={() => { setLoading(false); setError(true); }}
          />
        </div>

        {/* Bottom bar */}
        <div
          className="flex items-center justify-between px-4 py-2 flex-shrink-0"
          style={{ background: "rgba(10,11,14,0.98)", borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs text-white/40">
              {loading ? "Connecting..." : error ? "Stream error" : "Live stream"}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-white/30">If this server doesn't work, try another</span>
          </div>
        </div>
      </div>
    </div>
  );
}
