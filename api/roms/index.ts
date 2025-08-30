import type { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from '../utils/storage';

export default async function handler(req: VercelRequest, res: VercelResponse) {
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

    res.status(200).json(result);
  } catch (error) {
    console.error('Failed to fetch ROMs:', error);
    res.status(500).json({ error: 'Failed to fetch ROMs' });
  }
}