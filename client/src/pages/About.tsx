import { useEffect } from "react";

export default function About() {
  useEffect(() => {
    document.title = "About Us - EmulatorGames";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 
        "Learn more about EmulatorGames - your trusted source for classic video game ROMs and emulators."
      );
    }
  }, []);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center" data-testid="text-about-title">
          About EmulatorGames
        </h1>
        
        <div className="prose prose-lg max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">Our Mission</h2>
            <p className="text-foreground/80 mb-6">
              EmulatorGames is dedicated to preserving gaming history and making classic video games accessible to everyone. 
              We believe that retro gaming is an important part of digital culture and should be preserved for future generations.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">What We Offer</h2>
            <p className="text-foreground/80 mb-4">
              Our platform provides access to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-foreground/80 mb-6">
              <li>Comprehensive collection of classic video game ROMs</li>
              <li>Compatible emulators for various gaming platforms</li>
              <li>User-friendly interface for easy navigation</li>
              <li>Regular updates and maintenance</li>
              <li>Safe and secure downloads</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">Our Commitment</h2>
            <p className="text-foreground/80 mb-6">
              We are committed to providing a safe and reliable platform for retro gaming enthusiasts. 
              All content on our website is carefully curated and tested to ensure the best possible user experience.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">Join Our Community</h2>
            <p className="text-foreground/80">
              Whether you're a longtime retro gaming fan or just discovering classic games, 
              EmulatorGames welcomes you to join our community of gaming enthusiasts. 
              Explore our collection and rediscover the magic of classic gaming.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}