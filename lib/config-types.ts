export type Experience = {
  role: string;
  company: string;
  period: string; // "Jan 2026 - Present · Kigali, Rwanda"; text after " · " is shown as the location
  summary?: string; // one line shown on the timeline card (defaults to the first bullet)
  tech: string[];
  bullets: string[];
};

export type Project = {
  name: string;
  description: string;
  tech: string[];
  highlight?: string; // short badge, e.g. "NeurIPS 2025 WiML poster"
  url?: string; // repo, demo or paper link
};

export type PortfolioConfig = {
  name: string;
  title: string;
  pitch: string;
  location: string;
  greetings: string[];
  avatar: string;
  avatarGrayscale: boolean;
  email: string;
  githubUsername: string;
  linkedinUrl: string;
  xUrl: string;
  instagramUrl: string;
  resumeUrl: string;
  schedulingUrl: string;
  about: { heading: string; body: string; photo?: string };
  experience: Experience[];
  projects: Project[];
  certifications: { name: string; issuer: string; year?: string; credentialId?: string; url?: string }[];
  skills: Record<string, string[]>;
  suggestedQuestions: string[];
};
