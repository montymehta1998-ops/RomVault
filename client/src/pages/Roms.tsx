import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useRoute, useLocation } from "wouter";
import { GameCard } from "@/components/game/GameCard";
import { SearchBar } from "@/components/game/SearchBar";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import type { GameData } from "@shared/schema";

export default function Roms() {
  const [location] = useLocation();
  const [match, params] = useRoute("/roms/:console?");
  const [searchMatch] = useRoute("/search");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"downloads" | "rating" | "year" | "title">("downloads");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedConsole, setSelectedConsole] = useState<string>(params?.console || "");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const limit = 20;

  // Handle search from URL parameters
  useEffect(() => {
    if (searchMatch) {
      const urlParams = new URLSearchParams(window.location.search);
      const searchQuery = urlParams.get('q') || '';
      setSearch(searchQuery);
      setCurrentPage(1); // Reset page when search changes
    } else {
      setSearch(''); // Clear search when not on search page
    }
  }, [searchMatch, location]); // Add location as dependency to react to URL changes

  // Update selectedConsole when URL changes
  useEffect(() => {
    if (params?.console) {
      setSelectedConsole(params.console.toUpperCase());
    }
  }, [params?.console]);

  const { data: consoles } = useQuery<string[]>({
    queryKey: ["/api/consoles"],
  });

  // Get current search from URL if on search page, otherwise use local search state
  const currentSearch = useMemo(() => {
    if (searchMatch) {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get('q') || '';
    }
    return search;
  }, [searchMatch, location, search]);

  const { data: romsData, isLoading } = useQuery<{ games: GameData[]; total: number }>({
    queryKey: ["/api/roms", selectedConsole, currentSearch, sortBy, currentPage, limit],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedConsole) params.append('console', selectedConsole);
      if (currentSearch) params.append('search', currentSearch);
      params.append('sortBy', sortBy);
      params.append('page', currentPage.toString());
      params.append('limit', limit.toString());
      
      const response = await fetch(`/api/roms?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch ROMs');
      return response.json();
    },
  });

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [currentSearch, sortBy, selectedConsole, selectedCategory]);

  // Scroll to top when page changes (for pagination)
  useEffect(() => {
    if (searchMatch) {
      window.scrollTo(0, 0);
    }
  }, [currentPage, searchMatch]);

  const totalPages = romsData ? Math.ceil(romsData.total / limit) : 0;
  const startIndex = (currentPage - 1) * limit + 1;
  const endIndex = Math.min(startIndex + limit - 1, romsData?.total || 0);

  // Get unique categories from games
  const categories = romsData ? 
    Array.from(new Set(romsData.games.map(game => game.category))).sort() : 
    [];

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Page Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4" data-testid="text-roms-title">
          {searchMatch && currentSearch ? `Search Results for "${currentSearch}"` : "ROMs Archive"}
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto" data-testid="text-roms-description">
          {searchMatch && currentSearch ? 
            `Found ${romsData?.total || 0} games matching "${currentSearch}"` : 
            "Browse our complete collection of retro gaming ROMs. Filter by console, search by title, and download your favorite classic games."
          }
        </p>
      </div>

      {/* Filters and Search */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {!searchMatch && (
          <SearchBar 
            placeholder="Search ROMs..."
            className="w-full"
          />
        )}
        
        <Select value={selectedConsole || "all-consoles"} onValueChange={(value) => setSelectedConsole(value === "all-consoles" ? "" : value)}>
          <SelectTrigger data-testid="select-console-filter">
            <SelectValue placeholder="Filter by Console" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-consoles">All Consoles</SelectItem>
            {consoles?.map(console => (
              <SelectItem key={console} value={console}>
                {console}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedCategory || "all-categories"} onValueChange={(value) => setSelectedCategory(value === "all-categories" ? "" : value)}>
          <SelectTrigger data-testid="select-category-filter">
            <SelectValue placeholder="Filter by Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-categories">All Categories</SelectItem>
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
          romsData.games.map(game => (
            <GameCard key={game.id} game={game} />
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-muted-foreground" data-testid="text-no-roms">
              {currentSearch ? `No ROMs found matching "${currentSearch}"` : "No ROMs found"}
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