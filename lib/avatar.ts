import { existsSync } from "node:fs";
import path from "node:path";
import { site } from "./site";

const EXTENSIONS = ["jpg", "jpeg", "png", "webp"];

function findPublicImage(baseName: string): string | null {
  const found = EXTENSIONS.map((ext) => `${baseName}.${ext}`).find((f) =>
    existsSync(path.join(process.cwd(), "public", f)),
  );
  return found ? `/${found}` : null;
}

/** Server-only: the configured avatar, else public/avatar.*, else null. */
export function resolveAvatar(): string | null {
  return site.avatar || findPublicImage("avatar");
}

/** Server-only: the configured About photo, else public/about.*, else null. */
export function resolveAboutPhoto(): string | null {
  return site.about.photo || findPublicImage("about");
}
