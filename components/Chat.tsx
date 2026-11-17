"use client";

import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";

type Msg = { role: "user" | "assistant"; content: string };

const MAX_CHARS = 1000;

export default function Chat({ name, suggestions }: { name: string; suggestions: string[] }) {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  useEffect(() => () => abortRef.current?.abort(), []);

  // Other parts of the page (e.g. the experience timeline) can ask a question:
  // window.dispatchEvent(new CustomEvent("portfolio:ask", { detail: "question" }))
  const sendRef = useRef<(text: string) => void>(() => {});
  useEffect(() => {
    sendRef.current = send;
  });
  useEffect(() => {
    const onAsk = (ev: Event) => {
      const question = (ev as CustomEvent<string>).detail;
      if (typeof question !== "string") return;
      document.getElementById("ask")?.scrollIntoView({ behavior: "smooth", block: "start" });
      sendRef.current(question);
    };
    window.addEventListener("portfolio:ask", onAsk);
    return () => window.removeEventListener("portfolio:ask", onAsk);
  }, []);

  async function send(text: string) {
    const content = text.trim().slice(0, MAX_CHARS);
    if (!content || busy) return;

    const history: Msg[] = [...messages, { role: "user", content }];
    setMessages([...history, { role: "assistant", content: "" }]);
    setInput("");
    setBusy(true);

    const controller = new AbortController();
    abortRef.current = controller;
    const update = (fn: (prev: string) => string) =>
      setMessages((m) => {
        const copy = [...m];
        copy[copy.length - 1] = { role: "assistant", content: fn(copy[copy.length - 1].content) };
        return copy;
      });

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
        signal: controller.signal,
      });
      if (!res.ok || !res.body) {
        const msg = await res.text().catch(() => "");
        update(() => msg || "Something went wrong. Please try again.");
        return;
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        update((prev) => prev + chunk);
      }
    } catch (err) {
      if ((err as Error).name !== "AbortError") update((p) => p || "Connection lost. Please try again.");
    } finally {
      setBusy(false);
      abortRef.current = null;
    }
  }

  const last = messages.at(-1);
  const waiting = busy && last?.role === "assistant" && last.content === "";

  return (
    <div className="flex h-[32rem] flex-col overflow-hidden rounded-2xl bg-card shadow-[0_8px_30px_rgba(0,0,0,0.06)] ring-1 ring-line">
      <div className="flex items-center gap-2 border-b border-line px-4 py-3">
        <span className="h-2 w-2 rounded-full bg-accent" aria-hidden />
        <p className="text-sm font-medium">Ask my AI about {name}</p>
        {messages.length > 0 && (
          <button
            onClick={() => {
              abortRef.current?.abort();
              setMessages([]);
            }}
            className="ml-auto text-xs text-muted hover:text-fg"
          >
            Clear
          </button>
        )}
      </div>

      <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-4 py-4" aria-live="polite">
        {messages.length === 0 && (
          <div className="flex h-full flex-col justify-center gap-4">
            <p className="text-sm text-muted">
              Hi! I can answer questions about {name}&apos;s experience, projects, skills and availability.
            </p>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="rounded-full border border-line px-3 py-1.5 text-left text-sm hover:border-accent hover:text-accent"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m, i) =>
          m.role === "user" ? (
            <div key={i} className="flex justify-end">
              <p className="max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-br-sm bg-accent px-3.5 py-2 text-sm text-accent-fg">
                {m.content}
              </p>
            </div>
          ) : (
            <div key={i} className="prose-chat max-w-[90%] text-sm leading-relaxed">
              {m.content ? (
                <ReactMarkdown
                  components={{
                    a: (props) => <a {...props} target="_blank" rel="noopener noreferrer" />,
                  }}
                >
                  {m.content}
                </ReactMarkdown>
              ) : waiting && i === messages.length - 1 ? (
                <span className="inline-flex gap-1" aria-label="Thinking">
                  <span className="dot" />
                  <span className="dot [animation-delay:150ms]" />
                  <span className="dot [animation-delay:300ms]" />
                </span>
              ) : null}
            </div>
          ),
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="flex gap-2 border-t border-line p-3"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          maxLength={MAX_CHARS}
          placeholder="Ask about projects, skills, availability..."
          aria-label="Your question"
          className="min-w-0 flex-1 rounded-xl border border-line bg-bg px-3 py-2 text-base outline-none focus:border-accent sm:text-sm"
        />
        <button
          type="submit"
          disabled={busy || !input.trim()}
          className="rounded-xl bg-accent px-4 py-2 text-sm font-medium text-accent-fg disabled:opacity-40"
        >
          Send
        </button>
      </form>
    </div>
  );
}
