import { useEffect } from "react";

export default function Terms() {
  useEffect(() => {
    document.title = "Terms of Service - EmulatorGames";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 
        "Read EmulatorGames' terms of service to understand the rules and guidelines for using our platform."
      );
    }
  }, []);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center" data-testid="text-terms-title">
          Terms of Service
        </h1>
        
        <div className="prose prose-lg max-w-none space-y-8">
          <p className="text-foreground/80 text-center mb-8">
            <strong>Last updated:</strong> January 2025
          </p>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">1. Acceptance of Terms</h2>
            <p className="text-foreground/80 mb-6">
              By accessing and using EmulatorGames, you accept and agree to be bound by the terms 
              and provision of this agreement. If you do not agree to abide by the above, please 
              do not use this service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">2. Use License</h2>
            <p className="text-foreground/80 mb-4">
              Permission is granted to temporarily download one copy of the materials on EmulatorGames 
              for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
            </p>
            <ul className="list-disc list-inside space-y-2 text-foreground/80 mb-6">
              <li>Modify or copy the materials</li>
              <li>Use the materials for any commercial purpose or for any public display</li>
              <li>Attempt to reverse engineer any software contained on the website</li>
              <li>Remove any copyright or other proprietary notations from the materials</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">3. Disclaimer</h2>
            <p className="text-foreground/80 mb-6">
              The materials on EmulatorGames are provided on an 'as is' basis. EmulatorGames makes 
              no warranties, expressed or implied, and hereby disclaims and negates all other warranties 
              including without limitation, implied warranties or conditions of merchantability, fitness 
              for a particular purpose, or non-infringement of intellectual property or other violation of rights.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">4. Limitations</h2>
            <p className="text-foreground/80 mb-6">
              In no event shall EmulatorGames or its suppliers be liable for any damages (including, 
              without limitation, damages for loss of data or profit, or due to business interruption) 
              arising out of the use or inability to use the materials on EmulatorGames, even if 
              EmulatorGames or its authorized representative has been notified orally or in writing 
              of the possibility of such damage.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">5. Copyright Notice</h2>
            <p className="text-foreground/80 mb-6">
              At EmulatorGames, we do not encourage or promote the downloading of ROMs, not even for 
              discontinued titles. Therefore, we do not host or link to any copyrighted content. 
              We respect intellectual property rights and expect our users to do the same.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">6. User Conduct</h2>
            <p className="text-foreground/80 mb-4">
              Users agree not to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-foreground/80 mb-6">
              <li>Use the service for any illegal or unauthorized purpose</li>
              <li>Violate any laws in your jurisdiction</li>
              <li>Transmit worms, viruses, or any code of a destructive nature</li>
              <li>Attempt to gain unauthorized access to any part of the service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">7. Modifications</h2>
            <p className="text-foreground/80 mb-6">
              EmulatorGames may revise these terms of service at any time without notice. 
              By using this website, you are agreeing to be bound by the then current version 
              of these terms of service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">8. Contact Information</h2>
            <p className="text-foreground/80">
              If you have any questions about these Terms of Service, please contact us 
              through our contact page.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}