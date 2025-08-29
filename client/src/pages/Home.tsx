import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { CategoryCard } from "@/components/game/CategoryCard";
import { GameCard } from "@/components/game/GameCard";
import { Skeleton } from "@/components/ui/skeleton";
import type { RomData, GameData } from "@shared/schema";

export default function Home() {
  const { data: romData, isLoading } = useQuery<RomData>({
    queryKey: ["/api/rom-data"],
  });

  const { data: popularGames, isLoading: isLoadingPopular } = useQuery<GameData[]>({
    queryKey: ["/api/popular"],
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="hero-gradient rounded-2xl p-12 text-center text-white mb-12">
          <Skeleton className="h-16 w-96 mx-auto mb-4 bg-white/20" />
          <Skeleton className="h-8 w-full max-w-3xl mx-auto mb-8 bg-white/20" />
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Skeleton className="h-12 w-48 bg-white/20" />
            <Skeleton className="h-12 w-48 bg-white/20" />
          </div>
        </div>
      </div>
    );
  }

  if (!romData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">No ROM data available</h1>
          <p className="text-muted-foreground">Please check if the games.json file exists and contains valid data.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      {/* Hero Section */}
      <section className="hero-gradient rounded-2xl p-12 text-center text-white">
        <h1 className="text-4xl md:text-6xl font-bold mb-4" data-testid="text-hero-title">
          Classic Gaming Archive
        </h1>
        <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto" data-testid="text-hero-description">
          Discover thousands of classic video games from your favorite retro consoles. 
          Relive the golden age of gaming with our comprehensive ROM collection.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/categories">
            <button 
              className="px-8 py-3 bg-white text-primary font-semibold rounded-lg hover:bg-white/90 transition-colors"
              data-testid="button-browse-categories"
            >
              Browse Categories
            </button>
          </Link>
          <Link to="/popular">
            <button 
              className="px-8 py-3 border border-white/30 text-white font-semibold rounded-lg hover:bg-white/10 transition-colors"
              data-testid="button-popular-games"
            >
              Popular Games
            </button>
          </Link>
        </div>
      </section>

      {/* Stats Section */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-card border border-border rounded-lg p-6 text-center">
          <div className="text-3xl font-bold text-primary mb-2" data-testid="text-stat-total-games">
            {romData.stats.totalGames.toLocaleString()}
          </div>
          <div className="text-muted-foreground">Total Games</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-6 text-center">
          <div className="text-3xl font-bold text-primary mb-2" data-testid="text-stat-platforms">
            {romData.stats.totalCategories}
          </div>
          <div className="text-muted-foreground">Platforms</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-6 text-center">
          <div className="text-3xl font-bold text-primary mb-2" data-testid="text-stat-downloads">
            {romData.stats.totalDownloads}
          </div>
          <div className="text-muted-foreground">Downloads</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-6 text-center">
          <div className="text-3xl font-bold text-primary mb-2" data-testid="text-stat-active-users">
            {romData.stats.activeUsers}
          </div>
          <div className="text-muted-foreground">Active Users</div>
        </div>
      </section>

      {/* Categories Grid */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold" data-testid="text-browse-platforms">Browse by Platform</h2>
          <Link to="/categories" className="text-primary hover:underline" data-testid="link-view-all-categories">
            View All →
          </Link>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {romData.categories.map(category => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </section>

      {/* Popular Games Section */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold" data-testid="text-popular-week">Popular This Week</h2>
          <Link to="/popular" className="text-primary hover:underline" data-testid="link-view-all-popular">
            View All →
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoadingPopular ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="loading-skeleton rounded-lg h-80" />
            ))
          ) : popularGames && popularGames.length > 0 ? (
            popularGames.map((game) => (
              <GameCard key={game.id} game={game} />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">No popular games available at the moment.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
