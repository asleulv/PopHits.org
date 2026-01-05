import { Suspense } from 'react';
import { HelpCircle } from 'lucide-react';
import QuizGeneratorClient from '@/components/QuizGenerator/QuizGeneratorClient';

export const metadata = {
  title: 'Hit Song Quiz Generator | PopHits.org',
  description: 'Test your music knowledge with custom quizzes about hit songs from your favorite decades. Choose how many questions and adjust the difficulty level from famous #1 hits to obscure gems.',
  keywords: 'music quiz, hit songs quiz, pop music quiz, billboard quiz, music trivia',
  openGraph: {
    title: 'Hit Song Quiz Generator | PopHits.org',
    description: 'Test your music knowledge with custom quizzes about hit songs from your favorite decades.',
    url: 'https://pophits.org/quiz-generator',
    siteName: 'PopHits.org',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Hit Song Quiz Generator | PopHits.org',
    description: 'Test your music knowledge with custom quizzes about hit songs from your favorite decades.',
  },
  alternates: {
    canonical: 'https://pophits.org/quiz-generator',
  },
};

export default function QuizGeneratorPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12 min-h-screen space-y-10">
      
      {/* 1. Header Section - Consistent Brutalist Style */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center gap-2 bg-black text-white px-4 py-1">
          <HelpCircle className="w-4 h-4" />
          <h2 className="text-xs font-black italic uppercase tracking-[0.3em]">
            Knowledge Testing // Trivia Engine
          </h2>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter text-black leading-none">
          Quiz Generator
        </h1>

        <div className="max-w-2xl mx-auto pt-4 border-t-2 border-black/10">
          <p className="text-lg md:text-xl font-bold text-black/60 uppercase tracking-tight leading-tight italic">
            Test your expertise on the historical record. 
            From global chart-toppers to the most obscure artifacts of the pop archive.
          </p>
        </div>
      </div>

      {/* 2. Main Client Interface */}
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <Suspense 
          fallback={
            <div className="flex flex-col items-center justify-center py-20 border-2 border-black bg-[#fdfbf7]">
              <div className="w-12 h-12 border-4 border-black border-t-transparent animate-spin mb-4" />
              <p className="font-black uppercase italic tracking-widest text-xs">Calibrating Questions...</p>
            </div>
          }
        >
          <QuizGeneratorClient />
        </Suspense>
      </div>

      {/* 3. Footer Branding */}
      <div className="pt-12 text-center">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-black/20 italic">
          PopHits.org // Knowledge Retrieval System v2.6
        </p>
      </div>
    </div>
  );
}