"use client";

import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import ReactGA from 'react-ga4';

// Initialize Google Analytics
export const initGA = (measurementId) => {
  if (typeof window !== 'undefined' && !window.GA_INITIALIZED) {
    ReactGA.initialize(measurementId);
    window.GA_INITIALIZED = true;
    console.log('Google Analytics initialized');
  }
};

// Hook to track page views
export default function usePageTracking() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [initialized, setInitialized] = useState(false);

  // Initialize GA
  useEffect(() => {
    // The GA ID is now passed directly from the GoogleAnalytics component
    setInitialized(true);
  }, []);

  // Track page views
  useEffect(() => {
    if (!initialized) return;
    
    // Construct the full URL including search parameters
    const url = searchParams.size > 0 
      ? `${pathname}?${searchParams.toString()}`
      : pathname;
    
    // Send pageview to Google Analytics
    ReactGA.send({ 
      hitType: "pageview", 
      page: url,
      title: document.title
    });
    
    console.log(`Page view tracked: ${url}`);
  }, [pathname, searchParams, initialized]);
}
