'use client';

import Link from 'next/link';
import { Cake } from 'lucide-react';

export default function BirthdayWidget() {
  return (
    <section className="py-8 px-4 md:px-6 lg:px-8 max-w-6xl mx-auto">
      <Link href="/birthday">
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-lg p-2 border-2 border-amber-400 hover:shadow-lg hover:shadow-amber-400/50 transition-all cursor-pointer">
          <div className="flex items-center justify-between md:justify-center gap-4">
            <Cake className="w-8 h-8 md:w-12 md:h-12 text-amber-400 flex-shrink-0" />
            <div className="text-center flex-1">
              <h2 className="text-2xl md:text-3xl font-cherry text-white">
                Top 10 when you were born
              </h2>
              <p className="text-gray-300 text-sm text-cherry md:text-base mt-1">
                Which songs trended on the day you arrived?
              </p>
            </div>
            <div className="hidden md:block text-amber-400 text-4xl font-black">→</div>
          </div>
        </div>
      </Link>
    </section>
  );
}
