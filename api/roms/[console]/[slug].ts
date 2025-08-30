import type { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from '../../storage.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    console.log('Fetching ROM with console and slug:', req.query);
    const { console: consoleParam, slug } = req.query;
    
    if (!consoleParam || typeof consoleParam !== 'string') {
      return res.status(400).json({ error: 'Console parameter is required' });
    }
    
    if (!slug || typeof slug !== 'string') {
      return res.status(400).json({ error: 'Slug parameter is required' });
    }
    
    // Decode URL-encoded console parameter and remove -roms suffix if present
    const decodedConsole = decodeURIComponent(consoleParam);
    const consoleName = decodedConsole.endsWith('-roms') ?
      decodedConsole.slice(0, -5) : decodedConsole;
      
    const game = await storage.getGameBySlug(consoleName, slug);
    
    if (!game) {
      console.log(`ROM with console ${consoleName} and slug ${slug} not found`);
      return res.status(404).json({ error: 'ROM not found' });
    }
    
    console.log(`Successfully fetched ROM: ${game.title}`);
    res.status(200).json(game);
  } catch (error) {
    console.error('Failed to fetch ROM:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: 'Failed to fetch ROM', message: errorMessage });
  }
}