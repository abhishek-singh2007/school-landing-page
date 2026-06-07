import type { Metadata } from "next";
import { getGalleryImages } from "@/app/actions/getGalleryImages";
import { GalleryClient } from "@/components/gallery-client";

export const metadata: Metadata = {
  title: "Gallery | JKD International Inter College",
  description: "Browse gallery highlights from JKD International Inter College.",
};

export default async function GalleryPage() {
  // PHASE 3 & 4: Fetch gallery images from Firestore
  const result = await getGalleryImages();

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <section className="max-w-3xl space-y-4 mb-12">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-pillar-500">
          Memories
        </p>
        <h1 className="text-4xl font-black tracking-tight text-slate-950 dark:text-white sm:text-5xl">
          JKD Campus Gallery
        </h1>
        <p className="max-w-2xl text-base leading-8 text-slate-600 dark:text-slate-300">
          Explore moments from our school community. Click any image to view it in fullscreen.
        </p>
      </section>

      {/* PHASE 3: Responsive Grid with Firestore Data */}
      {result.success && result.data ? (
        <GalleryClient images={result.data} />
      ) : (
        <div className="rounded-[2rem] border border-white/70 bg-white/70 p-8 shadow-glass backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/60 text-center">
          <p className="text-sm leading-7 text-slate-600 dark:text-slate-300">
            {result.error || "No gallery images available yet."}
          </p>
        </div>
      )}
    </main>
  );
}