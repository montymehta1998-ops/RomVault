import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <i className="fas fa-gamepad text-primary-foreground text-lg"></i>
              </div>
              <span className="text-xl font-bold">RetroROMs</span>
            </div>
            <p className="text-muted-foreground mb-4 max-w-md">
              Your ultimate destination for classic video game ROMs. Preserving gaming history 
              one ROM at a time, bringing retro gaming to modern devices.
            </p>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="text-muted-foreground hover:text-primary transition-colors"
                data-testid="link-twitter"
              >
                <i className="fab fa-twitter text-xl"></i>
              </a>
              <a 
                href="#" 
                className="text-muted-foreground hover:text-primary transition-colors"
                data-testid="link-discord"
              >
                <i className="fab fa-discord text-xl"></i>
              </a>
              <a 
                href="#" 
                className="text-muted-foreground hover:text-primary transition-colors"
                data-testid="link-reddit"
              >
                <i className="fab fa-reddit text-xl"></i>
              </a>
              <a 
                href="#" 
                className="text-muted-foreground hover:text-primary transition-colors"
                data-testid="link-github"
              >
                <i className="fab fa-github text-xl"></i>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <Link to="/popular" className="hover:text-primary transition-colors" data-testid="link-popular-games">
                  Popular Games
                </Link>
              </li>
              <li>
                <Link to="/categories" className="hover:text-primary transition-colors" data-testid="link-all-categories">
                  All Categories
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors" data-testid="link-random-game">
                  Random Game
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <Link to="/about" className="hover:text-primary transition-colors" data-testid="link-about">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-primary transition-colors" data-testid="link-contact">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-primary transition-colors" data-testid="link-privacy">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-primary transition-colors" data-testid="link-terms">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-muted-foreground text-sm">
            © 2024 RetroROMs Archive. All rights reserved.
          </p>
          <p className="text-muted-foreground text-sm mt-2 md:mt-0">
            Built with React & Express.js
          </p>
        </div>
      </div>
    </footer>
  );
}
