// app/auth/action/page.tsx
import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

// Dynamic import to avoid SSR issues with Firebase
const FirebaseVerificationPage = dynamic(
  () => import('@/components/FirebaseVerificationPage'),
  { 
    ssr: false,
    loading: () => (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="relative mx-auto mb-4">
            <div className="w-16 h-16 border-4 border-gray-800 rounded-full"></div>
            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-amber-400 font-medium">Loading...</p>
        </div>
      </div>
    )
  }
);

export const metadata: Metadata = {
  title: 'Email Verification | KelvinTopup',
  description: 'Verify your email address to secure your KelvinTopup account.',
  robots: 'noindex, nofollow',
};

export default function AuthActionPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="relative mx-auto mb-4">
            <div className="w-16 h-16 border-4 border-gray-800 rounded-full"></div>
            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-amber-400 font-medium">Loading verification...</p>
        </div>
      </div>
    }>
      <FirebaseVerificationPage />
    </Suspense>
  );
}