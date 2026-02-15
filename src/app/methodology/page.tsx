import { getStats } from "@/lib/db";
import Link from "next/link";
import methodologyExtractions from "@/data/methodology-extractions.json";
import unifiedResources from "@/data/unified-resources.json";

/* ─── PRISMA flow box component ─── */
function FlowBox({
  label,
  count,
  accent = false,
  muted = false,
}: {
  label: string;
  count: number | string;
  accent?: boolean;
  muted?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border-2 px-6 py-4 text-center shadow-sm ${
        accent
          ? "border-orange bg-orange/5"
          : muted
            ? "border-gray-300 bg-gray-50"
            : "border-navy bg-white"
      }`}
    >
      <div
        className={`text-2xl font-bold ${
          accent ? "text-orange" : muted ? "text-gray-400" : "text-navy"
        }`}
      >
        {typeof count === "number" ? count.toLocaleString() : count}
      </div>
      <div className={`mt-1 text-sm ${muted ? "text-gray-400" : "text-gray-600"}`}>
        {label}
      </div>
    </div>
  );
}

/* ─── Arrow connector (vertical) ─── */
function Arrow({ label }: { label?: string }) {
  return (
    <div className="flex flex-col items-center py-1">
      <div className="h-6 w-0.5 bg-gray-300" />
      {label && (
        <div className="my-1 rounded-full bg-gray-100 px-3 py-0.5 text-xs text-gray-500">
          {label}
        </div>
      )}
      <div className="h-0 w-0 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent border-t-gray-300" />
    </div>
  );
}

/* ─── Keyword tag component ─── */
function KeywordTag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block rounded-full border border-gray-200 bg-white px-2.5 py-1 text-xs text-gray-700">
      {children}
    </span>
  );
}

/* ─── Journal row component ─── */
function JournalRow({
  name,
  category,
}: {
  name: string;
  category: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-gray-100 px-4 py-2 last:border-b-0">
      <span className="text-sm text-gray-700">{name}</span>
      <span className="shrink-0 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
        {category}
      </span>
    </div>
  );
}

/* ─── Classification option list ─── */
function ClassificationList({
  title,
  options,
}: {
  title: string;
  options: string[];
}) {
  return (
    <div>
      <h4 className="mb-2 text-sm font-semibold text-navy">{title}</h4>
      <div className="flex flex-wrap gap-1.5">
        {options.map((opt) => (
          <span
            key={opt}
            className="rounded-full border border-navy/15 bg-navy/5 px-2.5 py-0.5 text-xs text-navy"
          >
            {opt}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─── Section anchor nav items ─── */
const sectionNav = [
  { id: "search-strategy", label: "Search Strategy" },
  { id: "prisma-flow", label: "PRISMA Flow" },
  { id: "classification", label: "AI Classification" },
  { id: "extraction", label: "Full-Text Extraction" },
  { id: "update-protocol", label: "Update Protocol" },
  { id: "limitations", label: "Limitations" },
];

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════════════════════════════ */

export default function MethodologyPage() {
  const stats = getStats();

  const papersWithAbstract = stats.papersWithAbstract;
  const totalClassified = stats.totalClassified;
  const classifiedRelevant = stats.classifiedRelevant;
  const classifiedNotApplicable = stats.classifiedNotApplicable;
  const totalPapers = stats.totalPapers;
  const extractionCount = Object.keys(methodologyExtractions).length;
  const resourceCount = unifiedResources.resources.length;
  const resourcesWithPapers = unifiedResources.resources.filter(
    (r: { papers?: unknown[] }) => r.papers && r.papers.length > 0
  ).length;

  return (
    <div>
      {/* ── Hero header ── */}
      <section className="bg-navy px-4 py-14 text-white">
        <div className="mx-auto max-w-4xl">
          <h1 className="mb-3 text-3xl font-bold">Methodology &amp; Transparency</h1>
          <p className="mb-4 max-w-2xl text-lg text-gray-300">
            Full documentation of our search strategy, screening process, and
            classification protocol &mdash; inspired by PRISMA 2020 and Cochrane
            Living Systematic Review guidelines.
          </p>
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="rounded-lg border border-white/20 bg-white/10 px-4 py-2">
              <span className="font-semibold">{totalPapers.toLocaleString()}</span>{" "}
              records identified
            </div>
            <div className="rounded-lg border border-white/20 bg-white/10 px-4 py-2">
              <span className="font-semibold">{totalClassified.toLocaleString()}</span>{" "}
              AI-classified
            </div>
            <div className="rounded-lg border border-white/20 bg-white/10 px-4 py-2">
              <span className="font-semibold">{classifiedRelevant.toLocaleString()}</span>{" "}
              included as relevant
            </div>
            <div className="rounded-lg border border-white/20 bg-white/10 px-4 py-2">
              <span className="font-semibold">{extractionCount.toLocaleString()}</span>{" "}
              full-text extracted
            </div>
          </div>
        </div>
      </section>

      {/* ── Section navigation ── */}
      <div className="sticky top-[57px] z-40 border-b border-gray-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-4xl gap-1 overflow-x-auto px-4 py-2">
          {sectionNav.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="shrink-0 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600 transition-colors hover:bg-navy/10 hover:text-navy"
            >
              {s.label}
            </a>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-10">
        {/* ════════════════════════════════════════════════════════════════════
           1. SEARCH STRATEGY
           ════════════════════════════════════════════════════════════════════ */}
        <section id="search-strategy" className="mb-14">
          <h2 className="mb-2 text-2xl font-bold text-navy">Search Strategy</h2>
          <p className="mb-6 text-gray-600 leading-relaxed">
            We use a two-pronged search strategy to capture the broadest possible
            set of sports analytics publications: (1) monitoring 23 target
            journals known to publish sports analytics and sports science
            research, and (2) querying 90+ search keywords across all of
            OpenAlex. Both strategies are executed weekly.
          </p>

          {/* ── 1a. Monitored Journals ── */}
          <div className="mb-8">
            <h3 className="mb-3 text-lg font-semibold text-navy">
              Monitored Journals (23)
            </h3>
            <p className="mb-4 text-sm text-gray-500">
              All new publications in these journals are automatically ingested,
              regardless of keywords. ISSNs are verified against OpenAlex source
              records.
            </p>

            {/* Sports Analytics & Performance */}
            <div className="mb-4 rounded-xl border border-gray-200 bg-white shadow-sm">
              <div className="border-b border-gray-100 bg-gray-50 px-4 py-2">
                <h4 className="text-sm font-semibold text-orange">
                  Sports Analytics &amp; Performance (6)
                </h4>
              </div>
              <JournalRow name="Journal of Sports Sciences" category="ISSN 0264-0414" />
              <JournalRow name="International Journal of Sports Physiology and Performance" category="ISSN 1555-0265" />
              <JournalRow name="Journal of Sports Analytics" category="ISSN 2215-020X" />
              <JournalRow name="Journal of Quantitative Analysis in Sports" category="ISSN 1559-0410" />
              <JournalRow name="International Journal of Performance Analysis in Sport" category="ISSN 2474-8668" />
              <JournalRow name="Frontiers in Sports and Active Living" category="ISSN 2624-9367" />
            </div>

            {/* Sports Medicine & Injury */}
            <div className="mb-4 rounded-xl border border-gray-200 bg-white shadow-sm">
              <div className="border-b border-gray-100 bg-gray-50 px-4 py-2">
                <h4 className="text-sm font-semibold text-orange">
                  Sports Medicine &amp; Injury (13)
                </h4>
              </div>
              <JournalRow name="British Journal of Sports Medicine" category="ISSN 0306-3674" />
              <JournalRow name="Medicine and Science in Sports and Exercise" category="ISSN 0195-9131" />
              <JournalRow name="Journal of Science and Medicine in Sport" category="ISSN 1440-2440" />
              <JournalRow name="Sports Medicine" category="ISSN 0112-1642" />
              <JournalRow name="American Journal of Sports Medicine" category="ISSN 0363-5465" />
              <JournalRow name="Journal of Orthopaedic & Sports Physical Therapy" category="ISSN 1076-1608" />
              <JournalRow name="Scandinavian Journal of Medicine & Science in Sports" category="ISSN 0905-7188" />
              <JournalRow name="Clinical Journal of Sport Medicine" category="ISSN 1050-642X" />
              <JournalRow name="Physical Therapy in Sport" category="ISSN 1466-853X" />
              <JournalRow name="Current Sports Medicine Reports" category="ISSN 1537-890X" />
              <JournalRow name="Sports Health" category="ISSN 2332-7863" />
              <JournalRow name="International Journal of Sports Medicine" category="ISSN 1099-1263" />
              <JournalRow name="Injury Prevention" category="ISSN 1468-3849" />
            </div>

            {/* Sport Science & Exercise */}
            <div className="mb-4 rounded-xl border border-gray-200 bg-white shadow-sm">
              <div className="border-b border-gray-100 bg-gray-50 px-4 py-2">
                <h4 className="text-sm font-semibold text-orange">
                  Sport Science &amp; Exercise (2)
                </h4>
              </div>
              <JournalRow name="European Journal of Sport Science" category="ISSN 1746-1391" />
              <JournalRow name="Journal of Athletic Training" category="ISSN 1072-6050" />
            </div>

            {/* Sport Management & Policy */}
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
              <div className="border-b border-gray-100 bg-gray-50 px-4 py-2">
                <h4 className="text-sm font-semibold text-orange">
                  Sport Management &amp; Policy (2)
                </h4>
              </div>
              <JournalRow name="Journal of Sport Management" category="ISSN 0888-4773" />
              <JournalRow name="International Journal of Sport Policy and Politics" category="ISSN 1940-6940" />
            </div>
          </div>

          {/* ── 1b. Search Keywords ── */}
          <div>
            <h3 className="mb-3 text-lg font-semibold text-navy">
              Search Keywords (90+)
            </h3>
            <p className="mb-4 text-sm text-gray-500">
              Each keyword generates a separate OpenAlex query searching across
              title, abstract, and concept fields. Keywords are organized into 7
              categories to ensure comprehensive coverage of the field.
            </p>

            {/* General */}
            <div className="mb-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <h4 className="mb-2 text-sm font-semibold text-orange">
                General (5)
              </h4>
              <div className="flex flex-wrap gap-1.5">
                <KeywordTag>sports analytics</KeywordTag>
                <KeywordTag>sports science</KeywordTag>
                <KeywordTag>athletic performance</KeywordTag>
                <KeywordTag>sport medicine</KeywordTag>
                <KeywordTag>exercise science</KeywordTag>
              </div>
            </div>

            {/* Sport-specific */}
            <div className="mb-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <h4 className="mb-2 text-sm font-semibold text-orange">
                Sport-Specific (15)
              </h4>
              <div className="flex flex-wrap gap-1.5">
                <KeywordTag>football analytics</KeywordTag>
                <KeywordTag>soccer analytics</KeywordTag>
                <KeywordTag>tennis analytics</KeywordTag>
                <KeywordTag>basketball analytics</KeywordTag>
                <KeywordTag>NBA analytics</KeywordTag>
                <KeywordTag>cricket analytics</KeywordTag>
                <KeywordTag>baseball analytics</KeywordTag>
                <KeywordTag>ice hockey analytics</KeywordTag>
                <KeywordTag>cycling analytics</KeywordTag>
                <KeywordTag>speed skating performance</KeywordTag>
                <KeywordTag>esports analytics</KeywordTag>
                <KeywordTag>swimming analytics</KeywordTag>
                <KeywordTag>athletics performance analysis</KeywordTag>
                <KeywordTag>rugby analytics</KeywordTag>
                <KeywordTag>volleyball analytics</KeywordTag>
              </div>
            </div>

            {/* Methodology */}
            <div className="mb-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <h4 className="mb-2 text-sm font-semibold text-orange">
                Methodology (10)
              </h4>
              <div className="flex flex-wrap gap-1.5">
                <KeywordTag>expected goals</KeywordTag>
                <KeywordTag>Elo rating sport</KeywordTag>
                <KeywordTag>player tracking data</KeywordTag>
                <KeywordTag>VAEP football</KeywordTag>
                <KeywordTag>machine learning sport prediction</KeywordTag>
                <KeywordTag>deep learning sport</KeywordTag>
                <KeywordTag>computer vision sport</KeywordTag>
                <KeywordTag>natural language processing sport</KeywordTag>
                <KeywordTag>wearable sensor sport</KeywordTag>
                <KeywordTag>GPS tracking athlete</KeywordTag>
              </div>
            </div>

            {/* Theme */}
            <div className="mb-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <h4 className="mb-2 text-sm font-semibold text-orange">
                Theme (14)
              </h4>
              <div className="flex flex-wrap gap-1.5">
                <KeywordTag>injury prediction sport</KeywordTag>
                <KeywordTag>return to play</KeywordTag>
                <KeywordTag>transfer market football</KeywordTag>
                <KeywordTag>player valuation football</KeywordTag>
                <KeywordTag>betting market sport</KeywordTag>
                <KeywordTag>tactical analysis football</KeywordTag>
                <KeywordTag>match prediction sport</KeywordTag>
                <KeywordTag>talent identification sport</KeywordTag>
                <KeywordTag>player development academy</KeywordTag>
                <KeywordTag>coaching analytics</KeywordTag>
                <KeywordTag>referee decision sport</KeywordTag>
                <KeywordTag>judging bias sport</KeywordTag>
                <KeywordTag>doping detection</KeywordTag>
                <KeywordTag>fan engagement analytics</KeywordTag>
              </div>
            </div>

            {/* Injury & Rehabilitation */}
            <div className="mb-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <h4 className="mb-2 text-sm font-semibold text-orange">
                Injury &amp; Rehabilitation (15)
              </h4>
              <div className="flex flex-wrap gap-1.5">
                <KeywordTag>ACL reconstruction athlete</KeywordTag>
                <KeywordTag>anterior cruciate ligament sport</KeywordTag>
                <KeywordTag>concussion sport</KeywordTag>
                <KeywordTag>sports injury epidemiology</KeywordTag>
                <KeywordTag>hamstring injury football</KeywordTag>
                <KeywordTag>overuse injury athlete</KeywordTag>
                <KeywordTag>stress fracture athlete</KeywordTag>
                <KeywordTag>muscle injury sport</KeywordTag>
                <KeywordTag>rehabilitation athlete return</KeywordTag>
                <KeywordTag>injury prevention program sport</KeywordTag>
                <KeywordTag>sport injury risk factors</KeywordTag>
                <KeywordTag>workload injury athlete</KeywordTag>
                <KeywordTag>training load injury</KeywordTag>
                <KeywordTag>injury surveillance sport</KeywordTag>
                <KeywordTag>time loss injury sport</KeywordTag>
              </div>
            </div>

            {/* Female Athlete */}
            <div className="mb-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <h4 className="mb-2 text-sm font-semibold text-orange">
                Female Athlete &amp; Women&apos;s Sport Medicine (14)
              </h4>
              <div className="flex flex-wrap gap-1.5">
                <KeywordTag>female athlete triad</KeywordTag>
                <KeywordTag>relative energy deficiency sport</KeywordTag>
                <KeywordTag>RED-S athlete</KeywordTag>
                <KeywordTag>ACL injury female athlete</KeywordTag>
                <KeywordTag>sex differences sport injury</KeywordTag>
                <KeywordTag>menstrual cycle athletic performance</KeywordTag>
                <KeywordTag>pregnancy athlete performance</KeywordTag>
                <KeywordTag>female athlete injury risk</KeywordTag>
                <KeywordTag>women sport injury prevention</KeywordTag>
                <KeywordTag>gender differences sport medicine</KeywordTag>
                <KeywordTag>female athlete recovery</KeywordTag>
                <KeywordTag>hormonal contraceptive athlete</KeywordTag>
                <KeywordTag>bone health female athlete</KeywordTag>
                <KeywordTag>eating disorder athlete</KeywordTag>
              </div>
            </div>

            {/* Gender & Women's Sport */}
            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <h4 className="mb-2 text-sm font-semibold text-orange">
                Gender &amp; Women&apos;s Sport (11)
              </h4>
              <div className="flex flex-wrap gap-1.5">
                <KeywordTag>women&apos;s sport</KeywordTag>
                <KeywordTag>female athlete</KeywordTag>
                <KeywordTag>women&apos;s football</KeywordTag>
                <KeywordTag>women&apos;s soccer</KeywordTag>
                <KeywordTag>WNBA</KeywordTag>
                <KeywordTag>WTA tennis</KeywordTag>
                <KeywordTag>women&apos;s cycling</KeywordTag>
                <KeywordTag>gender equity sport</KeywordTag>
                <KeywordTag>female representation sport</KeywordTag>
                <KeywordTag>title IX sport</KeywordTag>
                <KeywordTag>gender pay gap sport</KeywordTag>
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════════
           2. PRISMA-INSPIRED FLOW DIAGRAM
           ════════════════════════════════════════════════════════════════════ */}
        <section id="prisma-flow" className="mb-14">
          <h2 className="mb-2 text-2xl font-bold text-navy">
            PRISMA-Inspired Study Flow
          </h2>
          <p className="mb-6 text-gray-600 leading-relaxed">
            Following the PRISMA 2020 reporting guidelines for systematic
            reviews, this flow diagram documents how records move through our
            identification, screening, and inclusion pipeline. All numbers update
            automatically as new data is processed.
          </p>

          {/* Flow diagram */}
          <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
            {/* Identification */}
            <div className="mb-2 text-center">
              <span className="inline-block rounded-full bg-navy px-4 py-1 text-xs font-semibold uppercase tracking-wider text-white">
                Identification
              </span>
            </div>
            <div className="flex justify-center">
              <FlowBox
                label="Records identified via OpenAlex (23 journals + 90+ keywords)"
                count={totalPapers}
              />
            </div>

            <Arrow label="Abstract retrieval" />

            {/* Screening */}
            <div className="mb-2 text-center">
              <span className="inline-block rounded-full bg-navy px-4 py-1 text-xs font-semibold uppercase tracking-wider text-white">
                Screening
              </span>
            </div>
            <div className="flex justify-center">
              <FlowBox
                label="Records with abstracts available for screening"
                count={papersWithAbstract}
              />
            </div>

            <div className="flex items-start justify-center gap-4">
              {/* Left branch: excluded (no abstract) */}
              <div className="mt-6 hidden w-48 md:block">
                <div className="flex items-center gap-2">
                  <div className="h-0.5 w-8 bg-gray-300" />
                  <FlowBox
                    label="Records without abstract (not yet screened)"
                    count={totalPapers - papersWithAbstract}
                    muted
                  />
                </div>
              </div>

              {/* Center continues */}
              <div className="flex flex-col items-center">
                <Arrow label="AI classification" />
              </div>

              {/* Spacer for right */}
              <div className="hidden w-48 md:block" />
            </div>

            <div className="flex justify-center">
              <FlowBox
                label="Records screened by AI classifier"
                count={totalClassified}
              />
            </div>

            {/* Split into included / excluded */}
            <div className="mt-4 flex flex-col items-center gap-4 md:flex-row md:justify-center md:gap-8">
              {/* Included */}
              <div className="flex flex-col items-center">
                <Arrow />
                <div className="mb-2 text-center">
                  <span className="inline-block rounded-full bg-orange px-4 py-1 text-xs font-semibold uppercase tracking-wider text-white">
                    Included
                  </span>
                </div>
                <FlowBox
                  label="Papers classified as relevant to sports analytics"
                  count={classifiedRelevant}
                  accent
                />
              </div>

              {/* Excluded */}
              <div className="flex flex-col items-center">
                <Arrow />
                <div className="mb-2 text-center">
                  <span className="inline-block rounded-full bg-gray-400 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-white">
                    Excluded
                  </span>
                </div>
                <FlowBox
                  label='Classified as "not applicable" (false positives from keyword search)'
                  count={classifiedNotApplicable}
                  muted
                />
              </div>
            </div>

            {/* Awaiting classification */}
            <div className="mt-8 rounded-lg border border-dashed border-gray-300 bg-gray-50 p-4 text-center text-sm text-gray-500">
              <strong>{(totalPapers - totalClassified).toLocaleString()}</strong>{" "}
              records awaiting classification &mdash;{" "}
              {(((totalPapers - totalClassified) / totalPapers) * 100).toFixed(1)}%
              of total records. Classification is ongoing.
            </div>
          </div>

          {/* PRISMA reference */}
          <p className="mt-3 text-xs text-gray-400">
            Flow diagram adapted from PRISMA 2020 (Page et al., 2021). For full
            PRISMA guidelines, see{" "}
            <a
              href="https://www.prisma-statement.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-navy"
            >
              prisma-statement.org
            </a>
            .
          </p>
        </section>

        {/* ════════════════════════════════════════════════════════════════════
           3. AI CLASSIFICATION PROTOCOL
           ════════════════════════════════════════════════════════════════════ */}
        <section id="classification" className="mb-14">
          <h2 className="mb-2 text-2xl font-bold text-navy">
            AI Classification Protocol
          </h2>
          <p className="mb-6 text-gray-600 leading-relaxed">
            Each paper with an available abstract is classified by an AI model
            into structured categories. The classification schema was designed to
            enable meta-analysis across sports, methodologies, and research
            themes.
          </p>

          {/* Model details */}
          <div className="mb-6 rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-100 bg-gray-50 px-6 py-3">
              <h3 className="font-semibold text-navy">Model Configuration</h3>
            </div>
            <div className="grid gap-4 p-6 md:grid-cols-2">
              <div>
                <div className="text-xs font-medium uppercase tracking-wider text-gray-400">
                  Model
                </div>
                <div className="mt-1 text-sm font-medium text-navy">
                  Claude Haiku 4.5
                </div>
                <div className="text-xs text-gray-500">
                  claude-haiku-4-5-20251001 (Anthropic)
                </div>
              </div>
              <div>
                <div className="text-xs font-medium uppercase tracking-wider text-gray-400">
                  Batch Size
                </div>
                <div className="mt-1 text-sm font-medium text-navy">
                  10 papers per API call
                </div>
                <div className="text-xs text-gray-500">
                  Papers sent together with individual JSON responses
                </div>
              </div>
              <div>
                <div className="text-xs font-medium uppercase tracking-wider text-gray-400">
                  Max Tokens
                </div>
                <div className="mt-1 text-sm font-medium text-navy">
                  4,096 tokens
                </div>
                <div className="text-xs text-gray-500">
                  Sufficient for 10 structured JSON classification objects
                </div>
              </div>
              <div>
                <div className="text-xs font-medium uppercase tracking-wider text-gray-400">
                  Confidence Threshold
                </div>
                <div className="mt-1 text-sm font-medium text-navy">
                  0.3 minimum
                </div>
                <div className="text-xs text-gray-500">
                  Papers below this threshold flagged for manual review
                </div>
              </div>
            </div>
          </div>

          {/* Classification schema */}
          <div className="mb-6 rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-100 bg-gray-50 px-6 py-3">
              <h3 className="font-semibold text-navy">Classification Schema</h3>
            </div>
            <div className="space-y-6 p-6">
              <ClassificationList
                title="Sport (24 options)"
                options={[
                  "football", "american_football", "tennis", "basketball",
                  "baseball", "ice_hockey", "cricket", "cycling",
                  "speed_skating", "athletics", "swimming", "rugby",
                  "volleyball", "handball", "esports", "golf",
                  "boxing_mma", "motorsport", "skiing", "figure_skating",
                  "gymnastics", "diving", "rowing", "other", "multi_sport",
                  "not_applicable",
                ]}
              />
              <ClassificationList
                title="Methodology (14 options)"
                options={[
                  "statistical", "machine_learning", "deep_learning", "NLP",
                  "computer_vision", "simulation", "optimization",
                  "network_analysis", "qualitative", "mixed_methods",
                  "review", "meta_analysis", "descriptive", "other",
                ]}
              />
              <ClassificationList
                title="Theme (18 options)"
                options={[
                  "performance_analysis", "injury_prevention",
                  "tactical_analysis", "betting_markets",
                  "player_development", "player_valuation",
                  "transfer_market", "gender_equity", "bias_detection",
                  "data_engineering", "fan_engagement", "coaching",
                  "nutrition_recovery", "psychology", "biomechanics",
                  "physiology", "methodology", "epidemiology", "other",
                ]}
              />
              <ClassificationList
                title="Data Type (8 options)"
                options={[
                  "event", "tracking", "video", "survey", "text",
                  "physiological", "mixed", "not_specified",
                ]}
              />
            </div>
          </div>

          {/* Additional fields */}
          <div className="mb-6 rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-100 bg-gray-50 px-6 py-3">
              <h3 className="font-semibold text-navy">Additional Classification Fields</h3>
            </div>
            <div className="divide-y divide-gray-100">
              <div className="flex items-start gap-4 px-6 py-4">
                <div className="mt-0.5 rounded bg-navy/10 px-2 py-0.5 text-xs font-mono text-navy">
                  sub_theme
                </div>
                <div className="text-sm text-gray-600">
                  Free-text sub-topic for more specific categorization (e.g.,
                  &quot;ACL reconstruction&quot;, &quot;expected goals&quot;,
                  &quot;draft pick value&quot;, &quot;concussion protocols&quot;).
                </div>
              </div>
              <div className="flex items-start gap-4 px-6 py-4">
                <div className="mt-0.5 rounded bg-navy/10 px-2 py-0.5 text-xs font-mono text-navy">
                  is_womens_sport
                </div>
                <div className="text-sm text-gray-600">
                  Boolean flag indicating whether the study specifically focuses
                  on women&apos;s or girls&apos; sport, female athletes, or gender-specific
                  analysis. Currently{" "}
                  <strong>{stats.womensSportCount.toLocaleString()}</strong>{" "}
                  papers flagged.
                </div>
              </div>
              <div className="flex items-start gap-4 px-6 py-4">
                <div className="mt-0.5 rounded bg-navy/10 px-2 py-0.5 text-xs font-mono text-navy">
                  confidence
                </div>
                <div className="text-sm text-gray-600">
                  Float 0.0&ndash;1.0 indicating the AI&apos;s confidence in its
                  classification. Papers scoring below 0.3 are flagged for manual
                  review. Scale: 0.9&ndash;1.0 (clear), 0.7&ndash;0.9 (mostly clear),
                  0.5&ndash;0.7 (ambiguous), 0.3&ndash;0.5 (uncertain),
                  0.0&ndash;0.3 (guessing).
                </div>
              </div>
              <div className="flex items-start gap-4 px-6 py-4">
                <div className="mt-0.5 rounded bg-navy/10 px-2 py-0.5 text-xs font-mono text-navy">
                  relevance
                </div>
                <div className="text-sm text-gray-600">
                  Three 0&ndash;10 scores rating relevance to: sports analytics,
                  sports medicine, and sports management. Used to identify papers
                  of cross-disciplinary interest.
                </div>
              </div>
              <div className="flex items-start gap-4 px-6 py-4">
                <div className="mt-0.5 rounded bg-navy/10 px-2 py-0.5 text-xs font-mono text-navy">
                  summary
                </div>
                <div className="text-sm text-gray-600">
                  One-sentence AI-generated summary of the key finding or
                  contribution, including sport, method, and main result.
                </div>
              </div>
            </div>
          </div>

          {/* Quality control */}
          <div className="rounded-xl border border-orange/30 bg-orange/5 p-6">
            <h3 className="mb-3 font-semibold text-orange">Quality Control</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="mt-1 text-orange">&#9679;</span>
                <span>
                  <strong>Confidence thresholding</strong>: Papers with
                  confidence below 0.3 are flagged as low-confidence and
                  prioritized for manual review.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 text-orange">&#9679;</span>
                <span>
                  <strong>Batch consistency</strong>: Papers are classified in
                  batches of 10 with a structured JSON schema to ensure
                  consistent output format.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 text-orange">&#9679;</span>
                <span>
                  <strong>Validation dataset</strong>: Jan Van Haaren&apos;s
                  annual soccer analytics reviews (approximately 200 papers/year,
                  2020&ndash;2025) serve as ground truth for evaluating
                  classifier recall on football analytics papers.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 text-orange">&#9679;</span>
                <span>
                  <strong>Manual review (planned)</strong>: A stratified sample
                  of classifications will be manually verified to estimate
                  precision and recall by category.
                </span>
              </li>
            </ul>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════════
           4. FULL-TEXT EXTRACTION PROTOCOL
           ════════════════════════════════════════════════════════════════════ */}
        <section id="extraction" className="mb-14">
          <h2 className="mb-2 text-2xl font-bold text-navy">
            Full-Text Extraction Protocol
          </h2>
          <p className="mb-6 text-gray-600 leading-relaxed">
            For papers where we have the full-text PDF (via our Zotero reference
            library), we run a deep extraction that goes far beyond
            abstract-based classification &mdash; extracting methodology details,
            data sources, code availability, tools, and instruments directly from
            the paper text.
          </p>

          {/* Model config */}
          <div className="mb-6 rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-100 bg-gray-50 px-6 py-3">
              <h3 className="font-semibold text-navy">
                Extraction Model Configuration
              </h3>
            </div>
            <div className="grid gap-4 p-6 md:grid-cols-2">
              <div>
                <div className="text-xs font-medium uppercase tracking-wider text-gray-400">
                  Model
                </div>
                <div className="mt-1 text-sm font-medium text-navy">
                  Claude Haiku 4.5
                </div>
                <div className="text-xs text-gray-500">
                  claude-haiku-4-5-20251001 (Anthropic)
                </div>
              </div>
              <div>
                <div className="text-xs font-medium uppercase tracking-wider text-gray-400">
                  Mode
                </div>
                <div className="mt-1 text-sm font-medium text-navy">
                  Single API call per paper
                </div>
                <div className="text-xs text-gray-500">
                  Methodology + resources extracted together
                </div>
              </div>
              <div>
                <div className="text-xs font-medium uppercase tracking-wider text-gray-400">
                  Cost
                </div>
                <div className="mt-1 text-sm font-medium text-navy">
                  ~$0.25 / million input tokens
                </div>
                <div className="text-xs text-gray-500">
                  $1.25 / million output tokens
                </div>
              </div>
              <div>
                <div className="text-xs font-medium uppercase tracking-wider text-gray-400">
                  Source
                </div>
                <div className="mt-1 text-sm font-medium text-navy">
                  Zotero reference library
                </div>
                <div className="text-xs text-gray-500">
                  3,656+ PDFs matched to OpenAlex records
                </div>
              </div>
            </div>
          </div>

          {/* Extraction Schema Part A: Methodology */}
          <div className="mb-6 rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-100 bg-gray-50 px-6 py-3">
              <h3 className="font-semibold text-navy">
                Extraction Schema &mdash; Part A: Methodology
              </h3>
            </div>
            <div className="divide-y divide-gray-100">
              <div className="flex items-start gap-4 px-6 py-4">
                <div className="mt-0.5 shrink-0 rounded bg-navy/10 px-2 py-0.5 text-xs font-mono text-navy">
                  study_design
                </div>
                <div className="text-sm text-gray-600">
                  Research design type: RCT, observational, cohort, case-control,
                  cross-sectional, meta-analysis, systematic review, etc.
                </div>
              </div>
              <div className="flex items-start gap-4 px-6 py-4">
                <div className="mt-0.5 shrink-0 rounded bg-navy/10 px-2 py-0.5 text-xs font-mono text-navy">
                  sample_size
                </div>
                <div className="text-sm text-gray-600">
                  Total N, size bucket (n_lt_30 to n_gt_10000), unit of analysis,
                  subgroups, and demographics when available.
                </div>
              </div>
              <div className="flex items-start gap-4 px-6 py-4">
                <div className="mt-0.5 shrink-0 rounded bg-navy/10 px-2 py-0.5 text-xs font-mono text-navy">
                  statistical_methods
                </div>
                <div className="text-sm text-gray-600">
                  Primary and all statistical methods used, software packages,
                  significance level, effect sizes, and confidence intervals.
                </div>
              </div>
              <div className="flex items-start gap-4 px-6 py-4">
                <div className="mt-0.5 shrink-0 rounded bg-navy/10 px-2 py-0.5 text-xs font-mono text-navy">
                  key_results
                </div>
                <div className="text-sm text-gray-600">
                  Main finding, primary outcome measure, key statistics (p-values,
                  effect sizes, accuracy metrics).
                </div>
              </div>
              <div className="flex items-start gap-4 px-6 py-4">
                <div className="mt-0.5 shrink-0 rounded bg-navy/10 px-2 py-0.5 text-xs font-mono text-navy">
                  data_characteristics
                </div>
                <div className="text-sm text-gray-600">
                  Data source, collection period, sampling method, competition
                  level (elite/amateur/recreational), sex of participants.
                </div>
              </div>
              <div className="flex items-start gap-4 px-6 py-4">
                <div className="mt-0.5 shrink-0 rounded bg-navy/10 px-2 py-0.5 text-xs font-mono text-navy">
                  methodological_quality
                </div>
                <div className="text-sm text-gray-600">
                  Control group presence, longitudinal design, blinding,
                  validated instruments, quality score indicators.
                </div>
              </div>
              <div className="flex items-start gap-4 px-6 py-4">
                <div className="mt-0.5 shrink-0 rounded bg-navy/10 px-2 py-0.5 text-xs font-mono text-navy">
                  sports_analytics_specifics
                </div>
                <div className="text-sm text-gray-600">
                  Model performance metrics, tracking technology used, match
                  events analyzed, temporal granularity (frame/event/match/season).
                </div>
              </div>
            </div>
          </div>

          {/* Extraction Schema Part B: Resources */}
          <div className="mb-6 rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-100 bg-gray-50 px-6 py-3">
              <h3 className="font-semibold text-navy">
                Extraction Schema &mdash; Part B: Resources &amp; Reproducibility
              </h3>
            </div>
            <div className="divide-y divide-gray-100">
              <div className="flex items-start gap-4 px-6 py-4">
                <div className="mt-0.5 shrink-0 rounded bg-navy/10 px-2 py-0.5 text-xs font-mono text-navy">
                  data_sources
                </div>
                <div className="text-sm text-gray-600">
                  All datasets used: name, URL, type (event/tracking/survey/etc.),
                  access level (open/restricted/commercial), platform, license.
                </div>
              </div>
              <div className="flex items-start gap-4 px-6 py-4">
                <div className="mt-0.5 shrink-0 rounded bg-navy/10 px-2 py-0.5 text-xs font-mono text-navy">
                  code_availability
                </div>
                <div className="text-sm text-gray-600">
                  Availability status, URL, programming language, framework.
                  Tracks whether papers share reproducible code.
                </div>
              </div>
              <div className="flex items-start gap-4 px-6 py-4">
                <div className="mt-0.5 shrink-0 rounded bg-navy/10 px-2 py-0.5 text-xs font-mono text-navy">
                  software_tools
                </div>
                <div className="text-sm text-gray-600">
                  All software packages, libraries, and tools mentioned (e.g.,
                  R, Python, SPSS, scikit-learn, TensorFlow, Stata).
                </div>
              </div>
              <div className="flex items-start gap-4 px-6 py-4">
                <div className="mt-0.5 shrink-0 rounded bg-navy/10 px-2 py-0.5 text-xs font-mono text-navy">
                  instruments
                </div>
                <div className="text-sm text-gray-600">
                  Questionnaires, validated scales, and measurement instruments
                  (e.g., GPS sensors, force plates, accelerometers, RPE scales).
                </div>
              </div>
              <div className="flex items-start gap-4 px-6 py-4">
                <div className="mt-0.5 shrink-0 rounded bg-navy/10 px-2 py-0.5 text-xs font-mono text-navy">
                  data_availability_statement
                </div>
                <div className="text-sm text-gray-600">
                  Statement status, repository, and conditions for data access.
                  Tracks open science practices across the field.
                </div>
              </div>
            </div>
          </div>

          {/* Quality controls */}
          <div className="mb-6 rounded-xl border border-orange/30 bg-orange/5 p-6">
            <h3 className="mb-3 font-semibold text-orange">
              Extraction Quality Controls
            </h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="mt-1 text-orange">&#9679;</span>
                <span>
                  <strong>Zero-hallucination rule</strong>: Every extracted value
                  must be accompanied by a verbatim <code className="text-xs bg-gray-100 px-1 rounded">quote</code> from
                  the paper. Values without supporting text are recorded
                  as <code className="text-xs bg-gray-100 px-1 rounded">not_stated</code> with
                  a null quote.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 text-orange">&#9679;</span>
                <span>
                  <strong>Auto-unwrap nested JSON</strong>: Safety mechanism for
                  AI nesting bugs &mdash; if the model wraps its response in an
                  extra layer, the parser automatically unwraps it.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 text-orange">&#9679;</span>
                <span>
                  <strong>URL validation</strong>: All extracted URLs are checked
                  for validity. Dead links are flagged; junk strings and
                  non-URL content are filtered.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 text-orange">&#9679;</span>
                <span>
                  <strong>Domain-level deduplication</strong>: Multiple URLs from
                  the same domain across papers are merged into a single resource
                  entry. 30+ blocked domains (social media, DOI resolvers,
                  publisher landing pages) are filtered out.
                </span>
              </li>
            </ul>
          </div>

          {/* Progress stats */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="grid gap-6 md:grid-cols-3">
              <div className="text-center">
                <div className="text-2xl font-bold text-navy">
                  {extractionCount.toLocaleString()}
                </div>
                <div className="mt-1 text-sm text-gray-500">
                  papers with full-text extraction
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange">
                  {resourceCount.toLocaleString()}
                </div>
                <div className="mt-1 text-sm text-gray-500">
                  unified resources discovered
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-navy">
                  {resourcesWithPapers.toLocaleString()}
                </div>
                <div className="mt-1 text-sm text-gray-500">
                  resources linked to papers
                </div>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap justify-center gap-3">
              <Link
                href="/explore"
                className="rounded-lg bg-navy/10 px-4 py-2 text-sm font-medium text-navy hover:bg-navy/20 transition-colors"
              >
                Explore Extracted Papers &rarr;
              </Link>
              <Link
                href="/resources"
                className="rounded-lg bg-orange/10 px-4 py-2 text-sm font-medium text-orange hover:bg-orange/20 transition-colors"
              >
                Browse Resource Directory &rarr;
              </Link>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════════
           5. UPDATE PROTOCOL
           ════════════════════════════════════════════════════════════════════ */}
        <section id="update-protocol" className="mb-14">
          <h2 className="mb-2 text-2xl font-bold text-navy">Update Protocol</h2>
          <p className="mb-6 text-gray-600 leading-relaxed">
            As a living review, this platform is designed for continuous updates.
            The pipeline runs in six stages, from paper discovery through
            full-text extraction to automated deployment.
          </p>

          <div className="space-y-4">
            {/* Stage 1: Watch */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-navy text-sm font-bold text-white">
                  1
                </div>
                <div>
                  <h3 className="font-semibold text-navy">
                    Watch &mdash; New Paper Discovery
                  </h3>
                  <div className="mt-2 grid gap-3 text-sm text-gray-600 md:grid-cols-2">
                    <div>
                      <div className="text-xs font-medium uppercase tracking-wider text-gray-400">
                        Data Source
                      </div>
                      <div className="mt-1">
                        <a
                          href="https://openalex.org"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-navy hover:text-orange hover:underline"
                        >
                          OpenAlex API
                        </a>{" "}
                        (polite pool, 10 requests/second)
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-medium uppercase tracking-wider text-gray-400">
                        Update Frequency
                      </div>
                      <div className="mt-1">Weekly automated monitoring</div>
                    </div>
                    <div>
                      <div className="text-xs font-medium uppercase tracking-wider text-gray-400">
                        Coverage
                      </div>
                      <div className="mt-1">
                        23 journals (all new publications) + 90+ keyword queries
                        across all indexed works
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-medium uppercase tracking-wider text-gray-400">
                        Lookback
                      </div>
                      <div className="mt-1">
                        Initial: 12 years (2014&ndash;2026). Incremental:
                        since last sync date.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stage 2: Enrich */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-navy text-sm font-bold text-white">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-navy">
                    Enrich &mdash; Metadata Enhancement
                  </h3>
                  <div className="mt-2 grid gap-3 text-sm text-gray-600 md:grid-cols-2">
                    <div>
                      <div className="text-xs font-medium uppercase tracking-wider text-gray-400">
                        Abstract Sources
                      </div>
                      <div className="mt-1">
                        OpenAlex batch API (primary), CrossRef (fallback),
                        Semantic Scholar (fallback)
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-medium uppercase tracking-wider text-gray-400">
                        Current Coverage
                      </div>
                      <div className="mt-1">
                        {papersWithAbstract.toLocaleString()} of{" "}
                        {totalPapers.toLocaleString()} papers have abstracts (
                        {stats.abstractPercentage}%)
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-medium uppercase tracking-wider text-gray-400">
                        Gender Inference
                      </div>
                      <div className="mt-1">
                        gender-guesser library applied to author first names.
                        Confidence threshold: 0.6 minimum.
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-medium uppercase tracking-wider text-gray-400">
                        Authors Processed
                      </div>
                      <div className="mt-1">
                        {stats.authorsWithGender.toLocaleString()} of{" "}
                        {stats.totalAuthors.toLocaleString()} authors with
                        gender inference ({stats.genderPercentage}%)
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stage 3: Classify */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-navy text-sm font-bold text-white">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-navy">
                    Classify &mdash; AI Paper Classification
                  </h3>
                  <div className="mt-2 grid gap-3 text-sm text-gray-600 md:grid-cols-2">
                    <div>
                      <div className="text-xs font-medium uppercase tracking-wider text-gray-400">
                        Model
                      </div>
                      <div className="mt-1">
                        Claude Haiku 4.5 (Anthropic), 10 papers per batch
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-medium uppercase tracking-wider text-gray-400">
                        Progress
                      </div>
                      <div className="mt-1">
                        {totalClassified.toLocaleString()} classified of{" "}
                        {papersWithAbstract.toLocaleString()} with abstracts (
                        {((totalClassified / papersWithAbstract) * 100).toFixed(1)}%)
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-medium uppercase tracking-wider text-gray-400">
                        Output
                      </div>
                      <div className="mt-1">
                        Sport, methodology, theme, data type, sub-theme,
                        is_womens_sport, confidence, relevance scores, summary
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-medium uppercase tracking-wider text-gray-400">
                        Relevance Rate
                      </div>
                      <div className="mt-1">
                        {classifiedRelevant.toLocaleString()} relevant (
                        {((classifiedRelevant / totalClassified) * 100).toFixed(1)}%),{" "}
                        {classifiedNotApplicable.toLocaleString()} not applicable (
                        {((classifiedNotApplicable / totalClassified) * 100).toFixed(1)}%)
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stage 4: Extract */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-navy text-sm font-bold text-white">
                  4
                </div>
                <div>
                  <h3 className="font-semibold text-navy">
                    Extract &mdash; Full-Text PDF Extraction
                  </h3>
                  <div className="mt-2 grid gap-3 text-sm text-gray-600 md:grid-cols-2">
                    <div>
                      <div className="text-xs font-medium uppercase tracking-wider text-gray-400">
                        Model
                      </div>
                      <div className="mt-1">
                        Claude Haiku 4.5 (Anthropic), 1 paper per call
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-medium uppercase tracking-wider text-gray-400">
                        Source
                      </div>
                      <div className="mt-1">
                        Zotero reference library (3,656+ PDFs matched to
                        OpenAlex records)
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-medium uppercase tracking-wider text-gray-400">
                        Output
                      </div>
                      <div className="mt-1">
                        Per-paper methodology details + data sources, code, tools,
                        and instruments (17 top-level fields)
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-medium uppercase tracking-wider text-gray-400">
                        Progress
                      </div>
                      <div className="mt-1">
                        {extractionCount.toLocaleString()} papers extracted
                        &mdash; extraction is ongoing
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stage 5: Aggregate */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-navy text-sm font-bold text-white">
                  5
                </div>
                <div>
                  <h3 className="font-semibold text-navy">
                    Aggregate &mdash; Resource Directory
                  </h3>
                  <div className="mt-2 grid gap-3 text-sm text-gray-600 md:grid-cols-2">
                    <div>
                      <div className="text-xs font-medium uppercase tracking-wider text-gray-400">
                        Data Sources
                      </div>
                      <div className="mt-1">
                        4 sources merged: curated resources, AI-extracted
                        resources, sport_datasets table, scrapers inventory
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-medium uppercase tracking-wider text-gray-400">
                        Quality Filters
                      </div>
                      <div className="mt-1">
                        URL validation, dead link removal, 30+ blocked domains,
                        domain-level deduplication
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-medium uppercase tracking-wider text-gray-400">
                        Output
                      </div>
                      <div className="mt-1">
                        {resourceCount.toLocaleString()} unified resources,{" "}
                        {resourcesWithPapers.toLocaleString()} with paper citations
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-medium uppercase tracking-wider text-gray-400">
                        Browse
                      </div>
                      <div className="mt-1">
                        <Link
                          href="/resources"
                          className="font-medium text-navy hover:text-orange hover:underline"
                        >
                          Resource Directory
                        </Link>{" "}
                        &mdash; searchable, filterable, with paper links
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stage 6: Publish */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-navy text-sm font-bold text-white">
                  6
                </div>
                <div>
                  <h3 className="font-semibold text-navy">
                    Publish &mdash; Website &amp; Data Export
                  </h3>
                  <div className="mt-2 grid gap-3 text-sm text-gray-600 md:grid-cols-2">
                    <div>
                      <div className="text-xs font-medium uppercase tracking-wider text-gray-400">
                        Website
                      </div>
                      <div className="mt-1">
                        Next.js 15 static export, auto-deployed via Vercel
                        on <code className="text-xs bg-gray-100 px-1 rounded">git push</code>
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-medium uppercase tracking-wider text-gray-400">
                        Data Exports
                      </div>
                      <div className="mt-1">
                        7+ JSON data files including stats, classified papers,
                        methodology extractions, paper resources, and unified
                        resource directory
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-medium uppercase tracking-wider text-gray-400">
                        Pages
                      </div>
                      <div className="mt-1">
                        <Link
                          href="/explore"
                          className="font-medium text-navy hover:text-orange hover:underline"
                        >
                          Explore Papers
                        </Link>
                        ,{" "}
                        <Link
                          href="/resources"
                          className="font-medium text-navy hover:text-orange hover:underline"
                        >
                          Resources
                        </Link>
                        ,{" "}
                        <Link
                          href="/trends"
                          className="font-medium text-navy hover:text-orange hover:underline"
                        >
                          Trends
                        </Link>
                        , and Methodology documentation
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-medium uppercase tracking-wider text-gray-400">
                        Open Data
                      </div>
                      <div className="mt-1">
                        Full classification dataset + extraction data available
                        as JSON; SQLite database for full access
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════════
           6. LIMITATIONS & TRANSPARENCY
           ════════════════════════════════════════════════════════════════════ */}
        <section id="limitations" className="mb-14">
          <h2 className="mb-2 text-2xl font-bold text-navy">
            Limitations &amp; Transparency
          </h2>
          <p className="mb-6 text-gray-600 leading-relaxed">
            We believe in full transparency about what our platform can and
            cannot do. The following limitations should be considered when
            interpreting results.
          </p>

          <div className="space-y-4">
            {/* AI Classification Limitations */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="mb-3 flex items-center gap-2 font-semibold text-navy">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-red-100 text-sm text-red-600">
                  !
                </span>
                AI Classification Limitations
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-gray-400">&bull;</span>
                  <span>
                    <strong>No manual validation yet.</strong> All
                    classifications are AI-generated. A manual validation study
                    is planned but has not yet been conducted. Precision and
                    recall per category are unknown.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-gray-400">&bull;</span>
                  <span>
                    <strong>Abstract-based classification, enhanced by full-text
                    extraction.</strong> The AI classifier reads paper title and
                    abstract. For {extractionCount.toLocaleString()} papers where
                    we have full-text PDFs, a separate deep extraction provides
                    detailed methodology, data sources, and code availability.
                    For the remaining papers, abstract-based classification is
                    the only signal.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-gray-400">&bull;</span>
                  <span>
                    <strong>Full-text extraction is still in progress.</strong>{" "}
                    Deep methodology extraction is available
                    for {extractionCount.toLocaleString()} papers with PDFs.
                    Abstract-based classification covers
                    all {totalClassified.toLocaleString()}+ classified papers but
                    provides less granular detail.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-gray-400">&bull;</span>
                  <span>
                    <strong>Single-label limitation.</strong> Each paper receives
                    one primary sport, methodology, and theme label. Papers that
                    span multiple categories (e.g., football + basketball, or ML
                    + statistical) are assigned to the most prominent one.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-gray-400">&bull;</span>
                  <span>
                    <strong>Confidence varies by category.</strong> Well-defined
                    categories (e.g., football, machine_learning) tend to have
                    higher classification accuracy than ambiguous ones (e.g.,
                    other, mixed_methods).
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-gray-400">&bull;</span>
                  <span>
                    <strong>Model updates may shift distributions.</strong> If
                    the classifier model is updated, category distributions may
                    shift. We document any model changes and re-classify as
                    needed.
                  </span>
                </li>
              </ul>
            </div>

            {/* OpenAlex Coverage */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="mb-3 flex items-center gap-2 font-semibold text-navy">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-100 text-sm text-amber-600">
                  !
                </span>
                OpenAlex Coverage Gaps
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-gray-400">&bull;</span>
                  <span>
                    <strong>Indexing delays.</strong> OpenAlex typically indexes
                    new publications within days to weeks of online publication,
                    but some smaller journals may have longer delays.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-gray-400">&bull;</span>
                  <span>
                    <strong>Conference proceedings.</strong> Sports analytics
                    conferences (MIT Sloan, BARQA, StatsBomb) publish working
                    papers that may not be fully indexed in OpenAlex.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-gray-400">&bull;</span>
                  <span>
                    <strong>Preprints.</strong> While OpenAlex indexes some
                    preprint servers, coverage of arXiv sports analytics
                    preprints and SSRN working papers may be incomplete.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-gray-400">&bull;</span>
                  <span>
                    <strong>Abstract availability.</strong> Approximately{" "}
                    {(100 - stats.abstractPercentage).toFixed(0)}% of identified
                    records lack abstracts in OpenAlex, preventing AI
                    classification.
                  </span>
                </li>
              </ul>
            </div>

            {/* Keyword Search Limitations */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="mb-3 flex items-center gap-2 font-semibold text-navy">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 text-sm text-blue-600">
                  !
                </span>
                Keyword Search Limitations
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-gray-400">&bull;</span>
                  <span>
                    <strong>False positives.</strong> Broad keywords like
                    &quot;sports analytics&quot; or &quot;exercise science&quot;
                    may retrieve papers tangentially related to sport.
                    The AI classifier filters these as &quot;not_applicable&quot;
                    &mdash; currently{" "}
                    {((classifiedNotApplicable / totalClassified) * 100).toFixed(1)}%
                    of classified papers.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-gray-400">&bull;</span>
                  <span>
                    <strong>False negatives.</strong> Papers using novel
                    terminology or studying sports not in our keyword list may be
                    missed. The keyword set is periodically expanded.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-gray-400">&bull;</span>
                  <span>
                    <strong>Language bias.</strong> All search keywords are in
                    English. Research published in other languages (Spanish,
                    Portuguese, German, Chinese) may be underrepresented.
                  </span>
                </li>
              </ul>
            </div>

            {/* Gender Inference Limitations */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="mb-3 flex items-center gap-2 font-semibold text-navy">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-purple-100 text-sm text-purple-600">
                  !
                </span>
                Gender Inference Limitations
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-gray-400">&bull;</span>
                  <span>
                    <strong>Name-based inference is imperfect.</strong> We use
                    the gender-guesser library which infers gender from first
                    names. This approach has known biases: it performs better on
                    Western/European names and poorly on East Asian, South Asian,
                    and African names.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-gray-400">&bull;</span>
                  <span>
                    <strong>Non-binary identities.</strong> The binary
                    male/female classification does not capture non-binary or
                    gender-diverse identities. Results should be interpreted as
                    reflecting societal naming conventions, not self-identified
                    gender.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-gray-400">&bull;</span>
                  <span>
                    <strong>Ambiguous names.</strong> Approximately{" "}
                    {(100 - stats.genderPercentage).toFixed(1)}% of authors have
                    unknown or ambiguous gender inference. These are labeled
                    &quot;unknown&quot; or &quot;andy&quot; (androgynous) in the
                    database.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-gray-400">&bull;</span>
                  <span>
                    <strong>Confidence threshold.</strong> Only inferences with
                    confidence above 0.6 are assigned. Below this threshold,
                    gender is recorded as &quot;unknown&quot;.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* ── Final CTA ── */}
        <section className="rounded-xl bg-navy/5 p-8 text-center">
          <h2 className="mb-3 text-xl font-bold text-navy">
            Questions About Our Methodology?
          </h2>
          <p className="mb-4 text-gray-600">
            This platform is designed for transparency and reproducibility. Our
            code, data, and classification pipeline are open source. If you have
            suggestions for improving our search strategy or classification
            schema, we welcome contributions.
          </p>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="https://github.com/mwolters-cmyk/living-sports-analytics-research"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-lg bg-navy px-6 py-3 font-semibold text-white transition-colors hover:bg-navy/80"
            >
              View on GitHub
            </a>
            <Link
              href="/contribute"
              className="inline-block rounded-lg bg-orange px-6 py-3 font-semibold text-white transition-colors hover:bg-orange-light"
            >
              Contribution Guide
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
