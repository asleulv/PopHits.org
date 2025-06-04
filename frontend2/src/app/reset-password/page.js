import { Metadata } from 'next';
import ResetPasswordForm from '@/components/users/ResetPasswordForm';

export const metadata = {
  title: 'Reset Password | PopHits.org',
  description: 'Reset your password for your PopHits.org account.',
  keywords: 'reset password, forgot password, account recovery, PopHits.org',
  openGraph: {
    title: 'Reset Password | PopHits.org',
    description: 'Reset your password for your PopHits.org account.',
    url: 'https://pophits.org/reset-password',
    siteName: 'PopHits.org',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Reset Password | PopHits.org',
    description: 'Reset your password for your PopHits.org account.',
  },
  alternates: {
    canonical: 'https://pophits.org/reset-password',
  },
};

export default function ResetPasswordPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        Reset Your Password
      </h1>
      <ResetPasswordForm />
    </div>
  );
}
