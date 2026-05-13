import { useEffect, useState } from "react";
import { X, Maximize2, Volume2 } from "lucide-react";

interface TrailerModalProps {
  videoKey: string;
  title: string;
  onClose: () => void;
}

export default function TrailerModal({ videoKey, title, onClose }: TrailerModalProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);

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

  // 1080p HD quality: vq=hd1080, hd=1, quality=hd1080
  const embedUrl = `https://www.youtube.com/embed/${videoKey}?autoplay=1&rel=0&modestbranding=1&vq=hd1080&hd=1&quality=hd1080&showinfo=0&fs=1&color=white&iv_load_policy=3`;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      onClick={onClose}
    >
      {/* Backdrop with intense blur */}
      <div className="absolute inset-0 bg-black/95 backdrop-blur-md" />

      {/* Animated glow behind modal */}
      <div className="absolute w-[80vw] h-[50vh] rounded-full bg-primary/10 blur-3xl pointer-events-none" />

      {/* Modal */}
      <div
        className={`relative z-10 rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 ${
          isFullscreen
            ? "w-screen h-screen rounded-none"
            : "w-full max-w-5xl mx-4 sm:mx-8"
        }`}
        style={{
          boxShadow: "0 0 80px rgba(255,107,53,0.15), 0 30px 100px rgba(0,0,0,0.9)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top bar */}
        <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-4 py-3 bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
          <div className="flex items-center gap-2 pointer-events-none">
            <div className="flex items-center gap-1.5 bg-blue-500/90 backdrop-blur px-2.5 py-1 rounded-md">
              <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              <span className="text-white text-xs font-black tracking-wider">HD 1080p</span>
            </div>
            <span className="text-white/70 text-sm font-medium line-clamp-1 hidden sm:block">{title}</span>
          </div>
          <div className="flex gap-2 pointer-events-auto">
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 rounded-xl bg-black/60 hover:bg-black border border-white/10 text-white transition-all duration-200 hover:scale-110"
              title="Toggle fullscreen"
            >
              <Maximize2 size={16} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-black/60 hover:bg-red-500/80 border border-white/10 text-white transition-all duration-200 hover:scale-110"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Video */}
        <div className={`aspect-video ${isFullscreen ? "h-screen" : ""}`}>
          <iframe
            src={embedUrl}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            allowFullScreen
            className="w-full h-full"
            style={{ border: "none" }}
          />
        </div>

        {/* Bottom glow */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
      </div>
    </div>
  );
}
