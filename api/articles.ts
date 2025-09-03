import type { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from './storage.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { slug } = req.query;
    
    // If slug is provided, return specific article
    if (slug && typeof slug === 'string') {
      const article = await storage.getArticleBySlug(slug);
      if (!article) {
        return res.status(404).json({ error: 'Article not found' });
      }
      return res.status(200).json(article);
    }
    
    // Otherwise return all articles
    const articles = await storage.getArticles();
    return res.status(200).json(articles);
  } catch (error) {
    console.error('Failed to fetch articles:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return res.status(500).json({ error: 'Failed to fetch articles', message: errorMessage });
  }
}