"use client";

import useEmblaCarousel from "embla-carousel-react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { collection, query, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

type Slide = {
  id?: string;
  title: string;
  eyebrow: string;
  description: string;
  imageSrc?: string;
  alt?: string;
};

const defaultSlides: Slide[] = [
  {
    title: "Add an Image",
    eyebrow: "Visual direction",
    description: "A placeholder-first hero that keeps attention on layout, hierarchy, and motion before the final photography lands.",
  },
  {
    title: "Add an Image",
    eyebrow: "Conversion focus",
    description: "Readable text, strong contrast, and a clean bordered frame make the content easy to scan on every device.",
  },
  {
    title: "Add an Image",
    eyebrow: "SEO ready",
    description: "Semantic structure, meaningful alt logic, and accessible controls prepare the section for production content.",
  },
];

function getImageAlt(slide: Slide) {
  return slide.alt?.trim() || `${slide.title} placeholder image`;
}

function PlaceholderArtwork({ title }: { title: string }) {
  return (
    <div className="flex h-full min-h-[40vh] sm:min-h-[52vh] items-center justify-center rounded-2xl sm:rounded-[2rem] border border-dashed border-slate-300/80 bg-white/70 p-6 text-center shadow-glass backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/50 sm:p-10">
      <div className="flex flex-col items-center gap-5">
        <svg
          viewBox="0 0 64 64"
          className="icon-pulse h-20 w-20 text-slate-400 dark:text-slate-500 sm:h-28 sm:w-28"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          aria-hidden="true"
        >
          <rect x="8" y="12" width="48" height="40" rx="6" />
          <circle cx="24" cy="26" r="4" />
          <path d="M16 42l11-11 8 8 6-6 7 9" />
        </svg>
        <div>
          <p className="text-lg font-semibold tracking-wide text-slate-900 dark:text-white sm:text-xl">Add an Image</p>
          <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500 dark:text-slate-400">
            {title} is intentionally left as a clean placeholder so the layout can ship before assets are finalized.
          </p>
        </div>
      </div>
    </div>
  );
}

export function HeroCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
  const [slides, setSlides] = useState<Slide[]>(defaultSlides);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch hero images from Firebase
  useEffect(() => {
    const fetchHeroImages = async () => {
      try {
        const q = query(collection(db, "hero_images"));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          setSlides(defaultSlides);
        } else {
          const images = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            title: doc.data().heading || "Hero Image",
            eyebrow: "Featured",
            description: doc.data().subheading || "Explore our latest content",
            imageSrc: doc.data().secure_url,
            alt: doc.data().heading,
          }));
          setSlides(images);
        }
      } catch {
        setSlides(defaultSlides);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHeroImages();
  }, []);

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

    setScrollSnaps(emblaApi.scrollSnapList());
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
    <section id="home" aria-labelledby="hero-heading" className="overflow-hidden">
      <div className="mb-6 sm:mb-8 grid gap-4 sm:gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-pillar-500">JKD Academy</p>
          <motion.h1
            id="hero-heading"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="mt-3 sm:mt-4 max-w-3xl text-2xl sm:text-3xl sm:text-4xl lg:text-5xl lg:text-6xl font-black tracking-tight text-slate-950 dark:text-white"
          >
            A responsive hero and glass navbar built for strong first impressions.
          </motion.h1>
        </div>

        <h2 className="max-w-xl text-xs sm:text-sm leading-6 sm:leading-7 text-slate-600 dark:text-slate-300 sm:text-base">
          Embla keeps the slider lightweight, Framer Motion adds polish to the menu, and Tailwind handles the layout without
          sacrificing accessibility.
        </h2>
      </div>

      <div className="rounded-2xl sm:rounded-[2rem] border border-white/60 bg-white/65 p-3 sm:p-4 lg:p-5 shadow-glass backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/55">
        <div className="mb-3 sm:mb-4 flex items-center justify-between gap-2 sm:gap-4 px-2 sm:px-3">
          <p className="text-xs sm:text-sm font-medium uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Hero Carousel</p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={scrollPrev}
              className="inline-flex h-9 sm:h-11 w-9 sm:w-11 items-center justify-center rounded-full border border-slate-200 bg-white/80 text-slate-900 transition hover:-translate-y-0.5 hover:border-pillar-300 hover:text-pillar-600 dark:border-white/10 dark:bg-white/5 dark:text-white"
              aria-label="Previous slide"
            >
              <svg viewBox="0 0 24 24" className="h-4 sm:h-5 w-4 sm:w-5" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>
            <button
              type="button"
              onClick={scrollNext}
              className="inline-flex h-9 sm:h-11 w-9 sm:w-11 items-center justify-center rounded-full border border-slate-200 bg-white/80 text-slate-900 transition hover:-translate-y-0.5 hover:border-pillar-300 hover:text-pillar-600 dark:border-white/10 dark:bg-white/5 dark:text-white"
              aria-label="Next slide"
            >
              <svg viewBox="0 0 24 24" className="h-4 sm:h-5 w-4 sm:w-5" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center min-h-[40vh] sm:min-h-[52vh]">
            <p className="text-slate-500">Loading hero images...</p>
          </div>
        ) : (
          <>
            <div className="overflow-hidden" ref={emblaRef}>
              <div className="flex touch-pan-y">
                {slides.map((slide) => (
                  <div key={slide.id || slide.eyebrow} className="min-w-0 flex-[0_0_100%] px-1 pb-2 sm:px-2">
                    <article className="grid gap-4 sm:gap-6 md:grid-cols-[0.92fr_1.08fr] md:items-stretch">
                      <div className="flex flex-col justify-between rounded-2xl sm:rounded-[2rem] border border-slate-200/80 bg-slate-950 p-4 sm:p-6 sm:p-8 text-white shadow-[0_24px_80px_rgba(2,6,23,0.35)] dark:border-white/10">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-pillar-200">{slide.eyebrow}</p>
                          <h3 className="mt-3 sm:mt-4 text-2xl sm:text-3xl sm:text-4xl font-semibold tracking-tight">{slide.title}</h3>
                          <p className="mt-3 sm:mt-4 max-w-md text-xs sm:text-sm leading-6 sm:leading-7 text-slate-300 sm:text-base">{slide.description}</p>
                        </div>

                        <div className="mt-6 sm:mt-8 flex flex-wrap gap-2 text-xs font-medium uppercase tracking-[0.25em] text-slate-300">
                          <span className="rounded-full border border-white/10 px-2.5 sm:px-3 py-1.5 sm:py-2">Tailwind</span>
                          <span className="rounded-full border border-white/10 px-2.5 sm:px-3 py-1.5 sm:py-2">Framer Motion</span>
                          <span className="rounded-full border border-white/10 px-2.5 sm:px-3 py-1.5 sm:py-2">Embla</span>
                        </div>
                      </div>

                      <figure className="min-h-[40vh] sm:min-h-[52vh]">
                        {slide.imageSrc ? (
                          <div className="relative h-full min-h-[40vh] sm:min-h-[52vh] overflow-hidden rounded-2xl sm:rounded-[2rem] border border-slate-300/80 bg-white shadow-glass dark:border-white/10 dark:bg-slate-900">
                            <Image
                              src={slide.imageSrc}
                              alt={getImageAlt(slide)}
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 100vw, 55vw"
                              priority={false}
                            />
                          </div>
                        ) : (
                          <PlaceholderArtwork title={slide.title} />
                        )}
                      </figure>
                    </article>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 sm:mt-5 flex items-center justify-center gap-2 pb-2">
              {scrollSnaps.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => emblaApi?.scrollTo(index)}
                  aria-label={`Go to slide ${index + 1}`}
                  aria-current={selectedIndex === index}
                  className={`h-2 sm:h-2.5 rounded-full transition-all duration-300 ${
                    selectedIndex === index ? "w-6 sm:w-8 bg-pillar-500" : "w-2 sm:w-2.5 bg-slate-300 dark:bg-slate-600"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <section id="about" className="sr-only">
        <h2>About JKD</h2>
        <p>Responsive navigation and a semantic hero carousel optimized for accessibility and search engines.</p>
      </section>
      <section id="toppers" className="sr-only">
        <h2>Toppers</h2>
      </section>
      <section id="gallery" className="sr-only">
        <h2>Gallery</h2>
      </section>
      <section id="contact-us" className="sr-only">
        <h2>Contact Us</h2>
      </section>
    </section>
  );
}

