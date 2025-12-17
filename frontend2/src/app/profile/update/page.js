import Link from 'next/link';
import ProfileUpdateForm from '@/components/users/ProfileUpdateForm';

export const metadata = {
  title: 'Update Profile | PopHits.org',
  description: 'Update your PopHits.org user profile information and preferences.',
  keywords: 'update profile, edit account, change password, PopHits.org',
  openGraph: {
    title: 'Update Profile | PopHits.org',
    description: 'Update your PopHits.org user profile information and preferences.',
    url: 'https://pophits.org/profile/update',
    siteName: 'PopHits.org',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Update Profile | PopHits.org',
    description: 'Update your PopHits.org user profile information and preferences.',
  },
  alternates: {
    canonical: 'https://pophits.org/profile/update',
  },
};

export default function ProfileUpdatePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link 
          href="/profile" 
          className="text-pink-500 hover:text-pink-700 transition-colors"
        >
          &larr; Back to Profile
        </Link>
      </div>
      
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        Update Your Profile
      </h1>
      
      <ProfileUpdateForm />
    </div>
  );
}
