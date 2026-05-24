import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/navbar";

export const metadata: Metadata = {
  title: "JKD International Inter College | Best school in kanpur panki ",
  description:
    "JKD International Inter College provides premium education with a focus on academic excellence, holistic development, and character building. Discover our heritage, leadership team, and commitment to shaping future leaders.",
  keywords: [
    "JKD International Inter College",
    "Inter College",
    "education",
    "academic excellence",
    "STEM education",
    "holistic development",
    "character building",
    "leadership",
    "Prashant Raj Yadav",
    "Ekta Yadav",
    "Ram Pal Singh Yadav",
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-[var(--background)] text-slate-950 antialiased transition-colors duration-300 dark:text-slate-50">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
