import type { VercelRequest, VercelResponse } from '@vercel/node';
import app from '../server/index';

// Vercel serverless function handler
export default async function handler(req: VercelRequest, res: VercelResponse) {
  return new Promise<void>((resolve, reject) => {
    // Handle the case where the response is already finished
    if (res.writableEnded) {
      resolve();
      return;
    }
    
    // Patch the response object to work with Vercel
    const originalEnd = res.end;
    res.end = function (...args: any[]) {
      // Call the original end method
      const result = originalEnd.apply(this, args);
      // Resolve the promise to indicate the request is finished
      resolve();
      return result;
    };
    
    // Handle errors
    res.once('error', reject);
    
    // Pass the request to our Express app
    try {
      app(req as any, res as any);
    } catch (error) {
      console.error('Error in Express app:', error);
      if (!res.headersSent) {
        res.status(500).send('Internal Server Error');
      }
      resolve();
    }
  });
}