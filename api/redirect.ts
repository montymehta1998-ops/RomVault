// Vercel serverless function handler
export default async function handler(request: Request) {
  const url = new URL(request.url);
  const pathname = url.pathname;
  
  // Redirects configuration
  const redirects: { [oldPath: string]: string } = {
    "/roms/gba-roms": "/roms/gameboy-advance-roms",
    "/roms/3ds-roms": "/roms/nintendo-3ds-roms",
    "/roms/gamecube-roms": "/roms/nintendo-gamecube-roms"
  };
  
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