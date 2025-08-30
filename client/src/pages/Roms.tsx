import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useRoute, useLocation } from "wouter";
import { GameCard } from "@/components/game/GameCard";
import { SearchBar } from "@/components/game/SearchBar";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import type { GameData } from "@shared/schema";

export default function Roms() {
  const [location] = useLocation();
  const [match, params] = useRoute("/roms/:console?");
  const [searchMatch] = useRoute("/search");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"downloads" | "rating" | "year" | "title">("downloads");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedConsole, setSelectedConsole] = useState<string>(params?.console || "");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const limit = 20;

  // Handle search from URL parameters
  useEffect(() => {
    if (searchMatch) {
      const urlParams = new URLSearchParams(window.location.search);
      const searchQuery = urlParams.get('q') || '';
      setSearch(searchQuery);
      setCurrentPage(1); // Reset page when search changes
    } else {
      setSearch(''); // Clear search when not on search page
    }
  }, [searchMatch, location]); // Add location as dependency to react to URL changes

  // Reset state when navigating to different console or clearing filters
  useEffect(() => {
    if (!params?.console) {
      setSelectedConsole('');
      setSelectedCategory('');
      setCurrentPage(1);
    }
  }, [params?.console, location]);

  // Update selectedConsole when URL changes and handle redirects
  useEffect(() => {
    if (params?.console) {
      // Handle redirects: if URL doesn't end with -roms, redirect to -roms version
      if (!params.console.endsWith('-roms')) {
        const newUrl = `/roms/${params.console}-roms`;
        window.history.replaceState({}, '', newUrl);
      }
      
      // Remove -roms suffix and convert to proper console name
      let consoleName = params.console;
      if (consoleName.endsWith('-roms')) {
        consoleName = consoleName.slice(0, -5);
      }
      
      // Convert hyphenated console name to actual console names used in the API
      // This maps from URL format (capcom-play-system-1) to API format (CPS 1)
      const consoleNameMapping: Record<string, string> = {
        'capcom-play-system-1': 'CPS 1',
        'capcom-play-system-2': 'CPS 2', 
        'capcom-play-system-3': 'CPS 3',
        'cps1': 'CPS 1',
        'cps2': 'CPS 2',
        'cps3': 'CPS 3',
        'acorn-archimedes': 'Acorn Archimedes',
        'acorn-atom': 'Acorn Atom',
        'action-max': 'Action Max',
        'apple-2-gs': 'Apple II GS',
        'apple-ii-gs': 'Apple II GS',
        'apple-2': 'Apple II',
        'apple-ii': 'Apple II',
        'amstrad-cpc': 'Amstrad CPC',
        'amstrad-gx4000': 'GX4000',
        'atari-2600': 'Atari 2600',
        'atari-5200': 'Atari 5200',
        'atari-7800': 'Atari 7800',
        'atari-8-bit': 'Atari 800',
        'atari-800': 'Atari 800',
        'atari-jaguar': 'Atari Jaguar',
        'atari-lynx': 'Atari Lynx',
        'atari-st': 'Atari ST',
        'bally-astrocade': 'Bally Arcade',
        'bbc-micro': 'BBC Micro',
        'cd-i': 'CD-i',
        'commodore-64-preservation': 'C64 Preservation',
        'commodore-64-tapes': 'C64 Tapes',
        'commodore-vic-20': 'Commodore VIC-20',
        'gameboy-color': 'GBC',
        'game-boy-color': 'GBC',
        'gameboy': 'GB',
        'game-boy': 'GB',
        'game-boy-advance': 'GBA',
        'gba': 'GBA',
        'gamecube': 'GameCube',
        'game-gear': 'Game Gear',
        'sega-game-gear': 'Game Gear',
        'gce-vectrex': 'Vectrex',
        'vectrex': 'Vectrex',
        'magnavox-odyssey-2': 'Magnavox Odyssey 2',
        'msx-2': 'MSX2',
        'msx2': 'MSX2',
        'msx': 'MSX',
        'n-gage': 'N-Gage',
        'neo-geo-pocket': 'NGP',
        'neo-geo': 'Neo Geo',
        'new-geo': 'Neo Geo',
        'nintendo-64': 'N64',
        'n64': 'N64',
        'nintendo-ds': 'NDS',
        'nds': 'NDS',
        'nintendo-wii': 'Wii',
        'wii': 'Wii',
        'nintendo-wii-u': 'Wii U',
        'wii-u': 'Wii U',
        'nintendo-switch': 'Switch',
        'switch': 'Switch',
        'nes': 'NES',
        'nintendo-entertainment-system': 'NES',
        'snes': 'SNES',
        'super-nintendo': 'SNES',
        'famicom': 'Famicom',
        'pc-fx': 'PC-FX',
        'playstation': 'PSX',
        'playstation-1': 'PSX',
        'psx': 'PSX',
        'playstation-2': 'PS2',
        'ps2': 'PS2',
        'playstation-3': 'PS3', 
        'ps3': 'PS3',
        'playstation-4': 'PS4',
        'ps4': 'PS4',
        'playstation-portable': 'PSP',
        'psp': 'PSP',
        'playstation-vita': 'PS Vita',
        'ps-vita': 'PS Vita',
        'pokemon-mini': 'Pokemon Mini',
        'sam-coupe': 'SAM Coupe',
        'sega-32x': '32X',
        '32x': '32X',
        'sega-cd': 'Sega CD',
        'sega-dreamcast': 'Dreamcast',
        'dreamcast': 'Dreamcast',
        'sega-genesis': 'Genesis',
        'genesis': 'Genesis',
        'sega-master-system': 'Master System',
        'master-system': 'Master System',
        'sega-saturn': 'Saturn',
        'saturn': 'Saturn',
        'sg-1000': 'SG-1000',
        'super-cassette-vision': 'Super Cassette Vision',
        'tandy-trs-80': 'TRS-80',
        'trs-80': 'TRS-80',
        'tatung-einstein': 'Tatung Einstein',
        'tiger-game-com': 'Game com',
        'game-com': 'Game com',
        'trs-80-color-computer': 'TRS-80 Color Computer',
        'turbo-duo': 'TurboGrafx-16',
        'turbografx-16': 'TurboGrafx-16',
        'virtual-boy': 'Virtual Boy',
        'watara-supervision': 'Watara Supervision',
        'wonderswan-color': 'WonderSwan Color',
        'wonderswan': 'WonderSwan',
        'xbox': 'Xbox',
        'xbox-one': 'Xbox One',
        'xbox-360': 'Xbox 360',
        'z-machine': 'Z-Machine',
        'zx-spectrum': 'ZX Spectrum'
      };
      
      const mappedConsoleName = consoleNameMapping[consoleName] || 
        consoleName.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
      
      setSelectedConsole(mappedConsoleName);
    }
  }, [params?.console]);

  const { data: consoles } = useQuery<string[]>({
    queryKey: ["/api/consoles"],
  });

  // Get current search from URL if on search page, otherwise use local search state
  const currentSearch = useMemo(() => {
    if (searchMatch) {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get('q') || '';
    }
    return search;
  }, [searchMatch, location, search]);

  const { data: romsData, isLoading } = useQuery<{ games: GameData[]; total: number }>({
    queryKey: ["/api/roms", selectedConsole, selectedCategory, currentSearch, sortBy, currentPage, limit],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedConsole) params.append('console', selectedConsole);
      if (selectedCategory) params.append('category', selectedCategory);
      if (currentSearch) params.append('search', currentSearch);
      params.append('sortBy', sortBy);
      params.append('page', currentPage.toString());
      params.append('limit', limit.toString());
      
      const response = await fetch(`/api/roms?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch ROMs');
      return response.json();
    },
  });

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [currentSearch, sortBy, selectedConsole, selectedCategory]);

  // Scroll to top when page changes (for pagination)
  useEffect(() => {
    if (searchMatch) {
      window.scrollTo(0, 0);
    }
  }, [currentPage, searchMatch]);

  const totalPages = romsData ? Math.ceil(romsData.total / limit) : 0;
  const startIndex = (currentPage - 1) * limit + 1;
  const endIndex = Math.min(startIndex + limit - 1, romsData?.total || 0);

  // Get unique categories from current filtered games (for the current console)
  const { data: allRomsData } = useQuery<{ games: GameData[]; total: number }>({
    queryKey: ["/api/roms", selectedConsole], // Only get games for selected console
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedConsole) params.append('console', selectedConsole);
      
      const response = await fetch(`/api/roms?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch ROMs');
      return response.json();
    },
  });

  const categories = allRomsData ? 
    Array.from(new Set(allRomsData.games.map(game => game.category))).sort() : 
    [];

  // Console-specific information for SEO
  const getConsoleInfo = (consoleName: string) => {
    const consoleData: Record<string, { title: string; description: string; displayTitle?: string; displayDescription?: string; info: string }> = {
      'PSP': {
        title: 'PSP Roms Download Now - Emulator Games',
        description: 'Check out all Emulator Games PSP Roms. You can easily download PSP Roms for free from our website. Our team has collected the best and high-speed download links of all PSP (PlayStation Portable).',
        displayTitle: 'PlayStation Portable (PSP) ROMs',
        displayDescription: 'Browse our complete collection of PlayStation Portable (PSP) ROMs. Download classic PSP games and enjoy portable gaming.',
        info: `The PlayStation Portable (PSP) was Sony's revolutionary handheld gaming console launched in 2004. Featuring console-quality graphics on a portable device, the PSP introduced the Universal Media Disc (UMD) format and offered multimedia capabilities including video playback, web browsing, and music. With its 4.3-inch LCD screen and powerful hardware, the PSP delivered exceptional gaming experiences with titles like God of War: Chains of Olympus, Grand Theft Auto: Vice City Stories, and Monster Hunter series. The system sold over 80 million units worldwide and established Sony as a major player in the handheld gaming market, paving the way for modern portable gaming devices.`
      },
      'N64': {
        title: 'N64 Roms Download Now - Emulator Games',
        description: 'Check out all Emulator Games N64 Roms. You can easily download N64 Roms for free from our website. Our team has collected the best and high-speed download links of all N64 (Nintendo 64).',
        displayTitle: 'Nintendo 64 (N64) ROMs',
        displayDescription: 'Browse our complete collection of Nintendo 64 (N64) ROMs. Download classic N64 games and relive the golden age of gaming.',
        info: `The Nintendo 64, released in 1996, revolutionized gaming with its groundbreaking 64-bit architecture and innovative three-pronged controller featuring the industry's first analog stick. This powerful console introduced true 3D gaming to the mainstream with legendary titles like Super Mario 64, The Legend of Zelda: Ocarina of Time, and GoldenEye 007. The N64's cartridge-based games offered instant loading and durability, while built-in 4-player support made it the ultimate party gaming console. With over 32 million units sold worldwide, the Nintendo 64 established many gaming conventions still used today and remains one of the most beloved consoles in gaming history.`
      },
      'SNES': {
        title: 'SNES Roms Download Now - Emulator Games',
        description: 'Check out all Emulator Games SNES Roms. You can easily download SNES Roms for free from our website. Our team has collected the best and high-speed download links of all SNES (Super Nintendo).',
        displayTitle: 'Super Nintendo (SNES) ROMs',
        displayDescription: 'Browse our complete collection of Super Nintendo (SNES) ROMs. Download classic SNES games and experience 16-bit gaming perfection.',
        info: `The Super Nintendo Entertainment System (SNES), launched in 1991, defined the golden age of 16-bit gaming with its revolutionary Mode 7 graphics and superior sound capabilities. This iconic console delivered legendary games like Super Mario World, The Legend of Zelda: A Link to the Past, Super Metroid, and Chrono Trigger. The SNES featured advanced graphics with rotation and scaling effects, true stereo sound, and the first controller with shoulder buttons. With 49.1 million units sold worldwide, the SNES won the fierce console wars of the 1990s and is widely regarded as one of the greatest gaming consoles ever created, hosting a library of timeless classics that continue to influence game design today.`
      },
      'PS2': {
        title: 'PS2 Roms Download Now - Emulator Games',
        description: 'Check out all Emulator Games PS2 Roms. You can easily download PS2 Roms for free from our website. Our team has collected the best and high-speed download links of all PS2 (PlayStation 2).',
        displayTitle: 'PlayStation 2 (PS2) ROMs',
        displayDescription: 'Browse our complete collection of PlayStation 2 (PS2) ROMs. Download classic PS2 games from the best-selling console of all time.',
        info: `The PlayStation 2, released in 2000, became the best-selling video game console in history with over 155 million units sold worldwide. This groundbreaking system introduced DVD playback, backward compatibility with original PlayStation games, and delivered exceptional gaming experiences with titles like Grand Theft Auto: San Andreas, God of War series, and Final Fantasy X. The PS2's diverse library included over 3,800 games across every genre, making it appealing to all types of gamers. Its 12-year production run and massive third-party support established Sony's dominance in the gaming industry and created a legacy that influences console design to this day.`
      },
      'PSX': {
        title: 'PSX Roms Download Now - Emulator Games',
        description: 'Check out all Emulator Games PSX Roms. You can easily download PSX Roms for free from our website. Our team has collected the best and high-speed download links of all PSX (PlayStation).',
        displayTitle: 'PlayStation (PSX) ROMs',
        displayDescription: 'Browse our complete collection of original PlayStation (PSX) ROMs. Download classic PS1 games that defined a generation.',
        info: `The original PlayStation, launched in 1994, revolutionized the gaming industry by bringing 3D graphics and CD-ROM technology to mainstream gaming. Sony's debut console dethroned Nintendo's dominance with superior graphics, mature game content, and strong third-party support. Iconic games like Final Fantasy VII, Metal Gear Solid, Resident Evil, and Gran Turismo established new franchises and gaming genres. The PlayStation sold over 102 million units worldwide and introduced features like analog controls, vibration feedback, and multi-disc games, setting the foundation for modern gaming and establishing Sony as a major force in the video game industry.`
      },
      'GBA': {
        title: 'GBA Roms Download Now - Emulator Games',
        description: 'Check out all Emulator Games GBA Roms. You can easily download GBA Roms for free from our website. Our team has collected the best and high-speed download links of all GBA (Game Boy Advance).',
        displayTitle: 'Game Boy Advance (GBA) ROMs',
        displayDescription: 'Browse our complete collection of Game Boy Advance (GBA) ROMs. Download classic GBA games and portable gaming favorites.',
        info: `The Game Boy Advance, released in 2001, advanced portable gaming with its 32-bit processor and vibrant color display. This revolutionary handheld featured backward compatibility with Game Boy and Game Boy Color games, ensuring access to Nintendo's extensive portable gaming library. The GBA delivered console-quality experiences in games like The Legend of Zelda: The Minish Cap, Pokémon Ruby/Sapphire, and Metroid Fusion. With over 81 million units sold worldwide, the Game Boy Advance maintained Nintendo's dominance in the handheld market and provided the foundation for the dual-screen innovation that would follow with the Nintendo DS.`
      },
      'NES': {
        title: 'NES Roms Download Now - Emulator Games',
        description: 'Check out all Emulator Games NES Roms. You can easily download NES Roms for free from our website. Our team has collected the best and high-speed download links of all NES (Nintendo Entertainment System).',
        displayTitle: 'Nintendo Entertainment System (NES) ROMs',
        displayDescription: 'Browse our complete collection of Nintendo Entertainment System (NES) ROMs. Download classic NES games that saved the video game industry.',
        info: `The Nintendo Entertainment System (NES), released in 1985, single-handedly revived the video game industry after the 1983 crash. This revolutionary 8-bit console introduced legendary franchises like Super Mario Bros., The Legend of Zelda, and Metroid. The NES featured the iconic D-pad controller and established many gaming conventions still used today. With classics like Super Mario Bros. 3, Mega Man series, and Final Fantasy, the NES sold over 61 million units worldwide and laid the foundation for Nintendo's gaming empire, making it one of the most important and influential consoles in gaming history.`
      },
      'Genesis': {
        title: 'Genesis Roms Download Now - Emulator Games',
        description: 'Check out all Emulator Games Genesis Roms. You can easily download Genesis Roms for free from our website. Our team has collected the best and high-speed download links of all Genesis (Sega Genesis).',
        displayTitle: 'Sega Genesis ROMs',
        displayDescription: 'Browse our complete collection of Sega Genesis ROMs. Download classic Genesis games and experience Sega\'s 16-bit powerhouse.',
        info: `The Sega Genesis (known as Mega Drive outside North America), released in 1988, challenged Nintendo's dominance with its "blast processing" and edgier game library. This 16-bit console featured iconic games like Sonic the Hedgehog, Streets of Rage, and Phantasy Star series. The Genesis was known for its superior arcade ports and mature content, appealing to older gamers with titles like Mortal Kombat. With over 30 million units sold worldwide, the Genesis established Sega as a major player in the console wars and created a legacy of fast-paced, action-packed gaming that defined the early 1990s.`
      },
      'GB': {
        title: 'GB Roms Download Now - Emulator Games',
        description: 'Check out all Emulator Games GB Roms. You can easily download GB Roms for free from our website. Our team has collected the best and high-speed download links of all GB (Game Boy).',
        displayTitle: 'Game Boy ROMs',
        displayDescription: 'Browse our complete collection of original Game Boy ROMs. Download classic Game Boy games that defined portable gaming.',
        info: `The original Game Boy, released in 1989, revolutionized portable gaming with its monochrome screen and incredible battery life. Despite being less powerful than competing handhelds, the Game Boy's affordability and killer app Tetris made it an instant success. The system featured legendary games like Pokémon Red/Blue, Super Mario Land, and The Legend of Zelda: Link's Awakening. With over 118 million units sold worldwide, the Game Boy established Nintendo's dominance in the handheld market and proved that gameplay matters more than graphics, creating a portable gaming revolution that continues to this day.`
      },
      'GBC': {
        title: 'GBC Roms Download Now - Emulator Games',
        description: 'Check out all Emulator Games GBC Roms. You can easily download GBC Roms for free from our website. Our team has collected the best and high-speed download links of all GBC (Game Boy Color).',
        displayTitle: 'Game Boy Color ROMs',
        displayDescription: 'Browse our complete collection of Game Boy Color ROMs. Download classic GBC games with vibrant color graphics.',
        info: `The Game Boy Color, released in 1998, brought vibrant color graphics to Nintendo's successful handheld gaming formula. This enhanced Game Boy featured backward compatibility with original Game Boy games while offering new color-exclusive titles. The system showcased games like Pokémon Gold/Silver, The Legend of Zelda: Oracle series, and Super Mario Bros. Deluxe. With over 118 million units sold across both Game Boy models, the Game Boy Color extended the life of the Game Boy platform and served as a bridge between the original Game Boy and the more advanced Game Boy Advance, maintaining Nintendo's portable gaming dominance.`
      },
      'Dreamcast': {
        title: 'Dreamcast Roms Download Now - Emulator Games',
        description: 'Check out all Emulator Games Dreamcast Roms. You can easily download Dreamcast Roms for free from our website. Our team has collected the best and high-speed download links of all Dreamcast (Sega Dreamcast).',
        displayTitle: 'Sega Dreamcast ROMs',
        displayDescription: 'Browse our complete collection of Sega Dreamcast ROMs. Download classic Dreamcast games from Sega\'s innovative final console.',
        info: `The Sega Dreamcast, released in 1998, was Sega's innovative final home console that pioneered online gaming and featured stunning graphics. Despite its technological superiority and built-in modem for internet connectivity, the Dreamcast faced fierce competition from Sony's PlayStation 2. The system delivered exceptional games like Shenmue, Jet Set Radio, Crazy Taxi, and Sonic Adventure. With its unique library of creative and experimental games, the Dreamcast sold 9.13 million units worldwide and developed a passionate cult following. Though discontinued in 2001, the Dreamcast is remembered as ahead of its time and influenced many modern gaming concepts.`
      },
      'NDS': {
        title: 'NDS Roms Download Now - Emulator Games',
        description: 'Check out all Emulator Games NDS Roms. You can easily download NDS Roms for free from our website. Our team has collected the best and high-speed download links of all NDS (Nintendo DS).',
        displayTitle: 'Nintendo DS ROMs',
        displayDescription: 'Browse our complete collection of Nintendo DS ROMs. Download classic NDS games with dual-screen gaming innovation.',
        info: `The Nintendo DS, released in 2004, revolutionized portable gaming with its innovative dual-screen design and touch screen controls. This groundbreaking handheld featured backward compatibility with Game Boy Advance games and introduced a new era of interactive gaming. The DS showcased legendary games like Nintendogs, Brain Age, New Super Mario Bros., and Pokémon Diamond/Pearl. With over 154 million units sold worldwide, the Nintendo DS became the best-selling handheld console in history and proved that innovation in hardware design could create entirely new gaming experiences.`
      },
      'Wii': {
        title: 'Wii Roms Download Now - Emulator Games',
        description: 'Check out all Emulator Games Wii Roms. You can easily download Wii Roms for free from our website. Our team has collected the best and high-speed download links of all Wii (Nintendo Wii).',
        displayTitle: 'Nintendo Wii ROMs',
        displayDescription: 'Browse our complete collection of Nintendo Wii ROMs. Download classic Wii games with motion controls.',
        info: `The Nintendo Wii, released in 2006, revolutionized gaming with its motion-sensing controls and brought video games to mainstream audiences worldwide. This innovative console featured the Wii Remote controller that detected movement in three-dimensional space, creating immersive gaming experiences. The Wii delivered iconic games like Wii Sports, Super Mario Galaxy, The Legend of Zelda: Twilight Princess, and Mario Kart Wii. With over 101 million units sold worldwide, the Wii became Nintendo's best-selling home console and demonstrated that innovative gameplay could triumph over raw processing power.`
      },
      'GameCube': {
        title: 'GameCube Roms Download Now - Emulator Games',
        description: 'Check out all Emulator Games GameCube Roms. You can easily download GameCube Roms for free from our website. Our team has collected the best and high-speed download links of all GameCube (Nintendo GameCube).',
        displayTitle: 'Nintendo GameCube ROMs',
        displayDescription: 'Browse our complete collection of Nintendo GameCube ROMs. Download classic GameCube games with innovative gameplay.',
        info: `The Nintendo GameCube, released in 2001, was Nintendo's powerful 6th generation console that featured distinctive cube design and miniDVD discs. Despite being the least successful of Nintendo's major home consoles, the GameCube delivered exceptional first-party games like Super Mario Sunshine, The Legend of Zelda: Wind Waker, Metroid Prime, and Super Smash Bros. Melee. With over 21 million units sold worldwide, the GameCube is remembered for its high-quality exclusive games and innovative controller design that influenced future Nintendo controllers.`
      },
      'Saturn': {
        title: 'Saturn Roms Download Now - Emulator Games',
        description: 'Check out all Emulator Games Saturn Roms. You can easily download Saturn Roms for free from our website. Our team has collected the best and high-speed download links of all Saturn (Sega Saturn).',
        displayTitle: 'Sega Saturn ROMs',
        displayDescription: 'Browse our complete collection of Sega Saturn ROMs. Download classic Saturn games with advanced 2D graphics.',
        info: `The Sega Saturn, released in 1994, was Sega's 32-bit console that competed with Sony's PlayStation and Nintendo 64. Known for its complex dual-CPU architecture and exceptional 2D graphics capabilities, the Saturn excelled at arcade-perfect ports and fighting games. The system featured legendary games like Nights into Dreams, Panzer Dragoon series, Virtua Fighter 2, and Guardian Heroes. With 9.26 million units sold worldwide, the Saturn found greater success in Japan than Western markets and is remembered for its unique library of creative and technically impressive games.`
      }
    };
    
    return consoleData[consoleName] || {
      title: `${consoleName} Roms Download Now - Emulator Games`,
      description: `Check out all Emulator Games ${consoleName} Roms. You can easily download ${consoleName} Roms for free from our website. Our team has collected the best and high-speed download links of all ${consoleName}.`,
      displayTitle: `${consoleName} ROMs`,
      displayDescription: `Browse our complete collection of ${consoleName} ROMs. Download classic ${consoleName} games and enjoy retro gaming.`,
      info: `The ${consoleName} console offered unique gaming experiences with a diverse library of classic games. Explore our collection of ${consoleName} ROMs and rediscover the games that made this system special.`
    };
  };

  const consoleInfo = selectedConsole ? getConsoleInfo(selectedConsole) : null;

  // Set page title and meta description based on console
  useEffect(() => {
    if (selectedConsole && consoleInfo) {
      document.title = consoleInfo.title;
      
      let metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.setAttribute('name', 'description');
        document.head.appendChild(metaDescription);
      }
      metaDescription.setAttribute('content', consoleInfo.description);
    } else if (searchMatch && currentSearch) {
      document.title = `Search Results for "${currentSearch}" - EmulatorGames.net`;
    } else {
      document.title = 'ROMs Archive - Browse All Gaming ROMs - EmulatorGames.net';
    }
  }, [selectedConsole, consoleInfo, searchMatch, currentSearch]);

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Page Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4" data-testid="text-roms-title">
          {searchMatch && currentSearch ? 
            `Search Results for "${currentSearch}"` : 
            (selectedConsole && consoleInfo ? (consoleInfo.displayTitle || consoleInfo.title) : "ROMs Archive")
          }
        </h1>
        <p className="text-sm text-muted-foreground max-w-2xl mx-auto" data-testid="text-roms-description">
          {searchMatch && currentSearch ? 
            `Found ${romsData?.total || 0} games matching "${currentSearch}"` : 
            (selectedConsole && consoleInfo ? (consoleInfo.displayDescription || consoleInfo.description) : 
             "Browse our complete collection of retro gaming ROMs. Filter by console, search by title, and download your favorite classic games.")
          }
        </p>
      </div>

      {/* Filters (Search removed from console pages) */}
      <div className={`grid grid-cols-1 gap-4 mb-8 ${!searchMatch && !selectedConsole ? 'md:grid-cols-4' : 'md:grid-cols-3'}`}>
        {!searchMatch && !selectedConsole && (
          <SearchBar 
            placeholder="Search ROMs..."
            className="w-full"
          />
        )}
        
        <Select value={selectedConsole || "all-consoles"} onValueChange={(value) => setSelectedConsole(value === "all-consoles" ? "" : value)}>
          <SelectTrigger data-testid="select-console-filter">
            <SelectValue placeholder="Filter by Console" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-consoles">All Consoles</SelectItem>
            {consoles?.map(console => (
              <SelectItem key={console} value={console}>
                {console}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedCategory || "all-categories"} onValueChange={(value) => setSelectedCategory(value === "all-categories" ? "" : value)}>
          <SelectTrigger data-testid="select-category-filter">
            <SelectValue placeholder="Filter by Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-categories">All Categories</SelectItem>
            {categories.map(category => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
          <SelectTrigger data-testid="select-sort-by">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="downloads">Most Downloaded</SelectItem>
            <SelectItem value="rating">Highest Rated</SelectItem>
            <SelectItem value="year">Newest First</SelectItem>
            <SelectItem value="title">Alphabetical</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Results Summary */}
      {romsData && !isLoading && (
        <div className="flex items-center justify-between mb-6">
          <p className="text-muted-foreground" data-testid="text-results-summary">
            {romsData.total === 0 ? "No ROMs found" : 
             `Showing ${startIndex}-${endIndex} of ${romsData.total.toLocaleString()} ROMs`}
          </p>
        </div>
      )}

      {/* ROMs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="loading-skeleton rounded-lg h-80" />
          ))
        ) : romsData && romsData.games.length > 0 ? (
          romsData.games.map((game, index) => (
            <GameCard key={`${game.id}-${game.platform}-${index}`} game={game} />
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-muted-foreground" data-testid="text-no-roms">
              {currentSearch ? `No ROMs found matching "${currentSearch}"` : "No ROMs found"}
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {romsData && romsData.total > limit && (
        <div className="flex items-center justify-center space-x-2 mt-12">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            data-testid="button-roms-pagination-prev"
          >
            Previous
          </Button>
          
          {/* Page numbers */}
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum;
            if (totalPages <= 5) {
              pageNum = i + 1;
            } else if (currentPage <= 3) {
              pageNum = i + 1;
            } else if (currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + i;
            } else {
              pageNum = currentPage - 2 + i;
            }

            const isActive = pageNum === currentPage;
            
            return (
              <Button
                key={pageNum}
                variant={isActive ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(pageNum)}
                data-testid={`button-roms-pagination-${pageNum}`}
              >
                {pageNum}
              </Button>
            );
          })}

          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            data-testid="button-roms-pagination-next"
          >
            Next
          </Button>
        </div>
      )}

      {/* Console Information Section */}
      {selectedConsole && consoleInfo && !searchMatch && (
        <div className="mt-16 bg-muted/30 rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-4 text-foreground">
            About the {selectedConsole}
          </h2>
          <div className="prose prose-lg max-w-none">
            <p className="text-foreground/80 leading-relaxed">
              {consoleInfo.info}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}