'use client';

import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { FloatingPortraitCard } from '@/components/floating-portrait-card';
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

export function ToppersPageClient() {
  const [toppers, setToppers] = useState<ProcessedTopper[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAndProcessToppers();
  }, []);

  const fetchAndProcessToppers = async () => {
    try {
      console.log('[ToppersPageClient] Fetching all toppers from Firebase...');
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

      // Add dynamic ranks
      const processedToppers = fetchedToppers.map((topper, index) => ({
        ...topper,
        rank: index + 1,
      }));

      console.log('[ToppersPageClient] Processed', processedToppers.length, 'toppers with dynamic ranks');
      setToppers(processedToppers);
      setError(null);
    } catch (err) {
      console.error('[ToppersPageClient] Error fetching toppers:', err);
      setError('Failed to load toppers');
      setToppers([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Loading State
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <Loader2 className="w-12 h-12 animate-spin text-yellow-400 mb-4" />
        <p className="text-slate-600 dark:text-slate-400">Loading toppers...</p>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="text-center py-24">
        <p className="text-slate-600 dark:text-slate-400 mb-4">{error}</p>
      </div>
    );
  }

  // Empty State
  if (toppers.length === 0) {
    return (
      <div className="text-center py-24">
        <p className="text-slate-600 dark:text-slate-400">No toppers found yet.</p>
      </div>
    );
  }

  // Toppers Grid
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
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
  );
}
