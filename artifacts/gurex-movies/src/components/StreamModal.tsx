import { useState, useEffect } from "react";
import { X, Maximize2, AlertCircle, Loader2, ExternalLink, Play } from "lucide-react";

interface StreamModalProps {
  subjectId: string;
  title: string;
  onClose: () => void;
}

const EMBED_SOURCES = [
  {
    name: "Source 1",
    url: (id: string) => `https://movieapi.xcasper.space/api/play?subjectId=${id}`,
    isApi: true,
  },
  {
    name: "ShowBox",
    url: (id: string) => `https://www.showbox.media/embed/movie/${id}`,
    isApi: false,
  },
];

export default function StreamModal({ subjectId, title, onClose }: StreamModalProps) {
  const [activeSource, setActiveSource] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-5xl glass rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/8">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <h3 className="font-semibold text-white text-sm line-clamp-1">{title}</h3>
          </div>
          <div className="flex items-center gap-2">
            {/* Source selector */}
            <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1">
              {EMBED_SOURCES.map((src, i) => (
                <button
                  key={src.name}
                  onClick={() => { setActiveSource(i); setLoading(true); setError(false); }}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                    activeSource === i
                      ? "bg-primary text-white"
                      : "text-white/50 hover:text-white hover:bg-white/8"
                  }`}
                >
                  {src.name}
                </button>
              ))}
            </div>
            <button onClick={onClose} className="p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/8 transition-all">
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Player */}
        <div className="relative aspect-video bg-black">
          {loading && !error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black z-10">
              <Loader2 size={36} className="text-primary animate-spin" />
              <p className="text-white/50 text-sm">Loading stream...</p>
            </div>
          )}

          {error ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black">
              <AlertCircle size={40} className="text-yellow-500" />
              <div className="text-center">
                <p className="text-white font-semibold mb-1">Stream Unavailable</p>
                <p className="text-white/50 text-sm mb-4">This content may not be available for direct streaming.</p>
                <a
                  href={`https://movieapi.xcasper.space/api/play?subjectId=${subjectId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 btn-primary px-5 py-2.5 rounded-full text-white text-sm font-semibold"
                >
                  <ExternalLink size={14} />
                  Try External Player
                </a>
              </div>
              <button
                onClick={() => { setActiveSource((activeSource + 1) % EMBED_SOURCES.length); setLoading(true); setError(false); }}
                className="text-primary text-sm hover:underline"
              >
                Try next source
              </button>
            </div>
          ) : (
            <iframe
              key={`${activeSource}-${subjectId}`}
              src={`https://movieapi.xcasper.space/api/play?subjectId=${subjectId}`}
              className="w-full h-full"
              allowFullScreen
              allow="fullscreen; autoplay; encrypted-media"
              onLoad={() => setLoading(false)}
              onError={() => { setLoading(false); setError(true); }}
            />
          )}
        </div>

        {/* Footer info */}
        <div className="px-5 py-3 border-t border-white/5 flex items-center justify-between">
          <p className="text-xs text-white/30">
            Content sourced from XCASPER Movies API — for entertainment discovery only
          </p>
          <a
            href={`https://movieapi.xcasper.space/api/play?subjectId=${subjectId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-primary/70 hover:text-primary transition-colors"
          >
            <ExternalLink size={11} />
            Open in new tab
          </a>
        </div>
      </div>
    </div>
  );
}
