import type { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from './utils/storage';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const data = await storage.getRomData();
    res.status(200).json(data);
  } catch (error) {
    console.error('Failed to fetch ROM data:', error);
    res.status(500).json({ error: 'Failed to fetch ROM data' });
  }
}