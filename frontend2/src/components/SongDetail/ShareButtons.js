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
    <div className="p-1 mb-2">
      <div className="flex justify-center gap-4">
        <div className="transform transition-transform hover:scale-110">
          <FacebookShareButton
            url={url}
            quote={`${song.title} by ${song.artist}`}
            hashtag="#popmusic"
          >
            <FacebookIcon size={40} round />
          </FacebookShareButton>
        </div>
        <div className="transform transition-transform hover:scale-110">
          <BlueskyShareButton
            url={url}
            title={shareText}
          >
            <BlueskyIcon size={40} round />
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
            <XIcon size={40} round />
          </TwitterShareButton>
        </div>
        <div className="transform transition-transform hover:scale-110">
          <WhatsappShareButton
            url={url}
            title={shareText}
            separator=" - "
          >
            <WhatsappIcon size={40} round />
          </WhatsappShareButton>
        </div>
        <div className="transform transition-transform hover:scale-110">
          <FacebookMessengerShareButton
            url={url}
            appId="291494419107518"
          >
            <FacebookMessengerIcon size={40} round />
          </FacebookMessengerShareButton>
        </div>
      </div>
    </div>
  );
}
