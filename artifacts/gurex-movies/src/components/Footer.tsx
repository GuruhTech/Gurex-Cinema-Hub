import { Link } from "wouter";
import { Film, Twitter, Instagram, Youtube, Zap } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative mt-20 overflow-hidden">
      {/* Top glow line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      {/* Background with glass */}
      <div className="bg-card/60 backdrop-blur-xl border-t border-white/5">
        <div className="max-w-screen-2xl mx-auto px-6 sm:px-10 py-14">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center shadow-lg shadow-orange-500/30">
                  <Film size={18} className="text-white" />
                </div>
                <div>
                  <span className="text-lg font-black gradient-text">GUREX</span>
                  <span className="text-lg font-black text-white"> MOVIES</span>
                </div>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed mb-5">
                Your ultimate destination for discovering movies and TV shows. Explore HD content from around the world.
              </p>
              <div className="flex gap-2">
                <a href="#" className="p-2.5 rounded-xl bg-white/5 hover:bg-primary/20 hover:text-primary border border-white/10 hover:border-primary/30 transition-all duration-200 hover:scale-110">
                  <Twitter size={15} />
                </a>
                <a href="#" className="p-2.5 rounded-xl bg-white/5 hover:bg-primary/20 hover:text-primary border border-white/10 hover:border-primary/30 transition-all duration-200 hover:scale-110">
                  <Instagram size={15} />
                </a>
                <a href="#" className="p-2.5 rounded-xl bg-white/5 hover:bg-primary/20 hover:text-primary border border-white/10 hover:border-primary/30 transition-all duration-200 hover:scale-110">
                  <Youtube size={15} />
                </a>
              </div>
            </div>

            {/* Discover */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-primary mb-4">Discover</h4>
              <ul className="space-y-3">
                {[
                  { href: "/trending", label: "Trending Now" },
                  { href: "/movies", label: "All Movies" },
                  { href: "/tv", label: "TV Shows" },
                  { href: "/top-rated", label: "Top Rated" },
                ].map(({ href, label }) => (
                  <li key={href}>
                    <Link href={href}>
                      <span className="text-sm text-muted-foreground hover:text-foreground cursor-pointer transition-colors hover:translate-x-1 inline-block">
                        {label}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Genres */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-primary mb-4">Genres</h4>
              <ul className="space-y-3">
                {[
                  { href: "/movies?genre=28", label: "Action" },
                  { href: "/movies?genre=12", label: "Adventure" },
                  { href: "/movies?genre=35", label: "Comedy" },
                  { href: "/movies?genre=27", label: "Horror" },
                  { href: "/movies?genre=878", label: "Science Fiction" },
                  { href: "/movies?genre=18", label: "Drama" },
                ].map(({ href, label }) => (
                  <li key={href}>
                    <Link href={href}>
                      <span className="text-sm text-muted-foreground hover:text-foreground cursor-pointer transition-colors hover:translate-x-1 inline-block">
                        {label}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* My Space */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-primary mb-4">My Space</h4>
              <ul className="space-y-3">
                {[
                  { href: "/watchlist", label: "My Watchlist" },
                  { href: "/favorites", label: "My Favorites" },
                  { href: "/watch-later", label: "Watch Later" },
                ].map(({ href, label }) => (
                  <li key={href}>
                    <Link href={href}>
                      <span className="text-sm text-muted-foreground hover:text-foreground cursor-pointer transition-colors hover:translate-x-1 inline-block">
                        {label}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>

              {/* HD Badge */}
              <div className="mt-5 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                <span className="text-xs font-bold text-blue-400 tracking-wider">HD STREAMING</span>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-white/5 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground/60">
              GUREX MOVIES &mdash; All content for discovery purposes only.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground/60">
              <Zap size={12} className="text-primary" />
              <span>Powered by</span>
              <span className="font-bold gradient-text">GuruTech API</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
