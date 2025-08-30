import type { VercelRequest, VercelResponse } from '@vercel/node';

// Use dynamic import to avoid module resolution issues
let app: any;

async function getExpressApp() {
  if (!app) {
    try {
      // Try to import the bundled server code
      const module = await import('../dist/index.js');
      app = module.default || module;
    } catch (error) {
      console.error('Failed to import bundled server module:', error);
      try {
        // Fallback to importing the source code
        const module = await import('../server/index.js');
        app = module.default || module;
      } catch (fallbackError) {
        console.error('Failed to import server module with fallback:', fallbackError);
        throw new Error('Could not import Express app module');
      }
    }
  }
  return app;
}

// Vercel serverless function handler
export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const expressApp = await getExpressApp();
    
    return new Promise<void>((resolve, reject) => {
      // Handle the case where the response is already finished
      if (res.writableEnded) {
        resolve();
        return;
      }
      
      // Patch the response object to work with Vercel
      const originalEnd = res.end;
      res.end = function (chunk?: any, encoding?: any, callback?: any) {
        // Call the original end method with proper parameters
        const result = originalEnd.call(this, chunk, encoding, callback);
        // Resolve the promise to indicate the request is finished
        resolve();
        return result;
      };
      
      // Handle errors
      res.once('error', reject);
      
      // Pass the request to our Express app
      try {
        expressApp(req as any, res as any);
      } catch (error) {
        console.error('Error in Express app:', error);
        if (!res.headersSent) {
          res.status(500).send('Internal Server Error');
        }
        resolve();
      }
    });
  } catch (error) {
    console.error('Failed to initialize Express app:', error);
    res.status(500).send('Internal Server Error');
  }
}