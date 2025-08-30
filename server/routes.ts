import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all ROM data
  app.get("/api/rom-data", async (req, res) => {
    try {
      const data = await storage.getRomData();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch ROM data" });
    }
  });

  // Get all categories
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch categories" });
    }
  });

  // Get specific category
  app.get("/api/categories/:id", async (req, res) => {
    try {
      const category = await storage.getCategory(req.params.id);
      if (!category) {
        return res.status(404).json({ error: "Category not found" });
      }
      res.json(category);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch category" });
    }
  });

  // Get games with optional filters
  app.get("/api/games", async (req, res) => {
    try {
      const {
        categoryId,
        search,
        sortBy,
        page = '1',
        limit = '20'
      } = req.query;

      const result = await storage.getGames({
        categoryId: categoryId as string,
        search: search as string,
        sortBy: sortBy as 'downloads' | 'rating' | 'year' | 'title',
        page: parseInt(page as string),
        limit: parseInt(limit as string),
      });

      res.json(result);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch games" });
    }
  });

  // Get specific game
  app.get("/api/games/:id", async (req, res) => {
    try {
      const game = await storage.getGame(req.params.id);
      if (!game) {
        return res.status(404).json({ error: "Game not found" });
      }
      res.json(game);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch game" });
    }
  });

  // Get popular games
  app.get("/api/popular", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 4;
      const games = await storage.getPopularGames(limit);
      res.json(games);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch popular games" });
    }
  });

  // Get all consoles
  app.get("/api/consoles", async (req, res) => {
    try {
      const consoles = await storage.getConsoles();
      res.json(consoles);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch consoles" });
    }
  });

  // Get ROMs with pagination and filters
  app.get("/api/roms", async (req, res) => {
    try {
      const {
        console,
        category,
        search,
        sortBy,
        page = '1',
        limit = '20'
      } = req.query;

      const result = await storage.getGames({
        console: console as string,
        category: category as string,
        search: search as string,
        sortBy: sortBy as 'downloads' | 'rating' | 'year' | 'title',
        page: parseInt(page as string),
        limit: parseInt(limit as string),
      });

      res.json(result);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch ROMs" });
    }
  });

  // Get ROM by console and slug
  app.get("/api/roms/:console/:slug", async (req, res) => {
    try {
      const { console: consoleParam, slug } = req.params;
      console.log(`Server route: Searching for game with console: ${consoleParam}, slug: ${slug}`);
      // For now, just pass the slug to getGameBySlug
      const game = await storage.getGameBySlug(consoleParam, slug);
      if (!game) {
        console.log(`Server route: Game not found for console: ${consoleParam}, slug: ${slug}`);
        return res.status(404).json({ error: "ROM not found" });
      }
      console.log(`Server route: Found game: ${game.title}`);
      res.json(game);
    } catch (error) {
      console.error("Server route: Failed to fetch ROM:", error);
      res.status(500).json({ error: "Failed to fetch ROM" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
