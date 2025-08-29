import { type Game, type Category, type RomData } from "@shared/schema";
import fs from "fs/promises";
import path from "path";

export interface IStorage {
  getRomData(): Promise<RomData>;
  getCategories(): Promise<Category[]>;
  getCategory(id: string): Promise<Category | undefined>;
  getGames(params?: {
    categoryId?: string;
    search?: string;
    sortBy?: 'downloads' | 'rating' | 'year' | 'title';
    page?: number;
    limit?: number;
  }): Promise<{ games: Game[]; total: number }>;
  getGame(id: string): Promise<Game | undefined>;
  getPopularGames(limit?: number): Promise<Game[]>;
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
    return await this.loadData();
  }

  async getCategories(): Promise<Category[]> {
    const data = await this.loadData();
    return data.categories;
  }

  async getCategory(id: string): Promise<Category | undefined> {
    const data = await this.loadData();
    return data.categories.find(cat => cat.id === id);
  }

  async getGames(params: {
    categoryId?: string;
    search?: string;
    sortBy?: 'downloads' | 'rating' | 'year' | 'title';
    page?: number;
    limit?: number;
  } = {}): Promise<{ games: Game[]; total: number }> {
    const data = await this.loadData();
    let games = [...data.games];

    // Filter by category
    if (params.categoryId) {
      games = games.filter(game => game.categoryId === params.categoryId);
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

  async getGame(id: string): Promise<Game | undefined> {
    const data = await this.loadData();
    return data.games.find(game => game.id === id);
  }

  async getPopularGames(limit: number = 4): Promise<Game[]> {
    const data = await this.loadData();
    return [...data.games]
      .sort((a, b) => b.downloads - a.downloads)
      .slice(0, limit);
  }
}

export const storage = new MemStorage();
