import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { ArrowLeft, Download, Shield, AlertTriangle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import type { GameData } from "@shared/schema";

export default function RomDownload() {
  const [match, params] = useRoute("/roms/:console/:slug/download");
  const [countdown, setCountdown] = useState(5);
  const [showDownload, setShowDownload] = useState(false);
  
  const { data: game, isLoading } = useQuery<GameData>({
    queryKey: ["/api/roms", params?.console, params?.slug],
    enabled: !!(params?.console && params?.slug),
    queryFn: async () => {
      const response = await fetch(`/api/roms/${params?.console}/${params?.slug}`);
      if (!response.ok) throw new Error('Failed to fetch ROM');
      return response.json();
    },
  });

  useEffect(() => {
    // Set page title for SEO
    if (game) {
      document.title = `${game.title} Download - ${game.platform} Roms - EmulatorGames.Net`;
      
      // Set meta description
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', 
          `Download ${game.title} ROM for ${game.platform} console. This ${game.region} version game offers ${game.category.toLowerCase()} gameplay. Free download with over ${(game.downloads / 1000).toFixed(0)}K downloads. Compatible with ${game.platform} emulators.`
        );
      }
    }
  }, [game]);

  // Countdown timer effect
  useEffect(() => {
    if (game && !showDownload && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      setShowDownload(true);
    }
  }, [game, countdown, showDownload]);

  if (!match || !params?.console || !params?.slug) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Download not found</h1>
          <p className="text-muted-foreground mb-4">The requested download could not be found.</p>
          <Link to="/roms">
            <Button data-testid="button-back-roms">Browse ROMs</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Always show the layout structure immediately

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

  const handleDirectDownload = () => {
    if (game.downloadUrl) {
      // Open download URL in new tab
      window.open(game.downloadUrl, '_blank');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Link to={params ? `/roms/${params.console}/${params.slug}` : '/roms'}>
            <Button 
              variant="secondary" 
              size="sm"
              className="p-2"
              data-testid="button-back-rom-detail"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            {game ? (
              <>
                <h1 className="text-3xl font-bold" data-testid="text-download-title">
                  Download {game.title}
                </h1>
                <p className="text-muted-foreground mt-2" data-testid="text-download-meta">
                  {game.platform} • {game.size}
                </p>
              </>
            ) : (
              <>
                <Skeleton className="h-9 w-80 mb-2" />
                <Skeleton className="h-5 w-40" />
              </>
            )}
          </div>
        </div>


        {/* Download Card */}
        <Card>
          <CardContent className="space-y-6">
            {game ? (
              <>
                {/* Timer Section (appears first when countdown is active) */}
                {!showDownload && (
                  <div className="text-center py-8">
                    <Clock className="h-12 w-12 text-primary mx-auto mb-4" />
                    <div className="text-2xl font-bold text-primary mb-2" data-testid="text-countdown">
                      {countdown}
                    </div>
                    <p className="text-muted-foreground">
                      Preparing your download... Please wait {countdown} second{countdown !== 1 ? 's' : ''}
                    </p>
                    <div className="w-full bg-muted rounded-full h-2 mt-4">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-1000"
                        style={{ width: `${((5 - countdown) / 5) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Game Info */}
                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">File:</span> 
                      <span className="font-medium ml-2" data-testid="text-download-filename">
                        {game.fileName}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Size:</span> 
                      <span className="font-medium ml-2" data-testid="text-download-size">
                        {game.size}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Console:</span> 
                      <span className="font-medium ml-2" data-testid="text-download-console">
                        {game.console}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Rating:</span> 
                      <span className="font-medium ml-2" data-testid="text-download-rating">
                        {game.rating}/5 ⭐
                      </span>
                    </div>
                  </div>
                </div>

                {/* Download Section (appears when countdown is done) */}
                {showDownload && (
                  <div className="text-center space-y-4">
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                      <Download className="h-10 w-10 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold" data-testid="text-ready-download">
                        Ready to Download
                      </h3>
                      <p className="text-muted-foreground mt-2">
                        Your download will begin automatically when you click the button below
                      </p>
                    </div>
                    <Button 
                      onClick={handleDirectDownload}
                      className="w-full py-4 text-lg font-semibold"
                      size="lg"
                      data-testid="button-start-download"
                    >
                      <Download className="mr-3 h-5 w-5" />
                      Start Download
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <>
                {/* Loading skeleton for download card */}
                <div className="text-center py-8">
                  <Skeleton className="h-12 w-12 rounded-full mx-auto mb-4" />
                  <Skeleton className="h-8 w-32 mx-auto mb-2" />
                  <Skeleton className="h-4 w-64 mx-auto mb-4" />
                  <Skeleton className="h-2 w-full" />
                </div>
                
                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i}>
                        <Skeleton className="h-4 w-12 mb-1" />
                        <Skeleton className="h-4 w-20" />
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Security Notice */}
            <div className="flex items-start space-x-3 p-4 bg-primary/5 rounded-lg">
              <Shield className="h-5 w-5 text-primary mt-0.5" />
              <div className="text-sm">
                <div className="font-medium mb-1">Safe Download</div>
                <div className="text-muted-foreground">
                  All files are scanned for viruses and verified for authenticity. 
                  Download safely from our secure servers.
                </div>
              </div>
            </div>

            {/* Back to Browse */}
            <div className="text-center pt-4">
              <Link to="/roms">
                <Button variant="outline" data-testid="button-browse-more-roms">
                  Browse More ROMs
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}