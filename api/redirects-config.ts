// Redirects configuration file for API (Vercel serverless functions)
// Define your old URL to new URL mappings here
// The system will automatically append any additional path segments to the new URL

interface RedirectConfig {
  [oldPath: string]: string;
}

const redirects: RedirectConfig = {
  // Example redirect:
  // Old: https://www.emulator-games.net/roms/gba-roms/
  // New: https://www.emulator-games.net/roms/gameboy-advance-roms
  "/roms/gba-roms": "/roms/gameboy-advance-roms",
  "/roms/3ds-roms": "/roms/nintendo-3ds-roms",
  "/roms/gamecube-roms": "/roms/nintendo-gamecube-roms",
  "/roms/playstation-3-roms/god-of-war-iii" : "/roms/playstation-3-roms/god-of-war-iii-usa"
};

export default redirects;