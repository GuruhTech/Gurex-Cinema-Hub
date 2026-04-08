import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { Search, BookmarkCheck, Home, Flame, Star, Tv, Film, Menu, X, Heart } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [, navigate] = useLocation();
  const searchRef = useRef<HTMLInputElement>(null);

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

  const navLinks = [
    { href: "/", label: "Home", icon: Home },
    { href: "/trending", label: "Trending", icon: Flame },
    { href: "/movies", label: "Movies", icon: Film },
    { href: "/tv", label: "TV Shows", icon: Tv },
    { href: "/top-rated", label: "Top Rated", icon: Star },
  ];

  return (
    <>
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
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center glow-primary transition-all duration-300 group-hover:scale-110">
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
            <div className="flex items-center gap-2">
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
