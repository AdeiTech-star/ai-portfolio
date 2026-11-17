import { site } from "./site";

export type Repo = {
  name: string;
  description: string | null;
  url: string;
  homepage: string | null;
  language: string | null;
  stars: number;
  topics: string[];
  updatedAt: string;
};

const REVALIDATE_SECONDS = 3600; // refresh GitHub data at most hourly

function headers(): HeadersInit {
  const h: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "portfolio-site",
  };
  if (process.env.GITHUB_TOKEN) h.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  return h;
}

type RestRepo = {
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  topics?: string[];
  fork: boolean;
  archived: boolean;
  pushed_at: string;
};

async function fetchAllPublicRepos(username: string): Promise<Repo[]> {
  const res = await fetch(
    `https://api.github.com/users/${encodeURIComponent(username)}/repos?per_page=100&sort=pushed`,
    { headers: headers(), next: { revalidate: REVALIDATE_SECONDS } },
  );
  if (!res.ok) throw new Error(`GitHub repos request failed: ${res.status}`);
  const data = (await res.json()) as RestRepo[];
  return data
    .filter((r) => !r.fork && !r.archived)
    .map((r) => ({
      name: r.name,
      description: r.description,
      url: r.html_url,
      homepage: r.homepage || null,
      language: r.language,
      stars: r.stargazers_count,
      topics: r.topics ?? [],
      updatedAt: r.pushed_at,
    }));
}

/** Pinned repos via GraphQL. Requires GITHUB_TOKEN; returns null when unavailable. */
async function fetchPinnedNames(username: string): Promise<string[] | null> {
  if (!process.env.GITHUB_TOKEN) return null;
  const query = `query($login: String!) {
    user(login: $login) { pinnedItems(first: 6, types: REPOSITORY) { nodes { ... on Repository { name } } } }
  }`;
  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: { ...headers(), "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables: { login: username } }),
    next: { revalidate: REVALIDATE_SECONDS },
  });
  if (!res.ok) return null;
  const json = await res.json();
  const nodes: { name?: string }[] = json?.data?.user?.pinnedItems?.nodes ?? [];
  const names = nodes.map((n) => n.name).filter((n): n is string => Boolean(n));
  return names.length ? names : null;
}

/**
 * All public, non-fork repos (for the chat agent).
 * Returns [] when no username is configured or GitHub is unreachable.
 */
export async function getRepos(): Promise<Repo[]> {
  if (!site.githubUsername) return [];
  try {
    return await fetchAllPublicRepos(site.githubUsername);
  } catch (err) {
    console.error(err);
    return [];
  }
}

/**
 * Repos to feature on the page, in priority order:
 * pinned repos (needs GITHUB_TOKEN) -> repos tagged with the `portfolio` topic -> most-starred / recent.
 */
export async function getFeaturedRepos(limit = 6, excludeUrls: string[] = []): Promise<Repo[]> {
  const exclude = new Set(excludeUrls.map((u) => u.toLowerCase().replace(/\/+$/, "")));
  const repos = (await getRepos()).filter((r) => !exclude.has(r.url.toLowerCase()));
  if (!repos.length) return [];

  // Pinned first, then `portfolio`-tagged, then most starred / recently pushed; no duplicates.
  const pinned = (await fetchPinnedNames(site.githubUsername).catch(() => null)) ?? [];
  const byName = new Map(repos.map((r) => [r.name, r]));
  const ordered = [
    ...pinned.map((n) => byName.get(n)).filter((r): r is Repo => Boolean(r)),
    ...repos.filter((r) => r.topics.includes("portfolio")),
    ...[...repos].sort((a, b) => b.stars - a.stars || b.updatedAt.localeCompare(a.updatedAt)),
  ];
  return [...new Map(ordered.map((r) => [r.name, r])).values()].slice(0, limit);
}

const README_MAX_CHARS = 5000;

/** Raw README text for one of the owner's repos (truncated to keep the prompt small). */
export async function getRepoReadme(repo: string): Promise<string | null> {
  if (!site.githubUsername) return null;
  const res = await fetch(
    `https://api.github.com/repos/${encodeURIComponent(site.githubUsername)}/${encodeURIComponent(repo)}/readme`,
    {
      headers: { ...headers(), Accept: "application/vnd.github.raw" },
      next: { revalidate: REVALIDATE_SECONDS },
    },
  );
  if (!res.ok) return null;
  const text = await res.text();
  return text.length > README_MAX_CHARS
    ? `${text.slice(0, README_MAX_CHARS)}\n\n[README truncated]`
    : text;
}
