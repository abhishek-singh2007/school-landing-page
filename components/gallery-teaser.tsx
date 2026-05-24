"use client";

import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

type GalleryItem = {
  id: number;
  title: string;
  label: string;
};

const galleryMock: GalleryItem[] = [
  { id: 1, title: "Annual Sports Day", label: "Campus life" },
  { id: 2, title: "Science Showcase", label: "Learning" },
  { id: 3, title: "Cultural Evening", label: "Celebration" },
  { id: 4, title: "Classroom Moments", label: "Everyday growth" },
  { id: 5, title: "Award Ceremony", label: "Achievement" },
  { id: 6, title: "Community Drive", label: "Service" },
];

export function GalleryTeaser() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start", skipSnaps: false });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) {
      return;
    }

    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) {
      return;
    }

    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);

    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <section aria-labelledby="gallery-teaser-heading" className="w-full">
      <div className="mb-6 flex flex-col items-center gap-4 text-center md:flex-row md:items-end md:justify-between md:text-left">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-pillar-500">Memories</p>
          <h2 id="gallery-teaser-heading" className="mt-3 text-3xl font-black tracking-tight text-slate-950 dark:text-white sm:text-4xl">
            JKD Campus Memories
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300 sm:text-base">
            A lightweight preview of school life, ready to connect with future admin data without changing the layout.
          </p>
        </div>
      </div>

      <div className="relative rounded-[2rem] border border-white/70 bg-white/70 px-3 py-5 shadow-glass backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/60 sm:px-5 sm:py-6">
        <div className="md:hidden">
          <div className="grid gap-4">
            {galleryMock.slice(0, 2).map((item) => (
              <article key={item.id} className="overflow-hidden rounded-[1.5rem] border border-slate-200/80 bg-white/85 shadow-glass dark:border-white/10 dark:bg-slate-900/80">
                <div className="relative aspect-video overflow-hidden bg-gray-100 dark:bg-gray-800">
                  <div className="absolute inset-0 flex items-center justify-center px-4 text-center">
                    <div className="space-y-3">
                      <ImageIcon className="mx-auto h-11 w-11 text-slate-400 dark:text-slate-500" aria-hidden="true" />
                      <div>
                        <p className="text-base font-semibold text-slate-700 dark:text-slate-200">Add Image</p>
                        <p className="mt-1 text-[0.65rem] uppercase tracking-[0.35em] text-slate-500 dark:text-slate-400">JKD Campus Memories</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-pillar-500">Gallery Preview</p>
                  <h3 className="mt-2 text-lg font-black tracking-tight text-slate-950 dark:text-white">{item.title}</h3>
                </div>
              </article>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={scrollPrev}
          aria-label="Previous gallery items"
          className="absolute left-2 top-1/2 z-20 hidden -translate-y-1/2 rounded-full border border-white/20 bg-white/20 p-3 text-slate-900 shadow-glass backdrop-blur-md transition hover:bg-white/30 dark:text-white md:block sm:left-4"
        >
          <ChevronLeft className="h-5 w-5" aria-hidden="true" />
        </button>

        <button
          type="button"
          onClick={scrollNext}
          aria-label="Next gallery items"
          className="absolute right-2 top-1/2 z-20 hidden -translate-y-1/2 rounded-full border border-white/20 bg-white/20 p-3 text-slate-900 shadow-glass backdrop-blur-md transition hover:bg-white/30 dark:text-white md:block sm:right-4"
        >
          <ChevronRight className="h-5 w-5" aria-hidden="true" />
        </button>

        <div className="hidden overflow-hidden px-10 sm:px-12 md:block" ref={emblaRef}>
          <div className="-mx-2 flex touch-pan-y">
            {galleryMock.map((item) => (
              <div key={item.id} className="min-w-0 basis-1/2 px-2 md:basis-1/3 lg:basis-1/4">
                <article className="group overflow-hidden rounded-[1.5rem] border border-slate-200/80 bg-white/80 shadow-glass transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-white/10 dark:bg-slate-900/80">
                  <div className="relative aspect-square overflow-hidden border-b border-slate-200/70 bg-gray-100 dark:border-white/10 dark:bg-gray-800">
                    <div className="absolute inset-0 flex items-center justify-center px-4 text-center">
                      <div className="space-y-3">
                        <ImageIcon className="mx-auto h-10 w-10 text-slate-400 dark:text-slate-500" aria-hidden="true" />
                        <div>
                          <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Add Image</p>
                          <p className="mt-1 text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">{item.label}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 sm:p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-pillar-500">Gallery Preview</p>
                    <h3 className="mt-2 truncate text-base font-bold text-slate-950 dark:text-white">{item.title}</h3>
                  </div>
                </article>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-5 flex items-center justify-center gap-2">
          {galleryMock.map((item, index) => (
            <button
              key={item.id}
              type="button"
              onClick={() => emblaApi?.scrollTo(index)}
              aria-label={`Go to gallery item ${index + 1}`}
              aria-current={selectedIndex === index}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                selectedIndex === index ? "w-8 bg-yellow-400" : "w-2.5 bg-slate-300 dark:bg-slate-600"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="mt-6 flex justify-center">
        <Link
          href="/gallery"
          className="inline-flex items-center gap-3 rounded-full border border-pillar-300 bg-gradient-to-r from-yellow-400 to-amber-500 px-7 py-3.5 text-sm font-bold text-slate-950 shadow-[0_18px_40px_rgba(250,204,21,0.28)] transition hover:-translate-y-0.5 hover:shadow-[0_20px_50px_rgba(250,204,21,0.34)] dark:border-yellow-300/40"
        >
          Explore Full Gallery
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
            <path d="m9 18 6-6-6-6" />
          </svg>
        </Link>
      </div>
    </section>
  );
}