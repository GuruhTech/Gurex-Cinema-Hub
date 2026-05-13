import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { Search, Home, Flame, Star, Tv, Film, Menu, X, Heart, Clock, Bookmark, ChevronDown } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [, navigate] = useLocation();
  const [location] = useLocation();
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (searchOpen && searchRef.current) searchRef.current.focus();
  }, [searchOpen]);

  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
  }, [location]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  const navLinks = [
    { href: "/", label: "Home", icon: Home },
    { href: "/trending", label: "Trending", icon: Flame },
    { href: "/movies", label: "Movies", icon: Film },
    { href: "/tv", label: "TV Shows", icon: Tv },
    { href: "/top-rated", label: "Top Rated", icon: Star },
  ];

  const isActive = (href: string) => (href === "/" ? location === "/" : location.startsWith(href));

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled || mobileOpen ? "nav-scrolled" : "bg-gradient-to-b from-black/70 to-transparent"
        }`}
      >
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/">
              <div className="flex items-center gap-2.5 cursor-pointer group">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-lg group-hover:shadow-primary/40 transition-shadow">
                  <Film size={16} className="text-white" />
                </div>
                <span className="font-black text-xl tracking-tight">
                  <span className="gradient-text">GUREX</span>
                  <span className="text-white/80 font-light ml-1 text-sm">CINEMA</span>
                </span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map(({ href, label, icon: Icon }) => (
                <Link key={href} href={href}>
                  <button
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive(href)
                        ? "text-white bg-primary/20 border border-primary/30"
                        : "text-white/60 hover:text-white hover:bg-white/8"
                    }`}
                  >
                    <Icon size={14} />
                    {label}
                  </button>
                </Link>
              ))}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              {/* Search */}
              {searchOpen ? (
                <form onSubmit={handleSearch} className="flex items-center">
                  <div className="flex items-center gap-2 glass rounded-full px-4 py-2 border border-primary/30">
                    <Search size={15} className="text-primary" />
                    <input
                      ref={searchRef}
                      type="search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search movies, shows..."
                      className="bg-transparent text-sm text-white placeholder-white/40 outline-none w-48 sm:w-64"
                    />
                    <button type="button" onClick={() => { setSearchOpen(false); setSearchQuery(""); }}>
                      <X size={15} className="text-white/50 hover:text-white transition-colors" />
                    </button>
                  </div>
                </form>
              ) : (
                <button
                  onClick={() => setSearchOpen(true)}
                  className="p-2.5 rounded-full text-white/60 hover:text-white hover:bg-white/8 transition-all"
                >
                  <Search size={18} />
                </button>
              )}

              {/* My Stuff dropdown (desktop) */}
              <div className="relative group hidden md:block">
                <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/8 transition-all">
                  <Bookmark size={15} />
                  My List
                  <ChevronDown size={12} />
                </button>
                <div className="absolute right-0 top-full pt-2 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity duration-200">
                  <div className="glass border border-white/10 rounded-xl p-1 min-w-40 shadow-2xl">
                    {[
                      { href: "/watchlist", label: "Watchlist", icon: Bookmark },
                      { href: "/favorites", label: "Favorites", icon: Heart },
                      { href: "/watch-later", label: "Watch Later", icon: Clock },
                    ].map(({ href, label, icon: Icon }) => (
                      <Link key={href} href={href}>
                        <button className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-sm text-white/70 hover:text-white hover:bg-white/8 transition-all text-left">
                          <Icon size={14} className="text-primary" />
                          {label}
                        </button>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Mobile menu toggle */}
              <button
                className="md:hidden p-2.5 rounded-full text-white/60 hover:text-white hover:bg-white/8 transition-all"
                onClick={() => setMobileOpen(!mobileOpen)}
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-white/8 bg-background/98">
            <div className="px-4 py-4 space-y-1">
              {navLinks.map(({ href, label, icon: Icon }) => (
                <Link key={href} href={href}>
                  <button
                    className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      isActive(href)
                        ? "text-white bg-primary/20 border border-primary/20"
                        : "text-white/60 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <Icon size={16} />
                    {label}
                  </button>
                </Link>
              ))}
              <div className="h-px bg-white/8 my-2" />
              {[
                { href: "/watchlist", label: "Watchlist", icon: Bookmark },
                { href: "/favorites", label: "Favorites", icon: Heart },
                { href: "/watch-later", label: "Watch Later", icon: Clock },
              ].map(({ href, label, icon: Icon }) => (
                <Link key={href} href={href}>
                  <button className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm text-white/60 hover:text-white hover:bg-white/5 transition-all">
                    <Icon size={16} className="text-primary" />
                    {label}
                  </button>
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
