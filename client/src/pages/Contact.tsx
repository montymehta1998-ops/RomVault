import { useEffect } from "react";

export default function Contact() {
  useEffect(() => {
    document.title = "Contact Us - EmulatorGames";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 
        "Get in touch with the EmulatorGames team. Contact us for support, feedback, or general inquiries."
      );
    }
  }, []);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center" data-testid="text-contact-title">
          Contact Us
        </h1>
        
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-semibold mb-6 text-foreground">Get in Touch</h2>
            <p className="text-foreground/80 mb-8">
              We'd love to hear from you! Whether you have questions, feedback, or need support, 
              our team is here to help. Reach out to us using the information below.
            </p>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2 text-foreground">General Inquiries</h3>
                <p className="text-foreground/80">
                  For general questions about our platform, games, or services.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2 text-foreground">Technical Support</h3>
                <p className="text-foreground/80">
                  Having trouble with downloads or emulators? We're here to help with technical issues.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2 text-foreground">Feedback</h3>
                <p className="text-foreground/80">
                  We value your feedback and suggestions to improve our platform and user experience.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-8">
            <h3 className="text-xl font-semibold mb-6 text-foreground">Contact Information</h3>
            
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-foreground mb-2">Response Time</h4>
                <p className="text-foreground/80">
                  We typically respond to all inquiries within 24-48 hours during business days.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-foreground mb-2">Business Hours</h4>
                <p className="text-foreground/80">
                  Monday - Friday: 9:00 AM - 6:00 PM (EST)<br />
                  Weekend support available for urgent technical issues.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-foreground mb-2">Language Support</h4>
                <p className="text-foreground/80">
                  We provide support in English and are working to expand our language options.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-foreground/80">
            Thank you for choosing EmulatorGames. We appreciate your interest in retro gaming 
            and look forward to hearing from you!
          </p>
        </div>
      </div>
    </div>
  );
}