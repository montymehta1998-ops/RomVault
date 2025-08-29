import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <i className="fas fa-gamepad text-primary-foreground text-lg"></i>
              </div>
              <span className="text-xl font-bold">EmulatorGames</span>
            </div>
            <p className="text-muted-foreground mb-4 max-w-md">
              At Emulator Games, we do not encourage or promote the downloading of ROMs, not even for discontinued titles. Therefore, we do not host or link to any copyrighted content.
            </p>
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
            © 2025 EmulatorGames. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
