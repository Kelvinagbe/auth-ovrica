'use client';

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { signInWithCustomToken } from 'firebase/auth';

export default function AuthCallback() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const handleCallback = async () => {
      const token = searchParams.get('token');
      const state = searchParams.get('state');
      
      // Verify state
      const savedState = sessionStorage.getItem('oauth_state');
      if (state !== savedState) {
        router.push('/login?error=invalid_state');
        return;
      }

      if (token) {
        try {
          // Convert Firebase ID token to custom token on your backend
          const response = await fetch('/api/auth/exchange-token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idToken: token })
          });

          const { customToken } = await response.json();

          // Sign in to Firebase on THIS domain with the custom token
          await signInWithCustomToken(auth, customToken);
          
          // Now the user is logged in via Firebase on this domain too!
          sessionStorage.removeItem('oauth_state');
          
          router.push('/dashboard');
          
        } catch (error) {
          console.error('Authentication error:', error);
          router.push('/login?error=auth_failed');
        }
      }
    };

    handleCallback();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Signing you in...</p>
      </div>
    </div>
  );
}