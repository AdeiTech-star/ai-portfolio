# AI Portfolio

A personal portfolio where recruiters can chat with an AI assistant that answers questions about me, backed by my resume (`content/profile.md`) and live GitHub data.

Built with Next.js (App Router), TypeScript, Tailwind CSS and the Claude API (`@anthropic-ai/sdk`), deployed on Vercel.

## How it works

| Piece | File |
|---|---|
| Owner info, links, experience, skills, suggested questions | `portfolio.config.ts` |
| The agent's knowledge base (resume, bio, projects, role preferences) | `content/profile.md` |
| Chat API: validation, rate limit, streaming Claude call, tool loop | `app/api/chat/route.ts` |
| System prompt (profile + GitHub repo list + behaviour rules) | `lib/system-prompt.ts` |
| Agent tools: `get_github_repos`, `get_repo_readme`, `share_resume`, `book_call`, `leave_contact` | `lib/chat-tools.ts` |
| GitHub fetching (non-forks; pinned -> `portfolio` topic -> most starred) | `lib/github.ts` |
| Per-IP rate limit (Upstash if configured, otherwise in-memory) | `lib/rate-limit.ts` |
| Chat UI (streaming, suggestion chips, mobile-friendly) | `components/Chat.tsx` |

The Claude API key is only used server-side in `/api/chat`; the browser never sees it. The model is `claude-opus-5-5` at `low` effort (short, fast chat answers), with prompt caching on the system prompt and server-side refusal fallbacks enabled.

`book_call` is only offered when `schedulingUrl` is set in `lib/site.ts`, and `leave_contact` only when `RESEND_API_KEY` and `CONTACT_TO_EMAIL` are set.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy the env template and add your key:
   ```bash
   cp .env.example .env.local
   ```
   Set at least `ANTHROPIC_API_KEY` (from https://platform.claude.com). The other variables are optional; see the comments in `.env.example`.
3. Fill in your info:
   - **`portfolio.config.ts`** (project root): name, title, pitch, hero greetings, socials, about text, GitHub username, email, scheduling link, experience, skills, chat suggestions
   - **`public/avatar.jpg`** (or `.jpeg` / `.png` / `.webp`): your photo, detected automatically. Without it the hero shows your initials. Shown in black and white unless you set `avatarGrayscale: false`.
   - `content/profile.md`: everything the assistant should know. It answers **only** from this file and GitHub, so be thorough.
   - `public/resume.pdf`: your resume
   - On GitHub, either pin up to 6 repos (needs `GITHUB_TOKEN`) or add the topic `portfolio` to the repos you want featured.
   - Colours: edit the tokens at the top of `app/globals.css`.
4. Run it:
   ```bash
   npm run dev
   ```
   Open http://localhost:3000.

## Deploy to Vercel

1. Push this repo to GitHub.
2. In Vercel, **Add New -> Project**, import the repo (framework preset: Next.js, no build settings to change).
3. Under **Settings -> Environment Variables**, add `ANTHROPIC_API_KEY` and any optional variables you use (`GITHUB_TOKEN`, `NEXT_PUBLIC_SITE_URL`, `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL`, `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`).
4. Deploy. Every push to `main` redeploys automatically.

## Safety and cost

- **Rate limiting:** 20 chat requests per IP per 10 minutes (`lib/rate-limit.ts`). The in-memory fallback is per serverless instance, so for real traffic add a free Upstash Redis database (Vercel Marketplace -> Upstash) and set the two `UPSTASH_*` variables.
- **Input caps:** visitor messages up to 1,000 characters; only the last 12 messages are sent to Claude; at most 4 model calls per message.
- **Spend limit:** set a monthly limit in the Claude Console (**Settings -> Limits**). Do this before sharing the link.
- **Secrets:** `.env*` is git-ignored (except `.env.example`). Never commit keys.
- The assistant is told to answer only from your profile and GitHub, to decline off-topic requests, and to ignore attempts to change its rules. Treat that as best-effort, and don't put anything in `profile.md` you wouldn't want public.
