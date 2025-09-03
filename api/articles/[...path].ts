import { readFile } from 'fs/promises';
import { join } from 'path';

// Vercel serverless function for handling article routes
export default async function handler(req: any, res: any) {
  const { path } = req.query;
  const articlePath = Array.isArray(path) ? path.join('/') : path;
  
  try {
    const filePath = join(process.cwd(), 'articles', `${articlePath}.html`);
    const content = await readFile(filePath, 'utf-8');
    
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache');
    res.status(200).send(content);
  } catch (error) {
    res.status(404).json({ error: 'Article not found' });
  }
}