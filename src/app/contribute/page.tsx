"use client";

import Link from "next/link";
import { useState } from "react";

/* ─── Collapsible component ─── */
function Expandable({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-3 text-left text-sm font-medium text-navy hover:text-orange transition-colors"
      >
        {title}
        <span className="text-lg text-gray-400">{open ? "\u2212" : "+"}</span>
      </button>
      {open && <div className="pb-4">{children}</div>}
    </div>
  );
}

/* ─── Prompt block component ─── */
function Prompt({ text }: { text: string }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 font-mono text-xs leading-relaxed text-gray-700">
      <div className="mb-1 text-[10px] font-sans font-semibold uppercase tracking-wider text-orange">
        Prompt for Claude Code
      </div>
      {text}
    </div>
  );
}

/* ─── Research type cards ─── */
const researchTypes = [
  {
    icon: "\u{1F4DA}",
    title: "Literature Review / State of Knowledge",
    who: "Any student, no coding required",
    time: "2\u20134 hours with Claude Code",
    example:
      "A student wants to map all research on injuries in female athletes — treatment approaches, performance effects, and research gaps.",
    steps: [
      "Clone the repo and open Claude Code",
      'Ask Claude to search OpenAlex, PubMed, and Google Scholar for your topic',
      'Claude creates a structured overview: core papers, methodology used, key findings',
      'Run create-analysis.py to scaffold a living analysis page',
      'Claude populates the literature array with tagged papers (core/supporting/context)',
      'Build, review, and submit a pull request',
    ],
    prompts: [
      {
        label: "Step 1: Broad search",
        text: `Search OpenAlex and Google Scholar for all papers about injuries in female athletes, including ACL injuries, concussion, stress fractures, and overuse injuries. Focus on treatment approaches and their effect on return-to-play outcomes. Search from 2010 onwards. For each paper, extract: authors, year, title, journal, DOI, key finding, methodology used, sport studied, and sample size.`,
      },
      {
        label: "Step 2: Scaffold the page",
        text: `Run python scripts/create-analysis.py "female-athlete-injuries" "Injuries in Female Athletes: Treatment and Performance Effects". Then populate the literature array in the generated page with the papers we found. Tag each as core, supporting, or context.`,
      },
      {
        label: "Step 3: Identify gaps",
        text: `Based on the papers we found, create a research gap analysis: which sports are understudied? Which injury types lack data on female athletes specifically? Where do sample sizes limit conclusions? Add this as a discussion section.`,
      },
    ],
  },
  {
    icon: "\u{1F4CA}",
    title: "Data Analysis (with existing data)",
    who: "Student comfortable with Python/R",
    time: "1\u20132 weeks with Claude Code",
    example:
      "Analyze whether lane assignment affects outcomes in speed skating, using scraped ISU results data.",
    steps: [
      "Clone the repo and explore available datasets (data/ directory)",
      "Use Claude Code to write analysis scripts",
      "Run statistical tests and generate results",
      "Scaffold an analysis page and populate with results + literature",
      "Build, review, and submit a PR",
    ],
    prompts: [
      {
        label: "Step 1: Explore available data",
        text: `What datasets are available in this project? I want to analyze [your topic]. Show me what data exists and what additional data I might need to scrape.`,
      },
      {
        label: "Step 2: Write the analysis",
        text: `Write a Python script that tests whether [your hypothesis]. Use the data in [path]. Include: descriptive statistics, appropriate statistical tests (t-test/ANOVA/regression depending on the question), effect sizes, and visualizations. Save results as JSON for the website.`,
      },
      {
        label: "Step 3: Build the page",
        text: `Run python scripts/create-analysis.py "[slug]" "[Title]". Then update the page with our statistical results, fill in the methodology section with our approach, and add the literature review papers. Make sure the key finding section reflects our main conclusion.`,
      },
    ],
  },
  {
    icon: "\u{1F578}",
    title: "New Scraper / Data Source",
    who: "Student with some Python experience",
    time: "3\u20135 days with Claude Code",
    example:
      "Build a scraper for handball statistics from IHF, following the existing scraper patterns in scrapers/.",
    steps: [
      "Look at existing scrapers (scrapers/base.py for shared utilities)",
      "Claude Code builds the scraper following project conventions",
      "Test with a small sample, then run full extraction",
      "Document the dataset in the sport_datasets table",
      "Submit PR with scraper + sample data",
    ],
    prompts: [
      {
        label: "Step 1: Understand patterns",
        text: `Read scrapers/base.py and one existing scraper (e.g., scrapers/scrape_openalex_papers.py). I want to build a scraper for [sport/source]. What\u0027s the standard pattern I should follow?`,
      },
      {
        label: "Step 2: Build the scraper",
        text: `Build a new scraper for [data source URL]. Follow the project conventions: use RateLimitedSession from base.py, use get_logger(), save to CSV with save_to_csv(). Add rate limiting and error handling. Include a --dry-run flag.`,
      },
    ],
  },
  {
    icon: "\u{1F916}",
    title: "AI Agent / Classifier (Thesis Project)",
    who: "MSc student, strong technical background",
    time: "Full thesis (3\u20136 months)",
    example:
      "Build an AI paper classifier that categorizes sports analytics papers by sport, methodology, and theme — validated against Jan Van Haaren\u0027s annual soccer analytics reviews.",
    steps: [
      "Study the existing classifier prompt in living_meta/classifier.py",
      "Design your classification approach (fine-tuning, prompt engineering, RAG)",
      "Use the database (39K+ papers (12K+ classified)) as training/test data",
      "Validate against human-tagged ground truth",
      "Integrate into the pipeline for automatic classification",
    ],
    prompts: [
      {
        label: "Step 1: Understand the current system",
        text: `Read living_meta/classifier.py, living_meta/config.py (taxonomies), and living_meta/database.py (schema). I want to build an AI classifier for sports analytics papers. What\u0027s the current approach and where can I improve it?`,
      },
      {
        label: "Step 2: Create validation set",
        text: `Query the database for papers that have been manually classified. Also fetch Jan Van Haaren\u0027s 2024 soccer analytics review categories. Create a validation dataset of at least 200 papers with ground truth labels.`,
      },
    ],
  },
];

export default function ContributePage() {
  return (
    <div>
      {/* Header */}
      <section className="bg-navy px-4 py-14 text-white">
        <div className="mx-auto max-w-5xl">
          <h1 className="mb-3 text-3xl font-bold">Contribute</h1>
          <p className="max-w-2xl text-lg text-gray-300">
            This platform is built for collaboration. Whether you&apos;re
            writing a literature review, analyzing data, or building a scraper
            &mdash; Claude Code + this repo gives you everything you need.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 py-10">
        {/* ─── THE IDEA ─── */}
        <section className="mb-12">
          <h2 className="mb-4 text-xl font-bold text-navy">
            How It Works: Claude Code as Your Research Partner
          </h2>
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <div className="mb-4 grid gap-4 md:grid-cols-3">
              <div className="rounded-lg bg-navy/5 p-4">
                <div className="mb-2 text-2xl">{"\u{1F4C2}"}</div>
                <h3 className="mb-1 text-sm font-semibold text-navy">
                  1. Clone the Repo
                </h3>
                <p className="text-xs text-gray-500">
                  The{" "}
                  <code className="rounded bg-gray-100 px-1 text-[10px]">
                    CLAUDE.md
                  </code>{" "}
                  file gives Claude full project context: database schema, 39K+
                  papers, 24 journals, coding conventions, and available
                  datasets for 15+ sports.
                </p>
              </div>
              <div className="rounded-lg bg-navy/5 p-4">
                <div className="mb-2 text-2xl">{"\u{1F4AC}"}</div>
                <h3 className="mb-1 text-sm font-semibold text-navy">
                  2. Describe What You Want
                </h3>
                <p className="text-xs text-gray-500">
                  Tell Claude what you&apos;re researching in natural language.
                  It searches for papers, writes analysis code, creates
                  visualizations, and scaffolds living analysis pages.
                </p>
              </div>
              <div className="rounded-lg bg-navy/5 p-4">
                <div className="mb-2 text-2xl">{"\u{1F680}"}</div>
                <h3 className="mb-1 text-sm font-semibold text-navy">
                  3. Submit a Pull Request
                </h3>
                <p className="text-xs text-gray-500">
                  Your contribution goes through GitHub PR review. Every
                  analysis follows our Cochrane-inspired protocol: structured
                  question, literature review, open data, transparent methods.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ─── SETUP ─── */}
        <section className="mb-12">
          <h2 className="mb-4 text-xl font-bold text-navy">
            One-Time Setup (~10 minutes)
          </h2>
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <div className="space-y-0">
              <div className="flex gap-3 border-b border-gray-100 py-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-orange text-xs font-bold text-white">
                  1
                </span>
                <div className="text-sm text-gray-600">
                  <strong>Install Claude Code:</strong>{" "}
                  <code className="rounded bg-gray-100 px-2 py-0.5 text-xs">
                    npm install -g @anthropic-ai/claude-code
                  </code>
                </div>
              </div>
              <div className="flex gap-3 border-b border-gray-100 py-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-orange text-xs font-bold text-white">
                  2
                </span>
                <div className="text-sm text-gray-600">
                  <strong>Clone the repo:</strong>{" "}
                  <code className="rounded bg-gray-100 px-2 py-0.5 text-xs">
                    git clone
                    https://github.com/mwolters-cmyk/living-sports-analytics-research.git
                  </code>
                </div>
              </div>
              <div className="flex gap-3 border-b border-gray-100 py-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-orange text-xs font-bold text-white">
                  3
                </span>
                <div className="text-sm text-gray-600">
                  <strong>Install dependencies:</strong>{" "}
                  <code className="rounded bg-gray-100 px-2 py-0.5 text-xs">
                    pip install -r requirements.txt
                  </code>
                </div>
              </div>
              <div className="flex gap-3 border-b border-gray-100 py-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-orange text-xs font-bold text-white">
                  4
                </span>
                <div className="text-sm text-gray-600">
                  <strong>
                    Create{" "}
                    <code className="rounded bg-gray-100 px-1 text-xs">
                      .env
                    </code>
                    :
                  </strong>{" "}
                  <code className="rounded bg-gray-100 px-2 py-0.5 text-xs">
                    OPENALEX_EMAIL=your@email.com
                  </code>
                </div>
              </div>
              <div className="flex gap-3 border-b border-gray-100 py-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-orange text-xs font-bold text-white">
                  5
                </span>
                <div className="text-sm text-gray-600">
                  <strong>Build the database:</strong>{" "}
                  <code className="rounded bg-gray-100 px-2 py-0.5 text-xs">
                    python -m living_meta.migrate_existing
                  </code>
                </div>
              </div>
              <div className="flex gap-3 py-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-orange text-xs font-bold text-white">
                  6
                </span>
                <div className="text-sm text-gray-600">
                  <strong>Start Claude Code:</strong>{" "}
                  <code className="rounded bg-gray-100 px-2 py-0.5 text-xs">
                    claude
                  </code>{" "}
                  (in the repo directory &mdash; it reads{" "}
                  <code className="text-xs">CLAUDE.md</code> automatically)
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── RESEARCH TYPES ─── */}
        <section className="mb-12">
          <h2 className="mb-2 text-xl font-bold text-navy">
            Choose Your Research Type
          </h2>
          <p className="mb-6 text-sm text-gray-500">
            Each type has concrete prompts you can copy into Claude Code. Pick
            the one closest to your project.
          </p>

          <div className="space-y-6">
            {researchTypes.map((rt) => (
              <div
                key={rt.title}
                className="rounded-xl border border-gray-200 bg-white shadow-sm"
              >
                <div className="border-b border-gray-100 p-6">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{rt.icon}</span>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-navy">
                        {rt.title}
                      </h3>
                      <div className="mt-1 flex flex-wrap gap-3 text-xs text-gray-500">
                        <span>{rt.who}</span>
                        <span className="text-gray-300">|</span>
                        <span>{rt.time}</span>
                      </div>
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-gray-600">
                    <span className="font-medium text-navy">Example: </span>
                    {rt.example}
                  </p>
                </div>

                <div className="p-6">
                  {/* Steps */}
                  <div className="mb-5">
                    <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-orange">
                      Workflow
                    </div>
                    <ol className="space-y-1.5 text-sm text-gray-600">
                      {rt.steps.map((step, i) => (
                        <li key={i} className="flex gap-2">
                          <span className="shrink-0 font-mono text-xs text-orange">
                            {i + 1}.
                          </span>
                          {step}
                        </li>
                      ))}
                    </ol>
                  </div>

                  {/* Prompts */}
                  <div>
                    <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-orange">
                      Copy-Paste Prompts
                    </div>
                    <div className="space-y-0">
                      {rt.prompts.map((p) => (
                        <Expandable
                          key={p.label}
                          title={p.label}
                          defaultOpen={false}
                        >
                          <Prompt text={p.text} />
                        </Expandable>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ─── THESIS PROJECTS ─── */}
        <section className="mb-12">
          <h2 className="mb-2 text-xl font-bold text-navy">
            Thesis Project Ideas
          </h2>
          <p className="mb-6 text-sm text-gray-500">
            BSc and MSc students at RSM can build their thesis on this platform.
            Each project has a clear scope, available data, and expected
            deliverables. Your work becomes part of a living research platform
            &mdash; not a throwaway assignment.
          </p>

          <div className="grid gap-4 md:grid-cols-2">
            {[
              {
                title: "AI Classifier Improvement",
                level: "MSc",
                desc: "Our baseline Claude Haiku classifier achieves good coverage. Can you improve it with fine-tuning, RAG, or ensemble methods? Validate against our gold standard set and Jan Van Haaren\u0027s annual reviews.",
                data: "12K+ classified papers, 50 gold standard extractions",
              },
              {
                title: "Topic Modeling Pipeline",
                level: "MSc",
                desc: "Apply BERTopic or LDA to 39K+ paper abstracts to discover emerging research themes and track how topics evolve over time.",
                data: "All abstracts in database",
              },
              {
                title: "Generic Elo Rating Framework",
                level: "BSc",
                desc: "Build a sport-agnostic Elo rating system that can be configured for any competitive sport. We already have Elo systems for 6+ sports to learn from.",
                data: "Existing Elo implementations",
              },
              {
                title: "Betting Market Efficiency",
                level: "MSc",
                desc: "Cross-sport comparison of betting market efficiency using our odds data + academic literature on market microstructure.",
                data: "Odds API data + papers",
              },
              {
                title: "Injury Prediction Synthesis",
                level: "BSc/MSc",
                desc: "Systematic analysis of injury prediction papers: which methods work best for which sports? Meta-analyze effect sizes across studies.",
                data: "25 sports medicine journals",
              },
              {
                title: "Citation Network Analysis",
                level: "MSc",
                desc: "Map the citation network of sports analytics. Which communities exist? Are women\u0027s sport papers cited less? Which papers are most influential?",
                data: "Full citation data via OpenAlex",
              },
            ].map((proj) => (
              <div
                key={proj.title}
                className="rounded-xl border border-gray-200 bg-white p-5"
              >
                <div className="mb-2 flex items-center gap-2">
                  <h3 className="font-semibold text-navy">{proj.title}</h3>
                  <span className="rounded-full bg-navy/10 px-2 py-0.5 text-xs font-medium text-navy">
                    {proj.level}
                  </span>
                </div>
                <p className="mb-2 text-sm text-gray-600">{proj.desc}</p>
                <div className="text-xs text-orange">{proj.data}</div>
              </div>
            ))}
          </div>

          <p className="mt-4 text-sm text-gray-500">
            Interested? Contact{" "}
            <strong>Matthijs Wolters</strong> or{" "}
            <strong>Otto Koppius</strong> at RSM.
          </p>
        </section>

        {/* ─── PAPER TAGGING ─── */}
        <section className="mb-12">
          <h2 className="mb-2 text-xl font-bold text-navy">
            Tag Papers (No Coding Required)
          </h2>
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <p className="mb-4 text-sm text-gray-600">
              Our AI classifier (Claude Haiku 4.5) has classified 35,000+ papers, with 12,000+ identified
              as sport-relevant. Help validate and improve these classifications by reviewing papers
              and correcting any misclassifications.
            </p>
            <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800">
              AI classification is active! Browse classified papers on the{" "}
              <Link href="/papers" className="font-medium underline hover:text-green-900">Papers page</Link>.
              Manual validation interface coming soon.
            </div>
          </div>
        </section>

        {/* ─── WHAT'S IN THE DATABASE ─── */}
        <section className="mb-12">
          <h2 className="mb-4 text-xl font-bold text-navy">
            What&apos;s Already in the Database?
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-gray-200 bg-white p-5 text-center">
              <div className="text-3xl font-bold text-navy">39,620</div>
              <div className="mt-1 text-sm text-gray-500">papers indexed</div>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-5 text-center">
              <div className="text-3xl font-bold text-navy">24</div>
              <div className="mt-1 text-sm text-gray-500">
                journals monitored
              </div>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-5 text-center">
              <div className="text-3xl font-bold text-navy">15+</div>
              <div className="mt-1 text-sm text-gray-500">sports covered</div>
            </div>
          </div>
          <p className="mt-4 text-sm text-gray-500">
            Coverage includes sports analytics journals (Journal of Sports
            Analytics, JQAS), sports science (JSS, EJSS), and sports medicine
            (BJSM, AJSM, MSSE, Scandinavian JMSS). See the full list in{" "}
            <code className="rounded bg-gray-100 px-1 text-xs">
              living_meta/config.py
            </code>
            .
          </p>
        </section>

        {/* ─── LINK TO ANALYSES ─── */}
        <section className="rounded-xl border-2 border-dashed border-navy/20 bg-navy/5 p-8 text-center">
          <h3 className="mb-2 text-lg font-semibold text-navy">
            See What a Finished Analysis Looks Like
          </h3>
          <p className="mb-4 text-sm text-gray-500">
            Our first living analysis is a natural experiment on lane advantage
            in speed skating &mdash; 14,774 race results, 15 papers reviewed,
            4 statistical models.
          </p>
          <Link
            href="/analyses/lane-advantage-1000m"
            className="inline-block rounded-lg bg-orange px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-orange-light"
          >
            View Example Analysis
          </Link>
        </section>
      </div>
    </div>
  );
}
