// Vercel serverless function handler for 3DS ROMs redirect
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
  
  // Calculate the remaining path after the old path
  const remainingPath = pathname.substring("/roms/3ds-roms".length);
  
  // Construct the new URL by combining the new path with the remaining path
  const newLocation = "/roms/nintendo-3ds-roms" + remainingPath;
  
  // Return a 301 redirect response
  return new Response(null, {
    status: 301,
    headers: {
      Location: newLocation
    }
  });
}