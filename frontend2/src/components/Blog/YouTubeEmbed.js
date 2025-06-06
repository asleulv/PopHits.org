"use client";

import { useEffect, useRef, useState } from 'react';
import './BlogContent.css';

export default function YouTubeEmbed({ content }) {
  const contentRef = useRef(null);
  const [processedContent, setProcessedContent] = useState(content);
  
  useEffect(() => {
    // Process the content on the client side
    if (!content) return;
    
    // Wrap all content in blog-content class with Open Sans font
    let newContent = `<div class="blog-content font-opensans text-lg">${content}</div>`;
    
    // Find YouTube URLs in the content
    const youtubeRegex = /https?:\/\/(www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})(&.*)?|https?:\/\/(www\.)?youtu\.be\/([a-zA-Z0-9_-]{11})(&.*)?/g;
    
    // Replace YouTube URLs with embeds
    let match;
    
    while ((match = youtubeRegex.exec(content)) !== null) {
      const fullUrl = match[0];
      let videoId;
      
      if (fullUrl.includes('youtube.com/watch?v=')) {
        const urlParams = new URLSearchParams(fullUrl.split('?')[1]);
        videoId = urlParams.get('v');
      } else if (fullUrl.includes('youtu.be/')) {
        videoId = fullUrl.split('youtu.be/')[1].split('?')[0].split('&')[0];
      }
      
      if (videoId) {
        const embedHtml = `
          <div class="relative aspect-video w-full my-6">
            <iframe 
              width="100%" 
              height="400" 
              src="https://www.youtube.com/embed/${videoId}" 
              title="YouTube video player" 
              frameborder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowfullscreen 
              class="rounded-lg shadow-lg">
            </iframe>
          </div>
        `;
        
        // Replace the URL with the embed HTML
        // We need to make sure we're replacing a URL that's not already in an anchor tag
        const urlRegex = new RegExp(`(^|[^"])${fullUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}([^"]|$)`, 'g');
        newContent = newContent.replace(urlRegex, `$1${embedHtml}$2`);
      }
    }
    
    setProcessedContent(newContent);
  }, [content]);
  
  return (
    <div 
      className="blog-content prose prose-xl max-w-none font-opensans prose-headings:font-sansita prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-pink-600 prose-a:no-underline hover:prose-a:text-pink-800 hover:prose-a:underline prose-img:rounded-lg prose-p:text-lg prose-li:text-lg"
      dangerouslySetInnerHTML={{ __html: processedContent }}
    />
  );
}
