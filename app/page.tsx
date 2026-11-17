import { FaGithub, FaInstagram, FaLinkedinIn, FaXTwitter } from "react-icons/fa6";
import { FiArrowUp, FiFileText, FiMail } from "react-icons/fi";
import Chat from "@/components/Chat";
import ExperienceTimeline from "@/components/ExperienceTimeline";
import Projects from "@/components/Projects";
import Reveal from "@/components/Reveal";
import Typewriter from "@/components/Typewriter";
import { resolveAboutPhoto, resolveAvatar } from "@/lib/avatar";
import { site } from "@/lib/site";
import { TechLogo } from "@/lib/tech-icons";

export const revalidate = 3600; // re-fetch GitHub projects at most hourly

const socials = [
  { label: "LinkedIn", href: site.linkedinUrl, Icon: FaLinkedinIn },
  site.githubUsername && { label: "GitHub", href: `https://github.com/${site.githubUsername}`, Icon: FaGithub },
  site.xUrl && { label: "X", href: site.xUrl, Icon: FaXTwitter },
  site.instagramUrl && { label: "Instagram", href: site.instagramUrl, Icon: FaInstagram },
].filter(Boolean) as { label: string; href: string; Icon: typeof FaGithub }[];

const nav = [
  { label: "Ask AI", href: "#ask" },
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
];

const nameParts = site.name.trim().split(/\s+/);
const initials = (nameParts[0][0] + (nameParts.length > 1 ? nameParts[nameParts.length - 1][0] : "")).toUpperCase();

function Section({
  id,
  title,
  children,
  wide = false,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <section id={id} className="scroll-mt-8 px-4 py-20 sm:px-6 sm:py-24">
      <Reveal className={`mx-auto ${wide ? "max-w-6xl" : "max-w-4xl"}`}>
        <h2 className="mb-12 text-center text-sm font-light uppercase tracking-[0.6em] text-muted sm:text-base">
          {title}
        </h2>
        {children}
      </Reveal>
    </section>
  );
}

export default function Home() {
  const avatar = resolveAvatar();
  const aboutPhoto = resolveAboutPhoto();
  return (
    <>
      {/* Top bar: socials left, contact right */}
      <header className="absolute inset-x-0 top-0 z-10 flex items-center justify-between px-4 py-5 sm:px-8">
        <div className="flex items-center gap-1">
          {socials.map(({ label, href, Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="rounded-full p-2 text-muted transition hover:text-accent"
            >
              <Icon className="h-5 w-5" />
            </a>
          ))}
        </div>
        <a href="#contact" className="flex items-center gap-2 text-sm uppercase tracking-wider text-muted hover:text-accent">
          <FiMail className="h-5 w-5" />
          <span className="hidden sm:inline">Get in touch</span>
        </a>
      </header>

      <main id="top">
        {/* Hero */}
        <section className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-4 text-center">
          <div aria-hidden className="rings" />
          <div className="relative">
            <div className="mx-auto mb-6 grid h-32 w-32 place-items-center overflow-hidden rounded-full bg-card ring-1 ring-line">
              {avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={avatar}
                  alt={site.name}
                  className={`h-full w-full object-cover ${site.avatarGrayscale ? "grayscale" : ""}`}
                />
              ) : (
                <span className="text-3xl font-light tracking-widest text-muted">{initials}</span>
              )}
            </div>
            <p className="text-xs uppercase tracking-[0.6em] text-muted sm:text-sm">{site.title}</p>
            <h1 className="mt-4 min-h-[2.5em] text-4xl font-normal tracking-tight sm:min-h-[1.3em] sm:text-6xl">
              <Typewriter phrases={site.greetings} />
            </h1>
            <p className="mx-auto mt-2 max-w-xl text-muted">{site.pitch}</p>
            <nav className="mt-8 flex flex-wrap justify-center gap-x-8 gap-y-3">
              {nav.map((n) => (
                <a
                  key={n.href}
                  href={n.href}
                  className="text-xs uppercase tracking-[0.2em] text-muted transition hover:text-accent sm:text-sm"
                >
                  {n.label}
                </a>
              ))}
            </nav>
          </div>
        </section>

        <Section id="ask" title="Ask my AI">
          <p className="mx-auto -mt-6 mb-8 max-w-xl text-center text-muted">
            Recruiter? Skip the scrolling. Ask anything about my experience, projects or availability.
          </p>
          <div className="mx-auto max-w-2xl">
            <Chat name={site.name} suggestions={site.suggestedQuestions} />
          </div>
        </Section>

        <Section id="about" title="About">
          <div
            className={`overflow-hidden rounded-2xl bg-card shadow-[0_8px_30px_rgba(0,0,0,0.04)] ring-1 ring-line ${
              aboutPhoto ? "grid md:grid-cols-[2fr_3fr]" : ""
            }`}
          >
            {aboutPhoto && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={aboutPhoto}
                alt={`${site.name}`}
                className="h-80 w-full object-cover object-[center_40%] md:h-full md:max-h-[28rem]"
              />
            )}
            <div className={`p-8 sm:p-10 ${aboutPhoto ? "self-center md:text-left" : "text-center"}`}>
              <h3 className="text-xl font-medium">{site.about.heading}</h3>
              <p className={`mt-4 max-w-2xl leading-relaxed text-muted ${aboutPhoto ? "" : "mx-auto"}`}>
                {site.about.body}
              </p>
              <p className="mt-4 text-sm text-muted">{site.location}</p>
            </div>
          </div>
        </Section>

        <Section id="experience" title="Experience" wide>
          <p className="mx-auto -mt-6 mb-12 max-w-xl text-center text-sm text-muted">
            <span className="md:hidden">Tap a role for the full story.</span>
            <span className="hidden md:inline">Hover over a role for a closer look, or click it for the full story.</span>
          </p>
          <div className="mx-auto max-w-5xl">
            <ExperienceTimeline items={site.experience} />
          </div>
        </Section>

        <Section id="skills" title="Skills">
          <div className="space-y-10">
            {Object.entries(site.skills).map(([group, items]) => (
              <div key={group} className="text-center">
                <h3 className="mb-5 text-xs uppercase tracking-[0.3em] text-muted">{group}</h3>
                <ul className="flex flex-wrap justify-center gap-4">
                  {items.map((s) => (
                    <li
                      key={s}
                      className="flex h-28 w-28 flex-col items-center justify-center gap-2 rounded-full bg-card p-2 text-center text-xs ring-1 ring-line transition hover:-translate-y-1 hover:shadow-md hover:ring-accent"
                    >
                      <TechLogo name={s} size={34} />
                      <span className="leading-tight">{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {site.certifications.length > 0 && (
              <div>
                <h3 className="mb-5 text-center text-xs uppercase tracking-[0.3em] text-muted">Certifications</h3>
                <ul className="mx-auto grid max-w-3xl gap-3 sm:grid-cols-2">
                  {site.certifications.map((c) => {
                    const inner = (
                      <>
                        <TechLogo name={c.issuer} size={26} />
                        <span className="min-w-0">
                          <span className="block text-sm font-medium leading-snug">{c.name}</span>
                          <span className="block text-xs text-muted">
                            {c.issuer}
                            {c.year ? ` · ${c.year}` : ""}
                            {c.url ? " · View credential →" : ""}
                          </span>
                          {c.credentialId && (
                            <span className="block break-all text-[11px] text-muted/80">ID {c.credentialId}</span>
                          )}
                        </span>
                      </>
                    );
                    const cls = "flex items-center gap-3 rounded-xl bg-card p-4 ring-1 ring-line";
                    return (
                      <li key={c.name}>
                        {c.url ? (
                          <a href={c.url} target="_blank" rel="noopener noreferrer" className={`${cls} transition hover:ring-accent`}>
                            {inner}
                          </a>
                        ) : (
                          <div className={cls}>{inner}</div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>
        </Section>

        <Section id="projects" title="Projects" wide>
          <Projects />
        </Section>

        <Section id="contact" title="Contact">
          <div className="text-center">
            <p className="text-3xl font-light sm:text-4xl">Let&apos;s build something together.</p>
            <p className="mx-auto mt-4 max-w-xl text-muted">
              Email is the fastest way to reach me. You can also leave a message through the chat
              above{site.schedulingUrl ? " or book a call" : ""}.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <a
                href={`mailto:${site.email}`}
                className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-fg transition hover:opacity-90"
              >
                <FiMail /> {site.email}
              </a>
              <a
                href={site.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm ring-1 ring-line transition hover:text-accent hover:ring-accent"
              >
                <FiFileText /> Resume
              </a>
              {site.schedulingUrl && (
                <a
                  href={site.schedulingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm ring-1 ring-line transition hover:text-accent hover:ring-accent"
                >
                  Book a call
                </a>
              )}
            </div>
          </div>
        </Section>
      </main>

      <footer className="px-4 pb-24 pt-6 text-center text-xs text-muted">
        © {new Date().getFullYear()} {site.name}. The chat assistant is powered by Claude and can make mistakes.
      </footer>

      <a
        href="#top"
        aria-label="Back to top"
        className="fixed bottom-5 right-5 z-20 grid h-11 w-11 place-items-center rounded-full bg-accent text-accent-fg shadow-lg transition hover:-translate-y-0.5"
      >
        <FiArrowUp className="h-5 w-5" />
      </a>
    </>
  );
}
