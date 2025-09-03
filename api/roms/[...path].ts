import { readFile } from 'fs/promises';
import { join } from 'path';

// Vercel serverless function for handling ROM article routes  
export default async function handler(req: any, res: any) {
  const { path } = req.query;
  const romPath = Array.isArray(path) ? path.join('/') : path;
  
  // Skip if this is an API route or existing ROM route
  if (romPath.startsWith('api') || 
      romPath.startsWith('gba-roms') || 
      romPath.startsWith('3ds-roms') || 
      romPath.startsWith('gamecube-roms') || 
      romPath.startsWith('playstation-3-roms')) {
    return res.status(404).json({ error: 'Not found' });
  }
  
  try {
    const filePath = join(process.cwd(), 'roms', `${romPath}.html`);
    const content = await readFile(filePath, 'utf-8');
    
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache');
    res.status(200).send(content);
  } catch (error) {
    res.status(404).json({ error: 'ROM article not found' });
  }
}