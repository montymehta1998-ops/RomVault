import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { ArrowLeft, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { GameData } from "@shared/schema";

export default function GameDetail() {
  const [match, params] = useRoute("/game/:id");
  
  const { data: game, isLoading } = useQuery<GameData>({
    queryKey: ["/api/games", params?.id],
    enabled: !!params?.id,
  });

  if (!match || !params?.id) {
    return <div>Game not found</div>;
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center space-x-4 mb-8">
          <Skeleton className="h-10 w-10" />
          <div className="space-y-2">
            <Skeleton className="h-10 w-96" />
            <Skeleton className="h-6 w-64" />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <Skeleton className="w-full aspect-[3/4] rounded-lg mb-4" />
            <Skeleton className="w-full h-64 rounded-lg" />
          </div>
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="w-full h-48 rounded-lg" />
            <Skeleton className="w-full h-64 rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Game not found</h1>
          <p className="text-muted-foreground mb-4">The requested game could not be found.</p>
          <Link to="/">
            <Button data-testid="button-back-home">Return Home</Button>
          </Link>
        </div>
      </div>
    );
  }

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

  const handleDownload = () => {
    if (game.downloadUrl) {
      window.open(game.downloadUrl, '_blank');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Game Header */}
      <div className="flex items-center space-x-4 mb-8">
        <Link to={`/category/${game.categoryId}`}>
          <Button 
            variant="secondary" 
            size="sm"
            className="p-2"
            data-testid="button-back-category"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-4xl font-bold" data-testid="text-game-title">
            {game.title}
          </h1>
          <p className="text-muted-foreground mt-2" data-testid="text-game-meta">
            <span>{game.platform}</span> • 
            <span> {game.year}</span> • 
            <span> {game.region}</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Game Image and Downloads */}
        <div className="lg:col-span-1">
          <img 
            src={game.image}
            alt={`${game.title} gameplay screenshot`}
            className="w-full rounded-lg shadow-lg mb-4"
          />
          
          {/* Download Section */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4" data-testid="text-download-info">
                Download Information
              </h3>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">File Name:</span>
                  <span data-testid="text-file-name">{game.fileName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">File Size:</span>
                  <span data-testid="text-file-size">{game.size}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Downloads:</span>
                  <span data-testid="text-download-count">{game.downloads.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Console:</span>
                  <span data-testid="text-console">{game.console}</span>
                </div>
              </div>
              <Button 
                onClick={handleDownload}
                className="w-full font-semibold"
                data-testid="button-download-rom"
              >
                <Download className="mr-2 h-4 w-4" />
                Download ROM
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Game Details */}
        <div className="lg:col-span-2">
          {/* Rating and Stats */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{renderStars(game.rating)}</span>
                    <span className="text-2xl font-bold" data-testid="text-rating-value">
                      {game.rating}
                    </span>
                  </div>
                  <div className="text-muted-foreground" data-testid="text-review-count">
                    Based on {game.reviewCount.toLocaleString()} reviews
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary" data-testid="text-total-downloads">
                    {(game.downloads / 1000).toFixed(1)}K
                  </div>
                  <div className="text-muted-foreground">Downloads</div>
                </div>
              </div>
              
              {/* Rating Breakdown */}
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map(star => {
                  // Simple distribution calculation based on rating
                  const percentage = star === Math.floor(game.rating) ? 
                    (game.rating >= 4.5 ? 78 : 65) : 
                    (star > game.rating ? Math.max(0, 15 - (star - game.rating) * 10) : 5);
                  
                  return (
                    <div key={star} className="flex items-center space-x-2">
                      <span className="text-sm w-8">{star}★</span>
                      <div className="flex-1 bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full" 
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-muted-foreground w-12">{percentage}%</span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Game Description */}
          {game.description && (
            <Card className="mb-6">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4" data-testid="text-about-game">
                  About This Game
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4" data-testid="text-game-description">
                  {game.description}
                </p>
                {game.longDescription && (
                  <p className="text-muted-foreground leading-relaxed" data-testid="text-game-long-description">
                    {game.longDescription}
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Technical Information */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4" data-testid="text-technical-specs">
                Technical Specifications
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-muted-foreground text-sm">Platform</div>
                  <div className="font-semibold" data-testid="text-spec-platform">{game.platform}</div>
                </div>
                <div>
                  <div className="text-muted-foreground text-sm">Console</div>
                  <div className="font-semibold" data-testid="text-spec-console">{game.console}</div>
                </div>
                <div>
                  <div className="text-muted-foreground text-sm">Category</div>
                  <div className="font-semibold" data-testid="text-spec-category">{game.category}</div>
                </div>
                <div>
                  <div className="text-muted-foreground text-sm">Region</div>
                  <div className="font-semibold" data-testid="text-spec-region">{game.region}</div>
                </div>
                <div>
                  <div className="text-muted-foreground text-sm">Release Year</div>
                  <div className="font-semibold" data-testid="text-spec-year">{game.year}</div>
                </div>
                <div>
                  <div className="text-muted-foreground text-sm">File Format</div>
                  <div className="font-semibold" data-testid="text-spec-format">
                    {game.fileName.split('.').pop()?.toUpperCase()}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
