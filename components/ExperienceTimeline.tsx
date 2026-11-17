"use client";

import { useEffect, useRef, useState } from "react";
import { FiArrowRight, FiCalendar, FiMapPin, FiMessageCircle, FiX } from "react-icons/fi";
import type { Experience } from "@/lib/config-types";
import { TechLogo } from "@/lib/tech-icons";

/** "Carnegie Mellon University Africa" -> "CMU", "Isazi Consulting" -> "IC" */
function initials(company: string) {
  return company
    .split(/\s+/)
    .filter((w) => /^[A-Z]/.test(w))
    .map((w) => w[0])
    .join("")
    .slice(0, 3);
}

function splitPeriod(period: string) {
  const [dates, ...rest] = period.split(" · ");
  return { dates: dates.trim(), location: rest.join(" · ").trim() };
}

const isCurrent = (e: Experience) => /present/i.test(e.period);

export default function ExperienceTimeline({ items }: { items: Experience[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);
  const listRef = useRef<HTMLOListElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  // Fill the timeline line as the visitor scrolls through it.
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const el = listRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const anchor = window.innerHeight * 0.6;
      setProgress(Math.min(1, Math.max(0, (anchor - r.top) / r.height)));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (open !== null && !d.open) d.showModal();
    if (open === null && d.open) d.close();
  }, [open]);

  const selected = open !== null ? items[open] : null;

  function askAI(e: Experience) {
    setOpen(null);
    window.dispatchEvent(
      new CustomEvent("portfolio:ask", { detail: `Tell me more about their ${e.role} role at ${e.company}.` }),
    );
  }

  return (
    <>
      <ol ref={listRef} className="relative">
        {/* the line: faint track + accent fill that grows with scroll */}
        <span aria-hidden className="absolute bottom-0 left-5 top-0 w-px bg-line md:left-1/2 md:-translate-x-1/2" />
        <span
          aria-hidden
          className="absolute left-5 top-0 w-px origin-top bg-accent transition-[height] duration-200 md:left-1/2 md:-translate-x-1/2"
          style={{ height: `${progress * 100}%` }}
        />

        {items.map((e, i) => {
          const { dates, location } = splitPeriod(e.period);
          const left = i % 2 === 0; // desktop: alternate sides
          const current = isCurrent(e);
          const reached = progress * items.length > i + 0.2;
          return (
            <li key={e.role + e.company} className="relative pb-12 pl-14 last:pb-0 md:grid md:grid-cols-2 md:gap-16 md:pl-0">
              {/* node on the line */}
              <span
                aria-hidden
                className={`absolute left-5 top-4 z-10 grid h-10 w-10 -translate-x-1/2 place-items-center rounded-full text-[10px] font-semibold tracking-wide ring-4 ring-bg transition-colors duration-500 md:left-1/2 ${
                  reached ? "border border-accent bg-accent text-accent-fg" : "border border-line bg-card text-muted"
                }`}
              >
                {initials(e.company)}
                {current && <span className="tl-pulse absolute inset-0 rounded-full" />}
              </span>

              {/* date on the opposite side (desktop) */}
              <p
                className={`hidden pt-6 text-sm uppercase tracking-[0.2em] text-muted md:block ${
                  left ? "md:order-2 md:text-left" : "md:order-1 md:text-right"
                }`}
              >
                {dates}
              </p>

              {/* card */}
              <div className={left ? "md:order-1" : "md:order-2"}>
                <button
                  type="button"
                  onClick={() => setOpen(i)}
                  aria-haspopup="dialog"
                  className="group block w-full rounded-2xl bg-card p-6 text-left shadow-[0_8px_30px_rgba(0,0,0,0.04)] ring-1 ring-line transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(0,0,0,0.08)] hover:ring-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-xs uppercase tracking-[0.2em] text-muted md:hidden">{dates}</p>
                    {current && (
                      <span className="rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-accent">
                        Now
                      </span>
                    )}
                  </div>
                  <h3 className="mt-1 text-xl font-light leading-snug">{e.role}</h3>
                  <p className="mt-1 font-semibold text-accent">{e.company}</p>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{e.summary ?? e.bullets[0]}</p>

                  {/* revealed on hover / focus (always shown on touch screens) */}
                  <div className="tl-more grid transition-[grid-template-rows] duration-500 ease-out">
                    <div className="overflow-hidden">
                      <ul className="mt-4 flex flex-wrap gap-2">
                        {e.tech.map((t) => (
                          <li key={t} className="inline-flex items-center gap-1.5 rounded-full bg-bg px-2.5 py-1 text-xs ring-1 ring-line">
                            <TechLogo name={t} size={14} />
                            {t}
                          </li>
                        ))}
                      </ul>
                      {location && (
                        <p className="mt-3 flex items-center gap-1.5 text-xs text-muted">
                          <FiMapPin aria-hidden /> {location}
                        </p>
                      )}
                      <p className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-accent">
                        Click for details <FiArrowRight aria-hidden className="transition group-hover:translate-x-1" />
                      </p>
                    </div>
                  </div>
                </button>
              </div>
            </li>
          );
        })}
      </ol>

      <dialog
        ref={dialogRef}
        onClose={() => setOpen(null)}
        onClick={(ev) => {
          if (ev.target === dialogRef.current) setOpen(null); // click on backdrop
        }}
        aria-labelledby="tl-dialog-title"
        className="tl-dialog m-auto w-[min(40rem,calc(100vw-2rem))] max-h-[85vh] rounded-2xl bg-card p-0 text-fg shadow-2xl ring-1 ring-line"
      >
        {selected && (
          <div className="p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-accent text-xs font-semibold text-accent-fg">
                {initials(selected.company)}
              </span>
              <div className="min-w-0 flex-1">
                <h3 id="tl-dialog-title" className="text-2xl font-light leading-snug">
                  {selected.role}
                </h3>
                <p className="mt-1 font-semibold text-accent">{selected.company}</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(null)}
                aria-label="Close"
                className="rounded-full p-2 text-muted transition hover:bg-bg hover:text-fg"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted">
              <span className="inline-flex items-center gap-1.5">
                <FiCalendar aria-hidden /> {splitPeriod(selected.period).dates}
              </span>
              {splitPeriod(selected.period).location && (
                <span className="inline-flex items-center gap-1.5">
                  <FiMapPin aria-hidden /> {splitPeriod(selected.period).location}
                </span>
              )}
              {isCurrent(selected) && (
                <span className="rounded-full bg-accent/10 px-2 py-0.5 text-xs font-semibold text-accent">Current role</span>
              )}
            </div>

            <h4 className="mt-6 text-xs uppercase tracking-[0.3em] text-muted">What I did</h4>
            <ul className="mt-3 space-y-3">
              {selected.bullets.map((b) => (
                <li key={b} className="flex gap-3 text-sm leading-relaxed">
                  <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  {b}
                </li>
              ))}
            </ul>

            <h4 className="mt-6 text-xs uppercase tracking-[0.3em] text-muted">Tools</h4>
            <ul className="mt-3 flex flex-wrap gap-2">
              {selected.tech.map((t) => (
                <li key={t} className="inline-flex items-center gap-2 rounded-xl bg-bg px-3 py-2 text-sm ring-1 ring-line">
                  <TechLogo name={t} size={18} />
                  {t}
                </li>
              ))}
            </ul>

            <button
              type="button"
              onClick={() => askAI(selected)}
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-accent-fg transition hover:opacity-90"
            >
              <FiMessageCircle aria-hidden /> Ask my AI about this role
            </button>
          </div>
        )}
      </dialog>
    </>
  );
}
