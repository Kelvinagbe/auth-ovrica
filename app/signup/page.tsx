'use client';

import { useState } from 'react';

const OVRICA_AUTH_URL = 'https://ovrica.com'; // or auth.ovrica.com

export default function SignInWithOvrica() {
  const [loading, setLoading] = useState(false);

  const handleSignIn = () => {
    setLoading(true);
    
    const redirectUri = `${window.location.origin}/auth/callback`;
    const state = generateRandomState();
    
    sessionStorage.setItem('oauth_state', state);
    
    const params = new URLSearchParams({
      redirect_uri: redirectUri,
      state: state
    });
    
    // Redirect to Ovrica SSO
    window.location.href = `${OVRICA_AUTH_URL}/sso/authorize?${params}`;
  };

  return (
    <button
      onClick={handleSignIn}
      disabled={loading}
      className="flex items-center justify-center gap-3 w-full px-6 py-3 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium disabled:opacity-50"
    >
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
      </svg>
      <span>Sign in with Ovrica</span>
    </button>
  );
}

function generateRandomState() {
  return Math.random().toString(36).substring(2, 15);
}