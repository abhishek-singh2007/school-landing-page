'use client';

import { useState } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';
import type { GalleryImage } from '@/app/actions/getGalleryImages';

interface GalleryClientProps {
  images: GalleryImage[];
}

export function GalleryClient({ images }: GalleryClientProps) {
  // PHASE 4: State for fullscreen lightbox
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleImageClick = (secureUrl: string) => {
    setSelectedImage(secureUrl);
  };

  const handleCloseLightbox = () => {
    setSelectedImage(null);
  };

  // Handle overlay click to close lightbox
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleCloseLightbox();
    }
  };

  // Handle ESC key to close lightbox
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleCloseLightbox();
    }
  };

  if (images.length === 0) {
    return (
      <div className="rounded-[2rem] border border-white/70 bg-white/70 p-8 shadow-glass backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/60 text-center">
        <p className="text-sm leading-7 text-slate-600 dark:text-slate-300">
          No gallery images available yet.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* PHASE 3: Responsive CSS Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {images.map((image) => (
          <div
            key={image.id}
            className="relative borderless sleek cursor-pointer rounded-xl shadow-md overflow-hidden hover:opacity-90 transition-opacity duration-300"
            onClick={() => handleImageClick(image.secure_url)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleImageClick(image.secure_url);
              }
            }}
          >
            <div className="relative w-full h-0 pb-[56.25%]">
              <Image
                src={image.secure_url}
                alt="Gallery image"
                fill
                className="object-cover w-full h-full"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw"
                priority={false}
              />
            </div>
          </div>
        ))}
      </div>

      {/* PHASE 4: Full-Screen Lightbox (Zoom Mode) */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm"
          onClick={handleOverlayClick}
          onKeyDown={handleKeyDown}
          role="dialog"
          aria-modal="true"
          aria-label="Image lightbox"
          tabIndex={-1}
        >
          {/* Close button - absolute top-right */}
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
              alt="Fullscreen gallery image"
              fill
              className="object-contain w-full h-full"
              sizes="100vw"
              priority
            />
          </div>

          {/* Optional: Display hint text */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-white/60 text-sm">
            Press ESC to close
          </div>
        </div>
      )}
    </>
  );
}
