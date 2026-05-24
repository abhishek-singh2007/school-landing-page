import { HeroCarousel } from "@/components/hero-carousel";
import { AboutTeaser } from "@/components/about-teaser";

export default function Home() {
  return (
    <main className="relative">
      <article aria-labelledby="hero-heading" className="mx-auto w-full max-w-7xl px-4 pb-16 pt-6 sm:px-6 lg:px-8">
        <HeroCarousel />
      </article>

      <AboutTeaser />
    </main>
  );
}
