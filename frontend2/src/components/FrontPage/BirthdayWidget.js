'use client';

import Link from 'next/link';
import { Cake, ArrowRight } from 'lucide-react';

export default function BirthdayWidget() {
  return (
    <section className="mb-12 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      <Link href="/birthday" className="group block">
        <div className="bg-yellow-400 border-4 border-black p-6 md:p-8 rounded-2xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            
            {/* Left: Icon and Title */}
            <div className="flex items-center gap-6 text-center md:text-left">
              <div className="bg-black p-4 rounded-full border-2 border-black shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)]">
                <Cake className="w-8 h-8 md:w-10 md:h-10 text-yellow-400 flex-shrink-0" />
              </div>
              
              <div>
                <h2 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter leading-none text-black">
                  The Birthday Hit-Finder
                </h2>
                <p className="font-mono text-sm md:text-base mt-2 text-black font-bold uppercase tracking-wider opacity-80">
                  Discover the Top 10 songs from the day you were born
                </p>
              </div>
            </div>

            {/* Right: Action Button */}
            <div className="bg-black text-white px-8 py-4 font-black uppercase tracking-tighter flex items-center gap-3 border-2 border-black group-hover:bg-white group-hover:text-black transition-colors shrink-0">
              Find Your Hits
              <ArrowRight className="w-5 h-5" />
            </div>
            
          </div>
        </div>
      </Link>
    </section>
  );
}