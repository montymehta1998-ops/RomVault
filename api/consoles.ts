import type { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from './utils/storage';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    console.log('Fetching consoles...');
    const consoles = await storage.getConsoles();
    console.log(`Successfully fetched ${consoles.length} consoles`);
    res.status(200).json(consoles);
  } catch (error) {
    console.error('Failed to fetch consoles:', error);
    res.status(500).json({ error: 'Failed to fetch consoles', message: error.message });
  }
}