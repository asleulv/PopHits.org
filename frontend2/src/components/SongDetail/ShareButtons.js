"use client";

import { useEffect, useState } from 'react';
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  FacebookMessengerShareButton,
  FacebookIcon,
  XIcon,
  WhatsappIcon,
  FacebookMessengerIcon,
  BlueskyShareButton,
  BlueskyIcon,
} from "react-share";

export default function ShareButtons({ song }) {
  const [url, setUrl] = useState(`https://pophits.org/songs/${song.slug}`);
  const [artistHashtag, setArtistHashtag] = useState("");
  
  // Update URL when component mounts on client side
  useEffect(() => {
    setUrl(window.location.href);
    // Create artist hashtag by removing spaces
    const hashtag = song.artist.replace(/\s+/g, "");
    setArtistHashtag(hashtag);
  }, [song.artist]);
  
  const shareText = `${song.title} (${song.year}) was a hit by ${song.artist}, spending ${song.weeks_on_chart} weeks on the Hot 100, peaking at #${song.peak_rank}`;
  
  return (
    <div className="p-6 mb-8 bg-yellow-50 rounded-xl shadow-sm border border-slate-300">
      <h2 className="text-lg font-semibold text-slate-900 text-center mb-4">Share This Song</h2>
      <div className="flex justify-center gap-4 flex-wrap">
        <div className="transform transition-transform hover:scale-110">
          <FacebookShareButton
            url={url}
            quote={`${song.title} by ${song.artist}`}
            hashtag="#popmusic"
          >
            <FacebookIcon size={44} round />
          </FacebookShareButton>
        </div>
        <div className="transform transition-transform hover:scale-110">
          <BlueskyShareButton
            url={url}
            title={shareText}
          >
            <BlueskyIcon size={44} round />
          </BlueskyShareButton>
        </div>
        <div className="transform transition-transform hover:scale-110">
          <TwitterShareButton
            url={url}
            title={shareText}
            via="PopHitsOrg"
            hashtags={[
              "popmusic",
              "favoritesong",
              artistHashtag,
              "pophitsdotorg",
            ]}
          >
            <XIcon size={44} round />
          </TwitterShareButton>
        </div>
        <div className="transform transition-transform hover:scale-110">
          <WhatsappShareButton
            url={url}
            title={shareText}
            separator=" - "
          >
            <WhatsappIcon size={44} round />
          </WhatsappShareButton>
        </div>
        <div className="transform transition-transform hover:scale-110">
          <FacebookMessengerShareButton
            url={url}
            appId="291494419107518"
          >
            <FacebookMessengerIcon size={44} round />
          </FacebookMessengerShareButton>
        </div>
      </div>
    </div>
  );
}
