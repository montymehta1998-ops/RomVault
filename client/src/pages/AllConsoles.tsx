import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface Console {
  id: string;
  name: string;
  description: string;
  gameCount: number;
  image: string;
  popularity: number;
}

export default function AllConsoles() {
  const { data: romData, isLoading } = useQuery({
    queryKey: ['/api/rom-data'],
    queryFn: async () => {
      const response = await fetch('/api/rom-data');
      if (!response.ok) throw new Error('Failed to fetch ROM data');
      return response.json();
    },
  });

  // Sort consoles by popularity (most downloaded games)
  const sortedConsoles = romData?.categories?.sort((a: Console, b: Console) => b.gameCount - a.gameCount) || [];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4" data-testid="text-page-title">
          All Console
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto" data-testid="text-page-description">
          Browse and download ROMs from all gaming consoles. Discover classic games from Nintendo, PlayStation, Sega, and many more platforms organized by most downloaded games.
        </p>
      </div>

      {/* Consoles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {isLoading ? (
          Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="loading-skeleton rounded-lg h-48" />
          ))
        ) : (
          sortedConsoles.map((console: Console) => (
            <Link
              key={console.id}
              to={`/roms/${console.id}`}
              data-testid={`link-console-${console.id}`}
            >
              <Card className="hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group">
                <CardContent className="p-6 text-center">
                  <div className="mb-4 flex justify-center">
                    <img
                      src={console.image || '/api/placeholder/80/80'}
                      alt={`${console.name} console`}
                      className="w-20 h-20 object-contain group-hover:scale-110 transition-transform duration-300"
                      data-testid={`img-console-${console.id}`}
                    />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors" data-testid={`text-console-name-${console.id}`}>
                    {console.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2" data-testid={`text-console-description-${console.id}`}>
                    {console.description}
                  </p>
                  <div className="text-xs font-medium text-primary" data-testid={`text-console-count-${console.id}`}>
                    {console.gameCount.toLocaleString()} games
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))
        )}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6 text-center">
                <Skeleton className="w-20 h-20 mx-auto mb-4 rounded" />
                <Skeleton className="h-6 w-3/4 mx-auto mb-2" />
                <Skeleton className="h-4 w-full mb-3" />
                <Skeleton className="h-4 w-1/2 mx-auto" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}