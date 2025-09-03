import redirects from './redirects-config.js';

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