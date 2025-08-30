import type { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from '../../storage.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    console.log('Fetching ROM with console and slug - specific route:', req.query, req.url);
    const { console: consoleParam, slug } = req.query;
    
    if (!consoleParam || typeof consoleParam !== 'string') {
      return res.status(400).json({ error: 'Console parameter is required' });
    }
    
    if (!slug || typeof slug !== 'string') {
      return res.status(400).json({ error: 'Slug parameter is required' });
    }
    
    // Log the parameters for debugging
    console.log(`Searching for game with console: ${consoleParam}, slug: ${slug}`);
    
    // For now, just pass the console parameter as is
    const game = await storage.getGameBySlug(consoleParam, slug);
    
    if (!game) {
      // Log more details for debugging
      console.log(`ROM with console ${consoleParam} and slug ${slug} not found`);
      // Try to get some info about what's available
      try {
        const allData = await storage.getRomData();
        const matchingConsoleGames = allData.games.filter(g =>
          g.console.toLowerCase() === consoleParam.toLowerCase()
        );
        console.log(`Found ${matchingConsoleGames.length} games for console ${consoleParam}`);
        if (matchingConsoleGames.length > 0) {
          console.log(`Sample games for ${consoleParam}:`, matchingConsoleGames.slice(0, 3).map(g => ({
            id: g.id,
            title: g.title,
            categoryId: g.categoryId
          })));
        }
      } catch (infoError) {
        console.error('Failed to get additional info for debugging:', infoError);
      }
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