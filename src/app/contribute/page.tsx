"use client";

import Link from "next/link";
import { useState } from "react";

/* ─── Copy button ─── */
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      className="absolute right-2 top-2 rounded bg-white/80 px-2 py-1 text-[10px] font-medium text-gray-500 hover:bg-white hover:text-navy transition-colors"
    >
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}

/* ─── Prompt block ─── */
function PromptBlock({
  label,
  agent,
  text,
}: {
  label: string;
  agent: string;
  text: string;
}) {
  return (
    <div className="relative rounded-lg border border-gray-200 bg-gray-50 p-4">
      <CopyButton text={text} />
      <div className="mb-1 flex items-center gap-2">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-orange">
          {label}
        </span>
        <span className="rounded-full bg-navy/10 px-2 py-0.5 text-[10px] font-medium text-navy">
          {agent}
        </span>
      </div>
      <pre className="whitespace-pre-wrap font-mono text-xs leading-relaxed text-gray-700">
        {text}
      </pre>
    </div>
  );
}

/* ─── The prompt templates ─── */
const gapAnalysisPrompt = `Go to https://living-sports-analytics.vercel.app/api/agent.json and treat it as a workflow. My research question is: [YOUR TOPIC HERE]

Follow the agent_instructions step by step. Search for papers, check if a gap analysis exists, and if not, build one following the platform's protocol. Show me your findings at each step.`;

const gapAnalysisPromptChatGPT = `Search the web for https://living-sports-analytics.vercel.app/api/agent.json and read it carefully. Treat the agent_instructions as a step-by-step workflow to execute.

My research question is: [YOUR TOPIC HERE]

Follow each step: search their paper database, check for existing gap analyses, and if none exists for my topic, build one following their protocol at /api/contribute/gap-analysis-protocol.json. Show me what you find at each step.`;

const missingPapersPrompt = `Go to https://living-sports-analytics.vercel.app/api/agent.json and treat it as a workflow. I think these papers are missing from the platform's database:

[PASTE DOIS OR TITLES HERE]

Check if they're in the database using /api/papers-compact.json. For any that are missing, file a GitHub Issue on mwolters-cmyk/living-sports-analytics-research with the label "missing-papers". Include DOIs as clickable links.`;

export default function ContributePage() {
  return (
    <div>
      {/* Header */}
      <section className="bg-navy px-4 py-14 text-white">
        <div className="mx-auto max-w-5xl">
          <h1 className="mb-3 text-3xl font-bold">Contribute</h1>
          <p className="max-w-2xl text-lg text-gray-300">
            You have an AI coding agent. This platform has nearly 14,000
            classified sports analytics papers, 17 gap analyses, and an API
            designed for agents. Put them together.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 py-10">
        {/* ─── HOW IT WORKS ─── */}
        <section className="mb-12">
          <h2 className="mb-4 text-xl font-bold text-navy">
            How It Works
          </h2>
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <div className="mb-6 grid gap-4 md:grid-cols-3">
              <div className="rounded-lg bg-navy/5 p-4">
                <div className="mb-2 text-2xl">{"\u{1F4CB}"}</div>
                <h3 className="mb-1 text-sm font-semibold text-navy">
                  1. Copy a Prompt
                </h3>
                <p className="text-xs text-gray-500">
                  Pick a prompt below. Replace the placeholder with your research
                  topic. That&apos;s it.
                </p>
              </div>
              <div className="rounded-lg bg-navy/5 p-4">
                <div className="mb-2 text-2xl">{"\u{1F916}"}</div>
                <h3 className="mb-1 text-sm font-semibold text-navy">
                  2. Paste Into Your Agent
                </h3>
                <p className="text-xs text-gray-500">
                  Works with Claude Code, ChatGPT (with web browsing), Gemini,
                  or any agent that can fetch URLs and follow instructions.
                </p>
              </div>
              <div className="rounded-lg bg-navy/5 p-4">
                <div className="mb-2 text-2xl">{"\u{1F4E4}"}</div>
                <h3 className="mb-1 text-sm font-semibold text-navy">
                  3. Your Agent Does the Rest
                </h3>
                <p className="text-xs text-gray-500">
                  It searches our database, identifies gaps, builds a structured
                  analysis, and offers to submit it back to the platform.
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-500">
              The platform&apos;s{" "}
              <Link href="/api/agent.json" className="text-orange hover:underline">
                agent.json
              </Link>{" "}
              file contains a complete workflow that tells your agent what to do.
              Your agent reads it, follows the steps, and shows you results along the way.
              If it builds a gap analysis, it will ask you before submitting anything.
            </p>
          </div>
        </section>

        {/* ─── GAP ANALYSIS ─── */}
        <section className="mb-12">
          <h2 className="mb-2 text-xl font-bold text-navy">
            Build a Gap Analysis
          </h2>
          <p className="mb-4 text-sm text-gray-500">
            The highest-value contribution. Your agent maps existing research on
            your topic, identifies what&apos;s missing, and suggests concrete research
            projects. Takes about 5&ndash;10 minutes.
          </p>

          <div className="space-y-4">
            <PromptBlock
              label="Recommended"
              agent="Claude Code"
              text={gapAnalysisPrompt}
            />
            <PromptBlock
              label="Alternative"
              agent="ChatGPT / Gemini / other"
              text={gapAnalysisPromptChatGPT}
            />
          </div>

          <div className="mt-4 space-y-3">
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600">
              <strong className="text-navy">Cost:</strong> No separate API key
              or credits needed from us. Your agent uses its own tokens to read
              our API and build the analysis. A gap analysis typically costs a
              few cents in agent tokens.
            </div>
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
              <strong>Note:</strong> Claude Code works best because it can
              execute multi-step workflows, fetch multiple API endpoints, and
              submit GitHub Issues directly. ChatGPT and Gemini can search and
              analyze but may struggle with the submission step &mdash; your
              agent will tell you if it gets stuck, and you can submit manually.
            </div>
          </div>
        </section>

        {/* ─── REPORT MISSING PAPERS ─── */}
        <section className="mb-12">
          <h2 className="mb-2 text-xl font-bold text-navy">
            Report Missing Papers
          </h2>
          <p className="mb-4 text-sm text-gray-500">
            Found papers that should be in our database? Your agent can check
            and file an issue.
          </p>

          <PromptBlock
            label="Prompt"
            agent="Claude Code"
            text={missingPapersPrompt}
          />
        </section>

        {/* ─── PREREQUISITES ─── */}
        <section className="mb-12">
          <h2 className="mb-4 text-xl font-bold text-navy">
            What You Need
          </h2>
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <div className="space-y-4">
              <div>
                <h3 className="mb-2 font-semibold text-navy">
                  Claude Code (recommended)
                </h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>
                    Install:{" "}
                    <code className="rounded bg-gray-100 px-2 py-0.5 text-xs">
                      npm install -g @anthropic-ai/claude-code
                    </code>
                  </p>
                  <p>
                    You need a GitHub account for submitting contributions. If
                    you don&apos;t have one, Claude Code can help you set one up
                    &mdash; just ask it.
                  </p>
                  <p>
                    Make sure the GitHub CLI is installed:{" "}
                    <code className="rounded bg-gray-100 px-2 py-0.5 text-xs">
                      gh auth login
                    </code>{" "}
                    &mdash; Claude Code can install it for you if needed.
                  </p>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4">
                <h3 className="mb-2 font-semibold text-navy">
                  ChatGPT, Gemini, or other agents
                </h3>
                <p className="text-sm text-gray-600">
                  Any agent that can browse the web and follow multi-step
                  instructions can use our API. Web browsing must be enabled.
                  These agents can build gap analyses but typically cannot submit
                  them automatically &mdash; you&apos;ll need to{" "}
                  <a
                    href="https://github.com/mwolters-cmyk/living-sports-analytics-research/issues/new"
                    className="text-orange hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    create the GitHub Issue manually
                  </a>
                  .
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ─── WHAT HAPPENS AFTER ─── */}
        <section className="mb-12">
          <h2 className="mb-4 text-xl font-bold text-navy">
            What Happens After You Submit
          </h2>
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-orange text-xs font-bold text-white">
                  1
                </span>
                <p>
                  Your contribution lands as a{" "}
                  <a
                    href="https://github.com/mwolters-cmyk/living-sports-analytics-research/issues"
                    className="text-orange hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    GitHub Issue
                  </a>{" "}
                  on our repository.
                </p>
              </div>
              <div className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-orange text-xs font-bold text-white">
                  2
                </span>
                <p>
                  We review it for quality (intellectual honesty, evidence
                  grounding, no hallucinated papers).
                </p>
              </div>
              <div className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-orange text-xs font-bold text-white">
                  3
                </span>
                <p>
                  If it passes review, it gets published on the{" "}
                  <Link href="/gaps" className="text-orange hover:underline">
                    Find the Gap
                  </Link>{" "}
                  page with credit to you.
                </p>
              </div>
              <div className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-orange text-xs font-bold text-white">
                  4
                </span>
                <p>
                  Missing papers get added to the database. New sources get
                  monitored automatically.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ─── FOR DEVELOPERS ─── */}
        <section className="mb-12">
          <h2 className="mb-2 text-xl font-bold text-navy">
            For Developers
          </h2>
          <p className="mb-4 text-sm text-gray-500">
            Building an agent or tool that works with sports analytics research?
            Our API is designed for programmatic access.
          </p>
          <div className="grid gap-3 md:grid-cols-2">
            {[
              {
                href: "/api/agent.json",
                label: "agent.json",
                desc: "Agent onboarding + workflow instructions",
              },
              {
                href: "/api/papers-compact.json",
                label: "papers-compact.json",
                desc: "All papers as compact search index (~4 MB)",
              },
              {
                href: "/api/gaps/index.json",
                label: "gaps/index.json",
                desc: "Gap analysis index with metadata",
              },
              {
                href: "/api/data-sources.json",
                label: "data-sources.json",
                desc: "Data sources with access methods",
              },
              {
                href: "/api/pipeline.json",
                label: "pipeline.json",
                desc: "Full classification taxonomy + ingestion protocol",
              },
              {
                href: "/api/contribute/gap-analysis-protocol.json",
                label: "gap-analysis-protocol.json",
                desc: "Step-by-step protocol for building gap analyses",
              },
            ].map((api) => (
              <a
                key={api.href}
                href={api.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 rounded-lg border border-gray-200 bg-white p-4 transition-colors hover:border-orange/50 hover:bg-orange/5"
              >
                <code className="shrink-0 rounded bg-gray-100 px-2 py-0.5 text-xs font-semibold text-navy">
                  GET
                </code>
                <div>
                  <div className="text-sm font-medium text-navy">
                    /api/{api.label}
                  </div>
                  <div className="text-xs text-gray-500">{api.desc}</div>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* ─── CTA ─── */}
        <section className="rounded-xl border-2 border-dashed border-navy/20 bg-navy/5 p-8 text-center">
          <h3 className="mb-2 text-lg font-semibold text-navy">
            See What Contributions Look Like
          </h3>
          <p className="mb-4 text-sm text-gray-500">
            Browse existing gap analyses to see the format and depth we&apos;re
            looking for.
          </p>
          <Link
            href="/gaps"
            className="inline-block rounded-lg bg-orange px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-orange-light"
          >
            View Gap Analyses
          </Link>
        </section>
      </div>
    </div>
  );
}
