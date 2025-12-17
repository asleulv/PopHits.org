import LoginForm from '@/components/users/LoginForm';

export const metadata = {
  title: 'Login | PopHits.org',
  description: 'Log in to your PopHits.org account to access personalized features, save your favorite songs, and create custom playlists.',
  keywords: 'login, sign in, account, authentication, PopHits.org',
  openGraph: {
    title: 'Login | PopHits.org',
    description: 'Log in to your PopHits.org account to access personalized features.',
    url: 'https://pophits.org/login',
    siteName: 'PopHits.org',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Login | PopHits.org',
    description: 'Log in to your PopHits.org account to access personalized features.',
  },
  alternates: {
    canonical: 'https://pophits.org/login',
  },
};

export default function LoginPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-slate-900">
        Login to Your Account
      </h1>
      <LoginForm />
    </div>
  );
}
