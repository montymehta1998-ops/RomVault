import type { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from '../storage';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    console.log('Fetching category with ID:', req.query.id);
    const { id } = req.query;
    
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'Category ID is required' });
    }
    
    const category = await storage.getCategory(id);
    
    if (!category) {
      console.log(`Category with ID ${id} not found`);
      return res.status(404).json({ error: 'Category not found' });
    }
    
    console.log(`Successfully fetched category: ${category.name}`);
    res.status(200).json(category);
  } catch (error) {
    console.error('Failed to fetch category:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: 'Failed to fetch category', message: errorMessage });
  }
}