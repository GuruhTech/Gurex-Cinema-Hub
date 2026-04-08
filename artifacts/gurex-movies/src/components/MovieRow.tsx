import { useRef } from "react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import MovieCard from "./MovieCard";
import type { Movie, TVShow } from "@/lib/tmdb";

interface MovieRowProps {
  title: string;
  items: (Movie | TVShow)[];
  mediaType?: "movie" | "tv";
  viewAllHref?: string;
  size?: "sm" | "md" | "lg";
  showType?: boolean;
}

export default function MovieRow({
  title,
  items,
  mediaType,
  viewAllHref,
  size = "md",
  showType = false,
}: MovieRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.clientWidth * 0.7;
    scrollRef.current.scrollBy({ left: dir === "right" ? amount : -amount, behavior: "smooth" });
  };

  if (!items?.length) return null;

  return (
    <div className="mb-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-5 px-4 sm:px-0">
        <div className="flex items-center gap-3">
          <div className="w-1 h-6 rounded-full bg-primary" />
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">{title}</h2>
        </div>
        <div className="flex items-center gap-2">
          {viewAllHref && (
            <Link href={viewAllHref}>
              <button className="flex items-center gap-1 text-sm text-primary hover:text-primary/80 font-semibold transition-colors group">
                See all
                <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          )}
          <button
            onClick={() => scroll("left")}
            className="p-1.5 rounded-full bg-card border border-border hover:bg-muted hover:border-primary/40 transition-all duration-200 hover:scale-110"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => scroll("right")}
            className="p-1.5 rounded-full bg-card border border-border hover:bg-muted hover:border-primary/40 transition-all duration-200 hover:scale-110"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Scroll container */}
      <div
        ref={scrollRef}
        className="carousel-container flex gap-4 pb-2 px-4 sm:px-0"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {items.map((item) => (
          <div key={item.id} style={{ scrollSnapAlign: "start" }}>
            <MovieCard item={item} mediaType={mediaType} size={size} showType={showType} />
          </div>
        ))}
      </div>
    </div>
  );
}
