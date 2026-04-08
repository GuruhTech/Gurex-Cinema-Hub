import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { Search, BookmarkCheck, Home, Flame, Star, Tv, Film, Menu, X, Heart, Download, Clock } from "lucide-react";
import { usePWAInstall } from "@/hooks/usePWAInstall";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showInstallToast, setShowInstallToast] = useState(false);
  const [, navigate] = useLocation();
  const searchRef = useRef<HTMLInputElement>(null);
  const { canInstall, isInstalled, install } = usePWAInstall();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (searchOpen && searchRef.current) {
      searchRef.current.focus();
    }
  }, [searchOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
      setMobileOpen(false);
    }
  };

  const handleInstall = async () => {
    const accepted = await install();
    if (!accepted) {
      setShowInstallToast(true);
      setTimeout(() => setShowInstallToast(false), 4000);
    }
  };

  const navLinks = [
    { href: "/", label: "Home", icon: Home },
    { href: "/trending", label: "Trending", icon: Flame },
    { href: "/movies", label: "Movies", icon: Film },
    { href: "/tv", label: "TV Shows", icon: Tv },
    { href: "/top-rated", label: "Top Rated", icon: Star },
  ];

  return (
    <>
      {/* Install toast notification */}
      {showInstallToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[200] px-4 py-3 rounded-xl glass border border-primary/30 shadow-xl flex items-center gap-3 animate-in slide-in-from-top-4 duration-300">
          <Download size={16} className="text-primary flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold">Install GUREX MOVIES</p>
            <p className="text-xs text-muted-foreground">Tap your browser menu → "Add to Home Screen"</p>
          </div>
          <button onClick={() => setShowInstallToast(false)} className="p-1 rounded-full hover:bg-card ml-1">
            <X size={14} />
          </button>
        </div>
      )}

      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "nav-scrolled" : "bg-transparent"
        }`}
      >
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-18">
            {/* Logo */}
            <Link href="/">
              <div className="flex items-center gap-2 cursor-pointer group">
                <div className="relative">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                    style={{ boxShadow: "0 0 20px rgba(255,107,53,0.4)" }}>
                    <Film size={16} className="text-white" />
                  </div>
                </div>
                <span className="text-xl font-black tracking-wider gradient-text hidden sm:block">
                  GUREX
                </span>
                <span className="text-xl font-black tracking-wider text-white hidden sm:block">
                  MOVIES
                </span>
              </div>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map(({ href, label, icon: Icon }) => (
                <NavLink key={href} href={href} icon={Icon}>
                  {label}
                </NavLink>
              ))}
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-1.5">
              {/* Search toggle */}
              {searchOpen ? (
                <form onSubmit={handleSearch} className="flex items-center">
                  <div className="relative">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      ref={searchRef}
                      type="search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search movies, TV shows..."
                      className="pl-9 pr-4 py-2 rounded-full bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary w-64 sm:w-80 transition-all"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setSearchOpen(false)}
                    className="ml-2 p-2 rounded-full hover:bg-card transition-colors"
                  >
                    <X size={18} className="text-muted-foreground" />
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => setSearchOpen(true)}
                  className="p-2 rounded-full hover:bg-card transition-all duration-200 hover:scale-110"
                  aria-label="Search"
                >
                  <Search size={20} className="text-foreground" />
                </button>
              )}

              <Link href="/watch-later">
                <button className="p-2 rounded-full hover:bg-card transition-all duration-200 hover:scale-110" aria-label="Watch Later">
                  <Clock size={20} className="text-foreground" />
                </button>
              </Link>

              <Link href="/favorites">
                <button className="p-2 rounded-full hover:bg-card transition-all duration-200 hover:scale-110" aria-label="Favorites">
                  <Heart size={20} className="text-foreground" />
                </button>
              </Link>

              <Link href="/watchlist">
                <button className="p-2 rounded-full hover:bg-card transition-all duration-200 hover:scale-110" aria-label="Watchlist">
                  <BookmarkCheck size={20} className="text-foreground" />
                </button>
              </Link>

              {/* PWA Install Button */}
              {(canInstall || !isInstalled) && (
                <button
                  onClick={handleInstall}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 hover:scale-105"
                  style={{
                    background: "linear-gradient(135deg, rgba(255,107,53,0.15), rgba(255,107,53,0.05))",
                    border: "1px solid rgba(255,107,53,0.3)",
                    color: "#ff6b35",
                  }}
                  aria-label="Install App"
                  title={isInstalled ? "App installed!" : "Install GUREX MOVIES as an app"}
                >
                  <Download size={13} />
                  <span className="hidden lg:block">{isInstalled ? "Installed" : "Install App"}</span>
                </button>
              )}

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="p-2 rounded-full hover:bg-card transition-colors md:hidden"
                aria-label="Menu"
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden glass border-t border-border">
            <div className="px-4 py-3 space-y-1">
              {navLinks.map(({ href, label, icon: Icon }) => (
                <Link key={href} href={href}>
                  <button
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg hover:bg-card text-sm font-medium transition-colors"
                  >
                    <Icon size={18} className="text-primary" />
                    {label}
                  </button>
                </Link>
              ))}
              <Link href="/watch-later">
                <button onClick={() => setMobileOpen(false)} className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg hover:bg-card text-sm font-medium transition-colors">
                  <Clock size={18} className="text-blue-400" />
                  Watch Later
                </button>
              </Link>
              <button
                onClick={() => { handleInstall(); setMobileOpen(false); }}
                className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg hover:bg-card text-sm font-medium transition-colors text-primary"
              >
                <Download size={18} className="text-primary" />
                {isInstalled ? "App Installed ✓" : "Install as App"}
              </button>
              <form onSubmit={handleSearch} className="pt-2">
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search..."
                    className="w-full pl-9 pr-4 py-2 rounded-full bg-card border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </form>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}

function NavLink({
  href,
  children,
  icon: Icon,
}: {
  href: string;
  children: React.ReactNode;
  icon: React.ElementType;
}) {
  const [location] = useLocation();
  const isActive = location === href;

  return (
    <Link href={href}>
      <button
        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
          isActive
            ? "text-primary bg-primary/10"
            : "text-muted-foreground hover:text-foreground hover:bg-card"
        }`}
      >
        <Icon size={15} />
        {children}
      </button>
    </Link>
  );
}
