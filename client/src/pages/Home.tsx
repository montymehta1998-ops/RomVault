import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { GameCard } from "@/components/game/GameCard";
import { Skeleton } from "@/components/ui/skeleton";
import type { RomData, GameData } from "@shared/schema";

export default function Home() {
  const { data: romData, isLoading } = useQuery<RomData>({
    queryKey: ["/api/rom-data"],
  });

  const { data: popularGames, isLoading: isLoadingPopular } = useQuery<GameData[]>({
    queryKey: ["/api/popular"],
  });

  // Set SEO meta tags
  useEffect(() => {
    document.title = "Emulator Games.net | Download ROMs and Emulators For Free (2025)";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 
        "Download 100% working ROMs and emulators only at Emulator Games.net in 2025. Emulator Games offer Free classic games to play offline."
      );
    }
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="hero-gradient rounded-2xl p-12 text-center text-white mb-12">
          <Skeleton className="h-16 w-96 mx-auto mb-4 bg-white/20" />
          <Skeleton className="h-8 w-full max-w-3xl mx-auto mb-8 bg-white/20" />
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Skeleton className="h-12 w-48 bg-white/20" />
            <Skeleton className="h-12 w-48 bg-white/20" />
          </div>
        </div>
      </div>
    );
  }

  if (!romData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">No ROM data available</h1>
          <p className="text-muted-foreground">Please check if the games.json file exists and contains valid data.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      {/* Hero Section */}
      <section className="hero-gradient rounded-2xl p-12 text-center text-white">
        <h1 className="text-4xl md:text-6xl font-bold mb-4" data-testid="text-hero-title">
          Emulator Games | Download ROMs & Emulators For Free (2025)
        </h1>
        <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto" data-testid="text-hero-description">
          Download 100% working ROMs and emulators only at Emulator-Games.net in 2025. Emulator Games offer Free classic games to play offline.
          Download ROMs PS3, GBA, PS1, SNES, N64, PS2, and more. Enjoy retro gaming easily at Emulator Games.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/all-consoles">
            <button 
              className="px-8 py-3 bg-white text-primary font-semibold rounded-lg hover:bg-white/90 transition-colors"
              data-testid="button-browse-categories"
            >
              Browse Categories
            </button>
          </Link>
          <Link to="/roms">
            <button 
              className="px-8 py-3 border border-white/30 text-white font-semibold rounded-lg hover:bg-white/10 transition-colors"
              data-testid="button-popular-games"
            >
              Popular Games
            </button>
          </Link>
        </div>
      </section>

      {/* Stats Section */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-card border border-border rounded-lg p-6 text-center">
          <div className="text-3xl font-bold text-primary mb-2" data-testid="text-stat-total-games">
            {romData.stats.totalGames.toLocaleString()}
          </div>
          <div className="text-muted-foreground">Total Games</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-6 text-center">
          <div className="text-3xl font-bold text-primary mb-2" data-testid="text-stat-platforms">
            {romData.stats.totalCategories}
          </div>
          <div className="text-muted-foreground">Platforms</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-6 text-center">
          <div className="text-3xl font-bold text-primary mb-2" data-testid="text-stat-downloads">
            {romData.stats.totalDownloads}
          </div>
          <div className="text-muted-foreground">Downloads</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-6 text-center">
          <div className="text-3xl font-bold text-primary mb-2" data-testid="text-stat-active-users">
            {romData.stats.activeUsers}
          </div>
          <div className="text-muted-foreground">Active Users</div>
        </div>
      </section>

      {/* Popular Games Section - Limited to 20-30 games */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold" data-testid="text-popular-games">Popular Games</h2>
          <Link to="/roms" className="text-primary hover:underline" data-testid="link-view-all-popular">
            View All →
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoadingPopular ? (
            Array.from({ length: 20 }).map((_, i) => (
              <div key={i} className="loading-skeleton rounded-lg h-80" />
            ))
          ) : (
            popularGames?.slice(0, 24).map((game, index) => (
              <GameCard key={`${game.id}-${game.platform}-${index}`} game={game} />
            ))
          )}
        </div>
      </section>

      {/* Content Section */}
      <section className="prose prose-lg max-w-none">
        <h2 className="text-3xl font-bold mb-6">2025's Best ROMs & Emulators at Emulator Games.net</h2>
        
        <p className="text-lg text-muted-foreground mb-8">
          In the world of retro gaming, finding a reliable platform to download ROMs and emulators can be a challenge. With Emulator Games.net, your search ends here. This website is a one-stop destination for gaming enthusiasts who want to relive the golden era of classic games. Whether you're a fan of Nintendo, PlayStation, Sega, or other consoles, Emulator Games has something for everyone. In this article, we'll explore why EmulatorGames is the best choice for gamers in 2025.
        </p>

        <h3 className="text-2xl font-semibold mb-4">What is EmulatorGames?</h3>
        
        <p className="text-muted-foreground mb-6">
          <Link to="/" className="text-primary hover:underline">Emulator Games</Link> is a platform dedicated to providing 100% working ROMs and emulators. It serves as a bridge between the nostalgic world of classic gaming and the modern-day gamer. With an extensive library of games and emulators, the website ensures you can play your favourite titles from any console, anytime, anywhere.
        </p>

        <h4 className="text-xl font-semibold mb-4">Key Features of Emulator Games</h4>
        
        <ol className="list-decimal list-inside space-y-4 text-muted-foreground mb-8">
          <li>
            <strong className="text-foreground">Wide Range of ROMs</strong><br />
            The platform offers a vast collection of ROMs for various consoles, including:
            <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
              <li>NES (Nintendo Entertainment System)</li>
              <li>SNES (Super Nintendo Entertainment System)</li>
              <li>GBA (Game Boy Advance)</li>
              <li>PlayStation</li>
              <li>Sega Genesis</li>
            </ul>
          </li>
          <li>
            <strong className="text-foreground">Reliable Emulators</strong><br />
            EmulatorGames provides emulators that are:
            <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
              <li>User-friendly</li>
              <li>Highly compatible</li>
              <li>Lightweight</li>
              <li>Regularly updated</li>
            </ul>
          </li>
          <li>
            <strong className="text-foreground">Safe and Secure Downloads</strong><br />
            All downloads are free from malware and viruses, ensuring a safe gaming experience.
          </li>
          <li>
            <strong className="text-foreground">Cross-Platform Compatibility</strong><br />
            Whether you're using Windows, macOS, Android, or iOS, the platform's emulators and ROMs are designed to work seamlessly on all major operating systems.
          </li>
          <li>
            <strong className="text-foreground">Community Support</strong><br />
            The website features forums and a help centre where users can connect, share tips, and resolve issues.
          </li>
        </ol>

        <h3 className="text-2xl font-semibold mb-4">Why Choose Emulator Games.Net?</h3>
        
        <p className="text-muted-foreground mb-6">
          With countless websites offering ROMs and emulators, Emulator Games stands out for several reasons:
        </p>

        <div className="space-y-6 mb-8">
          <div>
            <h4 className="text-lg font-semibold mb-2">1. 100% Working Downloads</h4>
            <p className="text-muted-foreground">
              EmulatorGames.net takes pride in offering ROMs and emulators that work flawlessly. Every file is tested to ensure it delivers a smooth gaming experience.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-2">2. Free Access</h4>
            <p className="text-muted-foreground">
              Unlike many platforms that charge for downloads, Emulator Games is completely free. You can download as many ROMs and emulators as you want without spending a dime.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-2">3. User-Friendly Interface</h4>
            <p className="text-muted-foreground">
              The website's clean and intuitive design makes it easy for users to find and download their favourite games and emulators. Categories and search filters simplify the process.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-2">4. Regular Updates</h4>
            <p className="text-muted-foreground">
              The team behind EmulatorGames is dedicated to keeping the library updated with the latest ROMs and emulator versions. This ensures you always have access to the best tools for retro gaming.
            </p>
          </div>
        </div>

        <h3 className="text-2xl font-semibold mb-4">How to Use Emulator Games</h3>
        
        <p className="text-muted-foreground mb-4">
          Getting started with Emulator Games is simple. Here's a step-by-step guide:
        </p>
        
        <div className="space-y-4 mb-8">
          <div>
            <h4 className="text-lg font-semibold mb-2">Step 1: Visit the Website</h4>
            <p className="text-muted-foreground">
              Navigate to <Link to="/" className="text-primary hover:underline">Emulator-Games.net</Link> on your browser.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-2">Step 2: Search for a ROM or Emulator</h4>
            <p className="text-muted-foreground">
              Use the search bar to find the ROM or emulator you're looking for. You can also browse through categories for inspiration.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-2">Step 3: Download the File</h4>
            <p className="text-muted-foreground">
              Click on the desired ROM or emulator, and hit the download button. Files are typically small, so downloads are quick.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-2">Step 4: Install and Play</h4>
            <p className="text-muted-foreground">
              Install the emulator on your device, load the ROM, and start playing your favorite classic games.
            </p>
          </div>
        </div>

        <h3 className="text-2xl font-semibold mb-4">Popular ROMs and Emulators on Emulator Games.net</h3>
        
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div>
            <h4 className="text-lg font-semibold mb-3">Top ROMs:</h4>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li><strong className="text-foreground">Super Mario Bros.</strong> (NES)</li>
              <li><strong className="text-foreground">The Legend of Zelda: A Link to the Past</strong> (SNES)</li>
              <li><strong className="text-foreground">Pokémon FireRed</strong> (GBA)</li>
              <li><strong className="text-foreground">Final Fantasy VII</strong> (PlayStation)</li>
              <li><strong className="text-foreground">Sonic the Hedgehog</strong> (Sega Genesis)</li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-3">Top Emulators:</h4>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li><strong className="text-foreground">Dolphin Emulator</strong> (GameCube/Wii)</li>
              <li><strong className="text-foreground">PCSX2</strong> (PlayStation 2)</li>
              <li><strong className="text-foreground">ePSXe</strong> (PlayStation 1)</li>
              <li><strong className="text-foreground">VisualBoyAdvance</strong> (GBA)</li>
              <li><strong className="text-foreground">RetroArch</strong> (Multi-platform)</li>
            </ul>
          </div>
        </div>

        <h3 className="text-2xl font-semibold mb-4">Tips for a Better Gaming Experience</h3>
        
        <ol className="list-decimal list-inside space-y-3 text-muted-foreground mb-8">
          <li>
            <strong className="text-foreground">Check System Requirements</strong><br />
            Ensure your device meets the minimum requirements for the emulator you're using.
          </li>
          <li>
            <strong className="text-foreground">Use a Controller</strong><br />
            For an authentic experience, connect a game controller to your device.
          </li>
          <li>
            <strong className="text-foreground">Save Progress</strong><br />
            Most emulators allow you to save your game progress. Use this feature to avoid starting over.
          </li>
          <li>
            <strong className="text-foreground">Stay Updated</strong><br />
            Regularly check for updates to your emulator for improved performance and compatibility.
          </li>
          <li>
            <strong className="text-foreground">Join the Community</strong><br />
            Participate in forums to get tips, share experiences, and connect with fellow gamers.
          </li>
        </ol>

        <h3 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h3>
        
        <div className="space-y-6 mb-8">
          <div>
            <h4 className="text-lg font-semibold mb-2">Is Emulatorgames.net safe?</h4>
            <p className="text-muted-foreground">
              Emulatorgames.net is a safe website to download or play ROMs games online!
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-2">Are the downloads really free?</h4>
            <p className="text-muted-foreground">
              Yes, all ROMs and emulators on Emulator Games are completely free to download and use.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-2">Do I need to register to download?</h4>
            <p className="text-muted-foreground">
              No registration is required. You can browse and download games immediately without creating an account.
            </p>
          </div>
        </div>

        <h3 className="text-2xl font-semibold mb-4">Conclusion</h3>
        
        <p className="text-muted-foreground">
          Emulator Games is the ultimate hub for retro gaming enthusiasts in 2025. With its extensive library of ROMs and emulators, user-friendly interface, and commitment to safety, the platform delivers an unmatched gaming experience. Whether you're revisiting childhood favorites or exploring classics for the first time, EmulatorGames.net has everything you need. Visit the website today and start your journey into the world of retro gaming!
        </p>
      </section>
    </div>
  );
}