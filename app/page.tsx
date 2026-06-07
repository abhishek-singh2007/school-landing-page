import { HeroCarousel as HeroSection } from "@/components/hero-carousel";
import { AboutTeaser } from "@/components/about-teaser";
import { TopperTeaser } from "@/components/topper-teaser";
import { FeaturedGallery } from "@/components/featured-gallery";
import { getFeaturedImages } from "@/app/actions/getFeaturedImages";

export default async function Home() {
  // PHASE 2: Fetch featured images from Firestore
  const result = await getFeaturedImages();

  return (
    <main className="relative mx-auto flex w-full max-w-7xl flex-col gap-16 px-4 py-6 sm:px-6 lg:px-8">
      <article aria-labelledby="hero-heading" className="w-full">
        <HeroSection />
      </article>

      <AboutTeaser />

      <TopperTeaser />

      {/* PHASE 2: Replace old GalleryTeaser with FeaturedGallery */}
      {result.success && result.data ? (
        <FeaturedGallery images={result.data} />
      ) : (
        <section className="w-full">
          <div className="rounded-[2rem] border border-white/70 bg-white/70 p-8 shadow-glass backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/60 text-center">
            <p className="text-sm leading-7 text-slate-600 dark:text-slate-300">
              {result.error || "Gallery section currently unavailable. Please try again later."}
            </p>
          </div>
        </section>
      )}
    </main>
  );
}
