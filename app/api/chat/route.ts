import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { buildTools, runTool } from "@/lib/chat-tools";
import { checkRateLimit, clientIp } from "@/lib/rate-limit";
import { buildSystemPrompt } from "@/lib/system-prompt";
import { site } from "@/lib/site";

export const runtime = "nodejs";
export const maxDuration = 60;

// CHAT_MODEL overrides the model, e.g. when a gateway (LiteLLM) names models differently.
const MODEL = process.env.CHAT_MODEL || "claude-opus-5-5";
// Set when requests go through a gateway such as LiteLLM instead of api.anthropic.com
// (the SDK reads ANTHROPIC_BASE_URL itself). Gateways may not forward beta features.
const VIA_GATEWAY = Boolean(process.env.ANTHROPIC_BASE_URL);
const MAX_USER_CHARS = 1000; // per visitor message
const MAX_HISTORY = 8; // messages kept from the conversation (older ones cost tokens on every turn)
const MAX_TOOL_ROUNDS = 3; // model calls per visitor message
const MAX_OUTPUT_TOKENS = 1500; // answers are meant to be short; caps the worst case

const Body = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().max(8000),
      }),
    )
    .min(1)
    .max(50),
});

export async function POST(req: Request) {
  if (!(await checkRateLimit(clientIp(req)))) {
    return text("You're sending messages too quickly. Please wait a few minutes and try again.", 429);
  }

  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return text("Invalid request.", 400);

  let history = parsed.data.messages.slice(-MAX_HISTORY);
  while (history.length && history[0].role !== "user") history = history.slice(1);
  const last = history.at(-1);
  if (!last || last.role !== "user" || !last.content.trim()) return text("Invalid request.", 400);
  if (last.content.length > MAX_USER_CHARS) {
    return text(`Please keep messages under ${MAX_USER_CHARS} characters.`, 400);
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return text("The chat isn't configured yet (missing ANTHROPIC_API_KEY).", 500);
  }

  const client = new Anthropic();
  const [system, tools] = [await buildSystemPrompt(), buildTools()];
  const messages: Anthropic.Beta.BetaMessageParam[] = history.map((m) => ({
    role: m.role,
    content: m.content,
  }));

  const encoder = new TextEncoder();
  const body = new ReadableStream<Uint8Array>({
    async start(controller) {
      const write = (s: string) => controller.enqueue(encoder.encode(s));
      try {
        for (let round = 0; round < MAX_TOOL_ROUNDS; round++) {
          const stream = client.beta.messages.stream(
            {
              model: MODEL,
              max_tokens: MAX_OUTPUT_TOKENS,
              // Re-run on a fallback model if the request is declined (direct Claude API only).
              ...(VIA_GATEWAY
                ? {}
                : { betas: ["server-side-fallback-2026-07-01"], fallbacks: "default" as const }),
              output_config: { effort: "low" }, // chat: short answers, low latency and cost
              system: [{ type: "text", text: system, cache_control: { type: "ephemeral" } }],
              tools,
              messages,
            },
            { signal: req.signal },
          );
          let wroteText = false;
          stream.on("text", (delta) => {
            wroteText = true;
            write(delta);
          });

          const message = await stream.finalMessage();
          const u = message.usage;
          console.log(
            `[chat] round ${round + 1} ${MODEL}: input ${u.input_tokens}, cache read ${u.cache_read_input_tokens ?? 0}, ` +
              `cache write ${u.cache_creation_input_tokens ?? 0}, output ${u.output_tokens}`,
          );

          if (message.stop_reason === "refusal") {
            write(`\n\nSorry, I can't help with that. Feel free to ask about ${site.name}'s work instead.`);
            break;
          }
          if (message.stop_reason === "pause_turn") {
            messages.push({ role: "assistant", content: message.content });
            continue;
          }

          const toolUses = message.content.filter(
            (b): b is Anthropic.Beta.BetaToolUseBlock => b.type === "tool_use",
          );
          if (toolUses.length === 0) break; // end_turn, max_tokens on text, etc.
          if (message.stop_reason === "max_tokens") break; // never run a truncated tool call

          messages.push({ role: "assistant", content: message.content });
          if (wroteText) write("\n\n"); // keep text before and after the tool call apart
          const results = await Promise.all(
            toolUses.map(async (t): Promise<Anthropic.Beta.BetaToolResultBlockParam> => {
              const out = await runTool(t.name, t.input).catch((err) => {
                console.error(`Tool ${t.name} failed`, err);
                return { content: "Tool failed.", isError: true };
              });
              return { type: "tool_result", tool_use_id: t.id, content: out.content, is_error: out.isError };
            }),
          );
          messages.push({ role: "user", content: results });
          if (round === MAX_TOOL_ROUNDS - 1) {
            write(`\n\nI couldn't finish looking that up. You can reach ${site.name} at ${site.email}.`);
          }
        }
      } catch (err) {
        if (req.signal.aborted) return controller.close();
        console.error("Chat error", err);
        const msg =
          err instanceof Anthropic.RateLimitError || err instanceof Anthropic.InternalServerError
            ? "The assistant is busy right now. Please try again in a moment."
            : "Something went wrong. Please try again.";
        write(`\n\n${msg}`);
      }
      controller.close();
    },
  });

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

function text(message: string, status: number) {
  return new Response(message, { status, headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
