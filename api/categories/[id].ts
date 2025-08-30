import type { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from '../utils/storage';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { id } = req.query;
    
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'Category ID is required' });
    }
    
    const category = await storage.getCategory(id);
    
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    
    res.status(200).json(category);
  } catch (error) {
    console.error('Failed to fetch category:', error);
    res.status(500).json({ error: 'Failed to fetch category' });
  }
}