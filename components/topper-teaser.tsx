'use client';

import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { FloatingPortraitCard } from './floating-portrait-card';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';


interface FirebaseTopper {
  id: string;
  name: string;
  score: number;
  classStream: string;
  passingYear: number;
  secure_url: string;
}

interface ProcessedTopper extends FirebaseTopper {
  rank: number;
}

export function TopperTeaser() {
  const [toppers, setToppers] = useState<ProcessedTopper[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAndProcessToppers();
  }, []);

  const fetchAndProcessToppers = async () => {
    try {
      console.log('[TopperTeaser] Fetching toppers from Firebase...');
      setIsLoading(true);

      // Fetch from Firestore
      const toppersRef = collection(db, 'toppers');
      const snapshot = await getDocs(toppersRef);

      // Map Firebase docs to ProcessedTopper
      let fetchedToppers: FirebaseTopper[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name,
        score: doc.data().score,
        classStream: doc.data().classStream,
        passingYear: doc.data().passingYear,
        secure_url: doc.data().secure_url,
      }));

      // Sort by score descending
      fetchedToppers.sort((a, b) => b.score - a.score);

      // Add dynamic ranks and slice top 3
      const topThree = fetchedToppers.slice(0, 3).map((topper, index) => ({
        ...topper,
        rank: index + 1,
      }));

      console.log('[TopperTeaser] Processed top 3 toppers:', topThree);
      setToppers(topThree);
      setError(null);
    } catch (err) {
      console.error('[TopperTeaser] Error fetching toppers:', err);
      setError('Failed to load toppers');
      setToppers([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section aria-label="JKD Top 3 Toppers" className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-12 flex flex-col items-center gap-5 text-center">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-yellow-500">Merit Board</p>
          <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950 dark:text-white sm:text-4xl lg:text-5xl">
            JKD Top 3 Achievers
          </h2>
          <p className="mt-4 max-w-xl mx-auto text-sm leading-7 text-slate-600 dark:text-slate-300 sm:text-base">
            Meet our outstanding students who excelled in their board examinations.
          </p>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-16">
          <Loader2 className="w-12 h-12 animate-spin text-yellow-400 mb-4" />
          <p className="text-slate-600 dark:text-slate-400">Loading toppers...</p>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="text-center py-16">
          <p className="text-slate-600 dark:text-slate-400 mb-4">{error}</p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && toppers.length === 0 && (
        <div className="text-center py-16">
          <p className="text-slate-600 dark:text-slate-400">No toppers found yet.</p>
        </div>
      )}

      {/* Toppers Grid */}
      {!isLoading && !error && toppers.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {toppers.map((topper) => (
              <FloatingPortraitCard
                key={topper.id}
                rank={topper.rank}
                name={topper.name}
                score={topper.score}
                classStream={topper.classStream}
                passingYear={topper.passingYear}
                imageUrl={topper.secure_url}
              />
            ))}
          </div>

          {/* View All Button */}
          <div className="flex justify-center">
            <Link
              href="/toppers"
              className="inline-flex items-center gap-3 rounded-full border border-yellow-300 bg-gradient-to-r from-yellow-400 to-amber-500 px-7 py-3.5 text-sm font-bold text-slate-950 shadow-[0_18px_40px_rgba(250,204,21,0.28)] transition hover:-translate-y-0.5 hover:shadow-[0_20px_50px_rgba(250,204,21,0.34)] dark:border-yellow-300/40"
            >
              ➡️ VIEW ALL TOPPERS
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </Link>
          </div>
        </>
      )}
    </section>
  );
}