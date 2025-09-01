// Test file for redirects
// This file demonstrates how the redirect mechanism works

import { redirectMiddleware } from './redirects';
import redirects from './redirects-config';

// Function to test redirects
function testRedirect(oldUrl: string) {
  console.log(`Testing redirect for: ${oldUrl}`);
  
  // Create a mock request object
  const mockRequest = {
    path: new URL(oldUrl).pathname
  } as any;
  
  // Create a mock response object
  const mockResponse = {
    redirect: (status: number, location: string) => {
      console.log(`Status: ${status}`);
      console.log(`Location: ${location}`);
      console.log('---');
    }
  } as any;
  
  // Create a mock next function
  const mockNext = () => {
    console.log('No redirect found, continuing to next middleware');
    console.log('---');
  };
  
  // Call the redirect middleware
  redirectMiddleware(mockRequest, mockResponse, mockNext);
}

// Test the GBA roms redirect
testRedirect('http://localhost:3000/roms/gba-roms/');
testRedirect('http://localhost:3000/roms/gba-roms/some-game-slug');
testRedirect('http://localhost:3000/roms/3ds-roms/');
testRedirect('http://localhost:3000/roms/3ds-roms/some-game-slug');
testRedirect('http://localhost:3000/roms/gamecube-roms/');
testRedirect('http://localhost:3000/roms/gamecube-roms/some-game-slug');
console.log('Test completed');