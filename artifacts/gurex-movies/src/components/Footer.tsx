import { Link } from "wouter";
import { Film, Github, Twitter, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-20">
      <div className="max-w-screen-2xl mx-auto px-6 sm:px-10 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center">
                <Film size={16} className="text-white" />
              </div>
              <span className="text-lg font-black gradient-text">GUREX MOVIES</span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Your ultimate destination for discovering movies and TV shows. Stream the best content from around the world.
            </p>
            <div className="flex gap-3 mt-4">
              <a href="#" className="p-2 rounded-full bg-muted hover:bg-primary/20 hover:text-primary transition-all duration-200">
                <Twitter size={16} />
              </a>
              <a href="#" className="p-2 rounded-full bg-muted hover:bg-primary/20 hover:text-primary transition-all duration-200">
                <Instagram size={16} />
              </a>
              <a href="#" className="p-2 rounded-full bg-muted hover:bg-primary/20 hover:text-primary transition-all duration-200">
                <Github size={16} />
              </a>
            </div>
          </div>

          {/* Discover */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest text-primary mb-4">Discover</h4>
            <ul className="space-y-2.5">
              {[
                { href: "/trending", label: "Trending" },
                { href: "/movies", label: "Movies" },
                { href: "/tv", label: "TV Shows" },
                { href: "/top-rated", label: "Top Rated" },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href}>
                    <span className="text-sm text-muted-foreground hover:text-foreground cursor-pointer transition-colors">{label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Genres */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest text-primary mb-4">Genres</h4>
            <ul className="space-y-2.5">
              {[
                { href: "/movies?genre=28", label: "Action" },
                { href: "/movies?genre=12", label: "Adventure" },
                { href: "/movies?genre=35", label: "Comedy" },
                { href: "/movies?genre=27", label: "Horror" },
                { href: "/movies?genre=878", label: "Sci-Fi" },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href}>
                    <span className="text-sm text-muted-foreground hover:text-foreground cursor-pointer transition-colors">{label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* My Space */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest text-primary mb-4">My Space</h4>
            <ul className="space-y-2.5">
              {[
                { href: "/watchlist", label: "Watchlist" },
                { href: "/favorites", label: "Favorites" },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href}>
                    <span className="text-sm text-muted-foreground hover:text-foreground cursor-pointer transition-colors">{label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} GUREX MOVIES. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Powered by{" "}
            <a
              href="https://www.themoviedb.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              TMDB
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
