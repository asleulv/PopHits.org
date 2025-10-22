import { Suspense } from "react";
import { Shuffle } from "lucide-react";
import {
  getTopRatedSongs,
  getRandomHitsByDecade,
  getFeaturedArtists,
  getCurrentHot100,
  getNumberOneHits,
  getRandomSongByArtist,
} from "@/lib/api";
import { getBlueskyPosts } from "@/lib/bluesky";

// Component imports
import HeroSection from "@/components/FrontPage/HeroSection";
import LatestBlogPostSection from "@/components/FrontPage/LatestBlogPostSection";
import YearBrowserSection from "@/components/FrontPage/YearBrowserSection";
import TopRatedSongsSection from "@/components/FrontPage/TopRatedSongsSection";
import CurrentHot100Section from "@/components/FrontPage/CurrentHot100Section";
import NumberOneHitsSection from "@/components/FrontPage/NumberOneHitsSection";
import RandomHitsByDecadeClient from "@/components/FrontPage/RandomHitsByDecadeClient";
import BlueskyDiscoverySection from "@/components/FrontPage/BlueskyDiscoverySection";
import FeaturedArtists from "@/components/FrontPage/FeaturedArtists";

// Helper function to get decade from year
function getDecade(year) {
  const decade = Math.floor(year / 10) * 10;
  return `${decade}s`;
}

export const metadata = {
  title:
    "PopHits.org - Chart-Topping Hits & Hidden Gems from 70 Years of Music",
  description:
    "Listen to Billboard chart hits and discover top-rated songs by decade on PopHits.org. Explore number one singles, hidden gems, and weekly chart updates with Spotify integration from 70 years of music history featuring 30,000+ curated hits.",
  keywords:
    "pop hits, greatest pop songs, chart-topping hits, music history, Billboard Hot 100, listen, spotify, weekly charts",
  openGraph: {
    title:
      "PopHits.org - Chart-Topping Hits & Hidden Gems from 70 Years of Music",
    description:
      "Listen to Billboard chart hits and discover top-rated songs by decade on PopHits.org. Explore number one singles, hidden gems, and weekly chart updates with Spotify integration from 70 years of music history featuring 30,000+ curated hits.",
    url: "https://pophits.org",
    siteName: "PopHits.org",
    type: "website",
    images: [
      {
        url: "https://pophits.org/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "PopHits.org - Chart-topping hits and hidden gems database",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "PopHits.org - Chart-Topping Hits & Hidden Gems from 70 Years of Music",
    description:
      "Listen to Billboard chart hits and discover top-rated songs by decade on PopHits.org. Explore number one singles, hidden gems, and weekly chart updates with Spotify integration.",
    images: ["https://pophits.org/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

// ============ ASYNC WRAPPER COMPONENTS ============

async function HeroSectionWrapper() {
  try {
    const featuredArtists = await getFeaturedArtists();
    let songWithImage = null;
    if (featuredArtists?.length > 0) {
      const randomArtist =
        featuredArtists[Math.floor(Math.random() * featuredArtists.length)];
      const song = await getRandomSongByArtist(randomArtist.slug);
      if (song?.id) {
        songWithImage = {
          id: song.id,
          title: song.title,
          artist: randomArtist.name,
          artist_slug: randomArtist.slug,
          year: song.year,
          slug: song.slug,
          image_upload: randomArtist.image,
          average_user_score: song.average_user_score,
          peak_rank: song.peak_rank,
        };
      }
    }
    return <HeroSection songWithImage={songWithImage} />;
  } catch (error) {
    console.error("Hero fetch failed:", error);
    return <HeroSection songWithImage={null} />;
  }
}

async function CurrentHot100Wrapper() {
  try {
    const currentHot100 = await getCurrentHot100();
    return <CurrentHot100Section currentHot100={currentHot100} />;
  } catch (error) {
    return <div>Loading Hot 100...</div>;
  }
}

async function BlueskyWrapper() {
  try {
    const blueskyPosts = await getBlueskyPosts();
    return blueskyPosts?.length > 0 ? (
      <BlueskyDiscoverySection posts={blueskyPosts} />
    ) : null;
  } catch (error) {
    console.error("Bluesky failed:", error);
    return null;
  }
}

async function RandomHitsWrapper() {
  try {
    const randomHitsByDecadeData = await getRandomHitsByDecade();
    const randomHitsByDecade =
      randomHitsByDecadeData.songs || randomHitsByDecadeData;

    const groupedByDecade = randomHitsByDecade.reduce((acc, song) => {
      const decade = getDecade(song.year);
      if (!acc[decade]) {
        acc[decade] = [];
      }
      acc[decade].push(song);
      return acc;
    }, {});

    return randomHitsByDecade.length > 0 ? (
      <section className="mb-8 bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800 text-white p-8 w-full lg:rounded-xl shadow-lg">
        <div className="flex flex-col items-center md:flex-row md:justify-center gap-4 mb-6">
          <h2 className="text-xl md:text-3xl font-cherry font-semibold flex items-center gap-3 text-white">
            <Shuffle className="hidden lg:block w-8 h-8 text-yellow-400" />
            <span className="bg-gradient-to-r from-yellow-400 to-pink-500 bg-clip-text text-transparent">
              Explore Chart-Topping Songs and Hidden Gems by Decade
            </span>
          </h2>
        </div>

        <RandomHitsByDecadeClient
          groupedByDecade={groupedByDecade}
          initialDecade={
            Object.keys(groupedByDecade).length > 0
              ? Object.keys(groupedByDecade)[
                  Math.floor(
                    Math.random() * Object.keys(groupedByDecade).length
                  )
                ]
              : null
          }
        />
      </section>
    ) : (
      <section className="mb-8 bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800 text-white p-8 w-full lg:rounded-xl shadow-lg">
        <div className="flex justify-center items-center py-12">
          <p className="text-xl">Loading random hits by decade...</p>
        </div>
      </section>
    );
  } catch (error) {
    return <div>Loading random hits...</div>;
  }
}

async function TopRatedWrapper() {
  try {
    const topRatedSongsData = await getTopRatedSongs();
    const topRatedSongs = topRatedSongsData.songs || topRatedSongsData;
    return <TopRatedSongsSection topRatedSongs={topRatedSongs} />;
  } catch (error) {
    return <div>Loading top rated...</div>;
  }
}

async function FeaturedArtistsWrapper() {
  try {
    const featuredArtists = await getFeaturedArtists();
    return <FeaturedArtists artists={featuredArtists} />;
  } catch (error) {
    return <div>Loading artists...</div>;
  }
}

async function NumberOneWrapper() {
  try {
    const numberOneHitsData = await getNumberOneHits();
    const numberOneHits = numberOneHitsData.songs || numberOneHitsData;
    return <NumberOneHitsSection numberOneHits={numberOneHits} />;
  } catch (error) {
    return <div>Loading number ones...</div>;
  }
}

async function BlogWrapper() {
  try {
    const apiUrl =
      process.env.NODE_ENV === "development"
        ? "http://localhost:8000/api/blog/?page=1&page_size=1"
        : "https://pophits.org/api/blog/?page=1&page_size=1";

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
      next: { revalidate: 0 },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();

    let latestBlogPost = null;
    if (Array.isArray(data)) {
      latestBlogPost = data.length > 0 ? data[0] : null;
    } else if (data.results && Array.isArray(data.results)) {
      latestBlogPost = data.results.length > 0 ? data.results[0] : null;
    }

    return latestBlogPost ? (
      <LatestBlogPostSection latestBlogPost={latestBlogPost} />
    ) : null;
  } catch (error) {
    return null;
  }
}

// ============ MAIN PAGE ============

export default async function FrontPage() {
  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: currentYear - 1958 + 1 },
    (_, i) => 1958 + i
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "PopHits.org",
            url: "https://pophits.org",
            description:
              "Explore top-rated songs, random hits by decade, and number one hits on PopHits.org. Discover iconic singles from the 50s to today.",
            potentialAction: {
              "@type": "SearchAction",
              target: "https://pophits.org/songs?q={search_term_string}",
              "query-input": "required name=search_term_string",
            },
          }),
        }}
      />
      <div className="px-0 py-8 sm:px-4 md:px-6 lg:px-8 mx-auto max-w-full">
        {/* 1. Hero Section - Priority */}
        <Suspense
          fallback={<div className="h-96 bg-gray-800 animate-pulse rounded" />}
        >
          <HeroSectionWrapper />
        </Suspense>

        {/* 2. Current Hot 100 */}
        <Suspense
          fallback={<div className="h-32 bg-gray-800 animate-pulse rounded" />}
        >
          <CurrentHot100Wrapper />
        </Suspense>

        {/* 3. Featured Discovery (Bluesky) */}
        <Suspense fallback={<div>Loading discovery...</div>}>
          <BlueskyWrapper />
        </Suspense>

        {/* 4. Random Hits by Decade */}
        <Suspense fallback={<div>Loading hits...</div>}>
          <RandomHitsWrapper />
        </Suspense>

        {/* 5. Top Rated Songs */}
        <Suspense fallback={<div>Loading top rated...</div>}>
          <TopRatedWrapper />
        </Suspense>

        {/* 6. Featured Artists */}
        <Suspense fallback={<div>Loading artists...</div>}>
          <FeaturedArtistsWrapper />
        </Suspense>

        {/* 7. Number One Hits */}
        <Suspense fallback={<div>Loading number ones...</div>}>
          <NumberOneWrapper />
        </Suspense>

        {/* 8. Year Browser */}
        <YearBrowserSection years={years} />

        {/* 9. Latest Blog Post */}
        <Suspense fallback={<div>Loading blog...</div>}>
          <BlogWrapper />
        </Suspense>
      </div>
    </>
  );
}
