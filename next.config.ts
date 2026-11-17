import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The chat route reads content/profile.md at runtime; make sure Vercel bundles it.
  outputFileTracingIncludes: {
    "/api/chat": ["./content/**/*"],
  },
};

export default nextConfig;
