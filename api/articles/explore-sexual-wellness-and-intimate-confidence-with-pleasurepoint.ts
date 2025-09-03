import { readFile } from 'fs/promises';
import { join } from 'path';

// Specific serverless function for this article
export default async function handler(req: any, res: any) {
  try {
    const filePath = join(process.cwd(), 'articles', 'explore-sexual-wellness-and-intimate-confidence-with-pleasurepoint.html');
    const content = await readFile(filePath, 'utf-8');
    
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache');
    res.status(200).send(content);
  } catch (error) {
    res.status(404).json({ error: 'Article not found' });
  }
}