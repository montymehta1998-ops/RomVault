import { useEffect } from 'react';

interface AdSenseProps {
  adSlot: string;
  adClient?: string;
  adFormat?: string;
  fullWidthResponsive?: boolean;
  style?: React.CSSProperties;
}

export function AdSense({ 
  adSlot, 
  adClient = "ca-pub-4291572749420740",
  adFormat = "auto",
  fullWidthResponsive = true,
  style = { display: 'block' }
}: AdSenseProps) {
  useEffect(() => {
    try {
      // Load AdSense script if not already loaded
      if (!window.adsbygoogle) {
        const script = document.createElement('script');
        script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=' + adClient;
        script.async = true;
        script.crossOrigin = 'anonymous';
        document.head.appendChild(script);
      }

      // Push ad to AdSense
      const timer = setTimeout(() => {
        try {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (err) {
          console.log('AdSense error:', err);
        }
      }, 100);

      return () => clearTimeout(timer);
    } catch (err) {
      console.log('AdSense loading error:', err);
    }
  }, [adClient]);

  return (
    <ins 
      className="adsbygoogle"
      style={style}
      data-ad-client={adClient}
      data-ad-slot={adSlot}
      data-ad-format={adFormat}
      data-full-width-responsive={fullWidthResponsive.toString()}
    />
  );
}

// Declare global adsbygoogle for TypeScript
declare global {
  interface Window {
    adsbygoogle: any[];
  }
}