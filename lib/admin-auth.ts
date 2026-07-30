import { createRemoteJWKSet, jwtVerify } from 'jose';

export const ADMIN_SESSION_COOKIE = 'admin_session';
const FIREBASE_JWKS = createRemoteJWKSet(
  new URL('https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com')
);

function getFirebaseProjectId() {
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

  if (!projectId) {
    throw new Error('Missing NEXT_PUBLIC_FIREBASE_PROJECT_ID environment variable');
  }

  return projectId;
}

function getAllowedAdminEmails() {
  const configuredEmails = process.env.ADMIN_EMAILS?.split(',') ?? ['admin@jkd.com'];

  return configuredEmails
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function isAllowedAdminEmail(email?: string | null) {
  if (!email) {
    return false;
  }

  return getAllowedAdminEmails().includes(email.trim().toLowerCase());
}

export function getAdminCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 60 * 60,
  };
}

export async function verifyFirebaseIdToken(token: string) {
  const projectId = getFirebaseProjectId();

  const { payload } = await jwtVerify(token, FIREBASE_JWKS, {
    issuer: `https://securetoken.google.com/${projectId}`,
    audience: projectId,
  });

  const email = typeof payload.email === 'string' ? payload.email : null;
  const uid =
    typeof payload.user_id === 'string'
      ? payload.user_id
      : typeof payload.sub === 'string'
        ? payload.sub
        : null;

  if (!email || !uid) {
    throw new Error('Invalid admin session token');
  }

  if (!isAllowedAdminEmail(email)) {
    throw new Error('You are not authorized to access the admin panel');
  }

  return {
    uid,
    email,
    payload,
  };
}