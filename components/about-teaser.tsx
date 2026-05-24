"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export function AboutTeaser() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <article className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        {/* Left: Founder Image Placeholder */}
        <motion.figure
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true, margin: "-80px" }}
          className="overflow-hidden rounded-[2rem] border border-white/60 bg-gradient-to-br from-slate-100 to-slate-50 shadow-glass backdrop-blur-xl dark:border-white/10 dark:from-slate-900 dark:to-slate-800"
        >
          <div className="aspect-[3/4] flex items-center justify-center">
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
              <p className="mt-3 text-sm font-medium text-slate-500 dark:text-slate-400">Late Mr. Ram Pal Singh Yadav</p>
              <p className="text-xs text-slate-400 dark:text-slate-500">Founder</p>
            </div>
          </div>
        </motion.figure>

        {/* Right: Heading, Mission & Leadership Info */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          viewport={{ once: true, margin: "-80px" }}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-pillar-500">Heritage & Leadership</p>

          <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950 dark:text-white sm:text-4xl lg:text-5xl">
            Our Visionary Founder
          </h2>

          <p className="mt-6 max-w-lg text-base leading-8 text-slate-600 dark:text-slate-300">
            Founded on principles of academic excellence and holistic development, JKD International Inter College has been shaping
            generations of leaders and innovators. Our commitment remains unwavering: to create an environment where every student can
            unlock their full potential.
          </p>

          {/* Subtle Leadership Mention */}
          <p className="mt-5 text-sm font-medium text-pillar-600 dark:text-pillar-400">
            Carrying the legacy forward under the dynamic leadership of Director Prashant Raj Yadav & Principal Ekta Yadav.
          </p>

          <Link
            href="/about"
            className="mt-8 inline-flex items-center gap-3 rounded-full border border-pillar-300 bg-gradient-to-r from-pillar-50 to-pillar-100 px-7 py-3.5 text-sm font-semibold text-pillar-900 shadow-md transition hover:from-pillar-100 hover:to-pillar-200 dark:border-pillar-600/50 dark:from-pillar-950/40 dark:to-pillar-900/40 dark:text-pillar-200"
          >
            Read Full History
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="m9 18 6-6-6-6" />
            </svg>
          </Link>
        </motion.div>
      </article>
    </section>
  );
}
