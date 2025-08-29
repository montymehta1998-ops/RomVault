import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import { GameCard } from "@/components/game/GameCard";
import { SearchBar } from "@/components/game/SearchBar";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import type { CategoryData, GameData } from "@shared/schema";

export default function Category() {
  const [match, params] = useRoute("/category/:id");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"downloads" | "rating" | "year" | "title">("downloads");
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 20;

  const { data: category } = useQuery<CategoryData>({
    queryKey: ["/api/categories", params?.id],
    enabled: !!params?.id,
  });

  const { data: gamesData, isLoading } = useQuery<{ games: GameData[]; total: number }>({
    queryKey: ["/api/games", params?.id, search, sortBy, currentPage, limit],
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      if (params?.id) queryParams.append('categoryId', params.id);
      if (search) queryParams.append('search', search);
      queryParams.append('sortBy', sortBy);
      queryParams.append('page', currentPage.toString());
      queryParams.append('limit', limit.toString());
      
      const response = await fetch(`/api/games?${queryParams.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch games');
      return response.json();
    },
    enabled: !!params?.id,
  });

  // Reset page when search or sort changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search, sortBy]);

  if (!match || !params?.id) {
    return <div>Category not found</div>;
  }

  const totalPages = gamesData ? Math.ceil(gamesData.total / limit) : 0;
  const startIndex = (currentPage - 1) * limit + 1;
  const endIndex = Math.min(startIndex + limit - 1, gamesData?.total || 0);

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Category Header */}
      <div className="flex items-center space-x-4 mb-8">
        <Link to="/">
          <Button 
            variant="secondary" 
            size="sm"
            className="p-2"
            data-testid="button-back-home"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-4xl font-bold" data-testid="text-category-name">
            {category?.name || "Loading..."}
          </h1>
          <p className="text-muted-foreground mt-2" data-testid="text-category-description">
            {category?.description} {category && `- ${category.gameCount.toLocaleString()} games available`}
          </p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1">
          <SearchBar 
            onSearch={setSearch}
            placeholder="Search games in this category..."
            className="w-full"
          />
        </div>
        <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
          <SelectTrigger className="w-48" data-testid="select-sort-by">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="downloads">Sort by Downloads</SelectItem>
            <SelectItem value="rating">Sort by Rating</SelectItem>
            <SelectItem value="year">Sort by Year</SelectItem>
            <SelectItem value="title">Sort by Title</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Games Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="loading-skeleton rounded-lg h-80" />
          ))
        ) : gamesData && gamesData.games.length > 0 ? (
          gamesData.games.map(game => (
            <GameCard key={game.id} game={game} />
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-muted-foreground" data-testid="text-no-games">
              {search ? `No games found matching "${search}"` : "No games found in this category"}
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {gamesData && gamesData.total > limit && (
        <div className="flex items-center justify-between mt-12">
          <div className="text-muted-foreground" data-testid="text-pagination-info">
            Showing {startIndex}-{endIndex} of {gamesData.total.toLocaleString()} games
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              data-testid="button-pagination-prev"
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
                  data-testid={`button-pagination-${pageNum}`}
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
              data-testid="button-pagination-next"
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
