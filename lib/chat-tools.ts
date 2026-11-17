import type Anthropic from "@anthropic-ai/sdk";
import { Resend } from "resend";
import { z } from "zod";
import { getRepoReadme, getRepos } from "./github";
import { site } from "./site";

type Tool = Anthropic.Beta.BetaTool;

// Tool order is fixed so the prompt-cache prefix (tools -> system) stays stable.
export function buildTools(): Tool[] {
  const tools: Tool[] = [
    {
      name: "get_github_repos",
      description:
        "List the owner's public GitHub repositories (non-forks) with description, language, stars, topics and last push date. Use for questions about projects or what they've worked on recently.",
      input_schema: { type: "object", properties: {}, additionalProperties: false },
      eager_input_streaming: true,
    },
    {
      name: "get_repo_readme",
      description:
        "Fetch the README of one of the owner's GitHub repositories, for detailed questions about a specific project. Use the exact repo name from get_github_repos or the system prompt.",
      input_schema: {
        type: "object",
        properties: { repo: { type: "string", description: "Repository name, e.g. 'my-project'" } },
        required: ["repo"],
        additionalProperties: false,
      },
      eager_input_streaming: true,
    },
    {
      name: "share_resume",
      description: "Get the link to the owner's resume PDF. Use when someone asks for the resume or CV.",
      input_schema: { type: "object", properties: {}, additionalProperties: false },
      eager_input_streaming: true,
    },
  ];

  if (site.schedulingUrl) {
    tools.push({
      name: "book_call",
      description:
        "Get the owner's scheduling link so a recruiter can book a call. Use when someone wants to talk, interview or meet.",
      input_schema: { type: "object", properties: {}, additionalProperties: false },
      eager_input_streaming: true,
    });
  }

  if (contactConfigured()) {
    tools.push({
      name: "leave_contact",
      description:
        "Forward a message from the visitor to the owner by email. Only call this after the visitor has explicitly given their name, email and message in this conversation and asked you to pass it on. Never invent or guess any of the fields.",
      input_schema: {
        type: "object",
        properties: {
          name: { type: "string", description: "Visitor's name" },
          email: { type: "string", description: "Visitor's email address" },
          company: { type: "string", description: "Visitor's company, if given" },
          message: { type: "string", description: "The message to forward" },
        },
        required: ["name", "email", "message"],
        additionalProperties: false,
      },
      eager_input_streaming: true,
    });
  }

  return tools;
}

function contactConfigured() {
  return Boolean(process.env.RESEND_API_KEY && process.env.CONTACT_TO_EMAIL);
}

const RepoInput = z.object({ repo: z.string().min(1).max(100).regex(/^[\w.-]+$/) });
const ContactInput = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.email().max(200),
  company: z.string().trim().max(100).optional(),
  message: z.string().trim().min(1).max(2000),
});
const Empty = z.object({}).strict();

export type ToolOutcome = { content: string; isError?: boolean };

/** Runs one tool call. Inputs are untrusted model output, so each is validated first. */
export async function runTool(name: string, input: unknown): Promise<ToolOutcome> {
  switch (name) {
    case "get_github_repos": {
      if (!Empty.safeParse(input ?? {}).success) return invalid(input);
      const repos = await getRepos();
      if (!repos.length) return { content: "No GitHub repositories available." };
      return { content: JSON.stringify(repos) };
    }
    case "get_repo_readme": {
      const parsed = RepoInput.safeParse(input);
      if (!parsed.success) return invalid(input);
      const readme = await getRepoReadme(parsed.data.repo);
      return readme
        ? { content: readme }
        : { content: `No README found for "${parsed.data.repo}".`, isError: true };
    }
    case "share_resume":
      return { content: JSON.stringify({ resumeUrl: absolute(site.resumeUrl) }) };
    case "book_call":
      return site.schedulingUrl
        ? { content: JSON.stringify({ schedulingUrl: site.schedulingUrl }) }
        : { content: "Scheduling is not set up.", isError: true };
    case "leave_contact": {
      const parsed = ContactInput.safeParse(input);
      if (!parsed.success) {
        return {
          content: `Invalid contact details: ${parsed.error.issues.map((i) => i.path.join(".") + " " + i.message).join("; ")}. Ask the visitor to correct them.`,
          isError: true,
        };
      }
      return sendContact(parsed.data);
    }
    default:
      return { content: `Unknown tool: ${name}`, isError: true };
  }
}

function invalid(input: unknown): ToolOutcome {
  return { content: JSON.stringify({ INVALID_JSON: JSON.stringify(input) }), isError: true };
}

function absolute(path: string) {
  if (/^https?:\/\//.test(path)) return path;
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "";
  return base ? new URL(path, base).toString() : path;
}

async function sendContact(c: z.infer<typeof ContactInput>): Promise<ToolOutcome> {
  if (!contactConfigured()) return { content: "Contact forwarding is not set up.", isError: true };
  const resend = new Resend(process.env.RESEND_API_KEY);
  const { error } = await resend.emails.send({
    from: process.env.CONTACT_FROM_EMAIL || "Portfolio <onboarding@resend.dev>",
    to: process.env.CONTACT_TO_EMAIL!,
    replyTo: c.email,
    subject: `Portfolio chat: message from ${c.name}${c.company ? ` (${c.company})` : ""}`,
    text: `Name: ${c.name}\nEmail: ${c.email}\nCompany: ${c.company ?? "-"}\n\n${c.message}`,
  });
  if (error) {
    console.error("Resend error", error);
    return {
      content: `Sending failed. Suggest emailing ${site.email} directly instead.`,
      isError: true,
    };
  }
  return { content: "Message sent to the owner." };
}
