import type { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from './storage.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    console.log('Fetching consoles...');
    const consoles = await storage.getConsoles();
    console.log(`Successfully fetched ${consoles.length} consoles`);
    res.status(200).json(consoles);
  } catch (error) {
    console.error('Failed to fetch consoles:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: 'Failed to fetch consoles', message: errorMessage });
  }
}