import { readFile } from 'fs/promises';
import { join } from 'path';

// Inline redirects configuration to avoid module resolution issues
const redirects = {
  "/roms/gba-roms": "/roms/gameboy-advance-roms",
  "/roms/3ds-roms": "/roms/nintendo-3ds-roms",
  "/roms/gamecube-roms": "/roms/nintendo-gamecube-roms",
  "/roms/playstation-3-roms/god-of-war-iii" : "/roms/playstation-3-roms/god-of-war-iii-usa"
};

// Vercel serverless function handler
export default async function handler(request: Request) {
  // For Vercel, request.url might be just a path, not a full URL
  let pathname: string;
  
  try {
    // Try to parse as a full URL first
    const url = new URL(request.url);
    pathname = url.pathname;
  } catch (error) {
    // If that fails, assume it's just a path
    pathname = request.url;
  }
  
  // Handle article URLs directly
  if (pathname.startsWith('/articles/')) {
    try {
      const articlePath = pathname.replace('/articles/', '').replace(/\/$/, ''); // Remove trailing slash
      const filePath = join(process.cwd(), 'articles', `${articlePath}.html`);
      
      console.log(`Attempting to read file: ${filePath}`);
      const content = await readFile(filePath, 'utf-8');
      
      return new Response(content, {
        status: 200,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
    } catch (error) {
      console.error(`Error reading article file: ${error}`);
      return new Response(`Article not found: ${pathname}`, { status: 404 });
    }
  }
  
  // Handle ROM article URLs directly
  if (pathname.startsWith('/roms/') && 
      (pathname.includes('level-up-your-fps-game') || 
       pathname.includes('unleashing-gaming-dominance'))) {
    try {
      const romPath = pathname.replace('/roms/', '').replace(/\/$/, ''); // Remove trailing slash
      const filePath = join(process.cwd(), 'roms', `${romPath}.html`);
      
      console.log(`Attempting to read ROM file: ${filePath}`);
      const content = await readFile(filePath, 'utf-8');
      
      return new Response(content, {
        status: 200,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
    } catch (error) {
      console.error(`Error reading ROM file: ${error}`);
      return new Response(`ROM article not found: ${pathname}`, { status: 404 });
    }
  }
  
  // Check if the pathname matches any redirect
  for (const [oldPath, newPath] of Object.entries(redirects)) {
    // Check for exact match or if the pathname starts with the old path
    if (pathname === oldPath || pathname.startsWith(oldPath + '/')) {
      // Calculate the remaining path after the old path
      const remainingPath = pathname.substring(oldPath.length);
      
      // Construct the new URL by combining the new path with the remaining path
      const newLocation = newPath + remainingPath;
      
      // Return a 301 redirect response
      return new Response(null, {
        status: 301,
        headers: {
          Location: newLocation
        }
      });
    }
  }
  
  // If no redirect is found, return a 404 response
  return new Response('Not Found', { status: 404 });
}