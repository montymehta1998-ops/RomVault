import type { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from '../utils/storage';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { id } = req.query;
    
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'Game ID is required' });
    }
    
    const game = await storage.getGame(id);
    
    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }
    
    res.status(200).json(game);
  } catch (error) {
    console.error('Failed to fetch game:', error);
    res.status(500).json({ error: 'Failed to fetch game' });
  }
}