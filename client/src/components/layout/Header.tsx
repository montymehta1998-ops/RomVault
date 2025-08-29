import { Link, useLocation } from "wouter";
import { useThemeContext } from "@/components/theme/ThemeProvider";
import { SearchBar } from "@/components/game/SearchBar";

export function Header() {
  const [location] = useLocation();
  const { theme, toggleTheme } = useThemeContext();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center space-x-4">
          <Link to="/" className="flex items-center space-x-2" data-testid="link-logo">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <i className="fas fa-gamepad text-primary-foreground text-lg"></i>
            </div>
            <span className="text-xl font-bold">RetroROMs</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6 text-sm">
            <Link 
              to="/" 
              className={`transition-colors ${location === '/' ? 'text-foreground' : 'text-muted-foreground hover:text-primary'}`}
              data-testid="link-home"
            >
              Home
            </Link>
            <Link 
              to="/categories" 
              className={`transition-colors ${location === '/categories' ? 'text-foreground' : 'text-muted-foreground hover:text-primary'}`}
              data-testid="link-categories"
            >
              Categories
            </Link>
            <Link 
              to="/roms" 
              className={`transition-colors ${location.startsWith('/roms') ? 'text-foreground' : 'text-muted-foreground hover:text-primary'}`}
              data-testid="link-roms"
            >
              ROMs
            </Link>
            <Link 
              to="/popular" 
              className={`transition-colors ${location === '/popular' ? 'text-foreground' : 'text-muted-foreground hover:text-primary'}`}
              data-testid="link-popular"
            >
              Popular
            </Link>
          </nav>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="hidden sm:block">
            <SearchBar />
          </div>
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-secondary hover:bg-accent transition-colors"
            data-testid="button-theme-toggle"
          >
            <i className={`fas ${theme === 'dark' ? 'fa-sun' : 'fa-moon'} text-secondary-foreground`}></i>
          </button>
        </div>
      </div>
    </header>
  );
}
