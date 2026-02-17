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
