import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth, type DecodedIdToken } from 'firebase-admin/auth';
import { NextRequest } from 'next/server';

export class FirebaseAdminConfigurationError extends Error {}

function firebaseAdminAuth() {
  if (!getApps().length) {
    const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n');
    if (!projectId || !clientEmail || !privateKey) throw new FirebaseAdminConfigurationError('Firebase Admin credentials are not configured.');
    initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) });
  }
  return getAuth();
}

export async function requireFirebaseUser(request: NextRequest): Promise<DecodedIdToken> {
  const token = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
  if (!token) throw new Error('Unauthorized');
  return firebaseAdminAuth().verifyIdToken(token);
}

export async function requireFirebaseAdmin(request: NextRequest): Promise<DecodedIdToken> {
  const user = await requireFirebaseUser(request);
  if (user.admin !== true) throw new Error('Forbidden');
  return user;
}
