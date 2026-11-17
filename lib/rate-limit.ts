import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Per-IP limit for /api/chat. Uses Upstash Redis when UPSTASH_REDIS_REST_URL and
// UPSTASH_REDIS_REST_TOKEN are set (works across Vercel instances); otherwise falls
// back to an in-memory limiter, which is per-instance and resets on cold starts.

const LIMIT = 20; // requests
const WINDOW_MS = 10 * 60 * 1000; // per 10 minutes

const upstash =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Ratelimit({
        redis: Redis.fromEnv(),
        limiter: Ratelimit.slidingWindow(LIMIT, "10 m"),
        prefix: "portfolio-chat",
      })
    : null;

const hits = new Map<string, number[]>();

function memoryLimit(key: string): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= LIMIT) {
    hits.set(key, recent);
    return false;
  }
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 10_000) hits.clear(); // crude memory guard
  return true;
}

/** Returns true when the request is allowed. */
export async function checkRateLimit(key: string): Promise<boolean> {
  if (upstash) {
    const { success } = await upstash.limit(key);
    return success;
  }
  return memoryLimit(key);
}

export function clientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  return fwd?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
}
