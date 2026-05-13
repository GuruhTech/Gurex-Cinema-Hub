import { useState } from "react";
import { X, Maximize2, ChevronLeft, ChevronRight, Play, RefreshCw, Wifi, AlertTriangle } from "lucide-react";

interface StreamModalProps {
  subjectId: string;
  title: string;
  subjectType?: 1 | 2;
  onClose: () => void;
}

interface EmbedSource {
  name: string;
  url: (id: string, type: 1 | 2, season: number, episode: number) => string;
}

const SOURCES: EmbedSource[] = [
  {
    name: "Server 1",
    url: (id, type, s, e) =>
      type === 2
        ? `https://vidsrc.me/embed/tv?imdb=${id}&season=${s}&episode=${e}`
        : `https://vidsrc.me/embed/movie?imdb=${id}`,
  },
  {
    name: "Server 2",
    url: (id, type, s, e) =>
      type === 2
        ? `https://vidsrc.xyz/embed/tv?imdb=${id}&season=${s}&episode=${e}`
        : `https://vidsrc.xyz/embed/movie?imdb=${id}`,
  },
  {
    name: "Server 3",
    url: (id, type, s, e) =>
      type === 2
        ? `https://embed.su/embed/tv/${id}/${s}/${e}`
        : `https://embed.su/embed/movie/${id}`,
  },
  {
    name: "Server 4",
    url: (id, type, s, e) =>
      type === 2
        ? `https://www.2embed.cc/embedtv/${id}&s=${s}&e=${e}`
        : `https://www.2embed.cc/embed/${id}`,
  },
];

export default function StreamModal({ subjectId, title, subjectType = 1, onClose }: StreamModalProps) {
  const [sourceIdx, setSourceIdx] = useState(0);
  const [iframeKey, setIframeKey] = useState(0);
  const [season, setSeason] = useState(1);
  const [episode, setEpisode] = useState(1);
  const isTV = subjectType === 2;

  const currentSource = SOURCES[sourceIdx];
  const embedUrl = currentSource.url(subjectId, subjectType, season, episode);

  const reload = () => setIframeKey((k) => k + 1);

  const switchSource = (idx: number) => {
    setSourceIdx(idx);
    setIframeKey((k) => k + 1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4"
      onKeyDown={handleKeyDown}
    >
      <div className="absolute inset-0 bg-black/95 backdrop-blur-sm" onClick={onClose} />

      <div className="relative z-10 w-full max-w-5xl glass rounded-2xl border border-white/10 overflow-hidden shadow-2xl shadow-black flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/8 bg-black/50 flex-shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="hidden sm:flex gap-1 flex-shrink-0">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <Wifi size={12} className="text-primary animate-pulse flex-shrink-0" />
            <h3 className="font-semibold text-white text-sm truncate max-w-[160px] sm:max-w-xs">
              {title}
            </h3>
          </div>

          <div className="flex items-center gap-1.5 flex-shrink-0">
            {/* Source switcher */}
            <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1">
              {SOURCES.map((src, i) => (
                <button
                  key={i}
                  onClick={() => switchSource(i)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                    sourceIdx === i
                      ? "bg-primary text-white"
                      : "text-white/40 hover:text-white hover:bg-white/8"
                  }`}
                >
                  {src.name}
                </button>
              ))}
            </div>

            <button
              onClick={reload}
              className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/8 transition-all"
              title="Reload player"
            >
              <RefreshCw size={14} />
            </button>
            <a
              href={embedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/8 transition-all"
              title="Open in new tab"
            >
              <Maximize2 size={14} />
            </a>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/8 transition-all"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* TV Episode controls */}
        {isTV && (
          <div className="flex items-center gap-4 px-4 py-2.5 bg-black/40 border-b border-white/5 flex-shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-white/50 text-xs font-medium uppercase tracking-wide">Season</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => { setSeason((s) => Math.max(1, s - 1)); reload(); }}
                  className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all text-white/60 hover:text-white"
                >
                  <ChevronLeft size={14} />
                </button>
                <span className="text-white font-bold text-sm w-8 text-center">{season}</span>
                <button
                  onClick={() => { setSeason((s) => s + 1); reload(); }}
                  className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all text-white/60 hover:text-white"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>

            <div className="w-px h-5 bg-white/10" />

            <div className="flex items-center gap-2">
              <span className="text-white/50 text-xs font-medium uppercase tracking-wide">Episode</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => { setEpisode((e) => Math.max(1, e - 1)); reload(); }}
                  className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all text-white/60 hover:text-white"
                >
                  <ChevronLeft size={14} />
                </button>
                <span className="text-white font-bold text-sm w-8 text-center">{episode}</span>
                <button
                  onClick={() => { setEpisode((e) => e + 1); reload(); }}
                  className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all text-white/60 hover:text-white"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>

            <button
              onClick={reload}
              className="ml-auto flex items-center gap-1.5 btn-primary px-3 py-1.5 rounded-lg text-white text-xs font-semibold"
            >
              <Play size={11} fill="white" />
              Play S{season}E{episode}
            </button>
          </div>
        )}

        {/* Player */}
        <div className="relative aspect-video bg-black">
          <iframe
            key={iframeKey}
            src={embedUrl}
            className="w-full h-full"
            allowFullScreen
            allow="fullscreen; autoplay; encrypted-media; picture-in-picture"
            referrerPolicy="origin"
            title={title}
          />

          {/* Fallback overlay hint */}
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm rounded-lg px-2.5 py-1.5 pointer-events-none opacity-60">
            <AlertTriangle size={11} className="text-yellow-400" />
            <span className="text-white/70 text-xs">If player is blank, try another server above</span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 border-t border-white/5 flex items-center justify-between bg-black/40 flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-primary/20 flex items-center justify-center">
              <Play size={8} fill="white" className="text-white" />
            </div>
            <p className="text-xs text-white/30">GuruTech Cinema &mdash; {currentSource.name}</p>
          </div>
          <a
            href={embedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-primary/60 hover:text-primary transition-colors"
          >
            <Maximize2 size={11} />
            Open in new tab
          </a>
        </div>
      </div>
    </div>
  );
}
