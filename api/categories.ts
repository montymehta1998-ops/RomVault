import type { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from './utils/storage';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const categories = await storage.getCategories();
    res.status(200).json(categories);
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
}