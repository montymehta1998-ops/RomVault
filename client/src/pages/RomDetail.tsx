import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { ArrowLeft, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { GameData } from "@shared/schema";

export default function RomDetail() {
  const [match, params] = useRoute("/roms/:console/:slug");
  
  const { data: game, isLoading } = useQuery<GameData>({
    queryKey: ["/api/roms", params?.console, params?.slug],
    enabled: !!(params?.console && params?.slug),
    queryFn: async () => {
      const response = await fetch(`/api/roms/${params?.console}/${params?.slug}`);
      if (!response.ok) throw new Error('Failed to fetch ROM');
      return response.json();
    },
  });

  if (!match || !params?.console || !params?.slug) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">ROM not found</h1>
          <p className="text-muted-foreground mb-4">The requested ROM could not be found.</p>
          <Link to="/roms">
            <Button data-testid="button-back-roms">Browse ROMs</Button>
          </Link>
        </div>
      </div>
    );
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
          <h1 className="text-2xl font-bold mb-4">ROM not found</h1>
          <p className="text-muted-foreground mb-4">The requested ROM could not be found.</p>
          <Link to="/roms">
            <Button data-testid="button-back-roms">Browse ROMs</Button>
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
      <span className="star-rating text-2xl">
        {"★".repeat(fullStars)}
        {hasHalfStar && "☆"}
        {"☆".repeat(emptyStars)}
      </span>
    );
  };

  const handleDownload = () => {
    if (game.downloadUrl) {
      // Open download page in same tab
      window.location.href = `/roms/${params.console}/${params.slug}/download`;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* ROM Header */}
      <div className="flex items-center space-x-4 mb-8">
        <Link to="/roms">
          <Button 
            variant="secondary" 
            size="sm"
            className="p-2"
            data-testid="button-back-roms"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-4xl font-bold" data-testid="text-rom-title">
            {game.title}
          </h1>
          <p className="text-muted-foreground mt-2" data-testid="text-rom-meta">
            <span>{game.platform}</span> • 
            <span> {game.year}</span> • 
            <span> {game.region}</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ROM Image and Download */}
        <div className="lg:col-span-1">
          <img 
            src={game.image}
            alt={`${game.title} game cover`}
            className="w-full rounded-lg shadow-lg mb-4"
            data-testid="img-rom-cover"
          />
          
          {/* Download Section */}
          <Card>
            <CardHeader>
              <CardTitle data-testid="text-download-info">Download Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 mb-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-muted-foreground">File Name</div>
                    <div className="font-medium text-sm" data-testid="text-file-name">{game.fileName}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">File Size</div>
                    <div className="font-medium text-sm" data-testid="text-file-size">{game.size}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Console</div>
                    <div className="font-medium text-sm" data-testid="text-console">{game.console}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Region</div>
                    <div className="font-medium text-sm" data-testid="text-region">{game.region}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Category</div>
                    <div className="font-medium text-sm" data-testid="text-category">{game.category}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Downloads</div>
                    <div className="font-medium text-sm" data-testid="text-download-count">
                      {game.downloads.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
              <Button 
                onClick={handleDownload}
                className="w-full font-semibold"
                size="lg"
                data-testid="button-download-now"
              >
                <Download className="mr-2 h-4 w-4" />
                Download Now
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* ROM Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Rating Card */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    {renderStars(game.rating)}
                    <span className="text-2xl font-bold" data-testid="text-rating-value">
                      {game.rating}
                    </span>
                  </div>
                  <div className="text-muted-foreground" data-testid="text-review-count">
                    {game.reviewCount.toLocaleString()} reviews
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary" data-testid="text-total-downloads">
                    {game.downloads >= 1000 ? `${(game.downloads / 1000).toFixed(1)}K` : game.downloads}
                  </div>
                  <div className="text-muted-foreground">Downloads</div>
                </div>
              </div>
              
            </CardContent>
          </Card>

          {/* Game Description */}
          {game.description && (
            <Card>
              <CardHeader>
                <CardTitle data-testid="text-about-rom">About This ROM</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed mb-4" data-testid="text-rom-description">
                  {game.description}
                </p>
                {game.longDescription && (
                  <p className="text-muted-foreground leading-relaxed" data-testid="text-rom-long-description">
                    {game.longDescription}
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Technical Specifications */}
          <Card>
            <CardHeader>
              <CardTitle data-testid="text-technical-specs">Technical Specifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div>
                    <div className="text-sm text-muted-foreground">Platform</div>
                    <div className="font-semibold" data-testid="text-spec-platform">{game.platform}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Console</div>
                    <div className="font-semibold" data-testid="text-spec-console">{game.console}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Category</div>
                    <div className="font-semibold" data-testid="text-spec-category">{game.category}</div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="text-sm text-muted-foreground">Region</div>
                    <div className="font-semibold" data-testid="text-spec-region">{game.region}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Release Year</div>
                    <div className="font-semibold" data-testid="text-spec-year">{game.year}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">File Format</div>
                    <div className="font-semibold" data-testid="text-spec-format">
                      {game.fileName.split('.').pop()?.toUpperCase()}
                    </div>
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