import { useEffect } from "react";
import { X, Youtube } from "lucide-react";
import { getTrailerEmbed } from "@/lib/guruhtech";

interface TrailerModalProps {
  trailerUrl: string;
  title: string;
  onClose: () => void;
}

export default function TrailerModal({ trailerUrl, title, onClose }: TrailerModalProps) {
  const embedUrl = getTrailerEmbed(trailerUrl);

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
      <div className="absolute inset-0 bg-black/95 backdrop-blur-md" onClick={onClose} />

      <div className="relative z-10 w-full max-w-4xl">
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center">
              <Youtube size={16} className="text-white" />
            </div>
            <div>
              <p className="text-xs text-white/40 uppercase tracking-widest font-semibold">Official Trailer</p>
              <h3 className="font-bold text-white text-sm line-clamp-1">{title}</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 rounded-full glass text-white/60 hover:text-white hover:bg-white/10 transition-all"
          >
            <X size={18} />
          </button>
        </div>

        <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black bg-black">
          {embedUrl ? (
            <iframe
              src={embedUrl}
              className="w-full h-full"
              allowFullScreen
              allow="fullscreen; autoplay; encrypted-media; picture-in-picture"
              title={`${title} Trailer`}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full gap-3">
              <Youtube size={40} className="text-red-500" />
              <p className="text-white/60 text-sm">Trailer unavailable</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
