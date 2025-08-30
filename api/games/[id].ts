import type { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from '../storage';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    console.log('Fetching game with ID:', req.query.id);
    const { id } = req.query;
    
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'Game ID is required' });
    }
    
    const game = await storage.getGame(id);
    
    if (!game) {
      console.log(`Game with ID ${id} not found`);
      return res.status(404).json({ error: 'Game not found' });
    }
    
    console.log(`Successfully fetched game: ${game.title}`);
    res.status(200).json(game);
  } catch (error) {
    console.error('Failed to fetch game:', error);
    res.status(500).json({ error: 'Failed to fetch game', message: error.message });
  }
}