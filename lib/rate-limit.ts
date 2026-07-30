import { headers } from 'next/headers';
import { doc, runTransaction } from 'firebase/firestore';
import { db } from '@/lib/firebase';

async function getRequestIp() {
  const headerStore = await headers();
  const forwardedFor = headerStore.get('x-forwarded-for');
  const realIp = headerStore.get('x-real-ip');
  const cloudflareIp = headerStore.get('cf-connecting-ip');

  const rawIp = forwardedFor?.split(',')[0]?.trim() || realIp || cloudflareIp || 'unknown';

  return rawIp;
}

export async function enforceRateLimit(options: {
  scope: string;
  identity: string;
  limit: number;
  windowMs: number;
}) {
  const now = Date.now();
  const key = `${options.scope}:${options.identity}:${await getRequestIp()}`;
  const ref = doc(db, 'rate_limits', key);

  const allowed = await runTransaction(db, async (transaction) => {
    const snapshot = await transaction.get(ref);

    if (!snapshot.exists()) {
      transaction.set(ref, {
        scope: options.scope,
        identity: options.identity,
        count: 1,
        windowStart: now,
        updatedAt: now,
      });

      return true;
    }

    const data = snapshot.data() as {
      count?: number;
      windowStart?: number;
    };

    const windowStart = typeof data.windowStart === 'number' ? data.windowStart : now;
    const count = typeof data.count === 'number' ? data.count : 0;

    if (now - windowStart >= options.windowMs) {
      transaction.set(ref, {
        scope: options.scope,
        identity: options.identity,
        count: 1,
        windowStart: now,
        updatedAt: now,
      });

      return true;
    }

    if (count >= options.limit) {
      return false;
    }

    transaction.update(ref, {
      count: count + 1,
      updatedAt: now,
    });

    return true;
  });

  if (!allowed) {
    throw new Error('Too many admin actions in a short time. Please wait and try again.');
  }
}