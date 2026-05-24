import type { Metadata } from "next";
import Image from "next/image";

type Topper = {
  id: string;
  name: string;
  percentage: string;
  rank: number;
  image: string;
  classGroup: "12th" | "10th";
  year: string;
};

const class12Toppers: Topper[] = [
  { id: "12-1", name: "Aditi Singh", percentage: "97.8%", rank: 1, image: createTopperImage("Aditi Singh", "12th", 1), classGroup: "12th", year: "2026" },
  { id: "12-2", name: "Rohit Yadav", percentage: "96.4%", rank: 2, image: createTopperImage("Rohit Yadav", "12th", 2), classGroup: "12th", year: "2026" },
  { id: "12-3", name: "Ananya Verma", percentage: "95.9%", rank: 3, image: createTopperImage("Ananya Verma", "12th", 3), classGroup: "12th", year: "2026" },
  { id: "12-4", name: "Sakshi Mishra", percentage: "95.4%", rank: 4, image: createTopperImage("Sakshi Mishra", "12th", 4), classGroup: "12th", year: "2026" },
  { id: "12-5", name: "Harsh Raj", percentage: "95.1%", rank: 5, image: createTopperImage("Harsh Raj", "12th", 5), classGroup: "12th", year: "2026" },
  { id: "12-6", name: "Ishita Yadav", percentage: "94.8%", rank: 6, image: createTopperImage("Ishita Yadav", "12th", 6), classGroup: "12th", year: "2026" },
  { id: "12-7", name: "Arjun Kumar", percentage: "94.5%", rank: 7, image: createTopperImage("Arjun Kumar", "12th", 7), classGroup: "12th", year: "2026" },
  { id: "12-8", name: "Nandini Singh", percentage: "94.2%", rank: 8, image: createTopperImage("Nandini Singh", "12th", 8), classGroup: "12th", year: "2026" },
  { id: "12-9", name: "Faizan Khan", percentage: "93.9%", rank: 9, image: createTopperImage("Faizan Khan", "12th", 9), classGroup: "12th", year: "2026" },
  { id: "12-10", name: "Priya Verma", percentage: "93.6%", rank: 10, image: createTopperImage("Priya Verma", "12th", 10), classGroup: "12th", year: "2026" },
];

const class10Toppers: Topper[] = [
  { id: "10-1", name: "Kunal Gupta", percentage: "98.2%", rank: 1, image: createTopperImage("Kunal Gupta", "10th", 1), classGroup: "10th", year: "2026" },
  { id: "10-2", name: "Priya Maurya", percentage: "97.1%", rank: 2, image: createTopperImage("Priya Maurya", "10th", 2), classGroup: "10th", year: "2026" },
  { id: "10-3", name: "Samar Khan", percentage: "96.3%", rank: 3, image: createTopperImage("Samar Khan", "10th", 3), classGroup: "10th", year: "2026" },
  { id: "10-4", name: "Anvi Singh", percentage: "95.8%", rank: 4, image: createTopperImage("Anvi Singh", "10th", 4), classGroup: "10th", year: "2026" },
  { id: "10-5", name: "Rudra Patel", percentage: "95.5%", rank: 5, image: createTopperImage("Rudra Patel", "10th", 5), classGroup: "10th", year: "2026" },
  { id: "10-6", name: "Tanya Singh", percentage: "95.1%", rank: 6, image: createTopperImage("Tanya Singh", "10th", 6), classGroup: "10th", year: "2026" },
  { id: "10-7", name: "Aarav Yadav", percentage: "94.8%", rank: 7, image: createTopperImage("Aarav Yadav", "10th", 7), classGroup: "10th", year: "2026" },
  { id: "10-8", name: "Muskan Verma", percentage: "94.4%", rank: 8, image: createTopperImage("Muskan Verma", "10th", 8), classGroup: "10th", year: "2026" },
  { id: "10-9", name: "Armaan Khan", percentage: "94.0%", rank: 9, image: createTopperImage("Armaan Khan", "10th", 9), classGroup: "10th", year: "2026" },
  { id: "10-10", name: "Riya Gupta", percentage: "93.7%", rank: 10, image: createTopperImage("Riya Gupta", "10th", 10), classGroup: "10th", year: "2026" },
];

export const metadata: Metadata = {
  title: "Hall of Fame 2026 | JKD International Inter College",
  description:
    "Explore the Hall of Fame 2026 for JKD International Inter College. View Class 12th and Class 10th board toppers in a clean, responsive grid layout.",
  keywords: [
    "JKD International Inter College",
    "Hall of Fame 2026",
    "board toppers",
    "Class 12th toppers",
    "Class 10th toppers",
    "Kanpur school toppers",
  ],
};

function createTopperImage(name: string, classGroup: Topper["classGroup"], rank: number) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000" fill="none">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#e0f2fe" />
          <stop offset="100%" stop-color="#f8fafc" />
        </linearGradient>
        <linearGradient id="accent" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#facc15" />
          <stop offset="100%" stop-color="#f59e0b" />
        </linearGradient>
      </defs>
      <rect width="800" height="1000" rx="42" fill="url(#bg)" />
      <circle cx="640" cy="180" r="120" fill="#fde68a" opacity="0.55" />
      <circle cx="170" cy="820" r="150" fill="#bfdbfe" opacity="0.55" />
      <rect x="70" y="72" width="660" height="856" rx="34" fill="rgba(255,255,255,0.7)" stroke="#dbeafe" />
      <rect x="102" y="110" width="182" height="54" rx="27" fill="url(#accent)" />
      <text x="193" y="145" text-anchor="middle" font-size="22" font-family="Arial, Helvetica, sans-serif" font-weight="700" fill="#0f172a">JKD TOPPER</text>
      <circle cx="400" cy="398" r="146" fill="#0f172a" opacity="0.08" />
      <circle cx="400" cy="376" r="116" fill="#1e293b" opacity="0.12" />
      <path d="M334 540c24-29 56-45 66-45s42 16 66 45c22 27 40 69 40 111v44H294v-44c0-42 18-84 40-111Z" fill="#0f172a" opacity="0.16" />
      <circle cx="400" cy="346" r="66" fill="#334155" opacity="0.22" />
      <text x="400" y="690" text-anchor="middle" font-size="38" font-family="Arial, Helvetica, sans-serif" font-weight="700" fill="#0f172a">${name}</text>
      <text x="400" y="740" text-anchor="middle" font-size="25" font-family="Arial, Helvetica, sans-serif" fill="#334155">${classGroup} Board Rank ${rank}</text>
      <rect x="224" y="794" width="352" height="64" rx="32" fill="#0f172a" />
      <text x="400" y="835" text-anchor="middle" font-size="24" font-family="Arial, Helvetica, sans-serif" font-weight="700" fill="#f8fafc">Pillar Yellow Spotlight</text>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function TopperCard({ topper }: { topper: Topper }) {
  return (
    <article className="group overflow-hidden rounded-[1.75rem] border border-white/70 bg-white/80 shadow-glass transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-white/10 dark:bg-slate-950/70">
      <div className="relative aspect-[4/5] overflow-hidden bg-slate-100 dark:bg-slate-900">
        <Image src={topper.image} alt={`${topper.name} - ${topper.classGroup} topper rank ${topper.rank}`} fill sizes="(max-width: 1024px) 50vw, 20vw" className="object-cover transition-transform duration-300 group-hover:scale-[1.03]" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/55 via-slate-950/5 to-transparent" />
        <div className="absolute right-3 top-3 rounded-full bg-yellow-400 px-3 py-1.5 text-xs font-black text-slate-950 shadow-[0_10px_24px_rgba(250,204,21,0.3)]">
          #{topper.rank}
        </div>
      </div>

      <div className="space-y-2 p-4 sm:p-5">
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-pillar-500">{topper.year}</p>
        <h3 className="truncate text-sm font-bold text-slate-900 dark:text-white sm:text-base">{topper.name}</h3>
        <div className="flex items-center justify-between gap-3">
          <span className="truncate text-xs text-slate-600 dark:text-slate-300">Class {topper.classGroup}</span>
          <span className="rounded-full bg-yellow-100 px-2.5 py-1 text-xs font-semibold text-slate-900 dark:bg-yellow-400/20 dark:text-yellow-200">
            {topper.percentage}
          </span>
        </div>
      </div>
    </article>
  );
}

function TopperGrid({ title, toppers }: { title: string; toppers: Topper[] }) {
  return (
    <section aria-labelledby={title.toLowerCase().replace(/[^a-z0-9]+/g, "-")} className="space-y-6">
      <div className="flex flex-col gap-2">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-pillar-500">Board Results</p>
        <h2 id={title.toLowerCase().replace(/[^a-z0-9]+/g, "-")} className="text-2xl font-black tracking-tight text-slate-950 dark:text-white sm:text-3xl">
          {title}
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5 lg:gap-6">
        {toppers.map((topper) => (
          <TopperCard key={topper.id} topper={topper} />
        ))}
      </div>
    </section>
  );
}

export default function ToppersPage() {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <header className="max-w-3xl space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-pillar-500">JKD International Inter College</p>
        <h1 className="text-4xl font-black tracking-tight text-slate-950 dark:text-white sm:text-5xl lg:text-6xl">
          Hall of Fame 2026
        </h1>
        <p className="max-w-2xl text-base leading-8 text-slate-600 dark:text-slate-300 sm:text-lg">
          Celebrating the academic excellence of JKD International Inter College across Class 12th and Class 10th board toppers.
        </p>
      </header>

      <div className="mt-12 space-y-12">
        <TopperGrid title="Class 12th Board Toppers" toppers={class12Toppers} />

        <hr className="border-slate-200/80 dark:border-white/10" />

        <TopperGrid title="Class 10th Board Toppers" toppers={class10Toppers} />
      </div>
    </main>
  );
}