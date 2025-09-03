import type { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from './storage.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    console.log('Fetching ROM data...');
    const data = await storage.getRomData();
    console.log(`Successfully fetched ROM data with ${data.categories.length} categories and ${data.games.length} games`);
    res.status(200).json(data);
  } catch (error) {
    console.error('Failed to fetch ROM data:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: 'Failed to fetch ROM data', message: errorMessage });
  }
}