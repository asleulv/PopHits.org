"use client";

import { useEffect } from 'react';
import usePageTracking, { initGA } from '@/hooks/usePageTracking';

// Google Analytics ID from the original frontend
const GA_ID = 'G-KWCKPJW0YJ';

export default function GoogleAnalytics() {
  // Use the page tracking hook in a try-catch block
  try {
    usePageTracking();
  } catch (error) {
    console.error('Error in page tracking:', error);
  }

  // Initialize GA on component mount
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        initGA(GA_ID);
        console.log('Google Analytics initialized with ID:', GA_ID);
      }
    } catch (error) {
      console.error('Error initializing Google Analytics:', error);
    }
  }, []);

  // This component doesn't render anything
  return null;
}
