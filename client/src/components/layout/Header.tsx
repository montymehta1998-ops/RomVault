import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useThemeContext } from "@/components/theme/ThemeProvider";
import { SearchBar } from "@/components/game/SearchBar";
import type { CategoryData } from "@shared/schema";

export function Header() {
  const [location] = useLocation();
  const { theme, toggleTheme } = useThemeContext();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const { data: categories } = useQuery<CategoryData[]>({
    queryKey: ["/api/categories"],
  });
  
  // Get top 8 categories by game count
  const topCategories = categories?.sort((a, b) => b.gameCount - a.gameCount).slice(0, 8) || [];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center space-x-4">
          <Link to="/" className="flex items-center space-x-2" data-testid="link-logo">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <i className="fas fa-gamepad text-primary-foreground text-lg"></i>
            </div>
            <span className="text-xl font-bold">EmulatorGames</span>
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
              to="/all-consoles" 
              className={`transition-colors ${location === '/all-consoles' ? 'text-foreground' : 'text-muted-foreground hover:text-primary'}`}
              data-testid="link-all-consoles"
            >
              All Consoles
            </Link>
            <div className="relative">
              <button
                onMouseEnter={() => setIsDropdownOpen(true)}
                onMouseLeave={() => setIsDropdownOpen(false)}
                className={`transition-colors flex items-center ${location.startsWith('/category') ? 'text-foreground' : 'text-muted-foreground hover:text-primary'}`}
                data-testid="button-categories"
              >
                Categories
                <i className="fas fa-chevron-down ml-1 text-xs"></i>
              </button>
              
              {/* Categories Dropdown */}
              {isDropdownOpen && (
                <div 
                  className="absolute top-full left-0 mt-2 w-64 bg-background border border-border rounded-lg shadow-lg z-50"
                  onMouseEnter={() => setIsDropdownOpen(true)}
                  onMouseLeave={() => setIsDropdownOpen(false)}
                >
                  <div className="p-2">
                    <div className="text-xs text-muted-foreground px-3 py-2 font-semibold">Top Categories</div>
                    <div className="grid grid-cols-1 gap-1">
                      {topCategories.map((category) => (
                        <Link
                          key={category.id}
                          to={`/category/${category.id}`}
                          className="flex items-center justify-between px-3 py-2 text-sm rounded hover:bg-accent transition-colors"
                          data-testid={`link-category-${category.id}`}
                        >
                          <span>{category.name}</span>
                          <span className="text-xs text-muted-foreground">{category.gameCount}</span>
                        </Link>
                      ))}
                    </div>
                    <div className="border-t border-border mt-2 pt-2">
                      <Link
                        to="/all-consoles"
                        className="block px-3 py-2 text-sm text-primary hover:bg-accent rounded transition-colors"
                        data-testid="link-view-all-categories"
                      >
                        View All Categories →
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <Link 
              to="/roms" 
              className={`transition-colors ${location.startsWith('/roms') ? 'text-foreground' : 'text-muted-foreground hover:text-primary'}`}
              data-testid="link-roms"
            >
              ROMs
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
          
          {/* Mobile menu button */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-secondary hover:bg-accent transition-colors"
            data-testid="button-mobile-menu"
          >
            <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'} text-secondary-foreground`}></i>
          </button>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="container mx-auto px-4 py-4 space-y-4">
            {/* Mobile search */}
            <div className="sm:hidden">
              <SearchBar />
            </div>
            
            {/* Mobile navigation */}
            <nav className="flex flex-col space-y-2">
              <Link 
                to="/" 
                className={`p-2 rounded-lg transition-colors ${location === '/' ? 'bg-accent text-foreground' : 'text-muted-foreground hover:text-primary hover:bg-accent'}`}
                data-testid="link-mobile-home"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <i className="fas fa-home mr-2"></i>
                Home
              </Link>
              <Link 
                to="/all-consoles" 
                className={`p-2 rounded-lg transition-colors ${location === '/all-consoles' ? 'bg-accent text-foreground' : 'text-muted-foreground hover:text-primary hover:bg-accent'}`}
                data-testid="link-mobile-all-consoles"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <i className="fas fa-th-large mr-2"></i>
                All Consoles
              </Link>
              <Link 
                to="/roms" 
                className={`p-2 rounded-lg transition-colors ${location.startsWith('/roms') ? 'bg-accent text-foreground' : 'text-muted-foreground hover:text-primary hover:bg-accent'}`}
                data-testid="link-mobile-roms"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <i className="fas fa-gamepad mr-2"></i>
                ROMs
              </Link>
              
              {/* Mobile Categories */}
              <div className="px-2 py-2">
                <div className="text-xs text-muted-foreground font-semibold mb-2">Top Categories</div>
                <div className="grid grid-cols-2 gap-1">
                  {topCategories.slice(0, 6).map((category) => (
                    <Link
                      key={category.id}
                      to={`/category/${category.id}`}
                      className="block px-2 py-1 text-xs rounded hover:bg-accent transition-colors"
                      data-testid={`link-mobile-category-${category.id}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
