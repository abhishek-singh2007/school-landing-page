'use server';

import { cookies } from 'next/headers';
import { ADMIN_SESSION_COOKIE, getAdminCookieOptions, verifyFirebaseIdToken } from '@/lib/admin-auth';

export async function createAdminSession(idToken: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    await verifyFirebaseIdToken(idToken);

    const cookieStore = await cookies();
    cookieStore.set(ADMIN_SESSION_COOKIE, idToken, getAdminCookieOptions());

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unable to create admin session',
    };
  }
}

export async function clearAdminSession(): Promise<{
  success: boolean;
}> {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, '', {
    ...getAdminCookieOptions(),
    maxAge: 0,
    expires: new Date(0),
  });

  return { success: true };
}