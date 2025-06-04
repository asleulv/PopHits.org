import { Metadata } from 'next';
import RegisterForm from '@/components/users/RegisterForm';

export const metadata = {
  title: 'Register | PopHits.org',
  description: 'Create a new account on PopHits.org to access personalized features, save your favorite songs, and create custom playlists.',
  keywords: 'register, sign up, create account, new user, PopHits.org',
  openGraph: {
    title: 'Register | PopHits.org',
    description: 'Create a new account on PopHits.org to access personalized features.',
    url: 'https://pophits.org/register',
    siteName: 'PopHits.org',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Register | PopHits.org',
    description: 'Create a new account on PopHits.org to access personalized features.',
  },
  alternates: {
    canonical: 'https://pophits.org/register',
  },
};

export default function RegisterPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        Create a New Account
      </h1>
      <RegisterForm />
    </div>
  );
}
