import { Link } from "wouter";
import type { GameData } from "@shared/schema";

interface GameCardProps {
  game: GameData;
  showViewDetails?: boolean;
}

export function GameCard({ game, showViewDetails = true }: GameCardProps) {
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
      <Link to={`/game/${game.id}`}>
        <img 
          src={game.image}
          alt={`${game.title} game cover`}
          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </Link>
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2" data-testid={`text-game-title-${game.id}`}>
          {game.title}
        </h3>
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
        {game.year && (
          <div className="text-xs text-muted-foreground mb-3">
            <div>Released: <span data-testid={`text-game-year-${game.id}`}>{game.year}</span></div>
            <div>Size: <span data-testid={`text-game-size-${game.id}`}>{game.size}</span></div>
          </div>
        )}
        {showViewDetails && (
          <Link to={`/game/${game.id}`}>
            <button 
              className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              data-testid={`button-view-details-${game.id}`}
            >
              View Details
            </button>
          </Link>
        )}
      </div>
    </div>
  );
}
