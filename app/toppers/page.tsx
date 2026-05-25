import type { Metadata } from 'next';
import { ToppersPageClient } from './page-client';


export const metadata: Metadata = {
  title: 'Hall of Fame 2026 | JKD International Inter College',
  description:
    'Explore the Hall of Fame 2026 for JKD International Inter College. View board toppers sorted by their academic performance.',
  keywords: [
    'JKD International Inter College',
    'Hall of Fame 2026',
    'board toppers',
    'academic excellence',
    'Kanpur school toppers',
  ],
};

export default function ToppersPage() {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <header className="max-w-3xl space-y-4 mb-12">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-yellow-500">JKD International Inter College</p>
        <h1 className="text-4xl font-black tracking-tight text-slate-950 dark:text-white sm:text-5xl lg:text-6xl">
          Hall of Fame 2026
        </h1>
        <p className="max-w-2xl text-base leading-8 text-slate-600 dark:text-slate-300 sm:text-lg">
          Celebrating the academic excellence of JKD International Inter College. All toppers are sorted by their board examination scores.
        </p>
      </header>

      <ToppersPageClient />
    </main>
  );
}