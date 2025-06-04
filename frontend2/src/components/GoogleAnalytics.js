"use client";

import { useEffect } from 'react';
import usePageTracking, { initGA } from '@/hooks/usePageTracking';

// Google Analytics ID from the original frontend
const GA_ID = 'G-KWCKPJW0YJ';

export default function GoogleAnalytics() {
  // Use the page tracking hook
  usePageTracking();

  // Initialize GA on component mount
  useEffect(() => {
    initGA(GA_ID);
    console.log('Google Analytics initialized with ID:', GA_ID);
  }, []);

  // This component doesn't render anything
  return null;
}
