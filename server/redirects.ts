import redirects from './redirects-config';
import { Request, Response, NextFunction } from 'express';

export function redirectMiddleware(req: Request, res: Response, next: NextFunction) {
  const pathname = req.path;
  
  // Check if the pathname matches any redirect
  for (const [oldPath, newPath] of Object.entries(redirects)) {
    // Check for exact match or if the pathname starts with the old path
    if (pathname === oldPath || pathname.startsWith(oldPath + '/')) {
      // Calculate the remaining path after the old path
      const remainingPath = pathname.substring(oldPath.length);
      
      // Construct the new URL by combining the new path with the remaining path
      const newLocation = newPath + remainingPath;
      
      // Return a 301 redirect response
      return res.redirect(301, newLocation);
    }
  }
  
  // If no redirect is found, continue to other routes
  next();
}