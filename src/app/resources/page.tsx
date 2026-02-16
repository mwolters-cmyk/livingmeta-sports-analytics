"use client";

import Link from "next/link";
import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import unifiedData from "@/data/unified-resources.json";

/* ─── Types ─── */
interface UnifiedResource {
  id: string;
  name: string;
  url: string;
  description: string;
  category: string;
  access: string;
  sports: string[];
  language?: string | null;
  papers: { work_id: string; title: string; sport: string; year: number | null }[];
  paper_count: number;
  on_platform: {
    description?: string;
    record_count?: number;
    datasets?: {
      description: string;
      record_count: number | null;
      gender: string | null;
      date_range: string | null;
    }[];
  } | null;
  scraper: { file: string; status: string } | null;
  access_method: "git_clone" | "kaggle_api" | "direct_download" | null;
  url_status: string | null;
  needs_scraper: boolean;
}

interface UnifiedResourcesData {
  generated_at: string;
  total_resources: number;
  with_papers: number;
  with_scraper: number;
  with_data: number;
  needs_scraper: number;
  with_access_method: number;
  access_methods: Record<string, number>;
  categories: Record<string, number>;
  resources: UnifiedResource[];
}

const data = unifiedData as UnifiedResourcesData;

/* ─── Labels & colors ─── */
const SPORT_LABELS: Record<string, string> = {
  football: "Football",
  american_football: "American Football",
  tennis: "Tennis",
  basketball: "Basketball",
  baseball: "Baseball",
  ice_hockey: "Ice Hockey",
  cricket: "Cricket",
  cycling: "Cycling",
  speed_skating: "Speed Skating",
  athletics: "Athletics",
  swimming: "Swimming",
  rugby: "Rugby",
  volleyball: "Volleyball",
  handball: "Handball",
  esports: "eSports",
  golf: "Golf",
  boxing_mma: "Boxing/MMA",
  motorsport: "Motorsport",
  skiing: "Skiing",
  multi_sport: "Multi-Sport",
  triathlon: "Triathlon",
  figure_skating: "Figure Skating",
  gymnastics: "Gymnastics",
  diving: "Diving",
  ski_jumping: "Ski Jumping",
  artistic_swimming: "Artistic Swimming",
  australian_football: "Australian Football",
};

const SPORT_COLORS: Record<string, string> = {
  football: "bg-green-100 text-green-800",
  american_football: "bg-red-100 text-red-800",
  tennis: "bg-yellow-100 text-yellow-800",
  basketball: "bg-orange-100 text-orange-800",
  baseball: "bg-blue-100 text-blue-800",
  ice_hockey: "bg-cyan-100 text-cyan-800",
  cricket: "bg-lime-100 text-lime-800",
  cycling: "bg-pink-100 text-pink-800",
  speed_skating: "bg-sky-100 text-sky-800",
  athletics: "bg-purple-100 text-purple-800",
  swimming: "bg-teal-100 text-teal-800",
  rugby: "bg-amber-100 text-amber-800",
  volleyball: "bg-indigo-100 text-indigo-800",
  handball: "bg-rose-100 text-rose-800",
  esports: "bg-violet-100 text-violet-800",
  golf: "bg-emerald-100 text-emerald-800",
  boxing_mma: "bg-red-100 text-red-800",
  motorsport: "bg-zinc-200 text-zinc-800",
  skiing: "bg-sky-100 text-sky-800",
  multi_sport: "bg-gray-100 text-gray-800",
  triathlon: "bg-fuchsia-100 text-fuchsia-800",
  figure_skating: "bg-blue-100 text-blue-800",
  gymnastics: "bg-pink-100 text-pink-800",
  diving: "bg-teal-100 text-teal-800",
  ski_jumping: "bg-cyan-100 text-cyan-800",
  artistic_swimming: "bg-violet-100 text-violet-800",
  australian_football: "bg-yellow-100 text-yellow-800",
};

const CATEGORY_LABELS: Record<string, string> = {
  dataset: "Dataset",
  scraper: "Scraper",
  library: "Library",
  api: "API",
  tool: "Tool",
  instrument: "Instrument",
  code: "Code",
};

const CATEGORY_COLORS: Record<string, string> = {
  dataset: "bg-blue-100 text-blue-700",
  scraper: "bg-amber-100 text-amber-700",
  library: "bg-purple-100 text-purple-700",
  api: "bg-red-100 text-red-700",
  tool: "bg-teal-100 text-teal-700",
  instrument: "bg-pink-100 text-pink-700",
  code: "bg-gray-100 text-gray-700",
};

const ACCESS_BADGES: Record<string, { label: string; className: string }> = {
  free: { label: "Free", className: "bg-green-100 text-green-700" },
  freemium: { label: "Freemium", className: "bg-amber-100 text-amber-700" },
  paid: { label: "Paid", className: "bg-red-100 text-red-700" },
};

/* ─── Helper: format number ─── */
function fmtNum(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(n >= 10_000 ? 0 : 1) + "K";
  return n.toLocaleString();
}

/* ─── Compute available sport filters from data ─── */
function getAvailableSports(): string[] {
  const sportCounts = new Map<string, number>();
  for (const r of data.resources) {
    for (const s of r.sports) {
      sportCounts.set(s, (sportCounts.get(s) || 0) + 1);
    }
  }
  return [...sportCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([s]) => s);
}

/* ─── Main page (Suspense wrapper for useSearchParams) ─── */
export default function ResourcesPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-gray-500">Loading...</div>
      }
    >
      <ResourcesContent />
    </Suspense>
  );
}

function ResourcesContent() {
  const searchParams = useSearchParams();

  /* ── State ── */
  const [query, setQuery] = useState(searchParams.get("search") || "");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [sportFilter, setSportFilter] = useState<string>("all");
  const [accessFilter, setAccessFilter] = useState<string>("all");
  const [flagFilter, setFlagFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("relevance");
  const [expandedPapers, setExpandedPapers] = useState<Set<string>>(new Set());
  const [expandedDatasets, setExpandedDatasets] = useState<Set<string>>(
    new Set()
  );

  /* sync URL search param */
  useEffect(() => {
    const s = searchParams.get("search");
    if (s && s !== query) setQuery(s);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const availableSports = useMemo(() => getAvailableSports(), []);

  /* ── Filter + search ── */
  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    let results = data.resources.filter((r) => {
      // Search
      if (q) {
        const inName = r.name.toLowerCase().includes(q);
        const inDesc = r.description.toLowerCase().includes(q);
        const inUrl = r.url.toLowerCase().includes(q);
        const inSport = r.sports.some(
          (s) => (SPORT_LABELS[s] || s).toLowerCase().includes(q)
        );
        if (!inName && !inDesc && !inUrl && !inSport) return false;
      }
      // Category
      if (categoryFilter !== "all" && r.category !== categoryFilter)
        return false;
      // Sport
      if (sportFilter !== "all" && !r.sports.includes(sportFilter))
        return false;
      // Access
      if (accessFilter !== "all" && r.access !== accessFilter) return false;
      // Flags
      if (flagFilter === "has_papers" && r.paper_count === 0) return false;
      if (flagFilter === "has_scraper" && !r.scraper) return false;
      if (flagFilter === "on_platform" && !r.on_platform) return false;
      if (flagFilter === "needs_scraper" && !r.needs_scraper) return false;
      if (flagFilter === "has_access_method" && !r.access_method) return false;
      return true;
    });

    // Sort
    if (sortBy === "papers") {
      results.sort((a, b) => b.paper_count - a.paper_count || a.name.localeCompare(b.name));
    } else if (sortBy === "name") {
      results.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      // relevance: curated first (have description), then paper count
      results.sort(
        (a, b) =>
          (a.description ? 0 : 1) - (b.description ? 0 : 1) ||
          b.paper_count - a.paper_count ||
          a.name.localeCompare(b.name)
      );
    }
    return results;
  }, [query, categoryFilter, sportFilter, accessFilter, flagFilter, sortBy]);

  const togglePapers = (id: string) => {
    setExpandedPapers((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleDatasets = (id: string) => {
    setExpandedDatasets((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  /* ── Counts for filter badges ── */
  const catCounts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const r of data.resources) {
      c[r.category] = (c[r.category] || 0) + 1;
    }
    return c;
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* ── Header ── */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Sports Analytics Resources
          </h1>
          <p className="text-gray-600 max-w-3xl">
            {data.total_resources.toLocaleString()} datasets, APIs, libraries,
            and tools for sports analytics research.{" "}
            <span className="text-blue-600 font-medium">
              {data.with_papers} cited in papers
            </span>
            {data.with_data > 0 && (
              <>
                {" \u00B7 "}
                <span className="text-emerald-600 font-medium">
                  {data.with_data} with data on this platform
                </span>
              </>
            )}
            {data.with_scraper > 0 && (
              <>
                {" \u00B7 "}
                <span className="text-amber-600 font-medium">
                  {data.with_scraper} with scrapers
                </span>
              </>
            )}
            {data.with_access_method > 0 && (
              <>
                {" \u00B7 "}
                <span className="text-purple-600 font-medium">
                  {data.with_access_method} easy access
                </span>
              </>
            )}
          </p>
        </div>

        {/* ── Filters bar ── */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-6 space-y-3">
          {/* Search */}
          <div className="flex flex-wrap gap-3 items-center">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search resources..."
              className="flex-1 min-w-[200px] rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white"
            >
              <option value="relevance">Sort: Relevance</option>
              <option value="papers">Sort: Paper citations</option>
              <option value="name">Sort: Name A-Z</option>
            </select>
          </div>

          {/* Filter row */}
          <div className="flex flex-wrap gap-2 items-center text-sm">
            {/* Category */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-1.5 bg-white"
            >
              <option value="all">All categories</option>
              {Object.entries(catCounts)
                .sort((a, b) => b[1] - a[1])
                .map(([cat, count]) => (
                  <option key={cat} value={cat}>
                    {CATEGORY_LABELS[cat] || cat} ({count})
                  </option>
                ))}
            </select>

            {/* Sport */}
            <select
              value={sportFilter}
              onChange={(e) => setSportFilter(e.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-1.5 bg-white"
            >
              <option value="all">All sports</option>
              {availableSports.map((s) => (
                <option key={s} value={s}>
                  {SPORT_LABELS[s] || s}
                </option>
              ))}
            </select>

            {/* Access */}
            <select
              value={accessFilter}
              onChange={(e) => setAccessFilter(e.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-1.5 bg-white"
            >
              <option value="all">All access</option>
              <option value="free">Free</option>
              <option value="freemium">Freemium</option>
              <option value="paid">Paid</option>
            </select>

            {/* Flags */}
            <select
              value={flagFilter}
              onChange={(e) => setFlagFilter(e.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-1.5 bg-white"
            >
              <option value="all">All resources</option>
              <option value="has_papers">
                Cited in papers ({data.with_papers})
              </option>
              <option value="has_scraper">
                Has scraper ({data.with_scraper})
              </option>
              <option value="on_platform">
                Data on platform ({data.with_data})
              </option>
              <option value="has_access_method">
                📦 Easy access ({data.with_access_method})
              </option>
              <option value="needs_scraper">
                Needs scraper ({data.needs_scraper})
              </option>
            </select>

            {/* Clear */}
            {(query ||
              categoryFilter !== "all" ||
              sportFilter !== "all" ||
              accessFilter !== "all" ||
              flagFilter !== "all") && (
              <button
                onClick={() => {
                  setQuery("");
                  setCategoryFilter("all");
                  setSportFilter("all");
                  setAccessFilter("all");
                  setFlagFilter("all");
                }}
                className="text-xs text-blue-600 hover:text-blue-800 underline ml-2"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        {/* ── Results count ── */}
        <p className="text-sm text-gray-500 mb-4">
          Showing {filtered.length} of {data.total_resources} resources
          {query && (
            <>
              {" "}
              matching &ldquo;<span className="font-medium">{query}</span>
              &rdquo;
            </>
          )}
        </p>

        {/* ── Resource list ── */}
        <div className="space-y-3">
          {filtered.map((r) => (
            <ResourceCard
              key={r.id + r.url}
              resource={r}
              papersExpanded={expandedPapers.has(r.id)}
              datasetsExpanded={expandedDatasets.has(r.id)}
              onTogglePapers={() => togglePapers(r.id)}
              onToggleDatasets={() => toggleDatasets(r.id)}
            />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-gray-500">
            No resources match your filters.
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Resource Card ─── */
function ResourceCard({
  resource: r,
  papersExpanded,
  datasetsExpanded,
  onTogglePapers,
  onToggleDatasets,
}: {
  resource: UnifiedResource;
  papersExpanded: boolean;
  datasetsExpanded: boolean;
  onTogglePapers: () => void;
  onToggleDatasets: () => void;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-4">
      {/* Top row: name + badges */}
      <div className="flex flex-wrap items-start gap-2 mb-2">
        <div className="flex-1 min-w-0">
          <a
            href={r.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-lg font-semibold text-blue-700 hover:text-blue-900 hover:underline"
          >
            {r.name}
            <span className="ml-1 text-xs text-gray-400">{"\u2197"}</span>
          </a>
        </div>

        {/* Badges row */}
        <div className="flex flex-wrap gap-1.5 items-center">
          {/* Category */}
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
              CATEGORY_COLORS[r.category] || "bg-gray-100 text-gray-700"
            }`}
          >
            {CATEGORY_LABELS[r.category] || r.category}
          </span>

          {/* Access */}
          {r.access && ACCESS_BADGES[r.access] && (
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                ACCESS_BADGES[r.access].className
              }`}
            >
              {ACCESS_BADGES[r.access].label}
            </span>
          )}

          {/* On platform */}
          {r.on_platform && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
              {"\u2713"} On platform
              {r.on_platform.record_count
                ? ` (${fmtNum(r.on_platform.record_count)} records)`
                : ""}
            </span>
          )}

          {/* Has scraper */}
          {r.scraper && (
            <a
              href={`https://github.com/mwolters/sports-analytics/blob/main/${r.scraper.file}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                r.scraper.status === "working"
                  ? "bg-amber-100 text-amber-700"
                  : r.scraper.status === "blocked"
                    ? "bg-red-100 text-red-700"
                    : "bg-gray-100 text-gray-700"
              } hover:opacity-80`}
              title={`Scraper: ${r.scraper.file} (${r.scraper.status})`}
            >
              {"\u{1F527}"} Scraper
              {r.scraper.status !== "working" ? ` (${r.scraper.status})` : ""}
            </a>
          )}

          {/* Access method */}
          {r.access_method === "git_clone" && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200">
              📦 Git Clone
            </span>
          )}
          {r.access_method === "kaggle_api" && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-sky-50 text-sky-700 border border-sky-200">
              📊 Kaggle API
            </span>
          )}
          {r.access_method === "direct_download" && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-teal-50 text-teal-700 border border-teal-200">
              ⬇️ Direct Download
            </span>
          )}

          {/* Needs scraper */}
          {r.needs_scraper && !r.scraper && !r.access_method && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-orange-50 text-orange-600 border border-orange-200">
              Needs scraper
            </span>
          )}

          {/* Language */}
          {r.language && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
              {r.language}
            </span>
          )}
        </div>
      </div>

      {/* Description */}
      {r.description && (
        <p className="text-sm text-gray-600 mb-2">{r.description}</p>
      )}

      {/* URL */}
      <p className="text-xs text-gray-400 mb-2 truncate">{r.url}</p>

      {/* Sport tags */}
      {r.sports.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {r.sports.map((s) => (
            <span
              key={s}
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                SPORT_COLORS[s] || "bg-gray-100 text-gray-700"
              }`}
            >
              {SPORT_LABELS[s] || s}
            </span>
          ))}
        </div>
      )}

      {/* On platform details */}
      {r.on_platform && r.on_platform.description && (
        <div className="bg-emerald-50 rounded-lg p-2 mb-2 text-sm text-emerald-800">
          <span className="font-medium">{"\u2713"} On this platform:</span>{" "}
          {r.on_platform.description}
          {r.on_platform.datasets && r.on_platform.datasets.length > 0 && (
            <>
              <button
                onClick={onToggleDatasets}
                className="ml-2 text-emerald-600 hover:text-emerald-800 underline text-xs"
              >
                {datasetsExpanded
                  ? "Hide datasets"
                  : `${r.on_platform.datasets.length} dataset(s)`}
              </button>
              {datasetsExpanded && (
                <ul className="mt-1.5 space-y-1 ml-4">
                  {r.on_platform.datasets.map((ds, i) => (
                    <li key={i} className="text-xs text-emerald-700">
                      {ds.description}
                      {ds.record_count
                        ? ` \u2014 ${fmtNum(ds.record_count)} records`
                        : ""}
                      {ds.gender ? ` (${ds.gender})` : ""}
                      {ds.date_range ? ` [${ds.date_range}]` : ""}
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </div>
      )}

      {/* Papers section */}
      {r.paper_count > 0 && (
        <div className="mt-2">
          <button
            onClick={onTogglePapers}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            {papersExpanded ? "\u25BC" : "\u25B6"}{" "}
            <span className="font-medium">
              {r.paper_count} paper{r.paper_count !== 1 ? "s" : ""}
            </span>{" "}
            cite this resource
          </button>
          {papersExpanded && (
            <ul className="mt-2 space-y-1 ml-4 max-h-60 overflow-y-auto">
              {r.papers.map((p) => (
                <li
                  key={p.work_id}
                  className="text-xs text-gray-600 flex items-start gap-1"
                >
                  <span className="text-gray-400 mt-0.5">{"\u2022"}</span>
                  <span>
                    <Link
                      href={`/explore?search=${encodeURIComponent(p.title)}`}
                      className="text-blue-600 hover:underline"
                    >
                      {p.title}
                    </Link>
                    {p.year && (
                      <span className="text-gray-400 ml-1">({p.year})</span>
                    )}
                    {p.sport && (
                      <span
                        className={`ml-1 px-1.5 py-0.5 rounded text-xs ${
                          SPORT_COLORS[p.sport] || "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {SPORT_LABELS[p.sport] || p.sport}
                      </span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
