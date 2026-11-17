import { getFeaturedRepos } from "@/lib/github";
import { site } from "@/lib/site";
import { TechLogo } from "@/lib/tech-icons";

const card =
  "flex flex-col rounded-2xl bg-card p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] ring-1 ring-line transition hover:-translate-y-1";

export default async function Projects() {
  // Skip repos already shown as featured cards.
  const repos = await getFeaturedRepos(6, site.projects.map((p) => p.url ?? "").filter(Boolean));

  return (
    <div className="space-y-14">
      {site.projects.length > 0 && (
        <div className="grid gap-5 md:grid-cols-3">
          {site.projects.map((p) => (
            <article key={p.name} className={card}>
              {p.highlight && (
                <p className="mb-3 self-start rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
                  {p.highlight}
                </p>
              )}
              <h3 className="text-lg font-medium">
                {p.url ? (
                  <a href={p.url} target="_blank" rel="noopener noreferrer" className="hover:text-accent">
                    {p.name}
                  </a>
                ) : (
                  p.name
                )}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{p.description}</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {p.tech.map((t) => (
                  <li key={t} className="inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-xs text-muted ring-1 ring-line">
                    <TechLogo name={t} size={13} />
                    {t}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      )}

      {repos.length > 0 && (
        <div>
          <h3 className="mb-5 text-center text-xs uppercase tracking-[0.3em] text-muted">From GitHub</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {repos.map((r) => (
              <article key={r.name} className={card}>
                <h4 className="font-medium">
                  <a href={r.url} target="_blank" rel="noopener noreferrer" className="hover:text-accent">
                    {r.name}
                  </a>
                </h4>
                <p className="mt-2 flex-1 text-sm text-muted">{r.description ?? "No description."}</p>
                <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
                  {r.language && <span>{r.language}</span>}
                  {r.stars > 0 && <span>★ {r.stars}</span>}
                  {r.homepage && (
                    <a href={r.homepage} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                      Live demo
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      )}

      {site.githubUsername && (
        <p className="text-center text-sm">
          <a
            href={`https://github.com/${site.githubUsername}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted underline-offset-4 hover:text-accent hover:underline"
          >
            See everything on GitHub →
          </a>
        </p>
      )}
    </div>
  );
}
