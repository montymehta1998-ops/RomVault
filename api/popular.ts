import type { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from './storage';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    console.log('Fetching popular games...');
    const limit = parseInt(req.query.limit as string) || 4;
    const games = await storage.getPopularGames(limit);
    console.log(`Successfully fetched ${games.length} popular games`);
    res.status(200).json(games);
  } catch (error) {
    console.error('Failed to fetch popular games:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: 'Failed to fetch popular games', message: errorMessage });
  }
}