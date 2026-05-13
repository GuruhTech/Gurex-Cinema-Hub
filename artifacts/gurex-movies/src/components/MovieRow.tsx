import { useRef } from "react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import MovieCard from "./MovieCard";
import type { Subject } from "@/lib/guruhtech";

interface MovieRowProps {
  title: string;
  icon?: React.ReactNode;
  items: Subject[];
  viewAllHref?: string;
  size?: "sm" | "md" | "lg";
}

export default function MovieRow({ title, icon, items, viewAllHref, size = "md" }: MovieRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.clientWidth * 0.7;
    scrollRef.current.scrollBy({ left: dir === "right" ? amount : -amount, behavior: "smooth" });
  };

  if (!items.length) return null;

  return (
    <div className="mb-10 group/row">
      <div className="flex items-center justify-between mb-4 px-0.5">
        <div className="flex items-center gap-2.5">
          {icon && <span className="text-primary">{icon}</span>}
          <h2 className="text-lg sm:text-xl font-bold text-white">{title}</h2>
          <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse hidden sm:block" />
        </div>
        {viewAllHref && (
          <Link href={viewAllHref}>
            <button className="flex items-center gap-1.5 text-xs font-semibold text-primary/70 hover:text-primary transition-colors group">
              View All
              <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
          </Link>
        )}
      </div>

      <div className="relative">
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/3 z-10 p-2 rounded-full glass opacity-0 group-hover/row:opacity-100 hover:bg-white/10 transition-all -translate-x-3"
        >
          <ChevronLeft size={18} className="text-white" />
        </button>

        <div ref={scrollRef} className="carousel-container flex gap-3 pb-2">
          {items.map((item) => (
            <MovieCard key={item.subjectId} item={item} size={size} />
          ))}
        </div>

        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/3 z-10 p-2 rounded-full glass opacity-0 group-hover/row:opacity-100 hover:bg-white/10 transition-all translate-x-3"
        >
          <ChevronRight size={18} className="text-white" />
        </button>
      </div>
    </div>
  );
}
