import { useState } from "react";
import { useLocation } from "wouter";

interface SearchBarProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchBar({ 
  onSearch, 
  placeholder = "Search games...",
  className = "w-64"
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [, setLocation] = useLocation();

  const handleSearch = (value: string) => {
    setQuery(value);
    if (onSearch) {
      onSearch(value);
    } else if (value.trim()) {
      // Global search - navigate to search results
      setLocation(`/search?q=${encodeURIComponent(value.trim())}`);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <input 
        type="search" 
        placeholder={placeholder}
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        className="w-full px-4 py-2 pl-10 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
        data-testid="input-search"
      />
      <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"></i>
    </div>
  );
}
