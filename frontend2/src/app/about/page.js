import Link from "next/link";
import Image from "next/image";
import {
  Music,
  Info,
  Mail,
  ArrowRight,
  ShieldQuestion,
  CalendarDays,
  TimerReset,
} from "lucide-react";

export const metadata = {
  title: "About PopHits.org | Billboard Hot 100 History",
  description:
    "Learn about PopHits.org, a comprehensive database of Billboard Hot 100 songs from 1958 to today. Discover the history of the Hot 100 chart and its evolution.",
  keywords:
    "billboard hot 100, music history, pop music, chart history, ricky nelson",
  openGraph: {
    title: "About PopHits.org | Billboard Hot 100 History",
    description:
      "Learn about PopHits.org, a comprehensive database of Billboard Hot 100 songs from 1958 to today.",
    url: "https://pophits.org/about",
    siteName: "PopHits.org",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "About PopHits.org | Billboard Hot 100 History",
    description:
      "Learn about PopHits.org, a comprehensive database of Billboard Hot 100 songs from 1958 to today.",
  },
  alternates: {
    canonical: "https://pophits.org/about",
  },
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl md:text-4xl font-cherry font-bold mb-6 text-center bg-gradient-to-r from-pink-500 via-purple-600 to-purple-900 bg-clip-text text-transparent">
          <div className="flex items-center justify-center gap-2 px-1 py-1">
            <Info className="w-8 h-8 text-pink-500" />
            <span className="bg-gradient-to-r from-pink-500 to-purple-700 bg-clip-text text-transparent">
              About PopHits.org
            </span>
          </div>
        </h1>

        <div className="text-center text-lg text-gray-700 mb-6 flex items-center justify-center gap-2">
          <Music className="w-5 h-5 text-pink-500" />
          <span>From Ricky Nelson to Olivia Rodrigo...</span>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
        <div className="p-6">
          <p className="text-gray-700 mb-6 leading-relaxed">
            <span className="font-semibold text-gray-800">PopHits.org</span> is
            your deep dive into the Billboard Hot 100—from its inception in 1958
            to the streaming era of today. We celebrate the hits that defined
            decades, changed music, and made pop culture history. With over
            30,000 tracks in our database, you can rate, revisit, and rediscover
            the most popular songs in America.
          </p>

          <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-5 rounded-xl mb-6">
            <div className="flex items-start gap-3 mb-2">
              <ShieldQuestion className="w-5 h-5 text-pink-500 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">
                  Why was this website created?
                </h3>
                <p className="text-gray-700">
                  Because pop music is history. It's joy, rebellion, heartbreak,
                  and change—all in three-minute bursts. PopHits.org was created
                  to track the pulse of popular music through the lens of the
                  Hot 100, offering context and connection behind the songs that
                  ruled the charts.
                </p>
                <p className="text-gray-700 mt-3">
                  Whether you're here to dig up forgotten gems, relive musical
                  milestones, or simply build a killer playlist, this site
                  invites you to explore how pop music reflects who we were—and
                  who we are.
                </p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <CalendarDays className="w-5 h-5 text-pink-500" />
              <h3 className="text-xl font-semibold text-gray-800">
                Timeline: Evolution of the Billboard Hot 100
              </h3>
            </div>
            <ul className="space-y-4 text-gray-700">
              {[
                {
                  date: "August 4, 1958",
                  text: "The first Billboard Hot 100 chart is published. Ricky Nelson's 'Poor Little Fool' is the first #1.",
                },
                {
                  date: "1991",
                  text: "Billboard begins using Nielsen SoundScan to track actual sales and airplay, bringing more accuracy to the charts.",
                },
                {
                  date: "1998",
                  text: "Songs no longer need to be released as a physical single to chart—airplay alone becomes enough.",
                },
                {
                  date: "2005",
                  text: "Digital download sales via platforms like iTunes are incorporated into the chart formula.",
                },
                {
                  date: "2012",
                  text: "YouTube streaming data is added—helped 'Harlem Shake' reach #1 in 2013 thanks to viral popularity.",
                },
                {
                  date: "2013–2018",
                  text: "Streaming grows more important. Billboard adjusts weightings to include audio-only and paid streams.",
                },
                {
                  date: "2020s",
                  text: "TikTok and short-form video influence chart success. Billboard adapts weighting to reflect different tiers of paid vs. free streaming.",
                },
              ].map(({ date, text }, index) => (
                <li key={index} className="flex items-start gap-3">
                  <TimerReset className="w-5 h-5 text-pink-500 mt-1 flex-shrink-0" />
                  <p>
                    <strong>{date}:</strong> {text}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-gray-800 to-gray-900 text-white p-6 rounded-xl shadow-lg mb-8">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="md:w-1/3 flex justify-center">
            <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-pink-500 shadow-lg transform transition-transform hover:scale-105 relative">
              <Image
                src="/gfx/ricky_nelson.jpg"
                alt="Ricky Nelson"
                fill
                sizes="(max-width: 768px) 100vw, 192px"
                className="object-cover"
                priority
              />
            </div>
          </div>

          <div className="md:w-2/3">
            <h3 className="text-xl font-semibold mb-3 bg-gradient-to-r from-pink-400 to-pink-300 bg-clip-text text-transparent">
              The First #1 Hit on the Hot 100
            </h3>
            <p className="text-gray-300 mb-4">
              Ricky Nelson (1940–1985) had the first-ever Hot 100 #1 in 1958
              with "Poor Little Fool." It set the stage for what would become
              the definitive pop chart in the U.S.
            </p>
            <Link
              href="/songs/ricky-nelson-poor-little-fool"
              className="inline-flex items-center gap-2 hover:text-pink-200 bg-gradient-to-r from-pink-500 to-pink-600 text-white px-4 py-2 rounded-lg shadow-sm hover:from-pink-600 hover:to-pink-700 transition-all duration-300"
            >
              Listen and rate this historic song{" "}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-5 rounded-xl shadow-sm text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Mail className="w-5 h-5 text-pink-500" />
          <h3 className="text-lg font-semibold text-gray-700">Contact Us</h3>
        </div>
        <a
          href="mailto:contact@pophits.org"
          className="text-pink-600 hover:text-pink-700 transition-colors font-medium"
        >
          contact@pophits.org
        </a>
      </div>
    </div>
  );
}
