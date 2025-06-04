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
    <div className="p-4 min-h-screen">
      <h1 className="text-2xl md:text-4xl font-cherry font-bold mb-6 text-center bg-gradient-to-r from-pink-500 via-purple-600 to-purple-900 bg-clip-text text-transparent">
        <div className="flex items-center justify-center gap-2 px-1 py-1">
          <HelpCircle className="w-8 h-8 text-pink-500" />
          <span className="bg-gradient-to-r from-pink-500 to-purple-700 bg-clip-text text-transparent">
            Hit Song Quiz Generator
          </span>
        </div>
      </h1>

      <div className="mb-8">
        <p className="text-center text-gray-700 text-lg max-w-3xl mx-auto">
          Test your music knowledge with custom quizzes about hit songs from your favorite decades.
          Choose how many questions and adjust the difficulty level from famous #1 hits to obscure gems.
        </p>
      </div>

      <Suspense fallback={<div className="text-center py-12">Loading quiz generator...</div>}>
        <QuizGeneratorClient />
      </Suspense>
    </div>
  );
}
