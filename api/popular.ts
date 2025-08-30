import type { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from './utils/storage';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const limit = parseInt(req.query.limit as string) || 4;
    const games = await storage.getPopularGames(limit);
    res.status(200).json(games);
  } catch (error) {
    console.error('Failed to fetch popular games:', error);
    res.status(500).json({ error: 'Failed to fetch popular games' });
  }
}