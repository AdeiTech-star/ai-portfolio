"use client";

import { useEffect, useState } from "react";

/** Types each phrase, pauses, deletes it, then moves to the next. */
export default function Typewriter({ phrases }: { phrases: string[] }) {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    if (reduced || phrases.length === 0) return;
    const full = phrases[index % phrases.length];
    let delay = deleting ? 40 : 90;
    if (!deleting && text === full) delay = 1800;
    if (deleting && text === "") delay = 400;

    const t = setTimeout(() => {
      if (!deleting && text === full) setDeleting(true);
      else if (deleting && text === "") {
        setDeleting(false);
        setIndex((i) => i + 1);
      } else setText(full.slice(0, text.length + (deleting ? -1 : 1)));
    }, delay);
    return () => clearTimeout(t);
  }, [text, deleting, index, phrases, reduced]);

  const shown = reduced ? phrases[0] : text;
  return (
    <span aria-label={phrases[0]}>
      <span aria-hidden>{shown}</span>
      <span aria-hidden className="caret ml-1 inline-block w-[3px] self-stretch bg-accent/40 align-[-0.1em]">&nbsp;</span>
    </span>
  );
}
