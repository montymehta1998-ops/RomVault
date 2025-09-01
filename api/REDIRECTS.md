# Redirect System Documentation

This document explains how to use the redirect system in the RomVault project.

## How it works

The redirect system consists of two main files:
1. `redirects-config.ts` - Contains the mapping of old URLs to new URLs
2. `redirects.ts` - The handler that processes redirect requests

## Adding new redirects

To add a new redirect, simply add a new entry to the `redirects` object in `redirects-config.ts`:

```typescript
const redirects: RedirectConfig = {
  // Existing redirects...
  
  // Add your new redirect here:
  "/old-path": "/new-path"
};
```

## How redirects are processed

When a request comes in, the system:
1. Checks if the requested path matches any of the old paths in the configuration
2. If a match is found, it responds with a 301 (Moved Permanently) status
3. The Location header is set to the new path, preserving any additional path segments

For example:
- Request: `/roms/gba-roms/`
- Redirects to: `/roms/gameboy-advance-roms/`
- Request: `/roms/gba-roms/some-game`
- Redirects to: `/roms/gameboy-advance-roms/some-game`

## Production Deployment

This redirect system is ready for production deployment. The redirects use relative paths, which will work correctly on any domain where your application is hosted.

For example, if your site is hosted at `https://www.emulator-games.net/`, the redirects will work automatically:
- `https://www.emulator-games.net/roms/gba-roms/`
- Will redirect to: `https://www.emulator-games.net/roms/gameboy-advance-roms/`

Similarly, if you deploy to a different domain or subdirectory, the redirects will still work correctly.

## Example

The system comes with pre-configured examples:

```typescript
"/roms/gba-roms": "/roms/gameboy-advance-roms",
"/roms/3ds-roms": "/roms/nintendo-3ds-roms",
"/roms/gamecube-roms": "/roms/nintendo-gamecube-roms"
```

Any additional path segments will be preserved during the redirect.