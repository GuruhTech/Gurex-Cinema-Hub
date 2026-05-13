import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { X, Maximize2, AlertCircle, Loader2, ExternalLink, Play, RefreshCw, Wifi } from "lucide-react";
import { guruhtech } from "@/lib/guruhtech";

interface StreamModalProps {
  subjectId: string;
  title: string;
  onClose: () => void;
}

function isEmbedUrl(url: string) {
  return url.startsWith("http") && !url.endsWith(".m3u8") && !url.endsWith(".mp4");
}

export default function StreamModal({ subjectId, title, onClose }: StreamModalProps) {
  const [sourceIdx, setSourceIdx] = useState(0);
  const [iframeKey, setIframeKey] = useState(0);

  const { data: playData, isLoading, error, refetch } = useQuery({
    queryKey: ["play", subjectId],
    queryFn: () => guruhtech.play(subjectId),
    retry: 1,
  });

  const streamUrl = playData?.url
    ?? playData?.streamList?.[sourceIdx]?.url
    ?? null;

  const streamList = playData?.streamList ?? [];
  const hasMultipleSources = streamList.length > 1;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onKeyDown={handleKeyDown}>
      <div className="absolute inset-0 bg-black/95 backdrop-blur-sm" onClick={onClose} />

      <div className="relative z-10 w-full max-w-5xl glass rounded-2xl border border-white/10 overflow-hidden shadow-2xl shadow-black">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/8 bg-black/40">
          <div className="flex items-center gap-3">
            <div className="flex gap-1">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <div className="flex items-center gap-2">
              <Wifi size={13} className="text-primary animate-pulse" />
              <h3 className="font-semibold text-white text-sm line-clamp-1 max-w-xs">{title}</h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {hasMultipleSources && (
              <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1">
                {streamList.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => { setSourceIdx(i); setIframeKey(k => k + 1); }}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                      sourceIdx === i
                        ? "bg-primary text-white"
                        : "text-white/50 hover:text-white hover:bg-white/8"
                    }`}
                  >
                    {src.quality ?? `Source ${i + 1}`}
                  </button>
                ))}
              </div>
            )}
            <button
              onClick={() => { setIframeKey(k => k + 1); refetch(); }}
              className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/8 transition-all"
              title="Reload"
            >
              <RefreshCw size={14} />
            </button>
            {streamUrl && (
              <a
                href={streamUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/8 transition-all"
                title="Open in new tab"
              >
                <Maximize2 size={14} />
              </a>
            )}
            <button onClick={onClose} className="p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/8 transition-all">
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Player Area */}
        <div className="relative aspect-video bg-black">
          {isLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black z-10">
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
                <Play size={20} fill="white" className="text-white absolute inset-0 m-auto" />
              </div>
              <div className="text-center">
                <p className="text-white font-semibold text-sm">Loading stream...</p>
                <p className="text-white/30 text-xs mt-1">Connecting to GuruTech servers</p>
              </div>
            </div>
          )}

          {error && !isLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 bg-black">
              <div className="w-16 h-16 rounded-full bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center">
                <AlertCircle size={28} className="text-yellow-500" />
              </div>
              <div className="text-center max-w-sm">
                <p className="text-white font-bold text-lg mb-1">Stream Unavailable</p>
                <p className="text-white/40 text-sm mb-5">
                  This content may not be available for streaming right now.
                </p>
                <div className="flex flex-col items-center gap-2">
                  <button
                    onClick={() => refetch()}
                    className="flex items-center gap-2 btn-primary px-5 py-2.5 rounded-full text-white text-sm font-semibold"
                  >
                    <RefreshCw size={14} />
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          )}

          {!isLoading && !error && streamUrl && (
            isEmbedUrl(streamUrl) ? (
              <iframe
                key={iframeKey}
                src={streamUrl}
                className="w-full h-full"
                allowFullScreen
                allow="fullscreen; autoplay; encrypted-media; picture-in-picture"
                title={title}
              />
            ) : (
              <video
                key={iframeKey}
                src={streamUrl}
                className="w-full h-full"
                controls
                autoPlay
                playsInline
              />
            )
          )}

          {!isLoading && !error && !streamUrl && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 bg-black">
              <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
                <Play size={28} className="text-primary ml-1" fill="currentColor" />
              </div>
              <div className="text-center max-w-sm">
                <p className="text-white font-bold mb-1">No Stream Found</p>
                <p className="text-white/40 text-sm mb-5">Stream data received but no playable URL was returned.</p>
                <button onClick={() => refetch()} className="flex items-center gap-2 btn-primary px-5 py-2.5 rounded-full text-white text-sm font-semibold mx-auto">
                  <RefreshCw size={14} />
                  Retry
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-white/5 flex items-center justify-between bg-black/40">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-primary/20 flex items-center justify-center">
              <Play size={8} fill="white" className="text-white" />
            </div>
            <p className="text-xs text-white/30">GuruTech Cinema &mdash; Streaming</p>
          </div>
          {streamUrl && (
            <a
              href={streamUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-primary/60 hover:text-primary transition-colors"
            >
              <ExternalLink size={11} />
              Open in new tab
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
