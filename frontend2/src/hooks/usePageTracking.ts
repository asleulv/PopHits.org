'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

const GA_ID = 'G-KWCKPJW0YJ';

export const initGA = (measurementId: string) => {
  if (typeof window === 'undefined' || !measurementId) return;
  if ((window as any).GA_INITIALIZED) return;

  // Initialize dataLayer FIRST
  (window as any).dataLayer = (window as any).dataLayer || [];

  // Define gtag function BEFORE loading script
  function gtag(...args: any[]) {
    (window as any).dataLayer?.push(arguments);
  }
  (window as any).gtag = gtag;

  // Load the Google Analytics script
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  
  // Initialize gtag immediately
  gtag('js', new Date());
  gtag('config', measurementId, { anonymize_ip: true });
  
  // Append script
  document.head.appendChild(script);
  
  (window as any).GA_INITIALIZED = true;
  console.log('✅ GA Initialized');
};


export default function usePageTracking() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== 'undefined' && !(window as any).GA_INITIALIZED) {
      initGA(GA_ID);
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const timer = setTimeout(() => {
      if ((window as any).gtag) {
        (window as any).gtag('event', 'page_view', { 
          page_path: pathname,
          page_location: window.location.href,
          page_title: document.title
        });
        console.log(`✅ Page view: ${pathname}`);
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [pathname]);
}