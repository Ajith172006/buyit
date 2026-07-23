import { firebaseAuth } from '@/lib/firebaseClient';

export async function firebaseAuthHeaders() {
  const token = await firebaseAuth?.currentUser?.getIdToken();
  if (!token) throw new Error('Please sign in to continue.');
  return { Authorization: `Bearer ${token}` };
}
