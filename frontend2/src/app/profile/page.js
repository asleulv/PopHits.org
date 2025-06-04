import { Metadata } from 'next';
import Link from 'next/link';
import ProfileClient from '@/components/users/ProfileClient';

export const metadata = {
  title: 'User Profile | PopHits.org',
  description: 'View and manage your PopHits.org user profile, bookmarks, and preferences.',
  keywords: 'user profile, account, bookmarks, preferences, PopHits.org',
  openGraph: {
    title: 'User Profile | PopHits.org',
    description: 'View and manage your PopHits.org user profile.',
    url: 'https://pophits.org/profile',
    siteName: 'PopHits.org',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'User Profile | PopHits.org',
    description: 'View and manage your PopHits.org user profile.',
  },
  alternates: {
    canonical: 'https://pophits.org/profile',
  },
};

export default function ProfilePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <ProfileClient />
    </div>
  );
}
