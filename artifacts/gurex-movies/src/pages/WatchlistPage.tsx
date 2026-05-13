import { useState } from "react";
import { Link } from "wouter";
import { Bookmark, Trash2, Film, Tv } from "lucide-react";
import { savedWatchlist, type SavedItem, getYear, getRatingColor } from "@/lib/guruhtech";

export default function WatchlistPage() {
  const [items, setItems] = useState<SavedItem[]>(() => savedWatchlist.get());

  const remove = (subjectId: string) => {
    savedWatchlist.remove(subjectId);
    setItems(savedWatchlist.get());
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2.5 rounded-xl bg-primary/15 border border-primary/20">
            <Bookmark size={22} className="text-primary" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">Watchlist</h1>
            <p className="text-sm text-white/40 mt-0.5">{items.length} title{items.length !== 1 ? "s" : ""} saved</p>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-24 text-white/30">
            <Bookmark size={48} className="mx-auto mb-4 opacity-30" />
            <p className="text-lg font-semibold mb-2">Your watchlist is empty</p>
            <p className="text-sm mb-6">Save movies and shows to watch later</p>
            <Link href="/"><button className="btn-primary px-6 py-3 rounded-full text-white font-semibold">Browse Content</button></Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {items.map((item) => (
              <div key={item.subjectId} className="glass rounded-2xl overflow-hidden border border-white/5 group hover:border-primary/20 transition-all">
                <Link href={`/detail/${item.detailPath}`}>
                  <div className="flex gap-3 p-3 cursor-pointer">
                    <div className="w-14 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-card">
                      {item.coverUrl && (
                        <img src={item.coverUrl} alt={item.title} className="w-full h-full object-cover" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0 pt-1">
                      <p className="font-semibold text-white text-sm line-clamp-2 mb-1">{item.title}</p>
                      <div className="flex items-center gap-2 flex-wrap">
                        {item.imdbRatingValue && parseFloat(item.imdbRatingValue) > 0 && (
                          <span className={`text-xs font-bold ${getRatingColor(item.imdbRatingValue)}`}>
                            ★ {item.imdbRatingValue}
                          </span>
                        )}
                        <span className="text-xs text-white/40">{getYear(item.releaseDate)}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${item.subjectType === 2 ? "type-badge-tv" : "type-badge-movie"}`}>
                          {item.subjectType === 2 ? <Tv size={9} className="inline mr-0.5" /> : <Film size={9} className="inline mr-0.5" />}
                          {item.subjectType === 2 ? "TV" : "Film"}
                        </span>
                      </div>
                      {item.genre && (
                        <p className="text-xs text-white/30 mt-1 line-clamp-1">{item.genre.split(",")[0]}</p>
                      )}
                    </div>
                  </div>
                </Link>
                <div className="flex items-center justify-between px-3 py-2 border-t border-white/5">
                  <p className="text-xs text-white/25">
                    Saved {new Date(item.addedAt).toLocaleDateString()}
                  </p>
                  <button
                    onClick={() => remove(item.subjectId)}
                    className="p-1.5 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-all"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
