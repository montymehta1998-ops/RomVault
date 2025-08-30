import express, { type Request, Response, NextFunction } from "express";
import { createServer } from "http";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

// For Vercel deployment, we need to export a handler
// But we also need to maintain compatibility with local development

let serverPromise: Promise<ReturnType<typeof createServer>> | null = null;

// Initialize routes
try {
  serverPromise = registerRoutes(app);
  serverPromise.catch((error) => {
    console.error("Failed to register routes:", error);
  });
} catch (error) {
  console.error("Failed to initialize routes:", error);
}

app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(status).json({ message });
  // Don't throw in production as it might crash the server
  if (process.env.NODE_ENV !== "production") {
    throw err;
  }
});

// Export the handler for Vercel
export default async function handler(req: any, res: any) {
  return new Promise<void>((resolve, reject) => {
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
    app(req, res, (err) => {
      if (err) {
        reject(err);
      } else {
        // If no error and the response hasn't been sent, send a 404
        if (!res.headersSent) {
          res.status(404).send('Not Found');
          resolve();
        }
      }
    });
  });
}

// For local development, we still need to start the server
if (!process.env.VERCEL) {
  // For local development
  (async () => {
    try {
      // Wait for routes to be registered
      const server = await serverPromise!;
      
      // Setup static files and Vite in development
      if (process.env.NODE_ENV === "development") {
        await setupVite(app, server);
      } else {
        serveStatic(app);
      }
      
      const port = parseInt(process.env.PORT || '5000', 10);
      server.listen(port, () => {
        log(`serving on port ${port}`);
      });
    } catch (error) {
      console.error("Failed to start server:", error);
    }
  })();
}
