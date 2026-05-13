import { Link } from "wouter";
import { Film, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center px-4">
        <div className="text-8xl font-black gradient-text mb-4">404</div>
        <Film size={48} className="mx-auto text-muted-foreground/30 mb-4" />
        <h1 className="text-2xl font-bold mb-2">Page Not Found</h1>
        <p className="text-muted-foreground mb-8">The page you're looking for doesn't exist.</p>
        <Link href="/">
          <button className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-bold px-6 py-3 rounded-full mx-auto transition-all duration-200 hover:scale-105">
            <Home size={18} />
            Go Home
          </button>
        </Link>
      </div>
    </div>
  );
}
