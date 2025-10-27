// @ts-ignore
'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export const initGA = (measurementId: string) => {
  if (typeof window === 'undefined' || !measurementId) return;
  if ((window as any).GA_INITIALIZED) return;

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script);

  (window as any).dataLayer = (window as any).dataLayer || [];
  function gtag(...args: any[]) {
    (window as any).dataLayer?.push(arguments);
  }
  
  (window as any).gtag = gtag;
  gtag('js', new Date());
  gtag('config', measurementId, {
    page_path: window.location.pathname,
    anonymize_ip: true,
  });

  (window as any).GA_INITIALIZED = true;
  console.log('✅ Google Analytics initialized');
};

export default function usePageTracking() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === 'undefined' || !(window as any).gtag) return;
    
    (window as any).gtag('event', 'page_view', {
      page_path: pathname,
      page_title: document.title,
    });
    
    console.log(`✅ Page view tracked: ${pathname}`);
  }, [pathname]);
}
