import Link from "next/link";
import { getStats, getGapAnalyses } from "@/lib/db";
import type { GapAnalysis, Gap, GapPaperRef, AgendaItem, GapPaperIndexEntry } from "@/lib/db";

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

/**
 * Parse text containing inline W-references (e.g. "W4406017810") and replace
 * them with clickable APA-style citations: "Author (Year)".
 *
 * Falls back to a short work_id label if no metadata is available.
 */
const INLINE_WID_RE = /(?:https:\/\/openalex\.org\/)?(W\d{5,})/g;

function formatAuthorSurname(fullName: string): string {
  // "Jan de Vries" → "De Vries", "John Smith" → "Smith", "Maria García-López" → "García-López"
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) return parts[0];
  // Handle "de", "van", "von", "el", "al" etc — include as part of surname
  const prefixes = new Set(["de", "van", "von", "el", "al", "del", "da", "di", "le", "la", "dos", "das"]);
  const firstNames: string[] = [];
  let surnameStart = -1;
  for (let i = 0; i < parts.length; i++) {
    if (i === 0) { firstNames.push(parts[i]); continue; }
    // If this is a prefix word and NOT the last word, it's part of the surname
    if (prefixes.has(parts[i].toLowerCase()) && i < parts.length - 1) {
      surnameStart = i;
      break;
    }
    // If we haven't hit a prefix yet, check if it could be a middle name
    if (i < parts.length - 1) {
      firstNames.push(parts[i]);
    } else {
      surnameStart = i;
    }
  }
  if (surnameStart === -1) surnameStart = parts.length - 1;
  return parts.slice(surnameStart).join(" ");
}

function RichText({
  text,
  paperIndex,
  className = "",
}: {
  text: string;
  paperIndex: Record<string, GapPaperIndexEntry>;
  className?: string;
}) {
  // Split text into segments: plain text and W-references
  const segments: Array<{ type: "text"; content: string } | { type: "ref"; workId: string; fullWorkId: string }> = [];
  let lastIndex = 0;

  // Reset regex state
  INLINE_WID_RE.lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = INLINE_WID_RE.exec(text)) !== null) {
    // Add preceding text
    if (match.index > lastIndex) {
      segments.push({ type: "text", content: text.slice(lastIndex, match.index) });
    }
    const wid = match[1]; // W#### part
    segments.push({ type: "ref", workId: wid, fullWorkId: `https://openalex.org/${wid}` });
    lastIndex = match.index + match[0].length;
  }

  // Add trailing text
  if (lastIndex < text.length) {
    segments.push({ type: "text", content: text.slice(lastIndex) });
  }

  // If no references found, return plain text
  if (segments.length === 1 && segments[0].type === "text") {
    return <span className={className}>{text}</span>;
  }

  return (
    <span className={className}>
      {segments.map((seg, i) => {
        if (seg.type === "text") {
          return <span key={i}>{seg.content}</span>;
        }
        // Look up paper info
        const info = paperIndex[seg.fullWorkId];
        if (!info) {
          // Unknown paper — render as plain W-id
          return <span key={i} className="text-gray-400 text-xs">[{seg.workId}]</span>;
        }
        const surname = info.first_author ? formatAuthorSurname(info.first_author) : null;
        const label = surname && info.year
          ? `${surname} (${info.year})`
          : surname
          ? surname
          : info.year
          ? `(${info.year})`
          : seg.workId;
        return (
          <Link
            key={i}
            href={`/explore?paper=${encodeURIComponent(seg.fullWorkId)}`}
            className="text-navy underline decoration-navy/30 hover:text-orange hover:decoration-orange transition-colors"
            title={info.title}
          >
            {label}
          </Link>
        );
      })}
    </span>
  );
}

/** Render a clickable paper reference in APA style: "Author (Year)" with full title as tooltip */
function PaperLink({ paper }: { paper: GapPaperRef }) {
  const surname = paper.first_author ? formatAuthorSurname(paper.first_author) : null;
  const label = surname && paper.year
    ? `${surname} (${paper.year})`
    : surname
    ? surname
    : paper.year
    ? `(${paper.year})`
    : paper.title || paper.work_id;

  return (
    <Link
      href={`/explore?paper=${encodeURIComponent(paper.work_id)}`}
      className="text-sm text-navy underline decoration-gray-300 hover:text-orange hover:decoration-orange transition-colors"
      title={paper.title || undefined}
    >
      {label}
    </Link>
  );
}

/** Render a single gap card */
function GapCard({ gap, paperIndex }: { gap: Gap; paperIndex: Record<string, GapPaperIndexEntry> }) {
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
      <p className="mb-3 text-sm text-gray-600 leading-relaxed">
        <RichText text={gap.description} paperIndex={paperIndex} />
      </p>
      {gap.evidence && (
        <div className="mb-3 rounded-lg bg-gray-50 p-3">
          <div className="text-xs font-medium text-gray-500 mb-1">Evidence</div>
          <p className="text-sm text-gray-600">
            <RichText text={gap.evidence} paperIndex={paperIndex} />
          </p>
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
function AgendaCard({ item, paperIndex }: { item: AgendaItem; paperIndex: Record<string, GapPaperIndexEntry> }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-center gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-navy text-sm font-bold text-white">
          {item.priority}
        </div>
        <h4 className="text-base font-semibold text-navy">{item.title}</h4>
      </div>
      <p className="mb-3 text-sm text-gray-600 leading-relaxed">
        <RichText text={item.description} paperIndex={paperIndex} />
      </p>
      <div className="grid gap-2 text-sm">
        {item.suggested_methodology && (
          <div>
            <span className="font-medium text-gray-500">Methodology: </span>
            <RichText text={item.suggested_methodology} paperIndex={paperIndex} className="text-gray-600" />
          </div>
        )}
        {item.suggested_data && (
          <div>
            <span className="font-medium text-gray-500">Data needed: </span>
            <RichText text={item.suggested_data} paperIndex={paperIndex} className="text-gray-600" />
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
          <p className="text-sm text-gray-600">
            <RichText text={item.potential_impact} paperIndex={paperIndex} />
          </p>
        </div>
      )}
    </div>
  );
}

/** Render a full gap analysis report */
function GapAnalysisReport({ analysis, paperIndex }: { analysis: GapAnalysis; paperIndex: Record<string, GapPaperIndexEntry> }) {
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
            <p className="text-sm text-blue-900/80">
              <RichText text={analysis.scope_assessment} paperIndex={paperIndex} />
            </p>
          </div>
        )}

        {/* Database Coverage */}
        {analysis.database_coverage && (
          <div className="rounded-lg bg-amber-50/50 border border-amber-100 p-4">
            <div className="text-xs font-semibold text-amber-800 mb-1">Database Coverage</div>
            <p className="text-sm text-amber-900/80">
              <RichText text={analysis.database_coverage} paperIndex={paperIndex} />
            </p>
          </div>
        )}

        {/* Research Landscape */}
        {analysis.landscape && (
          <section>
            <h4 className="text-base font-semibold text-navy mb-3">Research Landscape</h4>
            {analysis.landscape.summary && (
              <div className="prose prose-sm max-w-none text-gray-600 mb-4">
                {analysis.landscape.summary.split("\n\n").map((para, i) => (
                  <p key={i} className="mb-3 leading-relaxed">
                    <RichText text={para} paperIndex={paperIndex} />
                  </p>
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
                      <p className="text-sm text-gray-700">
                        <RichText text={f.finding} paperIndex={paperIndex} />
                      </p>
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
                <GapCard key={gap.id || i} gap={gap} paperIndex={paperIndex} />
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
                <AgendaCard key={i} item={item} paperIndex={paperIndex} />
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
                <p className="text-sm text-gray-600">
                  <RichText text={analysis.self_reflection.synthesis_quality} paperIndex={paperIndex} />
                </p>
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              {analysis.self_reflection.strengths && analysis.self_reflection.strengths.length > 0 && (
                <div>
                  <div className="text-sm font-medium text-emerald-700 mb-1">Strengths</div>
                  <ul className="space-y-1">
                    {analysis.self_reflection.strengths.map((s, i) => (
                      <li key={i} className="text-sm text-gray-600 flex gap-1.5">
                        <span className="text-emerald-500 shrink-0">+</span>
                        <RichText text={s} paperIndex={paperIndex} />
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
                        <span className="text-red-400 shrink-0">&minus;</span>
                        <RichText text={l} paperIndex={paperIndex} />
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
                      <span className="text-amber-500 shrink-0">!</span>
                      <RichText text={g} paperIndex={paperIndex} />
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {analysis.self_reflection.process_cost_reflection && (
              <div className="mt-4">
                <div className="text-sm font-medium text-gray-500 mb-1">Process Reflection</div>
                <p className="text-sm text-gray-600">
                  <RichText text={analysis.self_reflection.process_cost_reflection} paperIndex={paperIndex} />
                </p>
              </div>
            )}

            {analysis.self_reflection.assumptions && analysis.self_reflection.assumptions.length > 0 && (
              <div className="mt-4">
                <div className="text-sm font-medium text-gray-500 mb-1">Assumptions</div>
                <ul className="space-y-1">
                  {analysis.self_reflection.assumptions.map((a, i) => (
                    <li key={i} className="text-sm text-gray-500 italic">
                      <RichText text={a} paperIndex={paperIndex} />
                    </li>
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
  const paperIndex = gapAnalyses.paper_index || {};

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
              <GapAnalysisReport key={analysis.slug} analysis={analysis} paperIndex={paperIndex} />
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

      {/* ================================================================ */}
      {/* DEVELOPMENT LOG: What we learned & what comes next               */}
      {/* ================================================================ */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-navy mb-2">Development Log</h2>
        <p className="text-sm text-gray-400 mb-6 max-w-3xl">
          This platform is a living system. After each batch of gap analyses, we
          review the AI&apos;s self-reflections and use them to improve the pipeline.
          This log tracks what we learned and what we&apos;re building next.
        </p>

        {/* Entry: 2026-02-16 */}
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          <div className="border-b border-gray-100 bg-navy/[0.02] px-6 py-4">
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-navy/10 px-2.5 py-0.5 text-xs font-medium text-navy">
                Sprint 1
              </span>
              <span className="text-sm font-semibold text-navy">
                First 5 gap analyses &rarr; self-reflection &rarr; platform improvements
              </span>
              <span className="text-xs text-gray-400 ml-auto">16 Feb 2026</span>
            </div>
          </div>
          <div className="px-6 py-5 space-y-5">
            <div>
              <div className="text-sm font-medium text-gray-700 mb-2">What we learned from the first 5 analyses</div>
              <p className="text-sm text-gray-600 leading-relaxed">
                After running gap analyses on injury prediction, spending vs.
                success, football tactics, cycling prediction, and multi-sport
                training, every analysis flagged the same structural limitations. We
                synthesized the self-reflections into a top&nbsp;5 of improvements:
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-emerald-100 bg-emerald-50/50 p-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-emerald-600 text-sm font-bold">1</span>
                  <span className="text-sm font-medium text-emerald-800">Richer paper context for AI</span>
                  <span className="ml-auto rounded-full bg-emerald-100 px-2 py-0.5 text-xs text-emerald-700">Done</span>
                </div>
                <p className="text-xs text-emerald-700/80">
                  The gap analyzer now reads full PDF extraction data (key results,
                  effect sizes, statistical methods, validation approach) instead of
                  just abstracts. Papers with extracted data get ~2x richer summaries.
                </p>
              </div>
              <div className="rounded-lg border border-emerald-100 bg-emerald-50/50 p-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-emerald-600 text-sm font-bold">2</span>
                  <span className="text-sm font-medium text-emerald-800">Standardized effect size extraction</span>
                  <span className="ml-auto rounded-full bg-emerald-100 px-2 py-0.5 text-xs text-emerald-700">Done</span>
                </div>
                <p className="text-xs text-emerald-700/80">
                  Added <code className="text-xs">outcome_quantification</code> to the
                  extraction prompt: primary effect size with CI bounds, outcome measure
                  direction, validation type, and generalizability scope. Future
                  extractions will be meta-analysis ready.
                </p>
              </div>
              <div className="rounded-lg border border-emerald-100 bg-emerald-50/50 p-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-emerald-600 text-sm font-bold">3</span>
                  <span className="text-sm font-medium text-emerald-800">Broader database coverage</span>
                  <span className="ml-auto rounded-full bg-emerald-100 px-2 py-0.5 text-xs text-emerald-700">Done</span>
                </div>
                <p className="text-xs text-emerald-700/80">
                  Added sports economics journals (Journal of Sports Economics, Sport
                  Management Review, European Sport Management Quarterly), operations
                  research keywords, and conference proceedings keywords (Sloan, KDD)
                  to the literature watcher. Next watcher run will capture papers from
                  these new sources.
                </p>
              </div>
              <div className="rounded-lg border border-emerald-100 bg-emerald-50/50 p-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-emerald-600 text-sm font-bold">4</span>
                  <span className="text-sm font-medium text-emerald-800">Citation network infrastructure</span>
                  <span className="ml-auto rounded-full bg-emerald-100 px-2 py-0.5 text-xs text-emerald-700">Done</span>
                </div>
                <p className="text-xs text-emerald-700/80">
                  Created <code className="text-xs">paper_citations</code> table and
                  updated the watcher to store OpenAlex referenced_works. Once
                  populated, the gap analyzer can prove whether research clusters
                  actually cite each other &mdash; moving from &ldquo;I suspect
                  fragmentation&rdquo; to &ldquo;cluster A and B share 3 citations.&rdquo;
                </p>
              </div>
            </div>

            <div>
              <div className="text-sm font-medium text-gray-700 mb-2">What comes next</div>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex gap-2">
                  <span className="text-orange shrink-0">&#9679;</span>
                  <span>
                    <strong>Run the watcher</strong> with the new journals and keywords
                    to pull in sports economics and operations research papers. Then
                    re-run the spending vs. success analysis to see if coverage improves.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-orange shrink-0">&#9679;</span>
                  <span>
                    <strong>Backfill citation data</strong> for existing ~40K papers via
                    the OpenAlex API. Then build citation cluster visualization for the
                    gap analyses.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-orange shrink-0">&#9679;</span>
                  <span>
                    <strong>Re-extract papers</strong> with the new outcome_quantification
                    field to build a meta-analysis-ready dataset of effect sizes across
                    all papers with PDFs.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-orange shrink-0">&#9679;</span>
                  <span>
                    <strong>Open science badges</strong> on the explore page: show which
                    papers have open code, open data, and reproducible methods.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-orange shrink-0">&#9679;</span>
                  <span>
                    <strong>More gap analyses</strong> across different sports and
                    themes, using the enriched pipeline. Re-run existing analyses
                    periodically to track how the landscape evolves.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
