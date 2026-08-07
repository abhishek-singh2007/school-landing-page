import { cookies } from 'next/headers';
import { ADMIN_SESSION_COOKIE, verifyFirebaseIdToken } from '@/lib/admin-auth';
import { enforceRateLimit } from '@/lib/rate-limit';

const isDevelopment = process.env.NODE_ENV !== 'production';

export async function requireAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;

  if (!token) {
    if (isDevelopment) {
      return {
        uid: 'local-dev-admin',
        email: 'local-dev@jkd.internal',
        payload: {},
      };
    }

    throw new Error('Admin session missing. Please sign in again.');
  }

  return verifyFirebaseIdToken(token);
}

export async function requireAdminActionAccess(
  scope: string,
  options: { limit?: number; windowMs?: number } = {}
) {
  const session = await requireAdminSession();

  if (isDevelopment) {
    return session;
  }

  if (options.limit && options.windowMs) {
    await enforceRateLimit({
      scope,
      identity: session.uid,
      limit: options.limit,
      windowMs: options.windowMs,
    });
  }

  return session;
}