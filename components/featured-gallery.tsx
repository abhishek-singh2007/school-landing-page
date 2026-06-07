'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X } from 'lucide-react';

interface FeaturedImage {
  id: string;
  secure_url: string;
  public_id: string;
  isFeatured: boolean;
  created_at: unknown;
}

interface FeaturedGalleryProps {
  images: FeaturedImage[];
}

export function FeaturedGallery({ images }: FeaturedGalleryProps) {
  // PHASE 2: Lightbox state for featured gallery
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleImageClick = (secureUrl: string) => {
    setSelectedImage(secureUrl);
  };

  const handleCloseLightbox = () => {
    setSelectedImage(null);
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleCloseLightbox();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleCloseLightbox();
    }
  };

  if (images.length === 0) {
    return (
      <section className="w-full">
        <div className="mb-6 flex flex-col items-center gap-4 text-center md:flex-row md:items-end md:justify-between md:text-left">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-pillar-500">Memories</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 dark:text-white sm:text-4xl">
              JKD Campus Memories
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300 sm:text-base">
              Explore our campus moments and achievements.
            </p>
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/70 bg-white/70 p-8 shadow-glass backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/60 text-center">
          <p className="text-sm leading-7 text-slate-600 dark:text-slate-300">
            No featured images selected yet. Check back soon!
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full">
      <div className="mb-6 flex flex-col items-center gap-4 text-center md:flex-row md:items-end md:justify-between md:text-left">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-pillar-500">Memories</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 dark:text-white sm:text-4xl">
            JKD Campus Memories
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300 sm:text-base">
            A collection of our favorite moments from campus life.
          </p>
        </div>
      </div>

      <div className="rounded-[2rem] border border-white/70 bg-white/70 p-6 shadow-glass backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/60 md:p-8">
        {/* PHASE 2: Modern responsive grid for featured images */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {images.map((image) => (
            <div
              key={image.id}
              className="relative borderless sleek cursor-pointer rounded-xl shadow-md overflow-hidden hover:opacity-90 transition-opacity duration-300 h-48"
              onClick={() => handleImageClick(image.secure_url)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleImageClick(image.secure_url);
                }
              }}
            >
              <Image
                src={image.secure_url}
                alt="Featured gallery image"
                fill
                className="object-cover w-full h-full"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                priority={false}
              />
            </div>
          ))}
        </div>

        {/* PHASE 2: CTA Button below the grid */}
        <div className="mt-8 flex justify-center">
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
      </div>

      {/* PHASE 2: Lightbox for featured gallery */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm"
          onClick={handleOverlayClick}
          onKeyDown={handleKeyDown}
          role="dialog"
          aria-modal="true"
          aria-label="Featured image lightbox"
          tabIndex={-1}
        >
          {/* Close button */}
          <button
            onClick={handleCloseLightbox}
            className="absolute top-6 right-6 p-2 text-white hover:bg-white/10 rounded-lg transition-colors duration-200 z-60"
            aria-label="Close lightbox"
            title="Press ESC to close"
          >
            <X className="w-8 h-8" strokeWidth={2.5} />
          </button>

          {/* Image container */}
          <div className="relative w-full h-full flex items-center justify-center p-4">
            <Image
              src={selectedImage}
              alt="Fullscreen featured image"
              fill
              className="object-contain w-full h-full"
              sizes="100vw"
              priority
            />
          </div>

          {/* Hint text */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-white/60 text-sm">
            Press ESC to close
          </div>
        </div>
      )}
    </section>
  );
}
