import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { ArrowLeft, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
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

  const getGameDescription = (game: GameData): string => {
    // If we have a description, use it
    if (game.description) {
      return game.description;
    }

    // Generate a description based on the game's properties
    const platformDescriptions: Record<string, string> = {
      'Nintendo Entertainment System': 'classic 8-bit Nintendo console',
      'Super Nintendo Entertainment System': 'legendary 16-bit Super Nintendo system',
      'Game Boy': 'iconic portable handheld gaming device',
      'Game Boy Color': 'enhanced portable color handheld system',
      'Game Boy Advance': 'advanced 32-bit portable gaming console',
      'Nintendo 64': 'revolutionary 64-bit 3D gaming platform',
      'GameCube': 'compact cube-shaped Nintendo console',
      'Nintendo DS': 'dual-screen portable gaming system',
      'Nintendo Wii': 'motion-controlled gaming console',
      'PlayStation': 'groundbreaking 32-bit gaming console',
      'PlayStation 2': 'best-selling video game console of all time',
      'PlayStation Portable': 'advanced portable multimedia device',
      'Sega Genesis': 'classic 16-bit Sega gaming console',
      'Sega Master System': 'classic 8-bit Sega gaming system',
      'Sega Game Gear': 'portable color handheld gaming device',
      'Atari 2600': 'legendary vintage gaming console',
      'Arcade (MAME)': 'classic arcade gaming experience'
    };

    const categoryDescriptions: Record<string, string> = {
      'Action': 'fast-paced action gameplay',
      'Adventure': 'immersive adventure experience',
      'Puzzle': 'challenging puzzle mechanics',
      'RPG': 'rich role-playing adventure',
      'Sports': 'exciting sports simulation',
      'Racing': 'thrilling racing action',
      'Fighting': 'intense combat gameplay',
      'Shooter': 'action-packed shooting gameplay',
      'Platform': 'classic platforming adventure',
      'Other': 'unique gaming experience'
    };

    const platformDesc = platformDescriptions[game.platform] || 'retro gaming platform';
    const categoryDesc = categoryDescriptions[game.category] || 'gaming experience';
    
    const baseDescription = `Experience "${game.title}" on the ${platformDesc}. This ${game.category.toLowerCase()} title offers ${categoryDesc} that defined gaming in ${game.year}.`;
    
    const additionalInfo = game.downloads > 100000 
      ? ` With over ${(game.downloads / 1000).toFixed(0)}K downloads, this is a highly popular classic that continues to captivate retro gaming enthusiasts.`
      : ` Join thousands of retro gaming fans who have already discovered this ${game.region} classic.`;
    
    const compatibilityInfo = ` The ROM file is compatible with ${game.platform} emulators and provides an authentic gaming experience true to the original ${game.year} release.`;
    
    return baseDescription + additionalInfo + compatibilityInfo;
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Breadcrumb Navigation */}
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/" data-testid="link-breadcrumb-home">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/roms" data-testid="link-breadcrumb-roms">ROMs</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to={`/roms/${game.categoryId}-roms`} data-testid="link-breadcrumb-platform">{game.platform}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage data-testid="text-breadcrumb-current">{game.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* ROM Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold" data-testid="text-rom-title">
          {game.title}
        </h1>
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

          {/* Game Information */}
          <Card>
            <CardHeader>
              <CardTitle data-testid="text-game-info">Game Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-3">
                  <div>
                    <div className="text-sm text-muted-foreground">Platform</div>
                    <div className="font-semibold" data-testid="text-spec-platform">{game.platform}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Category</div>
                    <div className="font-semibold" data-testid="text-spec-category">{game.category}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">File Format</div>
                    <div className="font-semibold" data-testid="text-spec-format">
                      {game.fileName.split('.').pop()?.toUpperCase()}
                    </div>
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
                    <div className="text-sm text-muted-foreground">Total Downloads</div>
                    <div className="font-semibold" data-testid="text-spec-downloads">{game.downloads.toLocaleString()}</div>
                  </div>
                </div>
              </div>
              
              {/* Game Description */}
              <div className="mt-6 pt-6 border-t">
                <h4 className="text-lg font-semibold mb-3" data-testid="text-game-description-title">About This Game</h4>
                <div className="text-muted-foreground leading-relaxed" data-testid="text-game-description">
                  {getGameDescription(game)}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}