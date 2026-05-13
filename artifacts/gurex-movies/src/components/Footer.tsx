import { Link } from "wouter";
import { Film, Github, Globe } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-background/80 mt-16">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Film size={16} className="text-white" />
              </div>
              <span className="font-black text-xl">
                <span className="gradient-text">GUREX</span>
                <span className="text-white/60 font-light ml-1 text-sm">CINEMA</span>
              </span>
            </div>
            <p className="text-sm text-white/40 leading-relaxed">
              Your ultimate destination for movies and TV shows. Discover, track, and enjoy the best content.
            </p>
          </div>

          {/* Browse */}
          <div>
            <h4 className="text-sm font-semibold text-white/70 mb-3 uppercase tracking-wider">Browse</h4>
            <ul className="space-y-2">
              {[
                { href: "/trending", label: "Trending" },
                { href: "/movies", label: "Movies" },
                { href: "/tv", label: "TV Shows" },
                { href: "/top-rated", label: "Top Rated" },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href}>
                    <span className="text-sm text-white/40 hover:text-primary transition-colors cursor-pointer">
                      {label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* My List */}
          <div>
            <h4 className="text-sm font-semibold text-white/70 mb-3 uppercase tracking-wider">My List</h4>
            <ul className="space-y-2">
              {[
                { href: "/watchlist", label: "Watchlist" },
                { href: "/favorites", label: "Favorites" },
                { href: "/watch-later", label: "Watch Later" },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href}>
                    <span className="text-sm text-white/40 hover:text-primary transition-colors cursor-pointer">
                      {label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="text-sm font-semibold text-white/70 mb-3 uppercase tracking-wider">Powered By</h4>
            <div className="flex items-center gap-2 text-sm text-white/40 mb-2">
              <Globe size={13} className="text-primary" />
              XCASPER Movies API
            </div>
            <p className="text-xs text-white/25 mt-1">CASPER TECH KENYA DEVELOPERS</p>
            <a
              href="https://github.com/GuruhTech/Gurex-Cinema-Hub"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-white/40 hover:text-primary transition-colors mt-3"
            >
              <Github size={13} />
              Open Source
            </a>
          </div>
        </div>

        <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-white/25">
            © {new Date().getFullYear()} Gurex Cinema Hub. For entertainment discovery only.
          </p>
          <p className="text-xs text-white/25">
            Content data provided by XCASPER Movies API
          </p>
        </div>
      </div>
    </footer>
  );
}
