import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Gallery | JKD International Inter College",
  description: "Browse gallery highlights from JKD International Inter College.",
};

export default function GalleryPage() {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <section className="max-w-3xl space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-pillar-500">JKD International Inter College</p>
        <h1 className="text-4xl font-black tracking-tight text-slate-950 dark:text-white sm:text-5xl">Gallery</h1>
        <p className="max-w-2xl text-base leading-8 text-slate-600 dark:text-slate-300">
          This page is ready for future image uploads from the admin panel. For now it mirrors the placeholder-first layout used on the homepage.
        </p>
      </section>

      <div className="mt-8 rounded-[2rem] border border-white/70 bg-white/70 p-8 shadow-glass backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/60">
        <p className="text-sm leading-7 text-slate-600 dark:text-slate-300">
          Connect this page to the final gallery content source when the backend is ready.
        </p>

        <Link
          href="/"
          className="mt-6 inline-flex items-center gap-3 rounded-full border border-pillar-300 bg-gradient-to-r from-yellow-400 to-amber-500 px-6 py-3 text-sm font-bold text-slate-950"
        >
          Back to Home
        </Link>
      </div>
    </main>
  );
}