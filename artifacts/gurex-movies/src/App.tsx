import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HomePage from "@/pages/HomePage";
import MovieDetailPage from "@/pages/MovieDetailPage";
import TVDetailPage from "@/pages/TVDetailPage";
import MoviesPage from "@/pages/MoviesPage";
import TVPage from "@/pages/TVPage";
import TrendingPage from "@/pages/TrendingPage";
import TopRatedPage from "@/pages/TopRatedPage";
import SearchPage from "@/pages/SearchPage";
import WatchlistPage from "@/pages/WatchlistPage";
import FavoritesPage from "@/pages/FavoritesPage";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/movie/:id" component={MovieDetailPage} />
      <Route path="/tv/:id" component={TVDetailPage} />
      <Route path="/movies" component={MoviesPage} />
      <Route path="/tv" component={TVPage} />
      <Route path="/trending" component={TrendingPage} />
      <Route path="/top-rated" component={TopRatedPage} />
      <Route path="/search" component={SearchPage} />
      <Route path="/watchlist" component={WatchlistPage} />
      <Route path="/favorites" component={FavoritesPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
        <div className="min-h-screen bg-background">
          <Navbar />
          <main>
            <Router />
          </main>
          <Footer />
        </div>
      </WouterRouter>
    </QueryClientProvider>
  );
}

export default App;
