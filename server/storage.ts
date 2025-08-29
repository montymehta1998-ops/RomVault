import { type Game, type Category, type RomData, type GameData, type CategoryData } from "@shared/schema";
import fs from "fs/promises";
import path from "path";

export interface IStorage {
  getRomData(): Promise<RomData>;
  getCategories(): Promise<CategoryData[]>;
  getCategory(id: string): Promise<CategoryData | undefined>;
  getGames(params?: {
    categoryId?: string;
    console?: string;
    search?: string;
    sortBy?: 'downloads' | 'rating' | 'year' | 'title';
    page?: number;
    limit?: number;
  }): Promise<{ games: GameData[]; total: number }>;
  getGame(id: string): Promise<GameData | undefined>;
  getGameBySlug(console: string, slug: string): Promise<GameData | undefined>;
  getPopularGames(limit?: number): Promise<GameData[]>;
  getConsoles(): Promise<string[]>;
}

export class MemStorage implements IStorage {
  private romData: RomData | null = null;
  private dataDir: string;

  constructor() {
    this.dataDir = path.resolve(process.cwd(), "data");
  }

  private async loadData(): Promise<RomData> {
    if (!this.romData) {
      try {
        // Get all JSON files in data directory
        const files = await fs.readdir(this.dataDir);
        const jsonFiles = files.filter(file => file.endsWith('_roms.json'));
        
        let allGames: GameData[] = [];
        const categories: CategoryData[] = [];
        const consoleMap = new Map<string, string>();

        // Console name mappings
        const consoleNames: Record<string, string> = {
          '3ds': '3DS',
          'gba': 'Game Boy Advance',
          'psp': 'PlayStation Portable',
          'nds': 'Nintendo DS',
          'n64': 'Nintendo 64',
          'ps2': 'PlayStation 2',
          'ps3': 'PlayStation 3',
          'wii': 'Nintendo Wii',
          'gamecube': 'GameCube',
          'mame': 'Arcade (MAME)'
        };

        // Process each console's ROM file
        for (const file of jsonFiles) {
          const consoleKey = file.replace('_roms.json', '');
          const consoleName = consoleNames[consoleKey] || consoleKey.toUpperCase();
          const filePath = path.join(this.dataDir, file);
          
          try {
            const fileData = await fs.readFile(filePath, "utf-8");
            const games = JSON.parse(fileData) as any[];
            
            // Convert each game to our format
            const convertedGames: GameData[] = games.map((game, index) => {
              const downloads = parseInt(game.downloads) || 0;
              // Generate rating based on downloads (more downloads = better rating)
              let rating = 3.0; // Base rating
              if (downloads > 500000) rating = 4.8 + Math.random() * 0.2;
              else if (downloads > 300000) rating = 4.5 + Math.random() * 0.3;
              else if (downloads > 150000) rating = 4.0 + Math.random() * 0.5;
              else if (downloads > 50000) rating = 3.5 + Math.random() * 0.5;
              else rating = 3.0 + Math.random() * 0.7;
              
              return {
                id: game.slug || `${consoleKey}-${index}`,
                title: game.title,
                platform: consoleName,
                console: game.console || consoleKey.toUpperCase(),
                category: game.category === 'N/A' ? 'Other' : (game.category || 'Other'),
                categoryId: consoleKey,
                image: game.image || '',
                rating: Math.round(rating * 10) / 10, // Round to 1 decimal
                downloads: downloads,
                year: game.release_year === 'N/A' ? 2000 : parseInt(game.release_year) || 2000,
                region: game.region || 'Unknown',
                fileName: game.file_name,
                size: game.size === 'unknown' ? 'Unknown' : game.size,
                downloadUrl: game.download_url,
                description: null,
                longDescription: null,
                reviewCount: Math.floor(Math.random() * 1000) + 100
              };
            });

            allGames.push(...convertedGames);
            
            // Create category for this console
            categories.push({
              id: consoleKey,
              name: consoleName,
              description: `${consoleName} ROM collection`,
              image: convertedGames[0]?.image || '',
              gameCount: convertedGames.length
            });

          } catch (error) {
            console.error(`Failed to load ${file}:`, error);
          }
        }

        this.romData = {
          categories,
          games: allGames,
          stats: {
            totalGames: allGames.length,
            totalCategories: categories.length,
            totalDownloads: Math.floor(allGames.reduce((sum, game) => sum + game.downloads, 0) / 1000) + "K",
            activeUsers: Math.floor(Math.random() * 50000 + 10000).toLocaleString()
          }
        };
      } catch (error) {
        console.error("Failed to load ROM data:", error);
        // Return empty data structure if files don't exist
        this.romData = {
          categories: [],
          games: [],
          stats: {
            totalGames: 0,
            totalCategories: 0,
            totalDownloads: "0",
            activeUsers: "0"
          }
        };
      }
    }
    return this.romData;
  }

  async getRomData(): Promise<RomData> {
    const data = await this.loadData();
    if (!data) {
      throw new Error("Failed to load ROM data");
    }
    return data;
  }

  async getCategories(): Promise<CategoryData[]> {
    const data = await this.loadData();
    return data.categories;
  }

  async getCategory(id: string): Promise<CategoryData | undefined> {
    const data = await this.loadData();
    return data.categories.find(cat => cat.id === id);
  }

  async getGames(params: {
    categoryId?: string;
    console?: string;
    search?: string;
    sortBy?: 'downloads' | 'rating' | 'year' | 'title';
    page?: number;
    limit?: number;
  } = {}): Promise<{ games: GameData[]; total: number }> {
    const data = await this.loadData();
    let games = [...data.games];

    // Filter by category
    if (params.categoryId) {
      games = games.filter(game => game.categoryId === params.categoryId);
    }

    // Filter by console
    if (params.console) {
      games = games.filter(game => game.console.toLowerCase() === params.console!.toLowerCase());
    }

    // Filter by search term
    if (params.search) {
      const searchTerm = params.search.toLowerCase();
      games = games.filter(game => 
        game.title.toLowerCase().includes(searchTerm) ||
        game.platform.toLowerCase().includes(searchTerm)
      );
    }

    // Sort games
    if (params.sortBy) {
      games.sort((a, b) => {
        switch (params.sortBy) {
          case 'downloads':
            return b.downloads - a.downloads;
          case 'rating':
            return b.rating - a.rating;
          case 'year':
            return b.year - a.year;
          case 'title':
            return a.title.localeCompare(b.title);
          default:
            return 0;
        }
      });
    }

    const total = games.length;
    
    // Pagination
    if (params.page && params.limit) {
      const start = (params.page - 1) * params.limit;
      games = games.slice(start, start + params.limit);
    }

    return { games, total };
  }

  async getGame(id: string): Promise<GameData | undefined> {
    const data = await this.loadData();
    return data.games.find(game => game.id === id);
  }

  async getPopularGames(limit: number = 4): Promise<GameData[]> {
    const data = await this.loadData();
    return [...data.games]
      .sort((a, b) => b.downloads - a.downloads)
      .slice(0, limit);
  }

  async getGameBySlug(console: string, slug: string): Promise<GameData | undefined> {
    const data = await this.loadData();
    // First try to match by slug (id)
    let game = data.games.find(game => 
      game.console.toLowerCase() === console.toLowerCase() && 
      game.id === slug
    );
    
    // If not found, try to match by generated slug from filename
    if (!game) {
      game = data.games.find(game => 
        game.console.toLowerCase() === console.toLowerCase() && 
        this.createSlug(game.fileName) === slug
      );
    }
    
    return game;
  }

  async getConsoles(): Promise<string[]> {
    const data = await this.loadData();
    const consolesSet = new Set(data.games.map(game => game.console));
    const consoles = Array.from(consolesSet);
    return consoles.sort();
  }

  private createSlug(fileName: string): string {
    return fileName
      .toLowerCase()
      .replace(/\.[^/.]+$/, "") // Remove file extension
      .replace(/[^a-z0-9]+/g, "-") // Replace non-alphanumeric with hyphens
      .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
  }
}

export const storage = new MemStorage();
