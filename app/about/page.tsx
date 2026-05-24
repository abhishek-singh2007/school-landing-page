import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About JKD International Inter College | Heritage & Leadership",
  description:
    "Discover the rich heritage of JKD International Inter College, founded on principles of academic excellence. Learn about our visionary founder and dynamic leadership team.",
  keywords: ["JKD International Inter College", "about us", "founder", "leadership", "education", "academic excellence"],
};

export default function AboutPage() {
  return (
    <main className="relative">
      {/* Hero Section: Founder Tribute */}
      <article className="border-b border-white/40 bg-gradient-to-b from-white/50 to-transparent px-4 py-16 dark:border-white/10 dark:from-slate-950/50 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            {/* Founder Image */}
            <figure className="overflow-hidden rounded-[2rem] border border-white/60 bg-gradient-to-br from-slate-100 to-slate-50 shadow-glass backdrop-blur-xl dark:border-white/10 dark:from-slate-900 dark:to-slate-800">
              <div className="aspect-[3/4] flex items-center justify-center">
                <div className="text-center">
                  <svg
                    viewBox="0 0 24 24"
                    className="mx-auto h-20 w-20 text-slate-400 dark:text-slate-500"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  <p className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">Late Mr. Ram Pal Singh Yadav</p>
                  <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">Founder, JKD International Inter College</p>
                </div>
              </div>
            </figure>

            {/* Founder Story */}
            <section aria-labelledby="founder-heading">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-pillar-500">Our Foundation</p>

              <h1 id="founder-heading" className="mt-4 text-4xl font-black tracking-tight text-slate-950 dark:text-white sm:text-5xl">
                A Legacy Built on Vision
              </h1>

              <div className="mt-8 space-y-5 text-base leading-8 text-slate-600 dark:text-slate-300">
                <p>
                  Late Mr. Ram Pal Singh Yadav founded JKD International Inter College with an unwavering vision: to create an
                  institution where academic rigor meets holistic development. His pioneering spirit and commitment to educational
                  excellence laid the foundation for what has become one of the region's most respected educational establishments.
                </p>
                <p>
                  With a deep belief in the transformative power of quality education, Mr. Yadav envisioned an institution that would
                  not merely impart knowledge but cultivate critical thinking, creativity, and character. His legacy continues to guide
                  every decision, every program, and every interaction within our walls.
                </p>
                <p>
                  Today, under the dynamic leadership of Director Prashant Raj Yadav and Principal Ekta Yadav, we remain faithful to
                  his principles while embracing innovation and modern pedagogical methods. The college stands as a testament to his
                  enduring vision—a place where every student is empowered to become a leader, innovator, and responsible citizen.
                </p>
              </div>
            </section>
          </div>
        </div>
      </article>

      {/* Leadership Grid Section */}
      <section className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-pillar-500">Our Leaders</p>
          <h2 className="mt-4 text-4xl font-black tracking-tight text-slate-950 dark:text-white sm:text-5xl">
            Dynamic Leadership Team
          </h2>
          <p className="mt-6 mx-auto max-w-2xl text-base leading-8 text-slate-600 dark:text-slate-300">
            Dedicated professionals committed to nurturing talent and driving academic excellence across every discipline.
          </p>
        </div>

        {/* Leadership Grid: 1 col mobile, 2 cols desktop */}
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Principal: Mrs. Ekta Yadav */}
          <article className="overflow-hidden rounded-[2rem] border border-white/60 bg-white/70 shadow-glass backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/60">
            {/* Image Placeholder */}
            <figure className="overflow-hidden border-b border-white/40 bg-gradient-to-br from-slate-100 to-slate-50 dark:border-white/10 dark:from-slate-900 dark:to-slate-800">
              <div className="aspect-[4/3] flex items-center justify-center">
                <div className="text-center">
                  <svg
                    viewBox="0 0 24 24"
                    className="mx-auto h-16 w-16 text-slate-400 dark:text-slate-500"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  <p className="mt-3 text-xs font-medium text-slate-500 dark:text-slate-400">Photo Placeholder</p>
                </div>
              </div>
            </figure>

            {/* Content */}
            <div className="p-8 sm:p-10">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-pillar-500">Principal</p>
              <h3 className="mt-3 text-2xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-3xl">Mrs. Ekta Yadav</h3>

              <div className="mt-6 space-y-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
                <p>
                  Mrs. Ekta Yadav brings a wealth of experience and visionary leadership to the role of Principal. Her pedagogical
                  expertise and student-centric approach have been instrumental in elevating the academic standards of JKD International
                  Inter College.
                </p>
                <p>
                  With a strong focus on integrated development, she has spearheaded initiatives in STEM education, cultural enrichment,
                  and character building. Her commitment to creating an inclusive, nurturing environment ensures that every student
                  receives personalized attention and has opportunities to thrive both academically and personally.
                </p>
                <p>
                  Under her stewardship, the college continues to produce graduates who excel not just in academics but also in
                  becoming responsible global citizens equipped to face the challenges of tomorrow.
                </p>
              </div>

              <ul className="mt-6 flex flex-wrap gap-2">
                <li className="inline-block rounded-full border border-slate-200/80 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
                  Academic Leadership
                </li>
                <li className="inline-block rounded-full border border-slate-200/80 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
                  Student Development
                </li>
                <li className="inline-block rounded-full border border-slate-200/80 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
                  Innovation in Education
                </li>
              </ul>
            </div>
          </article>

          {/* Director: Mr. Prashant Raj Yadav */}
          <article className="overflow-hidden rounded-[2rem] border border-white/60 bg-white/70 shadow-glass backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/60">
            {/* Image Placeholder */}
            <figure className="overflow-hidden border-b border-white/40 bg-gradient-to-br from-slate-100 to-slate-50 dark:border-white/10 dark:from-slate-900 dark:to-slate-800">
              <div className="aspect-[4/3] flex items-center justify-center">
                <div className="text-center">
                  <svg
                    viewBox="0 0 24 24"
                    className="mx-auto h-16 w-16 text-slate-400 dark:text-slate-500"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  <p className="mt-3 text-xs font-medium text-slate-500 dark:text-slate-400">Photo Placeholder</p>
                </div>
              </div>
            </figure>

            {/* Content */}
            <div className="p-8 sm:p-10">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-pillar-500">Director</p>
              <h3 className="mt-3 text-2xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-3xl">Mr. Prashant Raj Yadav</h3>

              <div className="mt-6 space-y-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
                <p>
                  Mr. Prashant Raj Yadav directs the strategic vision and operational excellence of JKD International Inter College.
                  His forward-thinking approach and innovative management practices have transformed the institution into a beacon of
                  educational quality in the region.
                </p>
                <p>
                  With a keen eye on global trends in education, he has successfully integrated modern infrastructure, digital learning
                  platforms, and industry-relevant skill development into the curriculum. His emphasis on collaboration between faculty,
                  students, and industry partners has created an ecosystem of continuous learning and growth.
                </p>
                <p>
                  Committed to sustainable educational practices and community engagement, Mr. Yadav ensures that JKD International Inter
                  College remains at the forefront of educational innovation while staying rooted in values and excellence.
                </p>
              </div>

              <ul className="mt-6 flex flex-wrap gap-2">
                <li className="inline-block rounded-full border border-slate-200/80 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
                  Strategic Vision
                </li>
                <li className="inline-block rounded-full border border-slate-200/80 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
                  Digital Innovation
                </li>
                <li className="inline-block rounded-full border border-slate-200/80 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
                  Operational Excellence
                </li>
              </ul>
            </div>
          </article>
        </div>
      </section>

      {/* Institutional Values Section */}
      <section className="border-t border-white/40 bg-white/30 px-4 py-16 dark:border-white/10 dark:bg-slate-950/30 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-7xl">
          <div className="mb-12 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-pillar-500">Core Principles</p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-4xl">What We Stand For</h2>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: "✓", title: "Academic Excellence", desc: "Rigorous curriculum and world-class faculty committed to student success." },
              { icon: "✓", title: "Holistic Development", desc: "Beyond academics: sports, arts, character building, and life skills." },
              { icon: "✓", title: "Inclusive Community", desc: "An environment where every student belongs and can flourish." },
              { icon: "✓", title: "Innovation & Adaptation", desc: "Embracing modern tools and methodologies in education." },
              { icon: "✓", title: "Integrity & Ethics", desc: "Building leaders of conscience with strong moral values." },
              { icon: "✓", title: "Social Responsibility", desc: "Commitment to community upliftment and sustainable practices." },
            ].map((value, idx) => (
              <article
                key={idx}
                className="rounded-[1.5rem] border border-white/60 bg-white/70 p-6 shadow-glass backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/60 sm:p-8"
              >
                <div className="text-2xl font-bold text-pillar-500">{value.icon}</div>
                <h3 className="mt-3 text-lg font-bold text-slate-950 dark:text-white">{value.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{value.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
