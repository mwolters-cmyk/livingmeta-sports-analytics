import Link from "next/link";
import { getStats, getGapAnalyses } from "@/lib/db";
import type { GapAnalysis, Gap, GapPaperRef, AgendaItem } from "@/lib/db";

/** Gap type → visual style */
const GAP_TYPE_STYLES: Record<string, { label: string; classes: string }> = {
  topic: { label: "Topic", classes: "bg-blue-100 text-blue-800" },
  methodology: { label: "Methodology", classes: "bg-purple-100 text-purple-800" },
  data: { label: "Data", classes: "bg-teal-100 text-teal-800" },
  population: { label: "Population", classes: "bg-orange/10 text-orange" },
  replication: { label: "Replication", classes: "bg-amber-100 text-amber-800" },
  temporal: { label: "Temporal", classes: "bg-sky-100 text-sky-800" },
  integration: { label: "Integration", classes: "bg-indigo-100 text-indigo-800" },
};

/** Confidence → visual style */
const CONFIDENCE_STYLES: Record<string, { label: string; classes: string }> = {
  high: { label: "High confidence", classes: "bg-emerald-100 text-emerald-800" },
  medium: { label: "Medium confidence", classes: "bg-amber-100 text-amber-800" },
  low: { label: "Low confidence", classes: "bg-red-100 text-red-800" },
  unknown: { label: "Unknown", classes: "bg-gray-100 text-gray-500" },
};

/** Difficulty → label */
const DIFFICULTY_LABELS: Record<string, string> = {
  accessible_thesis: "BSc/MSc Thesis",
  standard_phd: "PhD Project",
  challenging_project: "Advanced Project",
  major_initiative: "Major Initiative",
};

/** Render a clickable paper reference */
function PaperLink({ paper }: { paper: GapPaperRef }) {
  return (
    <Link
      href={`/explore?paper=${encodeURIComponent(paper.work_id)}`}
      className="text-sm text-navy underline decoration-gray-300 hover:text-orange hover:decoration-orange transition-colors"
    >
      {paper.title || paper.work_id}{paper.year ? ` (${paper.year})` : ""}
    </Link>
  );
}

/** Render a single gap card */
function GapCard({ gap }: { gap: Gap }) {
  const typeStyle = GAP_TYPE_STYLES[gap.type] || GAP_TYPE_STYLES.topic;
  const confStyle = CONFIDENCE_STYLES[gap.confidence] || CONFIDENCE_STYLES.unknown;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${typeStyle.classes}`}>
          {typeStyle.label}
        </span>
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
          gap.importance === "high" ? "bg-navy/10 text-navy font-semibold" :
          gap.importance === "medium" ? "bg-gray-100 text-gray-600" :
          "bg-gray-50 text-gray-400"
        }`}>
          {gap.importance} importance
        </span>
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
          gap.feasibility === "high" ? "bg-emerald-50 text-emerald-700" :
          gap.feasibility === "medium" ? "bg-gray-100 text-gray-600" :
          "bg-gray-50 text-gray-400"
        }`}>
          {gap.feasibility} feasibility
        </span>
        <span className={`rounded-full px-2 py-0.5 text-xs ${confStyle.classes}`}>
          {confStyle.label}
        </span>
      </div>
      <h4 className="mb-2 text-base font-semibold text-navy">{gap.title}</h4>
      <p className="mb-3 text-sm text-gray-600 leading-relaxed">{gap.description}</p>
      {gap.evidence && (
        <div className="mb-3 rounded-lg bg-gray-50 p-3">
          <div className="text-xs font-medium text-gray-500 mb-1">Evidence</div>
          <p className="text-sm text-gray-600">{gap.evidence}</p>
        </div>
      )}
      {gap.supporting_papers && gap.supporting_papers.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          <span className="text-xs text-gray-400 mr-1 self-center">Papers:</span>
          {gap.supporting_papers.map((p, i) => (
            <span key={typeof p === "string" ? p : p.work_id || i}>
              <PaperLink paper={typeof p === "string" ? { work_id: p, title: p, year: null } : p} />
              {i < gap.supporting_papers.length - 1 && <span className="text-gray-300"> · </span>}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

/** Render a single research agenda item */
function AgendaCard({ item }: { item: AgendaItem }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-center gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-navy text-sm font-bold text-white">
          {item.priority}
        </div>
        <h4 className="text-base font-semibold text-navy">{item.title}</h4>
      </div>
      <p className="mb-3 text-sm text-gray-600 leading-relaxed">{item.description}</p>
      <div className="grid gap-2 text-sm">
        {item.suggested_methodology && (
          <div>
            <span className="font-medium text-gray-500">Methodology: </span>
            <span className="text-gray-600">{item.suggested_methodology}</span>
          </div>
        )}
        {item.suggested_data && (
          <div>
            <span className="font-medium text-gray-500">Data needed: </span>
            <span className="text-gray-600">{item.suggested_data}</span>
          </div>
        )}
        <div className="flex flex-wrap gap-2 mt-1">
          {item.estimated_difficulty && (
            <span className="rounded-full bg-navy/5 px-2.5 py-0.5 text-xs font-medium text-navy">
              {DIFFICULTY_LABELS[item.estimated_difficulty] || item.estimated_difficulty}
            </span>
          )}
          {item.addresses_gaps && item.addresses_gaps.length > 0 && (
            <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-500">
              Addresses: {item.addresses_gaps.join(", ")}
            </span>
          )}
        </div>
      </div>
      {item.potential_impact && (
        <div className="mt-3 rounded-lg bg-orange/5 p-3">
          <div className="text-xs font-medium text-orange mb-1">Potential impact</div>
          <p className="text-sm text-gray-600">{item.potential_impact}</p>
        </div>
      )}
    </div>
  );
}

/** Render a full gap analysis report */
function GapAnalysisReport({ analysis }: { analysis: GapAnalysis }) {
  const confStyle = CONFIDENCE_STYLES[analysis.analysis_confidence] || CONFIDENCE_STYLES.unknown;
  const dateStr = analysis.analyzed_at
    ? new Date(analysis.analyzed_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
    : analysis.created_at
    ? new Date(analysis.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
    : "";

  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      {/* Header */}
      <div className="border-b border-gray-100 bg-navy/[0.02] px-6 py-5">
        <h3 className="text-lg font-bold text-navy leading-snug mb-2">
          &ldquo;{analysis.question}&rdquo;
        </h3>
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${confStyle.classes}`}>
            {confStyle.label}
          </span>
          <span className="text-gray-400">
            {analysis.papers_analyzed} papers analyzed
          </span>
          {dateStr && (
            <>
              <span className="text-gray-400">&middot;</span>
              <span className="text-gray-400">{dateStr}</span>
            </>
          )}
          {analysis.cost_usd > 0 && (
            <>
              <span className="text-gray-400">&middot;</span>
              <span className="text-gray-400">${analysis.cost_usd.toFixed(2)} analysis cost</span>
            </>
          )}
        </div>
      </div>

      <div className="px-6 py-5 space-y-8">
        {/* Scope Assessment */}
        {analysis.scope_assessment && (
          <div className="rounded-lg bg-blue-50/50 border border-blue-100 p-4">
            <div className="text-xs font-semibold text-blue-800 mb-1">Scope Assessment</div>
            <p className="text-sm text-blue-900/80">{analysis.scope_assessment}</p>
          </div>
        )}

        {/* Database Coverage */}
        {analysis.database_coverage && (
          <div className="rounded-lg bg-amber-50/50 border border-amber-100 p-4">
            <div className="text-xs font-semibold text-amber-800 mb-1">Database Coverage</div>
            <p className="text-sm text-amber-900/80">{analysis.database_coverage}</p>
          </div>
        )}

        {/* Research Landscape */}
        {analysis.landscape && (
          <section>
            <h4 className="text-base font-semibold text-navy mb-3">Research Landscape</h4>
            {analysis.landscape.summary && (
              <div className="prose prose-sm max-w-none text-gray-600 mb-4">
                {analysis.landscape.summary.split("\n\n").map((para, i) => (
                  <p key={i} className="mb-3 leading-relaxed">{para}</p>
                ))}
              </div>
            )}

            {/* Key Findings */}
            {analysis.landscape.key_findings && analysis.landscape.key_findings.length > 0 && (
              <div className="space-y-3 mb-4">
                <div className="text-sm font-medium text-gray-500">Key Findings</div>
                {analysis.landscape.key_findings.map((f, i) => (
                  <div key={i} className="rounded-lg border border-gray-100 bg-gray-50/50 p-3">
                    <div className="flex items-start gap-2">
                      <span className={`mt-0.5 shrink-0 rounded-full px-2 py-0.5 text-xs ${
                        f.evidence_strength === "strong" ? "bg-emerald-100 text-emerald-800" :
                        f.evidence_strength === "moderate" ? "bg-amber-100 text-amber-800" :
                        "bg-gray-100 text-gray-500"
                      }`}>
                        {f.evidence_strength}
                      </span>
                      <p className="text-sm text-gray-700">{f.finding}</p>
                    </div>
                    {f.papers && f.papers.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {f.papers.slice(0, 5).map((p, j) => (
                          <span key={typeof p === "string" ? p : p.work_id || j} className="text-xs">
                            <PaperLink paper={typeof p === "string" ? { work_id: p, title: p, year: null } : p} />
                            {j < Math.min(f.papers.length, 5) - 1 && <span className="text-gray-300"> · </span>}
                          </span>
                        ))}
                        {f.papers.length > 5 && (
                          <span className="text-xs text-gray-400">+{f.papers.length - 5} more</span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Key Papers */}
            {analysis.landscape.key_papers && analysis.landscape.key_papers.length > 0 && (
              <div>
                <div className="text-sm font-medium text-gray-500 mb-2">Key Papers</div>
                <div className="space-y-2">
                  {analysis.landscape.key_papers.map((p, i) => (
                    <div key={typeof p === "string" ? p : p.work_id || i} className="flex gap-2 text-sm">
                      <span className="shrink-0 text-orange">&#9679;</span>
                      <div>
                        <PaperLink paper={typeof p === "string" ? { work_id: p, title: p, year: null } : p} />
                        {typeof p !== "string" && p.why_key && (
                          <span className="text-gray-400 ml-1">&mdash; {p.why_key}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {/* Identified Gaps */}
        {analysis.gaps && analysis.gaps.length > 0 && (
          <section>
            <h4 className="text-base font-semibold text-navy mb-1">
              Identified Research Gaps
            </h4>
            <p className="text-sm text-gray-400 mb-4">
              {analysis.gaps.length} gaps identified, ordered by importance
            </p>
            <div className="grid gap-4">
              {analysis.gaps.map((gap, i) => (
                <GapCard key={gap.id || i} gap={gap} />
              ))}
            </div>
          </section>
        )}

        {/* Research Agenda */}
        {analysis.research_agenda && analysis.research_agenda.length > 0 && (
          <section>
            <h4 className="text-base font-semibold text-navy mb-1">
              Research Agenda
            </h4>
            <p className="text-sm text-gray-400 mb-4">
              Prioritized directions for future research
            </p>
            <div className="grid gap-4">
              {analysis.research_agenda.map((item, i) => (
                <AgendaCard key={i} item={item} />
              ))}
            </div>
          </section>
        )}

        {/* Self-Reflection */}
        {analysis.self_reflection && (
          <section className="rounded-xl border border-gray-200 bg-gray-50/50 p-5">
            <h4 className="text-base font-semibold text-navy mb-3">
              Honest Self-Reflection
            </h4>
            <p className="text-xs text-gray-400 mb-4">
              The AI reflects on the quality and limitations of its own analysis. Transparency is a core value of this platform.
            </p>

            {analysis.self_reflection.synthesis_quality && (
              <div className="mb-4">
                <div className="text-sm font-medium text-gray-500 mb-1">Synthesis Quality</div>
                <p className="text-sm text-gray-600">{analysis.self_reflection.synthesis_quality}</p>
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              {analysis.self_reflection.strengths && analysis.self_reflection.strengths.length > 0 && (
                <div>
                  <div className="text-sm font-medium text-emerald-700 mb-1">Strengths</div>
                  <ul className="space-y-1">
                    {analysis.self_reflection.strengths.map((s, i) => (
                      <li key={i} className="text-sm text-gray-600 flex gap-1.5">
                        <span className="text-emerald-500 shrink-0">+</span> {s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {analysis.self_reflection.limitations && analysis.self_reflection.limitations.length > 0 && (
                <div>
                  <div className="text-sm font-medium text-red-700 mb-1">Limitations</div>
                  <ul className="space-y-1">
                    {analysis.self_reflection.limitations.map((l, i) => (
                      <li key={i} className="text-sm text-gray-600 flex gap-1.5">
                        <span className="text-red-400 shrink-0">&minus;</span> {l}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {analysis.self_reflection.database_coverage_gaps && analysis.self_reflection.database_coverage_gaps.length > 0 && (
              <div className="mt-4 rounded-lg bg-amber-50 border border-amber-200 p-3">
                <div className="text-sm font-medium text-amber-800 mb-1">
                  Suspected Database Coverage Gaps
                </div>
                <p className="text-xs text-amber-600 mb-2">
                  The AI suspects these topics may have relevant research not yet in our database. This helps us improve our coverage.
                </p>
                <ul className="space-y-1">
                  {analysis.self_reflection.database_coverage_gaps.map((g, i) => (
                    <li key={i} className="text-sm text-amber-900/80 flex gap-1.5">
                      <span className="text-amber-500 shrink-0">!</span> {g}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {analysis.self_reflection.process_cost_reflection && (
              <div className="mt-4">
                <div className="text-sm font-medium text-gray-500 mb-1">Process Reflection</div>
                <p className="text-sm text-gray-600">{analysis.self_reflection.process_cost_reflection}</p>
              </div>
            )}

            {analysis.self_reflection.assumptions && analysis.self_reflection.assumptions.length > 0 && (
              <div className="mt-4">
                <div className="text-sm font-medium text-gray-500 mb-1">Assumptions</div>
                <ul className="space-y-1">
                  {analysis.self_reflection.assumptions.map((a, i) => (
                    <li key={i} className="text-sm text-gray-500 italic">{a}</li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}


export default function GapsPage() {
  const stats = getStats();
  const gapAnalyses = getGapAnalyses();
  const totalRelevant = stats.classifiedRelevant || 0;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="mb-2 text-3xl font-bold text-navy">Find the Gap</h1>
      <p className="mb-10 text-lg text-gray-500">
        AI-powered research gap analysis for sports analytics
      </p>

      {/* ================================================================ */}
      {/* VISION: What this page does and why                              */}
      {/* ================================================================ */}
      <section className="mb-12 rounded-2xl border border-navy/10 bg-navy/[0.02] p-6 sm:p-8">
        <h2 className="text-xl font-bold text-navy mb-4">
          How This Works
        </h2>
        <div className="prose prose-sm max-w-none text-gray-600 space-y-4">
          <p className="leading-relaxed">
            Sports analytics research is growing rapidly, but it is also deeply
            fragmented. Most studies are <strong>monologues</strong>, not dialogues
            &mdash; individual teams or researchers exploring a question in
            isolation, rarely building on each other&rsquo;s work. The result is a
            landscape where the same gaps persist for years while other topics
            attract duplicate attention.
          </p>
          <p className="leading-relaxed">
            This page uses AI to cut through that fragmentation. Starting from a
            specific research question, an AI model reads <em>every relevant
            paper</em> in our database and produces an honest synthesis:
          </p>
          <ol className="list-decimal list-inside space-y-2 text-gray-600">
            <li>
              <strong>Research landscape</strong> &mdash; What is already known?
              What methods and data sources are being used?
            </li>
            <li>
              <strong>Identified gaps</strong> &mdash; What is missing? Where are
              topics, methods, populations, or data types neglected?
            </li>
            <li>
              <strong>Research agenda</strong> &mdash; What should be studied
              next, and how?
            </li>
            <li>
              <strong>Honest self-reflection</strong> &mdash; Where does the
              analysis itself fall short? What does our database not cover?
            </li>
          </ol>
          <div className="rounded-lg bg-amber-50/60 border border-amber-200/60 p-4 mt-4">
            <p className="text-sm text-amber-900/80 leading-relaxed">
              <strong>Intellectual honesty is central to this process.</strong> The
              AI may only cite papers that exist in our database &mdash; it cannot
              invent evidence. Every claim must point to specific papers. If the AI
              suspects that relevant research exists <em>outside</em> our database,
              it must flag this as a database coverage limitation. That is not a
              failure &mdash; it is a valuable finding that helps us improve the
              platform.
            </p>
          </div>
          <p className="leading-relaxed text-gray-500">
            Each report below is a snapshot of a living process. As our database
            grows and new papers are added, analyses can be re-run to track how the
            landscape evolves. The goal is to move sports analytics from fragmented
            monologues toward a shared, evidence-based research agenda.
          </p>
        </div>
      </section>

      {/* ================================================================ */}
      {/* DEEP GAP ANALYSES                                                */}
      {/* ================================================================ */}
      <section className="mb-10">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-navy mb-2">
            Research Gap Analyses
          </h2>
          <p className="text-gray-500 text-sm leading-relaxed max-w-3xl">
            Each analysis examines a specific research question against our full
            database of {totalRelevant.toLocaleString()} classified papers.
          </p>
        </div>

        {gapAnalyses.analyses.length > 0 ? (
          <div className="space-y-8">
            {gapAnalyses.analyses.map((analysis) => (
              <GapAnalysisReport key={analysis.slug} analysis={analysis} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
            <div className="text-lg font-medium text-gray-400 mb-2">
              Gap analyses are being generated
            </div>
            <p className="text-sm text-gray-400 max-w-lg mx-auto">
              AI-powered research gap reports will appear here as they are completed.
              Each report synthesizes the full body of relevant research around a
              specific question, identifies what is missing, and proposes a research
              agenda.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
