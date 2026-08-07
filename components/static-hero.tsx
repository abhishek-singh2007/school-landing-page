import Image from 'next/image';

export function StaticHero() {
  return (
    <section
      id="home"
      aria-label="Static hero image"
      className="relative w-full overflow-hidden bg-slate-950"
    >
      <div className="relative min-h-[100svh] w-full isolate">
        <Image
          src="/hero/hero-image.webp"
          alt="JKD International Inter College campus frontage"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>
    </section>
  );
}