"use client";

import { useEffect, useState } from "react";

function shouldBlockShortcut(event: KeyboardEvent) {
  const key = event.key.toLowerCase();
  const modifier = event.ctrlKey || event.metaKey;

  return (
    key === "f12" ||
    (modifier && event.shiftKey && (key === "i" || key === "j" || key === "c")) ||
    (modifier && key === "u") ||
    (modifier && key === "p")
  );
}

export function SiteRestrictions() {
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    const blockContextMenu = (event: MouseEvent) => event.preventDefault();
    const blockCopyAndDrag = (event: Event) => event.preventDefault();
    const blockShortcuts = (event: KeyboardEvent) => {
      if (shouldBlockShortcut(event)) {
        event.preventDefault();
        event.stopPropagation();
      }
    };

    const detectDevtools = () => {
      const widthGap = Math.abs(window.outerWidth - window.innerWidth);
      const heightGap = Math.abs(window.outerHeight - window.innerHeight);
      const probablyOpen = window.innerWidth > 1024 && (widthGap > 180 || heightGap > 180);
      setIsLocked(probablyOpen);
    };

    document.addEventListener("contextmenu", blockContextMenu);
    document.addEventListener("copy", blockCopyAndDrag);
    document.addEventListener("cut", blockCopyAndDrag);
    document.addEventListener("dragstart", blockCopyAndDrag);
    document.addEventListener("keydown", blockShortcuts, true);
    window.addEventListener("resize", detectDevtools);
    const interval = window.setInterval(detectDevtools, 1000);

    detectDevtools();

    return () => {
      document.removeEventListener("contextmenu", blockContextMenu);
      document.removeEventListener("copy", blockCopyAndDrag);
      document.removeEventListener("cut", blockCopyAndDrag);
      document.removeEventListener("dragstart", blockCopyAndDrag);
      document.removeEventListener("keydown", blockShortcuts, true);
      window.removeEventListener("resize", detectDevtools);
      window.clearInterval(interval);
    };
  }, []);

  return isLocked ? (
    <div className="site-security-lock pointer-events-none fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/95 px-6 text-center text-white backdrop-blur-lg">
      <div className="max-w-xl rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-yellow-300">Protected Mode</p>
        <h1 className="mt-4 text-2xl font-black tracking-tight sm:text-3xl">Inspection tools are disabled on this site.</h1>
        <p className="mt-4 text-sm leading-7 text-white/75">
          The page is temporarily locked because browser developer tools appear to be open.
          Close them to continue browsing.
        </p>
      </div>
    </div>
  ) : null;
}