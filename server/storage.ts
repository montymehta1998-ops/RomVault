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
          '3do': '3DO',
          '3ds': '3DS',
          'acorn_archimedes': 'Acorn Archimedes',
          'acorn_atom': 'Acorn Atom',
          'action_max': 'Action Max',
          'amiga': 'Amiga',
          'amstrad_cpc': 'Amstrad CPC',
          'amstrad_gx4000': 'Amstrad GX4000',
          'apple_2_gs': 'Apple IIgs',
          'apple_2': 'Apple II',
          'atari_2600': 'Atari 2600',
          'atari_5200': 'Atari 5200',
          'atari_7800': 'Atari 7800',
          'atari_8_bit': 'Atari 8-bit',
          'atari_jaguar': 'Atari Jaguar',
          'atari_lynx': 'Atari Lynx',
          'atari_st': 'Atari ST',
          'bally_astrocade': 'Bally Astrocade',
          'bbc_micro': 'BBC Micro',
          'capcom_play_system_1': 'Capcom Play System 1',
          'cd_i': 'CD-i',
          'colecovision': 'ColecoVision',
          'commodore_64_preservation': 'Commodore 64',
          'commodore_64_tapes': 'Commodore 64 Tapes',
          'commodore_vic_20': 'Commodore VIC-20',
          'cps2': 'Capcom Play System 2',
          'cps3': 'Capcom Play System 3',
          'dos': 'DOS',
          'famicom': 'Famicom',
          'fm_7': 'FM-7',
          'gamate': 'Gamate',
          'gameboy_color': 'Game Boy Color',
          'gameboy': 'Game Boy',
          'gamecube': 'GameCube',
          'gba': 'Game Boy Advance',
          'gce_vectrex': 'GCE Vectrex',
          'intellivision': 'Intellivision',
          'magnavox_odissey_2': 'Magnavox Odyssey²',
          'mame': 'Arcade (MAME)',
          'msx_2': 'MSX2',
          'msx': 'MSX',
          'n64': 'Nintendo 64',
          'n_gage': 'N-Gage',
          'nds': 'Nintendo DS',
          'neo_geo_pocket': 'Neo Geo Pocket',
          'nes': 'Nintendo Entertainment System',
          'new_geo': 'Neo Geo',
          'nintendo_wii_u': 'Nintendo Wii U',
          'pc_fx': 'PC-FX',
          'playstation_4': 'PlayStation 4',
          'playstation': 'PlayStation',
          'playstation_vita': 'PlayStation Vita',
          'pokemon_mini': 'Pokémon Mini',
          'ps2': 'PlayStation 2',
          'ps3': 'PlayStation 3',
          'psp': 'PlayStation Portable',
          'sam_coupe': 'SAM Coupé',
          'satellaview': 'Satellaview',
          'scummvm': 'ScummVM',
          'sega_32x': 'Sega 32X',
          'sega_cd': 'Sega CD',
          'sega_dreamcast': 'Sega Dreamcast',
          'sega_game_gear': 'Sega Game Gear',
          'sega_genesis': 'Sega Genesis',
          'sega_master_system': 'Sega Master System',
          'sega_naomi': 'Sega Naomi',
          'sega_pico': 'Sega Pico',
          'sega_saturn': 'Sega Saturn',
          'sg_1000': 'SG-1000',
          'sharp': 'Sharp',
          'snes': 'Super Nintendo Entertainment System',
          'super_cassette_vision': 'Super Cassette Vision',
          'switch': 'Nintendo Switch',
          'tandy_trs_80': 'Tandy TRS-80',
          'tatung_einstein': 'Tatung Einstein',
          'tiger_game_com': 'Tiger Game.com',
          'trs_80_color_computer': 'TRS-80 Color Computer',
          'turbo_duo': 'TurboGrafx-16/PC Engine',
          'turbografx16': 'TurboGrafx-16',
          'videopac_g7400': 'Videopac+ G7400',
          'virtual_boy': 'Virtual Boy',
          'watara_supervision': 'Watara Supervision',
          'wii': 'Nintendo Wii',
          'wonderswan_color': 'WonderSwan Color',
          'wonderswan': 'WonderSwan',
          'xbox_one': 'Xbox One',
          'xbox': 'Xbox',
          'z_machine': 'Z-Machine',
          'zx81': 'ZX81',
          'zx_spectrum': 'ZX Spectrum'
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
