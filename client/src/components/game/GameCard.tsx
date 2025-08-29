import { Link } from "wouter";
import type { GameData } from "@shared/schema";

interface GameCardProps {
  game: GameData;
}

export function GameCard({ game }: GameCardProps) {
  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    return (
      <span className="star-rating">
        {"★".repeat(fullStars)}
        {hasHalfStar && "☆"}
        {"☆".repeat(emptyStars)}
      </span>
    );
  };

  const formatDownloads = (downloads: number) => {
    if (downloads >= 1000) {
      return `${(downloads / 1000).toFixed(1)}K`;
    }
    return downloads.toString();
  };

  return (
    <div 
      className="game-card group bg-card border border-border rounded-lg overflow-hidden"
      data-testid={`card-game-${game.id}`}
    >
      <Link to={`/roms/${game.categoryId}-roms/${game.id}`}>
        <img 
          src={game.image}
          alt={`${game.title} game cover`}
          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </Link>
      <div className="p-4">
        <Link to={`/roms/${game.categoryId}-roms/${game.id}`}>
          <h3 className="font-semibold text-lg mb-2 hover:text-primary transition-colors cursor-pointer" data-testid={`text-game-title-${game.id}`}>
            {game.title}
          </h3>
        </Link>
        <p className="text-muted-foreground text-sm mb-2" data-testid={`text-game-platform-${game.id}`}>
          {game.platform}
        </p>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-1">
            {renderStars(game.rating)}
            <span className="text-sm text-muted-foreground" data-testid={`text-game-rating-${game.id}`}>
              {game.rating}
            </span>
          </div>
          <span className="text-sm text-muted-foreground" data-testid={`text-game-downloads-${game.id}`}>
            {formatDownloads(game.downloads)} downloads
          </span>
        </div>
      </div>
    </div>
  );
}
