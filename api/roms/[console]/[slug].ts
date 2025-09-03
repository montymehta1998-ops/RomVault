import type { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from '../../storage.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    console.log('Fetching ROM with console and slug - specific route:', req.query, req.url);
    const { console: consoleParam, slug } = req.query;
    
    if (!consoleParam || typeof consoleParam !== 'string') {
      console.log('Invalid console parameter:', consoleParam);
      return res.status(400).json({ error: 'Console parameter is required' });
    }
    
    if (!slug || typeof slug !== 'string') {
      console.log('Invalid slug parameter:', slug);
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
        console.log('Attempting to load ROM data for debugging...');
        const allData = await storage.getRomData();
        console.log(`Loaded ${allData.games.length} total games, ${allData.categories.length} categories`);
        
        // Check if we have any data at all
        if (allData.games.length === 0) {
          console.log('ERROR: No games loaded at all!');
        }
        
        // Look for games with the same slug
        const slugMatches = allData.games.filter(g => g.id === slug);
        console.log(`Found ${slugMatches.length} games with matching slug '${slug}'`);
        if (slugMatches.length > 0) {
          console.log(`Sample slug matches:`, slugMatches.slice(0, 3).map(g => ({
            id: g.id,
            title: g.title,
            categoryId: g.categoryId,
            console: g.console
          })));
        }
        
        // Look for games with the same console
        const consoleMatches = allData.games.filter(g =>
          g.console.toLowerCase() === consoleParam.toLowerCase() ||
          g.categoryId === consoleParam
        );
        console.log(`Found ${consoleMatches.length} games for console '${consoleParam}'`);
        if (consoleMatches.length > 0) {
          console.log(`Sample console matches:`, consoleMatches.slice(0, 3).map(g => ({
            id: g.id,
            title: g.title,
            categoryId: g.categoryId,
            console: g.console
          })));
        }
        
        // Also look for partial matches
        const partialMatches = allData.games.filter(g =>
          g.id.includes(slug) ||
          g.title.toLowerCase().includes(slug.replace(/-/g, ' '))
        );
        console.log(`Found ${partialMatches.length} games with partial matches to '${slug}'`);
        if (partialMatches.length > 0) {
          console.log(`Sample partial matches:`, partialMatches.slice(0, 3).map(g => ({
            id: g.id,
            title: g.title,
            categoryId: g.categoryId,
            console: g.console
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