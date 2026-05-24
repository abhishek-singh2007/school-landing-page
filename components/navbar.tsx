"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const navLinks = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#toppers", label: "Toppers" },
  { href: "#gallery", label: "Gallery" },
  { href: "#contact-us", label: "Contact Us" },
];

function useDesktopBreakpoint() {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)");
    const update = () => setIsDesktop(mediaQuery.matches);

    update();
    mediaQuery.addEventListener("change", update);

    return () => mediaQuery.removeEventListener("change", update);
  }, []);

  return isDesktop;
}

export function Navbar() {
  const isDesktop = useDesktopBreakpoint();
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const storedTheme = window.localStorage.getItem("jkd-theme");
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const nextTheme = storedTheme === "dark" || storedTheme === "light" ? storedTheme : systemPrefersDark ? "dark" : "light";

    setTheme(nextTheme);
    document.documentElement.classList.toggle("dark", nextTheme === "dark");
  }, []);

  const menuOrigin = useMemo(() => (isDesktop ? "-100%" : "100%"), [isDesktop]);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    document.documentElement.classList.toggle("dark", nextTheme === "dark");
    window.localStorage.setItem("jkd-theme", nextTheme);
  };

  return (
    <header className="sticky top-0 z-50 w-full">
      <nav
        aria-label="Primary"
        className="border-b border-white/50 bg-white/80 backdrop-blur-md dark:border-white/10 dark:bg-slate-950/80"
      >
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="#home" className="text-2xl font-black tracking-[0.35em] text-slate-950 dark:text-white" aria-label="JKD home">
            JKD
          </Link>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleTheme}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white/70 text-slate-800 transition hover:-translate-y-0.5 hover:border-pillar-300 hover:text-pillar-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-100"
              aria-label="Toggle dark mode"
            >
              {theme === "dark" ? (
                <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-[1.7]" aria-hidden="true">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-[1.7]" aria-hidden="true">
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2.5M12 19.5V22M4.93 4.93l1.77 1.77M17.3 17.3l1.77 1.77M2 12h2.5M19.5 12H22M4.93 19.07l1.77-1.77M17.3 6.7l1.77-1.77" />
                </svg>
              )}
            </button>

            <button
              type="button"
              onClick={() => setMenuOpen((value) => !value)}
              className="group inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white/70 text-slate-900 transition hover:-translate-y-0.5 hover:border-pillar-300 dark:border-white/10 dark:bg-white/5 dark:text-white"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
            >
              <span className="relative block h-4 w-5">
                <span
                  className={`absolute left-0 top-0 block h-0.5 w-5 origin-center rounded-full bg-current transition duration-300 ${
                    menuOpen ? "translate-y-2 rotate-45" : "translate-y-0 rotate-0"
                  }`}
                />
                <span
                  className={`absolute left-0 top-1.5 block h-0.5 w-5 origin-center rounded-full bg-current transition duration-300 ${
                    menuOpen ? "scale-x-0 opacity-0" : "scale-x-100 opacity-100"
                  }`}
                />
                <span
                  className={`absolute left-0 top-3 block h-0.5 w-5 origin-center rounded-full bg-current transition duration-300 ${
                    menuOpen ? "-translate-y-2 -rotate-45" : "translate-y-0 rotate-0"
                  }`}
                />
              </span>
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            initial={{ opacity: 0, y: menuOrigin }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: menuOrigin }}
            transition={{ type: "spring", stiffness: 120, damping: 18 }}
            className="fixed inset-x-0 bottom-0 top-16 z-40 md:top-20 md:bottom-auto"
          >
            <div className="h-full w-full border-t border-white/40 bg-white/90 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/90">
              <div className="mx-auto flex h-full w-full max-w-7xl flex-col justify-between px-4 py-8 sm:px-6 lg:px-8">
                <div className="grid gap-4 md:grid-cols-2 md:items-center">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-pillar-500">Navigate</p>
                    <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white md:text-5xl">
                      Jump to the next section.
                    </h2>
                  </div>
                  <div className="grid gap-3 md:justify-end">
                    {navLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setMenuOpen(false)}
                        className="rounded-2xl border border-slate-200 bg-white/80 px-5 py-4 text-base font-medium text-slate-900 transition hover:border-pillar-300 hover:text-pillar-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-100"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="mt-10 border-t border-slate-200/70 pt-6 text-sm text-slate-500 dark:border-white/10 dark:text-slate-400">
                  Sticky navigation remains available while the menu uses a device-specific slide direction for a cleaner mobile and desktop feel.
                </div>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
