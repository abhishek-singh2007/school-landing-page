"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

type TopperClass = "10th" | "12th";

type Topper = {
  id: number;
  name: string;
  rank: number;
  percentage: string;
  className: TopperClass;
  stream: string;
  image: string;
};

const toppers: Record<TopperClass, Topper[]> = {
  "12th": [
    {
      id: 1,
      name: "Aditi Singh",
      rank: 1,
      percentage: "97.8%",
      className: "12th",
      stream: "Science",
      image: createPlaceholderImage("Aditi Singh", "12th", "Rank 1"),
    },
    {
      id: 2,
      name: "Rohit Yadav",
      rank: 2,
      percentage: "96.4%",
      className: "12th",
      stream: "Commerce",
      image: createPlaceholderImage("Rohit Yadav", "12th", "Rank 2"),
    },
    {
      id: 3,
      name: "Ananya Verma",
      rank: 3,
      percentage: "95.9%",
      className: "12th",
      stream: "Arts",
      image: createPlaceholderImage("Ananya Verma", "12th", "Rank 3"),
    },
  ],
  "10th": [
    {
      id: 4,
      name: "Kunal Gupta",
      rank: 1,
      percentage: "98.2%",
      className: "10th",
      stream: "All Rounder",
      image: createPlaceholderImage("Kunal Gupta", "10th", "Rank 1"),
    },
    {
      id: 5,
      name: "Priya Maurya",
      rank: 2,
      percentage: "97.1%",
      className: "10th",
      stream: "Consistency Award",
      image: createPlaceholderImage("Priya Maurya", "10th", "Rank 2"),
    },
    {
      id: 6,
      name: "Samar Khan",
      rank: 3,
      percentage: "96.3%",
      className: "10th",
      stream: "Merit Scholar",
      image: createPlaceholderImage("Samar Khan", "10th", "Rank 3"),
    },
  ],
};

function createPlaceholderImage(name: string, classLabel: TopperClass, rankLabel: string) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000" fill="none">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#f8fafc" />
          <stop offset="100%" stop-color="#dbeafe" />
        </linearGradient>
        <linearGradient id="accent" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#facc15" />
          <stop offset="100%" stop-color="#f59e0b" />
        </linearGradient>
      </defs>
      <rect width="800" height="1000" rx="44" fill="url(#bg)" />
      <circle cx="640" cy="180" r="118" fill="#fde68a" opacity="0.55" />
      <circle cx="170" cy="820" r="150" fill="#bfdbfe" opacity="0.55" />
      <rect x="72" y="78" width="656" height="844" rx="34" fill="rgba(255,255,255,0.64)" stroke="#dbeafe" />
      <rect x="104" y="116" width="170" height="54" rx="27" fill="url(#accent)" />
      <text x="189" y="151" text-anchor="middle" font-size="22" font-family="Arial, Helvetica, sans-serif" font-weight="700" fill="#0f172a">JKD TOPPER</text>
      <circle cx="400" cy="402" r="148" fill="#0f172a" opacity="0.08" />
      <circle cx="400" cy="380" r="118" fill="#1e293b" opacity="0.12" />
      <path d="M333 548c24-29 56-45 67-45 11 0 43 16 67 45 22 27 39 69 39 111v42H294v-42c0-42 17-84 39-111Z" fill="#0f172a" opacity="0.16" />
      <circle cx="400" cy="350" r="66" fill="#334155" opacity="0.22" />
      <text x="400" y="694" text-anchor="middle" font-size="38" font-family="Arial, Helvetica, sans-serif" font-weight="700" fill="#0f172a">${name}</text>
      <text x="400" y="744" text-anchor="middle" font-size="25" font-family="Arial, Helvetica, sans-serif" fill="#334155">${classLabel} - ${rankLabel}</text>
      <rect x="224" y="792" width="352" height="64" rx="32" fill="#0f172a" />
      <text x="400" y="833" text-anchor="middle" font-size="24" font-family="Arial, Helvetica, sans-serif" font-weight="700" fill="#f8fafc">Pillar Yellow Spotlight</text>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function getImageAlt(topper: Topper) {
  return `${topper.name}, ${topper.className} topper rank ${topper.rank} with ${topper.percentage}`;
}

function getAccentLabel(activeTab: TopperClass) {
  return activeTab === "12th" ? "Class 12th toppers" : "Class 10th toppers";
}

export function TopperTeaser() {
  const [activeTab, setActiveTab] = useState<TopperClass>("12th");
  const [centerIndex, setCenterIndex] = useState(0);

  const activeToppers = toppers[activeTab];
  const total = activeToppers.length;
  const activeTopper = activeToppers[centerIndex];

  function setTab(nextTab: TopperClass) {
    setActiveTab(nextTab);
    setCenterIndex(0);
  }

  function shiftCenter(delta: number) {
    setCenterIndex((current) => (current + delta + total) % total);
  }

  const visibleIndexes = [centerIndex - 1, centerIndex, centerIndex + 1].map((index) => (index + total) % total);

  const cardPositions: Array<"left" | "center" | "right"> = ["left", "center", "right"];
  const activeLabel = activeTab === "12th" ? "Class 12th Board Toppers" : "Class 10th Board Toppers";

  return (
    <section aria-label="JKD Toppers" className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col items-center gap-5 text-center md:flex-row md:items-end md:justify-between md:text-left">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-pillar-500">Merit Board</p>
          <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950 dark:text-white sm:text-4xl lg:text-5xl">
            Celebrating JKD achievers with a responsive 3D topper showcase.
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-7 text-slate-600 dark:text-slate-300 sm:text-base">
            Switch between Class 10th and 12th, drag the center card to rotate the stack, or tap any side card to bring it forward.
          </p>
        </div>

        <div className="mx-auto inline-flex w-full max-w-sm justify-center rounded-full border border-white/60 bg-white/75 p-1.5 shadow-glass backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/55 md:mx-0 md:w-auto">
          {(["12th", "10th"] as const).map((tab) => {
            const active = activeTab === tab;

            return (
              <button
                key={tab}
                type="button"
                onClick={() => setTab(tab)}
                className={`flex-1 rounded-full px-5 py-3 text-sm font-semibold transition-all duration-300 md:flex-none ${
                  active
                    ? "bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-900 shadow-[0_12px_30px_rgba(250,204,21,0.35)]"
                    : "bg-black/10 text-slate-700 backdrop-blur-sm hover:bg-black/15 dark:bg-white/10 dark:text-slate-200 dark:hover:bg-white/15"
                }`}
                aria-pressed={active}
              >
                Class {tab}
              </button>
            );
          })}
        </div>
      </div>

      <div className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-white/70 px-3 py-8 shadow-glass backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/60 sm:px-6 sm:py-10 lg:px-10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(250,204,21,0.14),_transparent_42%),radial-gradient(circle_at_bottom_right,_rgba(30,64,175,0.18),_transparent_38%)]" />

        <button
          type="button"
          onClick={() => shiftCenter(-1)}
          aria-label="Previous topper"
          className="absolute left-2 top-1/2 z-30 -translate-y-1/2 rounded-full border border-white/20 bg-white/20 p-3 text-slate-900 shadow-glass backdrop-blur-md transition hover:bg-white/30 dark:text-white sm:left-4"
        >
          <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" />
        </button>

        <button
          type="button"
          onClick={() => shiftCenter(1)}
          aria-label="Next topper"
          className="absolute right-2 top-1/2 z-30 -translate-y-1/2 rounded-full border border-white/20 bg-white/20 p-3 text-slate-900 shadow-glass backdrop-blur-md transition hover:bg-white/30 dark:text-white sm:right-4"
        >
          <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" />
        </button>

        <div className="mx-auto w-full max-w-sm md:hidden">
          <article className="overflow-hidden rounded-[1.75rem] border border-slate-200/80 bg-white/90 text-left shadow-[0_18px_60px_rgba(15,23,42,0.10)] dark:border-white/10 dark:bg-slate-900/80">
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
              <Image
                src={activeTopper.image}
                alt={getImageAlt(activeTopper)}
                fill
                sizes="85vw"
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-slate-950/10 to-transparent" />

              <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-slate-950/60 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-white backdrop-blur-md">
                <span className="h-2 w-2 rounded-full bg-yellow-400 shadow-[0_0_16px_rgba(250,204,21,0.75)]" />
                {activeTopper.className} Standard
              </div>

              <div className="absolute right-4 top-4 rounded-full bg-yellow-400 px-4 py-2 text-sm font-black text-slate-950 shadow-[0_12px_30px_rgba(250,204,21,0.28)]">
                #{activeTopper.rank}
              </div>
            </div>

            <div className="flex flex-1 flex-col gap-4 p-5 sm:p-6">
              <div className="min-h-[7.5rem] space-y-2 overflow-hidden">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-pillar-500">{activeLabel}</p>
                <h3 className="truncate text-2xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-3xl">
                  {activeTopper.name}
                </h3>
                <p className="truncate text-sm leading-6 text-slate-600 dark:text-slate-300">{activeTopper.stream}</p>
                <p className="text-sm leading-6 text-slate-500 dark:text-slate-400">
                  Rank #{activeTopper.rank} with {activeTopper.percentage}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-slate-200/80 bg-slate-50/90 p-3 dark:border-white/10 dark:bg-white/5">
                  <p className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Rank</p>
                  <p className="mt-2 text-lg font-black text-slate-950 dark:text-white">{activeTopper.rank}</p>
                </div>
                <div className="rounded-2xl border border-yellow-300/60 bg-gradient-to-br from-yellow-100 to-amber-200 p-3 dark:border-yellow-400/20 dark:from-yellow-400/20 dark:to-amber-500/10">
                  <p className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-slate-600 dark:text-slate-300">Score</p>
                  <p className="mt-2 text-lg font-black text-slate-950 dark:text-white">{activeTopper.percentage}</p>
                </div>
              </div>
            </div>
          </article>
        </div>

        <div className="relative hidden min-h-[34rem] md:grid md:grid-cols-3 md:items-center md:gap-6">
          {visibleIndexes.map((topperIndex, positionIndex) => {
            const topper = activeToppers[topperIndex];
            const position = cardPositions[positionIndex];
            const isCenter = position === "center";

            return (
              <motion.button
                key={`${activeTab}-${topper.id}`}
                type="button"
                onClick={() => setCenterIndex(topperIndex)}
                drag={isCenter ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.12}
                whileHover={{ scale: isCenter ? 1.1 : 0.85 }}
                whileTap={{ scale: isCenter ? 1.06 : 0.82 }}
                animate={{
                  x: position === "left" ? "-8%" : position === "right" ? "8%" : 0,
                  scale: isCenter ? 1.1 : 0.85,
                  opacity: isCenter ? 1 : 0.6,
                  rotateY: position === "left" ? 24 : position === "right" ? -24 : 0,
                  zIndex: isCenter ? 30 : 10,
                  filter: isCenter ? "blur(0px)" : "blur(2px)",
                }}
                initial={false}
                transition={{ type: "tween", ease: "easeInOut", duration: 0.3 }}
                className={`relative mx-auto flex w-full max-w-[23rem] flex-col overflow-hidden rounded-[2rem] border text-left outline-none transition-[box-shadow,transform] duration-300 ${
                  isCenter
                    ? "border-yellow-300/70 bg-white/85 shadow-[0_24px_80px_rgba(250,204,21,0.28)] dark:border-yellow-400/30 dark:bg-slate-900/80"
                    : "border-slate-200/80 bg-white/70 shadow-[0_18px_60px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-slate-900/70"
                } ${isCenter ? "md:col-start-2" : position === "left" ? "md:col-start-1" : "md:col-start-3"}`}
                style={{
                  transformStyle: "preserve-3d",
                  perspective: 1600,
                }}
                aria-label={`${topper.name}, ${topper.className} topper rank ${topper.rank}`}
              >
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <Image
                    src={topper.image}
                    alt={getImageAlt(topper)}
                    fill
                    sizes="(max-width: 1024px) 92vw, 420px"
                    className="object-cover"
                    priority={isCenter}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-slate-950/10 to-transparent" />

                  <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-slate-950/60 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-white backdrop-blur-md">
                    <span className="h-2 w-2 rounded-full bg-yellow-400 shadow-[0_0_16px_rgba(250,204,21,0.75)]" />
                    {topper.className} Standard
                  </div>

                  <div className="absolute right-4 top-4 rounded-full bg-yellow-400 px-4 py-2 text-sm font-black text-slate-950 shadow-[0_12px_30px_rgba(250,204,21,0.28)]">
                    #{topper.rank}
                  </div>
                </div>

                <div className="flex flex-1 flex-col gap-4 p-5 sm:p-6">
                  <div className="min-h-[8rem] space-y-2 overflow-hidden">
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-pillar-500">{activeLabel}</p>
                    <h3 className="truncate text-2xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-3xl">
                      {topper.name}
                    </h3>
                    <p className="truncate text-sm leading-6 text-slate-600 dark:text-slate-300">{topper.stream}</p>
                    <p className="text-sm leading-6 text-slate-500 dark:text-slate-400">
                      Rank #{topper.rank} with {topper.percentage}
                    </p>
                  </div>

                  <div className="mt-auto grid grid-cols-2 gap-3">
                    <div className="rounded-2xl border border-slate-200/80 bg-slate-50/90 p-3 dark:border-white/10 dark:bg-white/5">
                      <p className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
                        Rank
                      </p>
                      <p className="mt-2 text-lg font-black text-slate-950 dark:text-white">{topper.rank}</p>
                    </div>
                    <div className="rounded-2xl border border-yellow-300/60 bg-gradient-to-br from-yellow-100 to-amber-200 p-3 dark:border-yellow-400/20 dark:from-yellow-400/20 dark:to-amber-500/10">
                      <p className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-slate-600 dark:text-slate-300">
                        Score
                      </p>
                      <p className="mt-2 text-lg font-black text-slate-950 dark:text-white">{topper.percentage}</p>
                    </div>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>

        <div className="relative mt-8 flex items-center justify-center gap-2">
          {activeToppers.map((topper, index) => {
            const active = index === centerIndex;

            return (
              <button
                key={`${activeTab}-dot-${topper.id}`}
                type="button"
                onClick={() => setCenterIndex(index)}
                aria-label={`Show ${topper.name}`}
                aria-current={active}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  active ? "w-10 bg-yellow-400 shadow-[0_0_0_6px_rgba(250,204,21,0.12)]" : "w-2.5 bg-slate-300 dark:bg-slate-600"
                }`}
              />
            );
          })}
        </div>

        <div className="relative mt-8 flex justify-center">
          <Link
            href="/toppers"
            className="inline-flex items-center gap-3 rounded-full border border-pillar-300 bg-gradient-to-r from-yellow-400 to-amber-500 px-7 py-3.5 text-sm font-bold text-slate-950 shadow-[0_18px_40px_rgba(250,204,21,0.28)] transition hover:-translate-y-0.5 hover:shadow-[0_20px_50px_rgba(250,204,21,0.34)] dark:border-yellow-300/40"
          >
            ➡️ VIEW ALL TOPPERS
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
              <path d="m9 18 6-6-6-6" />
            </svg>
          </Link>
        </div>

        <div className="sr-only">
          {Object.values(toppers)
            .flat()
            .map((topper) => (
              <p key={topper.id}>
                {topper.name}, {topper.className} topper rank {topper.rank}, scored {topper.percentage}.
              </p>
            ))}
        </div>
      </div>
    </section>
  );
}