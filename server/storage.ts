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
  private dataPath: string;

  constructor() {
    this.dataPath = path.resolve(process.cwd(), "data", "games.json");
  }

  private async loadData(): Promise<RomData> {
    if (!this.romData) {
      try {
        const data = await fs.readFile(this.dataPath, "utf-8");
        this.romData = JSON.parse(data);
      } catch (error) {
        console.error("Failed to load ROM data:", error);
        // Return empty data structure if file doesn't exist
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
    return data.games.find(game => 
      game.console.toLowerCase() === console.toLowerCase() && 
      this.createSlug(game.fileName) === slug
    );
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
