import { useEffect } from "react";

export default function Privacy() {
  useEffect(() => {
    document.title = "Privacy Policy - EmulatorGames";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 
        "Read EmulatorGames' privacy policy to understand how we collect, use, and protect your personal information."
      );
    }
  }, []);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center" data-testid="text-privacy-title">
          Privacy Policy
        </h1>
        
        <div className="prose prose-lg max-w-none space-y-8">
          <p className="text-foreground/80 text-center mb-8">
            <strong>Last updated:</strong> January 2025
          </p>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">1. Information We Collect</h2>
            <p className="text-foreground/80 mb-4">
              We collect information you provide directly to us, such as when you:
            </p>
            <ul className="list-disc list-inside space-y-2 text-foreground/80 mb-6">
              <li>Browse our website and use our services</li>
              <li>Contact us with questions or feedback</li>
              <li>Subscribe to our updates or newsletters</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">2. How We Use Your Information</h2>
            <p className="text-foreground/80 mb-4">
              We use the information we collect to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-foreground/80 mb-6">
              <li>Provide, maintain, and improve our services</li>
              <li>Respond to your comments, questions, and requests</li>
              <li>Monitor and analyze trends, usage, and activities</li>
              <li>Detect, investigate, and prevent fraudulent activities</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">3. Information Sharing</h2>
            <p className="text-foreground/80 mb-6">
              We do not sell, trade, or otherwise transfer your personal information to third parties 
              without your consent, except as described in this privacy policy or as required by law.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">4. Data Security</h2>
            <p className="text-foreground/80 mb-6">
              We implement appropriate security measures to protect your personal information against 
              unauthorized access, alteration, disclosure, or destruction. However, no method of 
              transmission over the internet is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">5. Cookies and Tracking</h2>
            <p className="text-foreground/80 mb-6">
              We use cookies and similar tracking technologies to enhance your browsing experience 
              and analyze website traffic. You can control cookie settings through your browser preferences.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">6. Third-Party Links</h2>
            <p className="text-foreground/80 mb-6">
              Our website may contain links to third-party websites. We are not responsible for 
              the privacy practices or content of these external sites. We encourage you to review 
              their privacy policies.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">7. Changes to This Policy</h2>
            <p className="text-foreground/80 mb-6">
              We may update this privacy policy from time to time. We will notify you of any changes 
              by posting the new privacy policy on this page and updating the "Last updated" date.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">8. Contact Us</h2>
            <p className="text-foreground/80">
              If you have any questions about this privacy policy or our privacy practices, 
              please contact us through our contact page.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}