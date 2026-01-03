import Link from "next/link";
import { notFound } from "next/navigation";
import {
  History,
  BookOpen,
  Star,
  Download,
  BarChart3,
  Users,
  ArrowRight,
  ShieldCheck,
  Scale
} from "lucide-react";
import { getCurrentHot100 } from "@/lib/api";

export const revalidate = 86400; 

export const metadata = {
  title: "Billboard Hot 100 Historical Archive | PopHits.org",
  description:
    "Explore why we focus on chart purity. Join a community of music historians rating hits from the 1940s to today using our unique anti-flood weighing system.",
  keywords: "music history, chart purity, billboard archive, streaming era, 1940s music, weighted charts, rate songs",
};

// --- Helper Components ---

function MovementBadge({ song }) {
  if (song.position_change === null || song.position_change === undefined) {
    return (
      <span className="text-xs font-black text-green-700 bg-green-100 px-2 py-1 rounded">
        ★ NEW ENTRY
      </span>
    );
  }

  if (song.position_change > 0) {
    return (
      <span className="text-xs font-black text-green-700 bg-green-100 px-2 py-1 rounded">
        ↑ {song.position_change}
      </span>
    );
  } else if (song.position_change < 0) {
    return (
      <span className="text-xs font-black text-red-700 bg-red-100 px-2 py-1 rounded">
        ↓ {Math.abs(song.position_change)}
      </span>
    );
  }
  return <span className="text-xs font-black text-gray-600 px-2 py-1">—</span>;
}

function formatChartDate(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default async function CurrentHot100Page() {
  const data = await getCurrentHot100();

  if (!data || !data.songs || data.songs.length === 0) {
    notFound();
  }

  const formattedDate = formatChartDate(data.chart_date);
  const limitedSongs = data.songs.slice(0, 10);

  return (
    <>
      <div className="min-h-screen bg-yellow-50 p-4 md:p-8">
        
        {/* ENHANCED JOURNEY HERO */}
        <div className="max-w-6xl mx-auto mb-12 border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8">
          <div className="flex flex-col lg:flex-row items-center gap-10">
            <div className="flex-1">
              <span className="inline-flex bg-red-600 text-white px-3 py-1 text-xs font-black uppercase mb-4 border-2 border-black animate-pulse">
                The Search for Chart Purity
              </span>
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-none mb-6 uppercase">
                Beyond the <span className="text-yellow-600">Streaming Era</span>
              </h2>
              <p className="text-lg text-gray-800 font-medium mb-4 leading-relaxed">
                Modern charts are broken. In the past, a &quot;hit&quot; represented a collective cultural moment. Today, streaming algorithms allow a single album release to flood the entire chart, making it impossible to compare modern data with the pure charts of the 20th century.
              </p>
              <p className="text-sm text-gray-600 mb-8 font-bold italic">
                PopHits.org has transitioned into <strong>The Hit Song Archive</strong> because we refuse to let streaming noise dilute musical legacy.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <div className="flex items-center gap-3 bg-gray-50 p-3 border-2 border-black">
                  <ShieldCheck className="text-red-600" size={20} />
                  <span className="font-bold text-xs uppercase text-gray-900">Historical Integrity First</span>
                </div>
                <div className="flex items-center gap-3 bg-gray-50 p-3 border-2 border-black">
                  <Scale className="text-blue-600" size={20} />
                  <span className="font-bold text-xs uppercase text-gray-900">Anti-Flood Weighing System</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <Link href="/" className="flex items-center gap-2 bg-black text-white px-8 py-4 font-black uppercase text-sm hover:bg-yellow-600 transition-all shadow-[4px_4px_0px_0px_rgba(202,138,4,1)]">
                  Enter The Archive
                </Link>
              </div>
            </div>
            
            <div className="w-full lg:w-80 border-4 border-black p-6 bg-yellow-100 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
               <h4 className="font-black uppercase text-center mb-4 border-b-2 border-black pb-2 text-sm">Roadmap 2026</h4>
               <p className="text-[11px] leading-tight font-bold text-gray-700 mb-4 uppercase">
                 <span className="text-blue-700">●</span> Anti-Flood weighing for year-end updates.<br/><br/>
                 <span className="text-red-700">●</span> Deep Dive: Expanding into the 1940s hits.<br/><br/>
                 <span className="text-green-700">●</span> Community-driven era rankings.
               </p>
               <p className="text-[10px] text-gray-600 italic border-t border-black/10 pt-4">
                 We prioritize cultural reach over streaming repetition.
               </p>
            </div>
          </div>
        </div>

        {/* Newspaper Header */}
        <div className="max-w-6xl mx-auto mb-8 border-4 border-black bg-black text-white p-6 text-center">
          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-2 uppercase">
            Chart Snapshot
          </h1>
          <div className="text-sm tracking-widest font-bold">
            A MOMENT IN TIME: {formattedDate.toUpperCase()}
          </div>
        </div>

        {/* Chart Grid with FADE OUT */}
        <div className="relative max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 pb-20">
            {limitedSongs.map((song, index) => (
              <div key={song.id || song.slug || index} className="border-b-2 border-black pb-6 flex gap-4 bg-white/50 p-2 hover:bg-white transition-colors group">
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 bg-black text-white flex items-center justify-center font-black text-xl group-hover:scale-110 transition-transform">
                    {song.current_position || index + 1}
                  </div>
                </div>
                <div className="flex-grow min-w-0">
                  <h3 className="font-black text-base md:text-lg leading-tight tracking-tight uppercase">
                    <Link href={`/songs/${song.slug}`} className="hover:text-yellow-600">
                      {song.title}
                    </Link>
                  </h3>
                  <p className="text-sm text-gray-700 mt-1">
                    <Link href={`/artist/${song.artist_slug}`} className="font-bold hover:underline">
                      {song.artist}
                    </Link>
                  </p>
                  <div className="mt-3">
                    <MovementBadge song={song} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-yellow-50 to-transparent pointer-events-none" />
        </div>

        {/* THE MANIFESTO BOX */}
        <div className="max-w-6xl mx-auto mt-[-20px] relative z-10 border-4 border-black bg-black text-white p-10">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-3xl font-black uppercase mb-6 tracking-tighter">The Future of Our Historical Record</h3>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
              The traditional comparison between eras is broken. We cannot measure a classic #1 from 1968 against a modern track that hits the top 10 simply because of an album-wide streaming flood. We do not agree with counting methods that allow a single artist to dominate 40% of a list through repetition.
            </p>
            <div className="bg-white/5 border border-white/10 p-6 mb-8 text-left">
              <h4 className="text-yellow-500 font-black text-xs uppercase mb-3">Our Archival Commitment:</h4>
              <ul className="text-xs text-gray-300 space-y-3 font-medium">
                <li className="flex gap-2"><span>●</span> <span><strong>Year-End Integration:</strong> We will continue to add new hits after each year closes, but only through a unique <strong>weighing system</strong> designed to prevent &quot;Morgan Wallen style&quot; floods from distorting historical data.</span></li>
                <li className="flex gap-2"><span>●</span> <span><strong>Deep Archive:</strong> We are looking further back than ever. Our research teams are currently preparing to integrate the hits of the <strong>1940s</strong> to complete our 20th-century roadmap.</span></li>
              </ul>
            </div>
            <Link href="/" className="inline-flex items-center gap-3 bg-yellow-400 text-black px-10 py-5 font-black uppercase text-sm hover:bg-white transition-all active:translate-y-1">
              Explore Purer Eras <ArrowRight size={20}/>
            </Link>
          </div>
        </div>

        {/* Global Discovery Footer */}
        <div className="max-w-6xl mx-auto mt-16 bg-black text-white p-12 text-center">
          <h3 className="text-3xl font-black uppercase mb-8 italic tracking-tighter italic">From the 40s to the Present</h3>
          <div className="flex flex-wrap justify-center gap-x-12 gap-y-6">
            {['1940', '1958', '1967', '1970', '1984', '1999', '2014'].map((year) => (
              <Link key={year} href={`/year/${year}`} className="text-5xl font-black text-gray-600 hover:text-yellow-400 transition-all">
                {year}
              </Link>
            ))}
          </div>
          <p className="mt-12 text-gray-500 text-[10px] font-black uppercase tracking-[0.3em]">
            PopHits.org — Protecting Musical History from Streaming Noise
          </p>
        </div>
      </div>
    </>
  );
}