import { useState, useEffect } from "react";
import { useLocation } from "wouter";

interface SearchBarProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
  className?: string;
  value?: string;
}

export function SearchBar({ 
  onSearch, 
  placeholder = "Search games...",
  className = "w-64",
  value = ""
}: SearchBarProps) {
  const [query, setQuery] = useState(value);
  const [, setLocation] = useLocation();

  // Update local state when value prop changes
  useEffect(() => {
    setQuery(value);
  }, [value]);

  const handleInputChange = (inputValue: string) => {
    setQuery(inputValue);
    // Only trigger local search callback for real-time filtering if provided
    if (onSearch) {
      onSearch(inputValue);
    }
  };

  const handleSearch = () => {
    if (query.trim()) {
      if (onSearch) {
        onSearch(query.trim());
      } else {
        // Global search - navigate to search results
        setLocation(`/search?q=${encodeURIComponent(query.trim())}`);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className={`relative flex ${className}`}>
      <div className="relative flex-1">
        <input 
          type="search" 
          placeholder={placeholder}
          value={query}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyPress={handleKeyPress}
          className="w-full px-4 py-2 pl-10 pr-4 bg-input border border-border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
          data-testid="input-search"
        />
        <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"></i>
      </div>
      <button
        onClick={handleSearch}
        className="px-4 py-2 bg-primary text-primary-foreground rounded-r-lg hover:bg-primary/90 transition-colors border border-l-0 border-border"
        data-testid="button-search"
      >
        <i className="fas fa-search"></i>
      </button>
    </div>
  );
}
