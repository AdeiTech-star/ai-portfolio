import type { IconType } from "react-icons";
import { FaAws, FaJava } from "react-icons/fa6";
import {
  SiC,
  SiCplusplus,
  SiDocker,
  SiFastapi,
  SiFirebase,
  SiGit,
  SiGithub,
  SiHuggingface,
  SiJavascript,
  SiKaggle,
  SiKeras,
  SiLangchain,
  SiLanggraph,
  SiMeta,
  SiMlflow,
  SiMoodle,
  SiNextdotjs,
  SiNodedotjs,
  SiNumpy,
  SiNvidia,
  SiOpencv,
  SiOptuna,
  SiPandas,
  SiPostgresql,
  SiPython,
  SiPytorch,
  SiReact,
  SiScikitlearn,
  SiShadcnui,
  SiSpringboot,
  SiTensorflow,
  SiTypescript,
  SiUdacity,
  SiUdemy,
} from "react-icons/si";
import { TbSql } from "react-icons/tb";

// Brand logo + brand colour per tool. Keys are lowercase. A null colour means
// "use the text colour" (for black logos that would vanish in dark mode).
// To add a tool: find its icon at https://react-icons.github.io/react-icons (Simple Icons set).
const ICONS: Record<string, { Icon: IconType; color: string | null }> = {
  python: { Icon: SiPython, color: "#3776AB" },
  java: { Icon: FaJava, color: "#E76F00" },
  c: { Icon: SiC, color: "#A8B9CC" },
  "c++": { Icon: SiCplusplus, color: "#00599C" },
  sql: { Icon: TbSql, color: "#336791" },
  typescript: { Icon: SiTypescript, color: "#3178C6" },
  javascript: { Icon: SiJavascript, color: "#F7DF1E" },
  pytorch: { Icon: SiPytorch, color: "#EE4C2C" },
  tensorflow: { Icon: SiTensorflow, color: "#FF6F00" },
  keras: { Icon: SiKeras, color: "#D00000" },
  "scikit-learn": { Icon: SiScikitlearn, color: "#F7931E" },
  "hugging face": { Icon: SiHuggingface, color: "#FFD21E" },
  trl: { Icon: SiHuggingface, color: "#FFD21E" }, // Hugging Face library
  peft: { Icon: SiHuggingface, color: "#FFD21E" }, // Hugging Face library
  langchain: { Icon: SiLangchain, color: "#1C3C3C" },
  langgraph: { Icon: SiLanggraph, color: "#1C3C3C" },
  opencv: { Icon: SiOpencv, color: "#5C3EE8" },
  docker: { Icon: SiDocker, color: "#2496ED" },
  fastapi: { Icon: SiFastapi, color: "#009688" },
  mlflow: { Icon: SiMlflow, color: "#0194E2" },
  optuna: { Icon: SiOptuna, color: "#2C5B9E" },
  git: { Icon: SiGit, color: "#F05032" },
  github: { Icon: SiGithub, color: null },
  "next.js": { Icon: SiNextdotjs, color: null },
  "spring boot": { Icon: SiSpringboot, color: "#6DB33F" },
  "nvidia dgx": { Icon: SiNvidia, color: "#76B900" },
  nvidia: { Icon: SiNvidia, color: "#76B900" },
  react: { Icon: SiReact, color: "#61DAFB" },
  "react native": { Icon: SiReact, color: "#61DAFB" },
  "node.js": { Icon: SiNodedotjs, color: "#5FA04E" },
  firebase: { Icon: SiFirebase, color: "#DD2C00" },
  postgresql: { Icon: SiPostgresql, color: "#4169E1" },
  pandas: { Icon: SiPandas, color: "#150458" },
  numpy: { Icon: SiNumpy, color: "#4DABCF" },
  "shadcn/ui": { Icon: SiShadcnui, color: null },
  aws: { Icon: FaAws, color: "#FF9900" },
  kaggle: { Icon: SiKaggle, color: "#20BEFF" },
  moodle: { Icon: SiMoodle, color: "#F98012" },
  "llama 3.1 8b": { Icon: SiMeta, color: "#0467DF" },
  udemy: { Icon: SiUdemy, color: "#A435F0" },
  udacity: { Icon: SiUdacity, color: "#02B3E4" },
};

export function techIcon(name: string) {
  return ICONS[name.trim().toLowerCase()] ?? null;
}

/** Brand logo for a tool, or a lettered badge when there's no official logo. */
export function TechLogo({ name, size = 32 }: { name: string; size?: number }) {
  const match = techIcon(name);
  if (match) {
    const { Icon, color } = match;
    return <Icon aria-hidden size={size} className="shrink-0" style={color ? { color } : undefined} />;
  }
  const letters = name.replace(/[^A-Za-z0-9]/g, "").slice(0, 2).toUpperCase();
  return (
    <span
      aria-hidden
      className="grid shrink-0 place-items-center rounded-md bg-accent/15 font-semibold text-accent"
      style={{ width: size, height: size, fontSize: Math.round(size * 0.4) }}
    >
      {letters}
    </span>
  );
}
