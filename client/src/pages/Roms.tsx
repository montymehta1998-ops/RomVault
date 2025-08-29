import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { GameCard } from "@/components/game/GameCard";
import { SearchBar } from "@/components/game/SearchBar";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import type { GameData } from "@shared/schema";

export default function Roms() {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"downloads" | "rating" | "year" | "title">("downloads");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedConsole, setSelectedConsole] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const limit = 20;

  const { data: consoles } = useQuery<string[]>({
    queryKey: ["/api/consoles"],
  });

  const { data: romsData, isLoading } = useQuery<{ games: GameData[]; total: number }>({
    queryKey: ["/api/roms", { 
      console: selectedConsole || undefined,
      search: search || undefined, 
      sortBy, 
      page: currentPage, 
      limit 
    }],
  });

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, sortBy, selectedConsole, selectedCategory]);

  const totalPages = romsData ? Math.ceil(romsData.total / limit) : 0;
  const startIndex = (currentPage - 1) * limit + 1;
  const endIndex = Math.min(startIndex + limit - 1, romsData?.total || 0);

  // Get unique categories from games
  const categories = romsData ? 
    Array.from(new Set(romsData.games.map(game => game.category))).sort() : 
    [];

  const createSlug = (fileName: string) => {
    return fileName
      .toLowerCase()
      .replace(/\.[^/.]+$/, "") // Remove file extension
      .replace(/[^a-z0-9]+/g, "-") // Replace non-alphanumeric with hyphens
      .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Page Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4" data-testid="text-roms-title">
          ROMs Archive
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto" data-testid="text-roms-description">
          Browse our complete collection of retro gaming ROMs. Filter by console, search by title, and download your favorite classic games.
        </p>
      </div>

      {/* Filters and Search */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <SearchBar 
          onSearch={setSearch}
          placeholder="Search ROMs..."
          className="w-full"
        />
        
        <Select value={selectedConsole} onValueChange={setSelectedConsole}>
          <SelectTrigger data-testid="select-console-filter">
            <SelectValue placeholder="Filter by Console" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Consoles</SelectItem>
            {consoles?.map(console => (
              <SelectItem key={console} value={console}>
                {console}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger data-testid="select-category-filter">
            <SelectValue placeholder="Filter by Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Categories</SelectItem>
            {categories.map(category => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
          <SelectTrigger data-testid="select-sort-by">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="downloads">Most Downloaded</SelectItem>
            <SelectItem value="rating">Highest Rated</SelectItem>
            <SelectItem value="year">Newest First</SelectItem>
            <SelectItem value="title">Alphabetical</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Results Summary */}
      {romsData && !isLoading && (
        <div className="flex items-center justify-between mb-6">
          <p className="text-muted-foreground" data-testid="text-results-summary">
            {romsData.total === 0 ? "No ROMs found" : 
             `Showing ${startIndex}-${endIndex} of ${romsData.total.toLocaleString()} ROMs`}
          </p>
        </div>
      )}

      {/* ROMs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="loading-skeleton rounded-lg h-80" />
          ))
        ) : romsData && romsData.games.length > 0 ? (
          romsData.games.map(game => {
            const slug = createSlug(game.fileName);
            return (
              <div 
                key={game.id} 
                className="game-card group bg-card border border-border rounded-lg overflow-hidden"
                data-testid={`card-rom-${game.id}`}
              >
                <Link to={`/roms/${game.console.toLowerCase()}/${slug}`}>
                  <img 
                    src={game.image}
                    alt={`${game.title} game cover`}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </Link>
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2" data-testid={`text-rom-title-${game.id}`}>
                    {game.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-2" data-testid={`text-rom-platform-${game.id}`}>
                    {game.platform}
                  </p>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-1">
                      <span className="star-rating">{"★".repeat(Math.floor(game.rating))}</span>
                      <span className="text-sm text-muted-foreground" data-testid={`text-rom-rating-${game.id}`}>
                        {game.rating}
                      </span>
                    </div>
                    <span className="text-sm text-muted-foreground" data-testid={`text-rom-downloads-${game.id}`}>
                      {game.downloads >= 1000 ? `${(game.downloads / 1000).toFixed(1)}K` : game.downloads} downloads
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground mb-3">
                    <div>Size: <span data-testid={`text-rom-size-${game.id}`}>{game.size}</span></div>
                    <div>Year: <span data-testid={`text-rom-year-${game.id}`}>{game.year}</span></div>
                  </div>
                  <Link to={`/roms/${game.console.toLowerCase()}/${slug}`}>
                    <Button 
                      className="w-full"
                      data-testid={`button-view-rom-${game.id}`}
                    >
                      View Details
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-muted-foreground" data-testid="text-no-roms">
              {search ? `No ROMs found matching "${search}"` : "No ROMs found"}
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {romsData && romsData.total > limit && (
        <div className="flex items-center justify-center space-x-2 mt-12">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            data-testid="button-roms-pagination-prev"
          >
            Previous
          </Button>
          
          {/* Page numbers */}
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum;
            if (totalPages <= 5) {
              pageNum = i + 1;
            } else if (currentPage <= 3) {
              pageNum = i + 1;
            } else if (currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + i;
            } else {
              pageNum = currentPage - 2 + i;
            }

            const isActive = pageNum === currentPage;
            
            return (
              <Button
                key={pageNum}
                variant={isActive ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(pageNum)}
                data-testid={`button-roms-pagination-${pageNum}`}
              >
                {pageNum}
              </Button>
            );
          })}

          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            data-testid="button-roms-pagination-next"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}