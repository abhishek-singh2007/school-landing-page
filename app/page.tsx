import { HeroCarousel as HeroSection } from "@/components/hero-carousel";
import { AboutTeaser } from "@/components/about-teaser";
import { TopperTeaser } from "@/components/topper-teaser";
import { GalleryTeaser } from "@/components/gallery-teaser";

export default function Home() {
  return (
    <main className="relative mx-auto flex w-full max-w-7xl flex-col gap-16 px-4 py-6 sm:px-6 lg:px-8">
      <article aria-labelledby="hero-heading" className="w-full">
        <HeroSection />
      </article>

      <AboutTeaser />

      <TopperTeaser />

      <GalleryTeaser />
    </main>
  );
}
