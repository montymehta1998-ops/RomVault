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

  // Reset state when navigating to different console or clearing filters
  useEffect(() => {
    if (!params?.console) {
      setSelectedConsole('');
      setSelectedCategory('');
      setCurrentPage(1);
    }
  }, [params?.console, location]);

  // Update selectedConsole when URL changes
  useEffect(() => {
    if (params?.console) {
      // Remove -roms suffix and convert to proper console name
      let consoleName = params.console;
      if (consoleName.endsWith('-roms')) {
        consoleName = consoleName.slice(0, -5);
      }
      
      // Convert hyphenated console name to actual console names used in the API
      // This maps from URL format (capcom-play-system-1) to API format (CPS 1)
      const consoleNameMapping: Record<string, string> = {
        'capcom-play-system-1': 'CPS 1',
        'capcom-play-system-2': 'CPS 2', 
        'capcom-play-system-3': 'CPS 3',
        'cps1': 'CPS 1',
        'cps2': 'CPS 2',
        'cps3': 'CPS 3',
        'acorn-archimedes': 'Acorn Archimedes',
        'acorn-atom': 'Acorn Atom',
        'action-max': 'Action Max',
        'apple-2-gs': 'Apple II GS',
        'apple-ii-gs': 'Apple II GS',
        'apple-2': 'Apple II',
        'apple-ii': 'Apple II',
        'amstrad-cpc': 'Amstrad CPC',
        'amstrad-gx4000': 'GX4000',
        'atari-2600': 'Atari 2600',
        'atari-5200': 'Atari 5200',
        'atari-7800': 'Atari 7800',
        'atari-8-bit': 'Atari 800',
        'atari-800': 'Atari 800',
        'atari-jaguar': 'Atari Jaguar',
        'atari-lynx': 'Atari Lynx',
        'atari-st': 'Atari ST',
        'bally-astrocade': 'Bally Arcade',
        'bbc-micro': 'BBC Micro',
        'cd-i': 'CD-i',
        'commodore-64-preservation': 'C64 Preservation',
        'commodore-64-tapes': 'C64 Tapes',
        'commodore-vic-20': 'Commodore VIC-20',
        'gameboy-color': 'GBC',
        'game-boy-color': 'GBC',
        'gameboy': 'GB',
        'game-boy': 'GB',
        'game-boy-advance': 'GBA',
        'gba': 'GBA',
        'gamecube': 'GameCube',
        'game-gear': 'Game Gear',
        'sega-game-gear': 'Game Gear',
        'gce-vectrex': 'Vectrex',
        'vectrex': 'Vectrex',
        'magnavox-odyssey-2': 'Magnavox Odyssey 2',
        'msx-2': 'MSX2',
        'msx2': 'MSX2',
        'msx': 'MSX',
        'n-gage': 'N-Gage',
        'neo-geo-pocket': 'NGP',
        'neo-geo': 'Neo Geo',
        'nintendo-64': 'N64',
        'n64': 'N64',
        'nintendo-ds': 'NDS',
        'nds': 'NDS',
        'nintendo-wii': 'Wii',
        'wii': 'Wii',
        'nintendo-wii-u': 'Wii U',
        'wii-u': 'Wii U',
        'nintendo-switch': 'Switch',
        'switch': 'Switch',
        'nes': 'NES',
        'nintendo-entertainment-system': 'NES',
        'snes': 'SNES',
        'super-nintendo': 'SNES',
        'famicom': 'Famicom',
        'pc-fx': 'PC-FX',
        'playstation': 'PSX',
        'playstation-1': 'PSX',
        'psx': 'PSX',
        'playstation-2': 'PS2',
        'ps2': 'PS2',
        'playstation-3': 'PS3', 
        'ps3': 'PS3',
        'playstation-4': 'PS4',
        'ps4': 'PS4',
        'playstation-portable': 'PSP',
        'psp': 'PSP',
        'playstation-vita': 'PS Vita',
        'ps-vita': 'PS Vita',
        'pokemon-mini': 'Pokemon Mini',
        'sam-coupe': 'SAM Coupe',
        'sega-32x': '32X',
        '32x': '32X',
        'sega-cd': 'Sega CD',
        'sega-dreamcast': 'Dreamcast',
        'dreamcast': 'Dreamcast',
        'sega-genesis': 'Genesis',
        'genesis': 'Genesis',
        'sega-master-system': 'Master System',
        'master-system': 'Master System',
        'sega-saturn': 'Saturn',
        'saturn': 'Saturn',
        'sg-1000': 'SG-1000',
        'super-cassette-vision': 'Super Cassette Vision',
        'tandy-trs-80': 'TRS-80',
        'trs-80': 'TRS-80',
        'tatung-einstein': 'Tatung Einstein',
        'tiger-game-com': 'Game com',
        'game-com': 'Game com',
        'trs-80-color-computer': 'TRS-80 Color Computer',
        'turbo-duo': 'TurboGrafx-16',
        'turbografx-16': 'TurboGrafx-16',
        'virtual-boy': 'Virtual Boy',
        'watara-supervision': 'Watara Supervision',
        'wonderswan-color': 'WonderSwan Color',
        'wonderswan': 'WonderSwan',
        'xbox': 'Xbox',
        'xbox-one': 'Xbox One',
        'xbox-360': 'Xbox 360',
        'z-machine': 'Z-Machine',
        'zx-spectrum': 'ZX Spectrum',
        'zx81': 'ZX81',
        '3do': '3DO',
        '3ds': '3DS',
        'dos': 'Dos',
        'mame': 'MAME',
        'scummvm': 'ScummVM'
      };
      
      const mappedConsoleName = consoleNameMapping[consoleName] || 
        consoleName.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
      
      setSelectedConsole(mappedConsoleName);
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
    queryKey: ["/api/roms", selectedConsole, selectedCategory, currentSearch, sortBy, currentPage, limit],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedConsole) params.append('console', selectedConsole);
      if (selectedCategory) params.append('category', selectedCategory);
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

  // Get unique categories from current filtered games (for the current console)
  const { data: allRomsData } = useQuery<{ games: GameData[]; total: number }>({
    queryKey: ["/api/roms", selectedConsole], // Only get games for selected console
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedConsole) params.append('console', selectedConsole);
      
      const response = await fetch(`/api/roms?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch ROMs');
      return response.json();
    },
  });

  const categories = allRomsData ? 
    Array.from(new Set(allRomsData.games.map(game => game.category))).sort() : 
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {!searchMatch && (
          <SearchBar 
            placeholder={selectedConsole ? `Search in ${selectedConsole}...` : "Search ROMs..."}
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
          romsData.games.map((game, index) => (
            <GameCard key={`${game.id}-${game.platform}-${index}`} game={game} />
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