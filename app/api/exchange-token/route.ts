import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase-admin';

export async function POST(request: NextRequest) {
  try {
    const { idToken } = await request.json();
    
    // Verify the ID token from Ovrica
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    
    // Create a custom token for THIS domain
    const customToken = await adminAuth.createCustomToken(decodedToken.uid);
    
    return NextResponse.json({ customToken });
    
  } catch (error) {
    console.error('Token exchange failed:', error);
    return NextResponse.json(
      { error: 'Invalid token' },
      { status: 401 }
    );
  }
}