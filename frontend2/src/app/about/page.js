import Link from "next/link";
import Image from "next/image";
import {
  Music,
  Info,
  ArrowRight,
  ShieldQuestion,
  CalendarDays,
  TimerReset,
  Heart,
  Star,
  Users,
  Disc,
  Headphones,
} from "lucide-react";

export const metadata = {
  title: "The Story Behind The Archive | PopHits.org",
  description: "From a pandemic Python script to a community-driven music archive. Read how Asle started PopHits.org to rank the history of popular music.",
  keywords: "music community, rate music, pop hits archive, music history database, Asle, music blog",
  openGraph: {
    title: "PopHits.org | Built for the Love of Hit Music",
    description: "How Asle turned a pandemic hobby into the definitive hit song archive.",
    url: "https://pophits.org/about",
    siteName: "PopHits.org",
    type: "website",
  },
  alternates: {
    canonical: "https://pophits.org/about",
  },
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8 mt-10">
      {/* Header Section */}
      <div className="mb-12">
        <div className="flex justify-center mb-6">
          <span className="inline-flex items-center gap-2 px-6 py-2 bg-black text-yellow-400 rounded-full text-sm font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <Heart className="w-4 h-4 fill-current" />
            Built for the obsessed
          </span>
        </div>
        
        <h1 className="text-4xl md:text-7xl font-black mb-6 tracking-tighter italic uppercase text-slate-900 text-center">
          ABOUT THE ARCHIVE
        </h1>

        <div className="text-center text-xl md:text-2xl text-slate-800 font-bold flex items-center justify-center gap-3">
          <Music className="w-6 h-6 text-black" />
          <span>From Ricky Nelson to the Modern Era...</span>
        </div>
      </div>

      {/* Main Brutalist Content Card */}
      <div className="bg-yellow-50 p-8 md:rounded-3xl rounded-none border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-12">
        <div className="max-w-4xl mx-auto">
          <p className="text-xl md:text-3xl text-slate-900 mb-10 font-black leading-none uppercase italic text-center md:text-left">
            It started with a Python script and a pandemic-sized ambition.
          </p>

          <div className="space-y-6 text-lg md:text-xl text-slate-800 font-bold leading-tight">
            <p>
              PopHits.org was created because my ambition to listen to every song ever recorded at some point became too ambitious. During the pandemic, I created a small Python script where I could register hit songs into a database, rate them, and sort tables of the best ratings per year.
            </p>
            <p>
              After digging through a couple thousand of these hits, it became ...whilst being a rewarding journey, a rather lonely one. So, what if there are others with the desire to systematically listen and rank their way through the history of popular music? 
            </p>
            <p>
              What if we could create a community? What if it&apos;s not MY ratings that decide how the best-hits-of-1984 looks like... What if it&apos;s OUR common opinion instead?
            </p>
            <p className="pt-4 text-2xl font-black italic">- Asle</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 my-12">
            <div className="bg-white p-6 border-2 border-black rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex items-center gap-3 mb-4">
                <ShieldQuestion className="w-8 h-8 text-black" />
                <h3 className="font-black text-xl uppercase tracking-tighter">The US Focus</h3>
              </div>
              <p className="text-slate-700 font-bold leading-snug">
                The database is mainly based on what was big in the US, because it has always been the biggest and most era-defining stage for popular music. If you succeeded in that gigantic market, you had pretty much made it. (And yes, I realize we might have to add some The Smiths songs eventually).
              </p>
            </div>

            <div className="bg-white p-6 border-2 border-black rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex items-center gap-3 mb-4">
                <Star className="w-8 h-8 text-black" />
                <h3 className="font-black text-xl uppercase tracking-tighter">Our Database</h3>
              </div>
              <p className="text-slate-700 font-bold leading-snug">
                With over 30,000 tracks, you can rate classics, build ultimate collections, and discover forgotten gems that a simple chart mirror would miss.
              </p>
            </div>
          </div>

          {/* Timeline Section */}
          <div className="bg-white p-8 border-2 border-black rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] mb-10">
            <div className="flex items-center gap-3 mb-6">
              <TimerReset className="w-8 h-8 text-black" />
              <h3 className="text-2xl font-black uppercase tracking-tighter italic">Timeline of the Quest</h3>
            </div>
            <ul className="space-y-6">
              {[
                { date: "THE PANDEMIC", text: "The first Python script is born to track and rate every major hit." },
                { date: "2,000+ SONGS", text: "The journey feels lonely. I decide to turn the script into a community archive." },
                { date: "JUNE 2025", text: "Had a One-Hit-Wonder idea while digging through the 90s and launched the PopHits Blog.", link: "/blog" },
                { date: "TODAY", text: "30,000+ tracks later, we are still ranking, still listening, and still debating." }
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-4 border-l-4 border-black pl-4">
                  <div className="flex flex-col">
                    <span className="font-black text-black text-lg">{item.date}</span>
                    <span className="text-slate-700 font-bold">
                      {item.text}
                      {item.link && (
                        <Link href={item.link} className="ml-2 text-blue-600 underline decoration-2 hover:text-black transition-colors">
                          Check it out →
                        </Link>
                      )}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Featured Legend Card */}
      <div className="bg-slate-900 text-white p-8 md:rounded-3xl rounded-none border-4 border-black shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="md:w-1/3 flex justify-center">
            <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-yellow-400 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative group transition-transform hover:scale-105">
              <Image
                src="/gfx/ricky_nelson.jpg"
                alt="Ricky Nelson"
                fill
                sizes="192px"
                className="object-cover"
                priority
              />
            </div>
          </div>

          <div className="md:w-2/3 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
              <Disc className="w-5 h-5 text-yellow-400" />
              <h3 className="text-yellow-400 font-black uppercase tracking-widest text-sm">
                Where the count began
              </h3>
            </div>
            <h2 className="text-3xl md:text-5xl font-black uppercase italic mb-4">
              RICKY NELSON
            </h2>
            <p className="text-slate-300 font-bold text-lg mb-6">
              Every system needs a starting point. In 1958, &ldquo;Poor Little Fool&rdquo; became the first song to hit the modern #1 spot, providing the first data point for a journey that spans decades.
            </p>
            <Link
              href="/songs/ricky-nelson-poor-little-fool"
              className="inline-flex items-center gap-2 px-8 py-3 bg-white text-black font-black uppercase tracking-widest text-sm border-2 border-black hover:bg-yellow-400 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none"
            >
              <Headphones className="w-5 h-5" />
              Rate This Classic →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}