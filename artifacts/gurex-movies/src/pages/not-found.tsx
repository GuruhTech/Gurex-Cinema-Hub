import { Link } from "wouter";
import { Film, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-20">
      <div className="text-center">
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-primary/15 border border-primary/20 flex items-center justify-center">
          <Film size={36} className="text-primary" />
        </div>
        <h1 className="text-6xl font-black text-white mb-3">404</h1>
        <p className="text-xl font-semibold text-white/60 mb-2">Page not found</p>
        <p className="text-sm text-white/30 mb-8">The page you're looking for doesn't exist</p>
        <Link href="/">
          <button className="btn-primary flex items-center gap-2 px-6 py-3 rounded-full text-white font-semibold mx-auto">
            <Home size={16} />
            Back to Home
          </button>
        </Link>
      </div>
    </div>
  );
}
