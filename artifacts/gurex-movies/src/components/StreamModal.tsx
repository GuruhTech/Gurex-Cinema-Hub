import { useState, useEffect, useRef } from "react";
import { X, Maximize2, Server, ChevronDown, AlertCircle, Loader2, Tv, Film, ShieldCheck } from "lucide-react";

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

// Cleanest servers — ordered by least ads first
const MOVIE_SERVERS = [
  {
    id: "embedsu",
    label: "Server 1 · No Ads",
    getUrl: (tmdb: number) => `https://embed.su/embed/movie/${tmdb}`,
  },
  {
    id: "vidsrc_cc",
    label: "Server 2 · Low Ads",
    getUrl: (tmdb: number) => `https://vidsrc.cc/v2/embed/movie/${tmdb}`,
  },
  {
    id: "vidlink",
    label: "Server 3 · HD",
    getUrl: (tmdb: number) => `https://vidlink.pro/movie/${tmdb}?primaryColor=ff6b35&secondaryColor=ff6b35&iconColor=ff6b35`,
  },
  {
    id: "videasy",
    label: "Server 4 · Backup",
    getUrl: (tmdb: number) => `https://player.videasy.net/movie/${tmdb}`,
  },
];

const TV_SERVERS = [
  {
    id: "embedsu",
    label: "Server 1 · No Ads",
    getUrl: (tmdb: number, s: number, e: number) => `https://embed.su/embed/tv/${tmdb}/${s}/${e}`,
  },
  {
    id: "vidsrc_cc",
    label: "Server 2 · Low Ads",
    getUrl: (tmdb: number, s: number, e: number) =>
      `https://vidsrc.cc/v2/embed/tv/${tmdb}?season=${s}&episode=${e}`,
  },
  {
    id: "vidlink",
    label: "Server 3 · HD",
    getUrl: (tmdb: number, s: number, e: number) =>
      `https://vidlink.pro/tv/${tmdb}/${s}/${e}?primaryColor=ff6b35&secondaryColor=ff6b35&iconColor=ff6b35`,
  },
  {
    id: "videasy",
    label: "Server 4 · Backup",
    getUrl: (tmdb: number, s: number, e: number) =>
      `https://player.videasy.net/tv/${tmdb}/${s}/${e}`,
  },
];

export default function StreamModal({
  tmdbId,
  imdbId,
  title,
  mediaType,
  totalSeasons = 1,
  onClose,
  initialSeason = 1,
  initialEpisode = 1,
}: StreamModalProps) {
  const [serverIdx, setServerIdx] = useState(0);
  const [season, setSeason] = useState(initialSeason);
  const [episode, setEpisode] = useState(initialEpisode);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showServerMenu, setShowServerMenu] = useState(false);
  const [showEpisodeMenu, setShowEpisodeMenu] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const servers = mediaType === "movie" ? MOVIE_SERVERS : TV_SERVERS;

  const getSrc = () => {
    const srv = servers[serverIdx] ?? servers[0];
    if (mediaType === "movie") {
      return (srv as (typeof MOVIE_SERVERS)[0]).getUrl(tmdbId);
    }
    return (srv as (typeof TV_SERVERS)[0]).getUrl(tmdbId, season, episode);
  };

  const [src, setSrc] = useState(getSrc);

  const reload = () => {
    setLoading(true);
    setSrc(getSrc());
  };

  useEffect(() => {
    reload();
  }, [serverIdx, season, episode]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";

    // Block any navigation attempts from the iframe
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("keydown", handleKey);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const toggleFullscreen = () => {
    if (!isFullscreen && containerRef.current) {
      containerRef.current.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/96 backdrop-blur-md" />

      <div
        ref={containerRef}
        className={`relative z-10 flex flex-col transition-all duration-300 ${
          isFullscreen
            ? "w-screen h-screen rounded-none"
            : "w-full max-w-6xl mx-4 sm:mx-6 rounded-2xl overflow-hidden"
        }`}
        style={{
          boxShadow: "0 0 100px rgba(255,107,53,0.12), 0 40px 120px rgba(0,0,0,0.95)",
          border: isFullscreen ? "none" : "1px solid rgba(255,255,255,0.08)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Control Bar */}
        <div
          className="flex items-center justify-between px-4 py-2.5 flex-shrink-0 z-20 gap-2"
          style={{ background: "rgba(10,11,14,0.99)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        >
          {/* Left: badges */}
          <div className="flex items-center gap-2 min-w-0">
            <div
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg flex-shrink-0"
              style={{ background: "rgba(255,107,53,0.15)", border: "1px solid rgba(255,107,53,0.3)" }}
            >
              {mediaType === "movie" ? (
                <Film size={12} className="text-primary" />
              ) : (
                <Tv size={12} className="text-primary" />
              )}
              <span className="text-primary text-xs font-bold uppercase tracking-wider">
                {mediaType === "movie" ? "Movie" : "TV"}
              </span>
            </div>

            {/* Ad-blocked badge */}
            <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-green-500/10 border border-green-500/20 flex-shrink-0">
              <ShieldCheck size={11} className="text-green-400" />
              <span className="text-green-400 text-xs font-semibold hidden sm:block">Ads Blocked</span>
            </div>

            <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 flex-shrink-0">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              <span className="text-blue-400 text-[11px] font-black tracking-wider">HD</span>
            </div>

            <span className="text-white/60 text-sm truncate hidden md:block">{title}</span>
          </div>

          {/* Right: controls */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {/* TV: Season/Episode picker */}
            {mediaType === "tv" && (
              <div className="relative">
                <button
                  onClick={() => { setShowEpisodeMenu(!showEpisodeMenu); setShowServerMenu(false); }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white/80 hover:text-white transition-colors"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
                >
                  S{String(season).padStart(2, "0")} · E{String(episode).padStart(2, "0")}
                  <ChevronDown size={11} />
                </button>
                {showEpisodeMenu && (
                  <div
                    className="absolute right-0 top-full mt-1 rounded-xl overflow-hidden z-30 w-56 p-3"
                    style={{
                      background: "rgba(12,13,18,0.99)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      boxShadow: "0 20px 60px rgba(0,0,0,0.9)",
                    }}
                  >
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">Season</p>
                    <div className="grid grid-cols-5 gap-1 mb-3">
                      {Array.from({ length: Math.min(totalSeasons, 20) }, (_, i) => i + 1).map((s) => (
                        <button
                          key={s}
                          onClick={() => { setSeason(s); setEpisode(1); }}
                          className={`py-1.5 rounded-lg text-xs font-bold transition-colors ${
                            season === s ? "bg-primary text-white" : "bg-white/5 hover:bg-white/10 text-white/60"
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">Episode</p>
                    <div className="grid grid-cols-6 gap-1 max-h-28 overflow-y-auto">
                      {Array.from({ length: 30 }, (_, i) => i + 1).map((ep) => (
                        <button
                          key={ep}
                          onClick={() => { setEpisode(ep); setShowEpisodeMenu(false); }}
                          className={`py-1.5 rounded-lg text-xs font-bold transition-colors ${
                            episode === ep ? "bg-primary text-white" : "bg-white/5 hover:bg-white/10 text-white/60"
                          }`}
                        >
                          {ep}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Server picker */}
            <div className="relative">
              <button
                onClick={() => { setShowServerMenu(!showServerMenu); setShowEpisodeMenu(false); }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white/70 hover:text-white transition-colors"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
              >
                <Server size={11} />
                <span className="hidden sm:block">{servers[serverIdx]?.label}</span>
                <span className="sm:hidden">Servers</span>
                <ChevronDown size={11} />
              </button>
              {showServerMenu && (
                <div
                  className="absolute right-0 top-full mt-1 rounded-xl overflow-hidden z-30 w-48"
                  style={{
                    background: "rgba(12,13,18,0.99)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    boxShadow: "0 20px 60px rgba(0,0,0,0.9)",
                  }}
                >
                  {servers.map((srv, idx) => (
                    <button
                      key={srv.id}
                      onClick={() => { setServerIdx(idx); setShowServerMenu(false); }}
                      className={`w-full text-left px-4 py-2.5 text-xs transition-colors flex items-center gap-2 ${
                        idx === serverIdx
                          ? "text-primary bg-primary/10 font-bold"
                          : "text-white/60 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <div
                        className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                          idx === serverIdx ? "bg-primary" : "bg-white/20"
                        }`}
                      />
                      {srv.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-xl text-white/50 hover:text-white transition-all hover:bg-white/10"
              title="Fullscreen"
            >
              <Maximize2 size={14} />
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-white/50 hover:text-red-400 transition-all hover:bg-red-500/10"
            >
              <X size={14} />
            </button>
          </div>
        </div>

        {/* Video */}
        <div className="relative aspect-video flex-shrink-0 bg-black">
          {loading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-black">
              <Loader2 size={36} className="text-primary animate-spin mb-3" />
              <p className="text-white/50 text-sm">Loading stream…</p>
            </div>
          )}

          {/*
            Sandbox policy — blocks ALL ads from opening popups or redirecting the page:
            ✅ allow-scripts          → video player JS works
            ✅ allow-same-origin      → player can load its own resources
            ✅ allow-fullscreen       → user can go fullscreen
            ✅ allow-forms            → some players use form submissions
            ✅ allow-presentation     → allows picture-in-picture
            ❌ allow-popups           → BLOCKED → no popup ads
            ❌ allow-top-navigation   → BLOCKED → can't redirect your whole page
            ❌ allow-popups-to-escape-sandbox → BLOCKED → ads can't escape sandbox
          */}
          <iframe
            key={`${src}-${serverIdx}`}
            src={src}
            title={`Watch: ${title}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            allowFullScreen
            sandbox="allow-scripts allow-same-origin allow-fullscreen allow-forms allow-presentation"
            referrerPolicy="no-referrer"
            className="w-full h-full"
            style={{ border: "none", display: "block" }}
            onLoad={() => setLoading(false)}
          />
        </div>

        {/* Bottom bar */}
        <div
          className="flex items-center justify-between px-4 py-2 flex-shrink-0"
          style={{ background: "rgba(10,11,14,0.99)", borderTop: "1px solid rgba(255,255,255,0.05)" }}
        >
          <div className="flex items-center gap-2">
            <ShieldCheck size={13} className="text-green-400" />
            <span className="text-xs text-green-400/70 font-medium">
              Popups & redirects blocked
            </span>
          </div>
          <span className="text-xs text-white/25">
            {loading ? "Connecting…" : "If video doesn't play, try a different server"}
          </span>
        </div>
      </div>
    </div>
  );
}
