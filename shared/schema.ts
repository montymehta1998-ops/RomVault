import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, real, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const categories = pgTable("categories", {
  id: varchar("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  image: text("image").notNull(),
  gameCount: integer("game_count").notNull().default(0),
});

export const games = pgTable("games", {
  id: varchar("id").primaryKey(),
  title: text("title").notNull(),
  platform: text("platform").notNull(),
  console: text("console").notNull(),
  category: text("category").notNull(),
  categoryId: varchar("category_id").notNull(),
  image: text("image").notNull(),
  rating: real("rating").notNull(),
  downloads: integer("downloads").notNull().default(0),
  year: integer("year").notNull(),
  region: text("region").notNull(),
  fileName: text("file_name").notNull(),
  size: text("size").notNull(),
  downloadUrl: text("download_url").notNull(),
  description: text("description"),
  longDescription: text("long_description"),
  reviewCount: integer("review_count").notNull().default(0),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertCategorySchema = createInsertSchema(categories).omit({
  id: true,
});

export const insertGameSchema = createInsertSchema(games).omit({
  id: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categories.$inferSelect;
export type InsertGame = z.infer<typeof insertGameSchema>;
export type Game = typeof games.$inferSelect;

// Frontend-only types for JSON data
export interface GameData {
  id: string;
  title: string;
  platform: string;
  console: string;
  category: string;
  categoryId: string;
  image: string;
  rating: number;
  downloads: number;
  year: number;
  region: string;
  fileName: string;
  size: string;
  downloadUrl: string;
  description?: string;
  longDescription?: string;
  reviewCount: number;
}

export interface CategoryData {
  id: string;
  name: string;
  description: string;
  image: string;
  gameCount: number;
}

export interface RomData {
  categories: CategoryData[];
  games: GameData[];
  stats: {
    totalGames: number;
    totalCategories: number;
    totalDownloads: string;
    activeUsers: string;
  };
}
