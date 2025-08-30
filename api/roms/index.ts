import type { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from '../../server/storage';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    console.log('Fetching ROMs with params:', req.query);
    const {
      console: consoleParam,
      category,
      search,
      sortBy,
      page = '1',
      limit = '20'
    } = req.query;

    const result = await storage.getGames({
      console: consoleParam as string,
      category: category as string,
      search: search as string,
      sortBy: sortBy as 'downloads' | 'rating' | 'year' | 'title',
      page: parseInt(page as string),
      limit: parseInt(limit as string),
    });

    console.log(`Successfully fetched ${result.games.length} ROMs out of ${result.total} total`);
    res.status(200).json(result);
  } catch (error) {
    console.error('Failed to fetch ROMs:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: 'Failed to fetch ROMs', message: errorMessage });
  }
}