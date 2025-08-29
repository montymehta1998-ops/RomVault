import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { ArrowLeft, Download, Shield, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import type { GameData } from "@shared/schema";

export default function RomDownload() {
  const [match, params] = useRoute("/roms/:console/:slug/download");
  
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
      document.title = `Download ${game.title} ROM - RetroROMs Archive`;
    }
  }, [game]);

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

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="flex items-center space-x-4 mb-8">
            <Skeleton className="h-10 w-10" />
            <div className="space-y-2">
              <Skeleton className="h-10 w-96" />
              <Skeleton className="h-6 w-64" />
            </div>
          </div>
          <Skeleton className="w-full h-96 rounded-lg" />
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
          <Link to={`/roms/${params.console}/${params.slug}`}>
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
            <h1 className="text-3xl font-bold" data-testid="text-download-title">
              Download {game.title}
            </h1>
            <p className="text-muted-foreground mt-2" data-testid="text-download-meta">
              {game.platform} • {game.size}
            </p>
          </div>
        </div>

        {/* Download Warning */}
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Important:</strong> Make sure you own a legal copy of this game before downloading. 
            ROMs are provided for backup and preservation purposes only.
          </AlertDescription>
        </Alert>

        {/* Download Card */}
        <Card>
          <CardHeader className="text-center">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Download className="h-10 w-10 text-primary" />
            </div>
            <CardTitle className="text-2xl" data-testid="text-ready-download">
              Ready to Download
            </CardTitle>
            <p className="text-muted-foreground">
              Your download will begin automatically when you click the button below
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
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

            {/* Download Button */}
            <Button 
              onClick={handleDirectDownload}
              className="w-full py-4 text-lg font-semibold"
              size="lg"
              data-testid="button-start-download"
            >
              <Download className="mr-3 h-5 w-5" />
              Start Download
            </Button>

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