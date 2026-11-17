"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Fades and lifts its children in once their top has scrolled into the viewport.
 * Uses a position check rather than IntersectionObserver so sections jumped past
 * (nav links, fast scrolls) are revealed too.
 */
export default function Reveal({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (shown) return;
    let frame = 0;
    const check = () => {
      frame = 0;
      const el = ref.current;
      if (el && el.getBoundingClientRect().top < window.innerHeight * 0.9) setShown(true);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(check);
    };
    check();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [shown]);

  return (
    <div ref={ref} className={`reveal ${shown ? "reveal-in" : ""} ${className}`}>
      {children}
    </div>
  );
}
