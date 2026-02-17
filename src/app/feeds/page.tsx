import Link from "next/link";
import contentSourcesData from "@/data/content-sources.json";
import { SPORT_LABELS } from "@/lib/db";

interface ContentSource {
  id: number;
  name: string;
  platform: string | null;
  url: string;
  feed_url: string | null;
  feed_type: string | null;
  sitemap_url: string | null;
  sport_focus: string | null;
  category: string;
  description: string | null;
  author_name: string | null;
  active: number;
  last_checked: string | null;
  last_new_item: string | null;
  check_frequency: string | null;
  item_count: number;
  latest_item_date: string | null;
  collection_method: string;
}

const allSources = contentSourcesData as ContentSource[];

// Group by collection method
const METHOD_ORDER = ["rss", "sitemap", "thesis_scraper", "ssac_scraper"];

const METHOD_LABELS: Record<string, string> = {
  rss: "RSS & Atom Feeds",
  sitemap: "Sitemap Scrapers",
  thesis_scraper: "University Thesis Repositories",
  ssac_scraper: "Conference Paper Scrapers",
};

const METHOD_DESCRIPTIONS: Record<string, string> = {
  rss:
    "Blogs, newsletters, and academic portals monitored via RSS/Atom feeds. New posts are discovered automatically within hours of publication.",
  sitemap:
    "Sources monitored by parsing their XML sitemap for new pages. Checked periodically for new content.",
  thesis_scraper:
    "Dutch university thesis repositories scraped via OAI-PMH protocol or HTML parsing. Discovers new sports analytics theses and dissertations.",
  ssac_scraper:
    "Conference paper archives scraped for research papers and competition entries.",
};

const METHOD_ICONS: Record<string, React.ReactNode> = {
  rss: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
      <path d="M3.75 3a.75.75 0 0 0-.75.75v.5c0 .414.336.75.75.75H4c6.075 0 11 4.925 11 11v.25c0 .414.336.75.75.75h.5a.75.75 0 0 0 .75-.75V16C17 8.82 11.18 3 4 3h-.25Z" />
      <path d="M3 8.75A.75.75 0 0 1 3.75 8H4a8 8 0 0 1 8 8v.25a.75.75 0 0 1-.75.75h-.5a.75.75 0 0 1-.75-.75V16a6 6 0 0 0-6-6h-.25A.75.75 0 0 1 3 9.25v-.5ZM7 15a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z" />
    </svg>
  ),
  sitemap: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
      <path fillRule="evenodd" d="M4.25 2A2.25 2.25 0 0 0 2 4.25v2.5A2.25 2.25 0 0 0 4.25 9h2.5A2.25 2.25 0 0 0 9 6.75v-2.5A2.25 2.25 0 0 0 6.75 2h-2.5Zm0 9A2.25 2.25 0 0 0 2 13.25v2.5A2.25 2.25 0 0 0 4.25 18h2.5A2.25 2.25 0 0 0 9 15.75v-2.5A2.25 2.25 0 0 0 6.75 11h-2.5Zm9-9A2.25 2.25 0 0 0 11 4.25v2.5A2.25 2.25 0 0 0 13.25 9h2.5A2.25 2.25 0 0 0 18 6.75v-2.5A2.25 2.25 0 0 0 15.75 2h-2.5Zm0 9A2.25 2.25 0 0 0 11 13.25v2.5A2.25 2.25 0 0 0 13.25 18h2.5A2.25 2.25 0 0 0 18 15.75v-2.5A2.25 2.25 0 0 0 15.75 11h-2.5Z" clipRule="evenodd" />
    </svg>
  ),
  thesis_scraper: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
      <path d="M10.75 16.82A7.462 7.462 0 0 1 15 15.5c.71 0 1.396.098 2.046.282A.75.75 0 0 0 18 15.06v-11a.75.75 0 0 0-.546-.721A9.006 9.006 0 0 0 15 3a8.963 8.963 0 0 0-4.25 1.065V16.82ZM9.25 4.065A8.963 8.963 0 0 0 5 3c-.85 0-1.673.118-2.454.339A.75.75 0 0 0 2 4.06v11a.75.75 0 0 0 .954.721A7.506 7.506 0 0 1 5 15.5c1.579 0 3.042.487 4.25 1.32V4.065Z" />
    </svg>
  ),
  ssac_scraper: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
      <path fillRule="evenodd" d="M2 3.5A1.5 1.5 0 0 1 3.5 2h9A1.5 1.5 0 0 1 14 3.5v11.75A2.75 2.75 0 0 0 16.75 18h-12A2.75 2.75 0 0 1 2 15.25V3.5Zm3.75 7a.75.75 0 0 0 0 1.5h4.5a.75.75 0 0 0 0-1.5h-4.5Zm0 3a.75.75 0 0 0 0 1.5h4.5a.75.75 0 0 0 0-1.5h-4.5ZM5 5.75A.75.75 0 0 1 5.75 5h4.5a.75.75 0 0 1 .75.75v2.5a.75.75 0 0 1-.75.75h-4.5A.75.75 0 0 1 5 8.25v-2.5Z" clipRule="evenodd" />
      <path d="M16.5 6.5h-1v8.75a1.25 1.25 0 1 0 2.5 0V8a1.5 1.5 0 0 0-1.5-1.5Z" />
    </svg>
  ),
};

const CATEGORY_BADGES: Record<string, string> = {
  blog: "Blog",
  newsletter: "Newsletter",
  news: "News",
  thesis_portfolio: "Academic",
  working_paper_repo: "Papers",
};

function formatDate(dateStr: string | null): string | null {
  if (!dateStr) return null;
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  } catch {
    return null;
  }
}

export const metadata = {
  title: "Feeds | Living Sports Analytics",
  description:
    "All data feeds powering the platform: OpenAlex academic pipeline, RSS/Atom feeds, thesis repositories, and conference paper scrapers.",
};

export default function FeedsPage() {
  const groupedSources: Record<string, ContentSource[]> = {};
  for (const source of allSources) {
    const method = source.collection_method;
    if (!groupedSources[method]) groupedSources[method] = [];
    groupedSources[method].push(source);
  }

  const totalSources = allSources.length;
  const rssSources = groupedSources["rss"]?.length || 0;
  const scrapedSources = totalSources - rssSources;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-2 text-3xl font-bold text-navy">Feeds</h1>
      <p className="mb-6 text-gray-500">
        All data feeds that power this platform. OpenAlex provides the academic backbone
        ({">"}59K papers from 28 journals + keyword queries). Grey literature comes from{" "}
        {totalSources} curated non-OpenAlex sources ({rssSources} RSS feeds, {scrapedSources} scrapers).
      </p>

      {/* ================================================================== */}
      {/* OPENALEX SECTION */}
      {/* ================================================================== */}
      <section className="mb-10">
        <div className="mb-4 flex items-center gap-2">
          <span className="text-emerald-600">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
              <path d="M10 1a6 6 0 0 0-3.815 10.631C7.237 12.5 8 13.443 8 14.456v.644a.75.75 0 0 0 .75.75h2.5a.75.75 0 0 0 .75-.75v-.644c0-1.013.762-1.957 1.815-2.825A6 6 0 0 0 10 1ZM8.863 17.414a.75.75 0 0 0-.226 1.483 9.066 9.066 0 0 0 2.726 0 .75.75 0 0 0-.226-1.483 7.563 7.563 0 0 1-2.274 0Z" />
            </svg>
          </span>
          <div>
            <h2 className="text-xl font-semibold text-navy">
              OpenAlex Academic Pipeline
            </h2>
            <p className="text-sm text-gray-500">
              Primary source of peer-reviewed publications. Polled weekly via the{" "}
              <a href="https://openalex.org" target="_blank" rel="noopener noreferrer" className="text-orange hover:underline">
                OpenAlex API
              </a>{" "}
              (free, open scholarly catalog). Discovers new papers across 28 target journals
              and ~100 keyword queries spanning 15+ sports.
            </p>
          </div>
        </div>

        {/* OpenAlex query strategy for AI agents */}
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-5">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-emerald-800">
            Query strategy &amp; sweetspot
          </h3>
          <p className="mb-3 text-sm text-gray-700">
            Our queries are tuned for high recall with acceptable precision. False positives are filtered
            downstream by AI classification (Claude Haiku). The strategy has two phases:
          </p>

          <div className="space-y-4">
            {/* Phase 1: Journals */}
            <div className="rounded-lg border border-emerald-100 bg-white p-4">
              <h4 className="mb-1 text-sm font-semibold text-navy">Phase 1: Journal monitoring (28 journals)</h4>
              <p className="mb-2 text-xs text-gray-500">
                Every paper published in these journals is fetched &mdash; no keyword filter needed.
                These are the core sports analytics, sports medicine, sport management, and sport economics journals.
              </p>
              <div className="flex flex-wrap gap-1.5">
                {[
                  "J. Sports Sciences", "J. Sports Analytics", "JQAS",
                  "Int. J. Performance Analysis", "Frontiers Sports & Active Living",
                  "Br. J. Sports Medicine", "Med. Sci. Sports Exercise",
                  "J. Science & Medicine in Sport", "Sports Medicine",
                  "Am. J. Sports Medicine", "Scand. J. Med. Sci. Sports",
                  "Eur. J. Sport Science", "J. Athletic Training",
                  "J. Sport Management", "J. Sports Economics",
                  "Sport Management Review", "Eur. Sport Management Q.",
                  "J. Sport & Exercise Psychology",
                ].map((j) => (
                  <span key={j} className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] text-emerald-800">
                    {j}
                  </span>
                ))}
                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] text-gray-500">
                  +10 more
                </span>
              </div>
              <p className="mt-2 text-xs text-gray-400">
                API filter: <code className="rounded bg-gray-100 px-1 text-[10px]">primary_location.source.issn:&lt;ISSN&gt;,type:article</code>
                &nbsp;&middot; Max 500 results/journal &middot; Sorted by publication_date desc
              </p>
            </div>

            {/* Phase 2: Keywords */}
            <div className="rounded-lg border border-emerald-100 bg-white p-4">
              <h4 className="mb-1 text-sm font-semibold text-navy">Phase 2: Keyword search (~100 queries)</h4>
              <p className="mb-2 text-xs text-gray-500">
                Catches papers in journals outside Phase 1. Keywords are organized in 5 groups,
                each tuned for precision. The search uses OpenAlex full-text search (?search=) combined with
                type:article and is_paratext:false filters.
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-medium text-navy">General (5 queries)</p>
                  <p className="text-[10px] text-gray-500">
                    &ldquo;sports analytics&rdquo;, &ldquo;sports science&rdquo;, &ldquo;athletic performance&rdquo;, &ldquo;sport medicine&rdquo;, &ldquo;exercise science&rdquo;
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-navy">Sport-specific (42 queries)</p>
                  <p className="text-[10px] text-gray-500">
                    &ldquo;football analytics&rdquo;, &ldquo;basketball analytics&rdquo;, &ldquo;tennis analytics&rdquo;, &ldquo;esports analytics&rdquo;, &ldquo;cycling analytics&rdquo;, &ldquo;speed skating performance&rdquo;, &ldquo;darts performance analysis&rdquo; &hellip;
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-navy">Methodology (10 queries)</p>
                  <p className="text-[10px] text-gray-500">
                    &ldquo;expected goals&rdquo;, &ldquo;VAEP football&rdquo;, &ldquo;player tracking data&rdquo;, &ldquo;machine learning sport prediction&rdquo;, &ldquo;GPS tracking athlete&rdquo; &hellip;
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-navy">Themes (25 queries)</p>
                  <p className="text-[10px] text-gray-500">
                    &ldquo;injury prediction sport&rdquo;, &ldquo;transfer market football&rdquo;, &ldquo;talent identification sport&rdquo;, &ldquo;referee decision sport&rdquo;, &ldquo;fan engagement analytics&rdquo; &hellip;
                  </p>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-xs font-medium text-navy">Gender &amp; women&apos;s sport (17 queries)</p>
                  <p className="text-[10px] text-gray-500">
                    &ldquo;women&apos;s sport&rdquo;, &ldquo;female athlete&rdquo;, &ldquo;WNBA&rdquo;, &ldquo;women&apos;s cycling performance&rdquo;, &ldquo;gender equity sport&rdquo;, &ldquo;paralympic athlete performance&rdquo; &hellip;
                  </p>
                </div>
              </div>
              <p className="mt-2 text-xs text-gray-400">
                API filter: <code className="rounded bg-gray-100 px-1 text-[10px]">?search=&lt;keyword&gt;&amp;filter=type:article,is_paratext:false</code>
                &nbsp;&middot; Max 300 results/keyword &middot; Canonical keyword lists in{" "}
                <code className="rounded bg-gray-100 px-1 text-[10px]">living_meta/config.py</code>
              </p>
            </div>

            {/* Reserve keywords */}
            <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
              <h4 className="mb-1 text-sm font-semibold text-gray-600">Reserve keyword groups (not in weekly poll)</h4>
              <p className="mb-2 text-xs text-gray-500">
                Defined in config.py but not yet activated in the watcher. Available for targeted runs or future expansion.
              </p>
              <div className="flex flex-wrap gap-2 text-[10px] text-gray-400">
                <span>Injury &amp; rehabilitation (15)</span>
                <span>&middot;</span>
                <span>Female athlete medicine (14)</span>
                <span>&middot;</span>
                <span>Sports economics (15)</span>
                <span>&middot;</span>
                <span>OR &amp; optimization (11)</span>
                <span>&middot;</span>
                <span>Conference &amp; grey lit (7)</span>
              </div>
            </div>
          </div>

          {/* AI agent sweetspot instruction */}
          <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4">
            <h4 className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-amber-900">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4">
                <path fillRule="evenodd" d="M6.701 2.25c.577-1 2.02-1 2.598 0l5.196 9a1.5 1.5 0 0 1-1.299 2.25H2.804a1.5 1.5 0 0 1-1.3-2.25l5.197-9ZM8 5a.75.75 0 0 1 .75.75v2.5a.75.75 0 0 1-1.5 0v-2.5A.75.75 0 0 1 8 5Zm0 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
              </svg>
              Sweetspot query instruction for AI agents
            </h4>
            <div className="space-y-2 text-xs text-amber-900/80">
              <p>
                <strong>Goal:</strong> High recall (catch all sports analytics papers), acceptable precision
                (false positives are OK &mdash; downstream AI classification filters them out at ~$0.001/paper).
              </p>
              <p>
                <strong>Pattern that works:</strong> Use <code className="rounded bg-amber-100 px-1">&ldquo;&lt;sport&gt; analytics&rdquo;</code> or{" "}
                <code className="rounded bg-amber-100 px-1">&ldquo;&lt;sport&gt; performance analysis&rdquo;</code> as the search query combined with{" "}
                <code className="rounded bg-amber-100 px-1">filter=type:article,is_paratext:false</code>.
                Add the sport name to the query for precision (e.g. &ldquo;cycling analytics&rdquo; not just &ldquo;analytics&rdquo;).
              </p>
              <p>
                <strong>What to avoid:</strong> Generic terms without a sport context (&ldquo;machine learning&rdquo;, &ldquo;prediction&rdquo;, &ldquo;performance&rdquo;)
                produce massive result sets with {">"}95% irrelevant papers. Always anchor to a sport or sports-specific concept.
              </p>
              <p>
                <strong>Bandwidth:</strong> A 10-20% false positive rate is fine. Our classifier catches those. But a query
                returning {">"}50% junk (e.g. &ldquo;data analysis&rdquo;) wastes API budget and should be made more specific.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* AI PIPELINE — Classification, Extraction & Ingestion */}
      {/* ================================================================== */}
      <section className="mb-10">
        <div className="mb-4 flex items-center gap-2">
          <span className="text-indigo-600">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
              <path d="M4.632 3.533A2 2 0 0 1 6.577 2h6.846a2 2 0 0 1 1.945 1.533l1.976 8.234A3.489 3.489 0 0 0 16 11.5H4c-.476 0-.93.095-1.344.267l1.976-8.234Z" />
              <path fillRule="evenodd" d="M4 13a2 2 0 1 0 0 4h12a2 2 0 1 0 0-4H4Zm11.24 2a.75.75 0 0 1 .75-.75H16a.75.75 0 0 1 0 1.5h-.01a.75.75 0 0 1-.75-.75Zm-2.5 0a.75.75 0 0 1 .75-.75H13.5a.75.75 0 0 1 0 1.5h-.01a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" />
            </svg>
          </span>
          <div>
            <h2 className="text-xl font-semibold text-navy">
              AI Pipeline &mdash; Classification &amp; Ingestion
            </h2>
            <p className="text-sm text-gray-500">
              How papers are classified, what gets extracted, and how to contribute new sources.
              Machine-readable version:{" "}
              <a href="/api/pipeline.json" className="font-medium text-indigo-600 hover:underline">
                /api/pipeline.json
              </a>
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-indigo-200 bg-indigo-50/50 p-5">
          {/* Classification Taxonomy */}
          <div className="mb-5">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-indigo-800">
              Classification taxonomy
            </h3>
            <p className="mb-3 text-xs text-gray-600">
              Every paper is classified by Claude Haiku into one sport, one methodology, and one or more themes.
              Papers must score &ge;5 on our 10-point sports analytics relevance scale to appear on the platform.
            </p>

            {/* Sports */}
            <div className="mb-3">
              <p className="mb-1.5 text-xs font-medium text-navy">Sports (33)</p>
              <div className="flex flex-wrap gap-1">
                {[
                  "football", "american_football", "tennis", "basketball", "baseball",
                  "ice_hockey", "cricket", "cycling", "speed_skating", "athletics",
                  "swimming", "rugby", "volleyball", "handball", "esports", "golf",
                  "boxing_mma", "motorsport", "skiing", "figure_skating", "gymnastics",
                  "diving", "rowing", "darts", "snooker", "badminton", "table_tennis",
                  "water_polo", "aussie_rules", "futsal", "floorball", "other", "multi_sport",
                ].map((s) => (
                  <span key={s} className="rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] text-indigo-700">
                    {s.replace(/_/g, " ")}
                  </span>
                ))}
              </div>
            </div>

            {/* Methodologies */}
            <div className="mb-3">
              <p className="mb-1.5 text-xs font-medium text-navy">Methodologies (13)</p>
              <div className="flex flex-wrap gap-1">
                {[
                  "statistical", "machine_learning", "deep_learning", "NLP",
                  "computer_vision", "simulation", "optimization", "network_analysis",
                  "qualitative", "mixed_methods", "review", "meta_analysis", "other",
                ].map((m) => (
                  <span key={m} className="rounded-full bg-violet-100 px-2 py-0.5 text-[10px] text-violet-700">
                    {m.replace(/_/g, " ")}
                  </span>
                ))}
              </div>
            </div>

            {/* Themes */}
            <div>
              <p className="mb-1.5 text-xs font-medium text-navy">Themes (17)</p>
              <div className="flex flex-wrap gap-1">
                {[
                  "performance_analysis", "injury_prevention", "tactical_analysis",
                  "betting_markets", "player_development", "player_valuation",
                  "transfer_market", "gender_equity", "bias_detection",
                  "data_engineering", "fan_engagement", "coaching",
                  "nutrition_recovery", "psychology", "biomechanics", "methodology", "other",
                ].map((t) => (
                  <span key={t} className="rounded-full bg-purple-100 px-2 py-0.5 text-[10px] text-purple-700">
                    {t.replace(/_/g, " ")}
                  </span>
                ))}
              </div>
            </div>

            <p className="mt-2 text-xs text-gray-400">
              Canonical taxonomy:{" "}
              <code className="rounded bg-gray-100 px-1 text-[10px]">SPORT_CATEGORIES</code>,{" "}
              <code className="rounded bg-gray-100 px-1 text-[10px]">METHODOLOGY_CATEGORIES</code>,{" "}
              <code className="rounded bg-gray-100 px-1 text-[10px]">THEME_CATEGORIES</code>{" "}
              in <code className="rounded bg-gray-100 px-1 text-[10px]">living_meta/config.py</code>
            </p>
          </div>

          {/* Extraction Schema */}
          <div className="mb-5 rounded-lg border border-indigo-100 bg-white p-4">
            <h4 className="mb-2 text-sm font-semibold text-navy">Extraction schema</h4>
            <p className="mb-2 text-xs text-gray-500">
              After classification, Claude Haiku extracts structured data from each paper&apos;s PDF or abstract:
            </p>
            <div className="grid gap-2 sm:grid-cols-2">
              <div>
                <p className="text-xs font-medium text-navy">Methodology fields</p>
                <p className="text-[10px] text-gray-500">
                  study_design, sample_size, data_sources, key_techniques, validation_approach, limitations
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-navy">Resource fields</p>
                <p className="text-[10px] text-gray-500">
                  data_sources (name, URL, type, access), instruments, code_availability, data_availability
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-navy">Other fields</p>
                <p className="text-[10px] text-gray-500">
                  future_research (author-identified research directions)
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-navy">Cost</p>
                <p className="text-[10px] text-gray-500">
                  ~$0.04/paper (PDF), ~$0.005/paper (abstract-only)
                </p>
              </div>
            </div>
            <p className="mt-2 text-xs text-gray-400">
              Full prompts:{" "}
              <code className="rounded bg-gray-100 px-1 text-[10px]">SYSTEM_PROMPT</code>,{" "}
              <code className="rounded bg-gray-100 px-1 text-[10px]">ABSTRACT_SYSTEM_PROMPT</code>,{" "}
              <code className="rounded bg-gray-100 px-1 text-[10px]">UNIFIED_NONOA_PROMPT</code>{" "}
              in <code className="rounded bg-gray-100 px-1 text-[10px]">living_meta/paper_extractor.py</code>
            </p>
          </div>

          {/* How to Contribute Sources */}
          <div className="mb-5 rounded-lg border border-indigo-100 bg-white p-4">
            <h4 className="mb-2 text-sm font-semibold text-navy">How to contribute sources</h4>
            <p className="mb-3 text-xs text-gray-500">
              AI agents and human contributors can add new sources via{" "}
              <code className="rounded bg-gray-100 px-1 text-[10px]">scripts/ingest_source.py</code>.
              Clone the{" "}
              <a
                href="https://github.com/mwolters-cmyk/living-sports-analytics-research"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:underline"
              >
                GitHub repo
              </a>{" "}
              and run locally.
            </p>

            <div className="grid gap-3 sm:grid-cols-2">
              {/* Type A */}
              <div className="rounded-lg border border-green-100 bg-green-50/50 p-3">
                <p className="text-xs font-semibold text-green-800">Type A: With abstract</p>
                <p className="mt-1 text-[10px] text-green-700">
                  Free insert &mdash; no API key needed. Suitable for theses, preprints, conference papers with available abstracts.
                </p>
                <div className="mt-2 rounded bg-green-100/50 p-2">
                  <code className="block text-[10px] text-green-900">
                    python scripts/ingest_source.py \<br />
                    &nbsp;&nbsp;--url &quot;https://...&quot; \<br />
                    &nbsp;&nbsp;--type thesis \<br />
                    &nbsp;&nbsp;--title &quot;My Thesis&quot; \<br />
                    &nbsp;&nbsp;--abstract &quot;This thesis...&quot;
                  </code>
                </div>
                <p className="mt-1.5 text-[10px] text-green-600">
                  Valid types: thesis, working_paper, conference_paper
                </p>
              </div>

              {/* Type B */}
              <div className="rounded-lg border border-amber-100 bg-amber-50/50 p-3">
                <p className="text-xs font-semibold text-amber-800">Type B: Without abstract</p>
                <p className="mt-1 text-[10px] text-amber-700">
                  ~$0.03/source &mdash; requires YOUR Anthropic API key. Fetches HTML, runs Claude Haiku for classification + extraction.
                </p>
                <div className="mt-2 rounded bg-amber-100/50 p-2">
                  <code className="block text-[10px] text-amber-900">
                    ANTHROPIC_API_KEY=sk-... \<br />
                    python scripts/ingest_source.py \<br />
                    &nbsp;&nbsp;--url &quot;https://...&quot; \<br />
                    &nbsp;&nbsp;--type blog_post
                  </code>
                </div>
                <p className="mt-1.5 text-[10px] text-amber-600">
                  Valid types: blog_post, news_article, report
                </p>
              </div>
            </div>

            {/* Batch format */}
            <div className="mt-3 rounded-lg border border-gray-100 bg-gray-50 p-3">
              <p className="text-xs font-medium text-gray-700">Batch ingestion (JSONL format)</p>
              <div className="mt-1.5 rounded bg-gray-100/50 p-2">
                <code className="block text-[10px] text-gray-700">
                  {`{"url": "https://...", "type": "blog_post"}`}<br />
                  {`{"url": "https://...", "type": "thesis", "abstract": "...", "title": "..."}`}<br />
                  <br />
                  python scripts/ingest_source.py --batch sources.jsonl
                </code>
              </div>
            </div>

            <p className="mt-3 text-xs text-gray-500">
              <strong>Quality gate:</strong> All sources are classified by AI. Only sources scoring &ge;5 on the
              sports analytics relevance scale appear on the website. Dry run with{" "}
              <code className="rounded bg-gray-100 px-1 text-[10px]">--dry-run</code> to preview without ingesting.
            </p>
          </div>

          {/* API Key Policy */}
          <div className="rounded-lg border border-red-200 bg-red-50 p-4">
            <h4 className="mb-1 flex items-center gap-1.5 text-sm font-semibold text-red-800">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4">
                <path fillRule="evenodd" d="M8 1a3.5 3.5 0 0 0-3.5 3.5V7A1.5 1.5 0 0 0 3 8.5v5A1.5 1.5 0 0 0 4.5 15h7a1.5 1.5 0 0 0 1.5-1.5v-5A1.5 1.5 0 0 0 11.5 7V4.5A3.5 3.5 0 0 0 8 1Zm2 6V4.5a2 2 0 1 0-4 0V7h4Z" clipRule="evenodd" />
              </svg>
              API key policy
            </h4>
            <p className="text-xs text-red-700">
              External contributors (including AI agents) must use their <strong>own</strong>{" "}
              <code className="rounded bg-red-100 px-1 text-[10px]">ANTHROPIC_API_KEY</code>.
              The platform does not provide API keys for third-party use.
              Type A ingestion (with abstract) is free and requires no API key.
              Type B ingestion requires a key for the Claude Haiku call.
            </p>
          </div>

          {/* Build a Scraper */}
          <div className="rounded-lg border border-amber-200 bg-amber-50/50 p-4">
            <h4 className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-amber-900">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4">
                <path fillRule="evenodd" d="M6.955 1.45A.5.5 0 0 1 7.452 1h1.096a.5.5 0 0 1 .497.45l.17 1.699c.484.12.94.312 1.356.562l1.321-.916a.5.5 0 0 1 .67.033l.774.775a.5.5 0 0 1 .034.67l-.916 1.32c.25.417.443.873.563 1.357l1.699.17a.5.5 0 0 1 .45.497v1.096a.5.5 0 0 1-.45.497l-1.699.17c-.12.484-.312.94-.562 1.356l.916 1.321a.5.5 0 0 1-.034.67l-.774.774a.5.5 0 0 1-.67.033l-1.32-.916c-.417.25-.874.443-1.357.563l-.17 1.699a.5.5 0 0 1-.497.45H7.452a.5.5 0 0 1-.497-.45l-.17-1.699a4.973 4.973 0 0 1-1.356-.562l-1.321.916a.5.5 0 0 1-.67-.034l-.774-.774a.5.5 0 0 1-.034-.67l.916-1.32a4.971 4.971 0 0 1-.562-1.357l-1.699-.17A.5.5 0 0 1 1 8.548V7.452a.5.5 0 0 1 .45-.497l1.699-.17c.12-.484.312-.94.562-1.356l-.916-1.321a.5.5 0 0 1 .033-.67l.775-.774a.5.5 0 0 1 .67-.033l1.32.916c.417-.25.874-.443 1.357-.563l.17-1.699ZM8 10.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" clipRule="evenodd" />
              </svg>
              Build a scraper
            </h4>
            <p className="mb-3 text-xs text-amber-800">
              Many sports data sources lack programmatic access. AI agents can contribute scrapers via pull request.
              Check{" "}
              <a href="/api/pipeline.json" className="font-medium text-amber-700 underline hover:text-amber-900">
                /api/pipeline.json
              </a>{" "}
              for the full <code className="rounded bg-amber-100 px-1 text-[10px]">scraper_contribution</code> spec
              and the dynamic <code className="rounded bg-amber-100 px-1 text-[10px]">needs_scraper</code> list
              (sorted by research impact).
            </p>

            {/* Scraper contract */}
            <div className="mb-3 rounded-lg border border-amber-100 bg-white/60 p-3">
              <p className="mb-1.5 text-xs font-medium text-amber-900">Scraper contract</p>
              <div className="grid grid-cols-1 gap-1.5 text-[11px] text-amber-800 sm:grid-cols-2">
                <div className="flex items-start gap-1.5">
                  <span className="mt-0.5 text-amber-500">&#x2713;</span>
                  <span>Use <code className="rounded bg-amber-50 px-0.5">RateLimitedSession</code> from <code className="rounded bg-amber-50 px-0.5">scrapers/base.py</code> (delay &ge; 1s)</span>
                </div>
                <div className="flex items-start gap-1.5">
                  <span className="mt-0.5 text-amber-500">&#x2713;</span>
                  <span>Output CSV via <code className="rounded bg-amber-50 px-0.5">save_to_csv()</code> to <code className="rounded bg-amber-50 px-0.5">DATA_DIR</code></span>
                </div>
                <div className="flex items-start gap-1.5">
                  <span className="mt-0.5 text-amber-500">&#x2713;</span>
                  <span>Module docstring with <code className="rounded bg-amber-50 px-0.5">DATASOURCES</code>, <code className="rounded bg-amber-50 px-0.5">PARAMETERS</code>, ethics note</span>
                </div>
                <div className="flex items-start gap-1.5">
                  <span className="mt-0.5 text-amber-500">&#x2713;</span>
                  <span>File naming: <code className="rounded bg-amber-50 px-0.5">scrapers/scrape_&lt;source&gt;.py</code></span>
                </div>
                <div className="flex items-start gap-1.5">
                  <span className="mt-0.5 text-amber-500">&#x2713;</span>
                  <span>All file I/O with <code className="rounded bg-amber-50 px-0.5">encoding=&apos;utf-8&apos;</code></span>
                </div>
                <div className="flex items-start gap-1.5">
                  <span className="mt-0.5 text-red-500">&#x2717;</span>
                  <span>No <code className="rounded bg-red-50 px-0.5">subprocess</code>, <code className="rounded bg-red-50 px-0.5">eval()</code>, <code className="rounded bg-red-50 px-0.5">exec()</code>, or hardcoded secrets</span>
                </div>
              </div>
            </div>

            {/* Template preview */}
            <div className="mb-3 rounded-lg border border-amber-100 bg-gray-50 p-3">
              <p className="mb-1.5 text-xs font-medium text-amber-900">Template (minimal)</p>
              <div className="rounded bg-gray-100/50 p-2">
                <code className="block whitespace-pre text-[10px] leading-relaxed text-gray-700">{`"""
Scrape <Source Name> — <sport> data
DATASOURCES: <source_url>
PARAMETERS: season (int)
Ethics: Respects robots.txt, 1 req/s
"""
from scrapers.base import (
    RateLimitedSession, save_to_csv, DATA_DIR
)

def scrape(season: int = 2024):
    session = RateLimitedSession(delay=1.0)
    rows = []
    # ... your scraping logic ...
    save_to_csv(rows, DATA_DIR / "source.csv")

if __name__ == "__main__":
    scrape()`}</code>
              </div>
            </div>

            {/* PR workflow */}
            <div className="rounded-lg border border-amber-100 bg-white/60 p-3">
              <p className="mb-1.5 text-xs font-medium text-amber-900">PR workflow</p>
              <ol className="ml-4 list-decimal space-y-1 text-[11px] text-amber-800">
                <li>Fork <a href="https://github.com/mwolters-cmyk/living-sports-analytics-research" className="font-medium text-amber-700 underline hover:text-amber-900" target="_blank" rel="noopener noreferrer">the repo</a></li>
                <li>Add your scraper in <code className="rounded bg-amber-50 px-0.5">scrapers/scrape_&lt;name&gt;.py</code></li>
                <li>Register in <code className="rounded bg-amber-50 px-0.5">SCRAPER_SOURCE_MAP</code> (in <code className="rounded bg-amber-50 px-0.5">export_unified_resources.py</code>)</li>
                <li>Open a PR &mdash; automated checks verify the contract, a maintainer reviews</li>
              </ol>
              <p className="mt-2 text-[10px] text-amber-600">
                See the full checklist and template at{" "}
                <a href="/api/pipeline.json" className="font-medium underline hover:text-amber-800">/api/pipeline.json</a>
                {" "}&rarr; <code className="rounded bg-amber-50 px-0.5">scraper_contribution</code>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* NON-OPENALEX SOURCES */}
      {/* ================================================================== */}

      {/* RSS subscription box */}
      <div className="mb-8 rounded-xl border border-orange/20 bg-orange/5 p-4">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex-shrink-0 text-orange">{METHOD_ICONS.rss}</span>
          <div>
            <p className="font-medium text-navy">Subscribe to our combined feed</p>
            <p className="mt-1 text-sm text-gray-600">
              All new publications from OpenAlex + these sources in one RSS feed:{" "}
              <a href="/feed.xml" className="font-medium text-orange hover:underline">
                /feed.xml
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Source groups by collection method */}
      <div className="space-y-10">
        {METHOD_ORDER.map((method) => {
          const sources = groupedSources[method];
          if (!sources || sources.length === 0) return null;

          return (
            <section key={method}>
              <div className="mb-4 flex items-center gap-2">
                <span className={
                  method === "rss" ? "text-orange" :
                  method === "thesis_scraper" ? "text-blue-500" :
                  method === "ssac_scraper" ? "text-purple-500" :
                  "text-navy/50"
                }>
                  {METHOD_ICONS[method]}
                </span>
                <div>
                  <h2 className="text-xl font-semibold text-navy">
                    {METHOD_LABELS[method]} ({sources.length})
                  </h2>
                  <p className="text-sm text-gray-500">
                    {METHOD_DESCRIPTIONS[method]}
                  </p>
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                {sources.map((source) => (
                  <div
                    key={source.id}
                    className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h3 className="font-semibold text-navy">
                          <a
                            href={source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-orange hover:underline"
                          >
                            {source.name}
                            <span className="ml-1 inline-block text-gray-400">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="inline h-3 w-3">
                                <path fillRule="evenodd" d="M4.22 11.78a.75.75 0 0 1 0-1.06L9.44 5.5H5.75a.75.75 0 0 1 0-1.5h5.5a.75.75 0 0 1 .75.75v5.5a.75.75 0 0 1-1.5 0V6.56l-5.22 5.22a.75.75 0 0 1-1.06 0Z" clipRule="evenodd" />
                              </svg>
                            </span>
                          </a>
                        </h3>
                        {source.author_name && (
                          <p className="text-sm text-gray-500">by {source.author_name}</p>
                        )}
                      </div>
                      <div className="flex flex-shrink-0 gap-1.5">
                        {CATEGORY_BADGES[source.category] && (
                          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                            {CATEGORY_BADGES[source.category]}
                          </span>
                        )}
                        {source.sport_focus && (
                          <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
                            {SPORT_LABELS[source.sport_focus] || source.sport_focus}
                          </span>
                        )}
                      </div>
                    </div>

                    {source.description && (
                      <p className="mt-2 line-clamp-2 text-sm text-gray-600">
                        {source.description}
                      </p>
                    )}

                    <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-400">
                      {source.item_count > 0 && (
                        <span className="font-medium text-gray-500">
                          {source.item_count} {source.item_count === 1 ? "item" : "items"} collected
                        </span>
                      )}
                      {source.latest_item_date && (
                        <span>Latest: {formatDate(source.latest_item_date)}</span>
                      )}
                      {source.feed_url && source.feed_type && (
                        <span className="capitalize">{source.feed_type}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      {/* Suggest a source */}
      <div className="mt-12 rounded-xl border border-dashed border-gray-300 bg-gray-50 p-6 text-center">
        <h3 className="font-semibold text-navy">Know a sports analytics blog or resource we should track?</h3>
        <p className="mt-2 text-sm text-gray-500">
          We&apos;re always looking for high-quality sources. Suggest a blog, newsletter, or thesis repository on our{" "}
          <Link href="/contribute" className="text-orange hover:underline">
            contribute page
          </Link>{" "}
          or open an issue on{" "}
          <a
            href="https://github.com/mwolters-cmyk/living-sports-analytics-research/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange hover:underline"
          >
            GitHub
          </a>
          .
        </p>
      </div>
    </div>
  );
}
