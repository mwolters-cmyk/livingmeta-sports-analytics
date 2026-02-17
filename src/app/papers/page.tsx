"use client";

import Link from "next/link";
import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import classifiedPapersData from "@/data/classified-papers.json";
import pdfManifest from "../../../public/api/paper-pdfs.json";
import methodologyData from "@/data/methodology-extractions.json";
import paperResourcesData from "@/data/paper-resources.json";
import {
  SPORT_LABELS,
  THEME_LABELS,
  METHODOLOGY_LABELS,
  CONTENT_TYPE_LABELS,
} from "@/lib/db";
import type { ClassifiedPaper } from "@/lib/db";

const allPapers = classifiedPapersData as ClassifiedPaper[];

// Build a Set of work_ids that have full-text PDFs available
const pdfMap = new Map<string, string>();
for (const p of (pdfManifest as { papers: { work_id: string; pdf_url: string }[] }).papers) {
  pdfMap.set(p.work_id, p.pdf_url);
}
const pdfCount = pdfMap.size;

// Methodology extraction data (deep AI analysis from full-text PDFs or abstracts)
interface MethodologyExtraction {
  study_design?: string;
  sample_size?: number | string;
  sample_unit?: string;
  sample_bucket?: string;
  primary_method?: string;
  all_methods?: string[];
  software?: string;
  has_effect_sizes?: boolean;
  has_confidence_intervals?: boolean;
  temporal_scope?: string;
  competition_level?: string;
  sex_of_participants?: string;
  age_range?: string;
  sport_context?: string;
  main_result?: string;
  limitations?: string[];
  future_research?: string[];
  data_availability?: string;
  code_availability?: string;
  extraction_source?: string;
}
const methodExtractions = methodologyData as unknown as Record<string, MethodologyExtraction>;
const methodExtractionCount = Object.keys(methodExtractions).length;

// Paper resource extraction data (data sources, code, tools, instruments)
interface PaperResourceData {
  data_sources?: { name: string; type: string; access: string; url?: string; platform?: string; url_status?: "verified" | "dead" }[];
  code?: { status: string; url?: string; language?: string; framework?: string; url_status?: "verified" | "dead" };
  tools?: { name: string; type: string; url?: string; version?: string }[];
  instruments?: { name: string; type: string; url?: string }[];
  data_availability?: { status: string; contact?: string; url?: string; conditions?: string };
  contact?: { name: string; email: string; institution?: string };
}
const paperResources = paperResourcesData as unknown as Record<string, PaperResourceData>;
const paperResourceCount = Object.keys(paperResources).length;

// Build filter options from actual data
const sports = [...new Set(allPapers.map((p) => p.sport))].sort();
const themes = [...new Set(allPapers.map((p) => p.theme))].sort();
const methodologies = [...new Set(allPapers.map((p) => p.methodology))].sort();
const contentTypes = [...new Set(allPapers.map((p) => p.content_type || "journal_article"))].sort();

// Count non-journal content for header stats
const blogPostCount = allPapers.filter((p) => p.content_type === "blog_post").length;
const thesisCount = allPapers.filter((p) => p.content_type === "thesis").length;
const newsCount = allPapers.filter((p) => p.content_type === "news_article").length;
const conferenceCount = allPapers.filter((p) => p.content_type === "conference_paper").length;
const workingPaperCount = allPapers.filter((p) => p.content_type === "working_paper").length;
const nonJournalCount = blogPostCount + thesisCount + newsCount + conferenceCount + workingPaperCount;

type SortOption = "date" | "citations" | "fwci" | "citations_per_year" | "journal_impact";

const SORT_LABELS: Record<SortOption, string> = {
  date: "Date (newest)",
  citations: "Citations (most)",
  fwci: "FWCI (highest)",
  citations_per_year: "Citations/year",
  journal_impact: "Journal Impact",
};

/** Format FWCI with color coding: >1 is above world average */
function FwciTag({ value }: { value: number | null }) {
  if (value === null || value === undefined) return null;
  const color =
    value >= 2
      ? "bg-emerald-100 text-emerald-800"
      : value >= 1
        ? "bg-blue-100 text-blue-800"
        : "bg-gray-100 text-gray-500";
  return (
    <span className={`rounded px-1.5 py-0.5 text-xs font-medium ${color}`} title="Field-Weighted Citation Impact (1.0 = world average)">
      FWCI {value.toFixed(2)}
    </span>
  );
}

/** Small impact indicator for journal/author */
function ImpactBadge({ label, value, title }: { label: string; value: number | null | undefined; title: string }) {
  if (value === null || value === undefined) return null;
  return (
    <span className="text-xs text-gray-400" title={title}>
      {label}: {typeof value === "number" && value % 1 !== 0 ? value.toFixed(1) : value}
    </span>
  );
}

/** Expandable abstract — shows first 4 lines with "Read full abstract" toggle */
function AbstractToggle({ text, isAiSummary = false }: { text: string; isAiSummary?: boolean }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = text.length > 300;
  return (
    <div className="mt-2">
      <p className={`text-sm ${isAiSummary ? "italic text-gray-500" : "text-gray-600"} ${
        !expanded && isLong ? "line-clamp-4" : ""
      }`}>
        {text}
      </p>
      {isLong && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-0.5 text-xs text-indigo-600 hover:text-indigo-800 cursor-pointer"
        >
          {expanded ? "Show less \u25B2" : "Read full abstract \u25BC"}
        </button>
      )}
    </div>
  );
}

/** Format author name in AP Stylebook style: "De Vries, J." */
function formatAuthorAP(fullName: string): string {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) return parts[0];
  const prefixes = new Set(["de", "van", "von", "el", "al", "del", "da", "di", "le", "la", "dos", "das"]);
  const firstNames: string[] = [];
  let surnameStart = -1;
  for (let i = 0; i < parts.length; i++) {
    if (i === 0) { firstNames.push(parts[i]); continue; }
    if (prefixes.has(parts[i].toLowerCase()) && i < parts.length - 1) {
      surnameStart = i;
      break;
    }
    if (i < parts.length - 1) {
      firstNames.push(parts[i]);
    } else {
      surnameStart = i;
    }
  }
  if (surnameStart === -1) surnameStart = parts.length - 1;
  const surname = parts.slice(surnameStart).join(" ");
  const capSurname = surname.charAt(0).toUpperCase() + surname.slice(1);
  const initials = firstNames.map(n => n.charAt(0).toUpperCase() + ".").join("");
  return initials ? `${capSurname}, ${initials}` : capSurname;
}

// Color maps for badges
const sportColors: Record<string, string> = {
  football: "bg-green-100 text-green-800",
  basketball: "bg-orange-100 text-orange-800",
  tennis: "bg-yellow-100 text-yellow-800",
  baseball: "bg-red-100 text-red-800",
  ice_hockey: "bg-blue-100 text-blue-800",
  athletics: "bg-purple-100 text-purple-800",
  swimming: "bg-cyan-100 text-cyan-800",
  cycling: "bg-lime-100 text-lime-800",
  speed_skating: "bg-sky-100 text-sky-800",
  volleyball: "bg-amber-100 text-amber-800",
  rugby: "bg-emerald-100 text-emerald-800",
  multi_sport: "bg-gray-100 text-gray-700",
};

const themeColors: Record<string, string> = {
  performance_analysis: "bg-blue-100 text-blue-800",
  injury_prevention: "bg-red-100 text-red-800",
  tactical_analysis: "bg-indigo-100 text-indigo-800",
  player_development: "bg-green-100 text-green-800",
  psychology: "bg-violet-100 text-violet-800",
  biomechanics: "bg-teal-100 text-teal-800",
  physiology: "bg-pink-100 text-pink-800",
  methodology: "bg-gray-100 text-gray-700",
  gender_equity: "bg-fuchsia-100 text-fuchsia-800",
  epidemiology: "bg-orange-100 text-orange-800",
};

export default function ExplorePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-500">Loading...</div>}>
      <ExploreContent />
    </Suspense>
  );
}

function ExploreContent() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("search") || "");
  const [sport, setSport] = useState("");
  const [theme, setTheme] = useState("");
  const [methodology, setMethodology] = useState("");
  const [contentType, setContentType] = useState("");
  const [womenOnly, setWomenOnly] = useState(false);
  const [fullTextOnly, setFullTextOnly] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>("date");
  const [page, setPage] = useState(0);
  const limit = 25;

  // Sync with URL search param when navigating from other pages
  useEffect(() => {
    const s = searchParams.get("search");
    if (s && s !== query) setQuery(s);
  }, [searchParams]);

  // Direct paper ID filter (from resources page links)
  const paperId = searchParams.get("paper");

  const filtered = useMemo(() => {
    let results = allPapers;

    // Direct work_id lookup (exact match, takes priority over text search)
    if (paperId) {
      results = results.filter((p) => p.work_id === paperId);
      if (results.length > 0) return results;
      // Fallback: try without openalex prefix
      results = allPapers.filter((p) => p.work_id?.endsWith(paperId));
      if (results.length > 0) return results;
      // Nothing found, fall through to normal search
      results = allPapers;
    }

    if (query) {
      const q = query.toLowerCase();
      results = results.filter(
        (p) =>
          (p.title && p.title.toLowerCase().includes(q)) ||
          (p.abstract && p.abstract.toLowerCase().includes(q)) ||
          (p.ai_summary && p.ai_summary.toLowerCase().includes(q)) ||
          (p.sub_theme && p.sub_theme.toLowerCase().includes(q)) ||
          (p.first_author_name && p.first_author_name.toLowerCase().includes(q)) ||
          (p.primary_topic && p.primary_topic.toLowerCase().includes(q))
      );
    }

    if (sport) {
      results = results.filter((p) => p.sport === sport);
    }

    if (theme) {
      results = results.filter((p) => p.theme === theme);
    }

    if (methodology) {
      results = results.filter((p) => p.methodology === methodology);
    }

    if (contentType) {
      results = results.filter((p) => (p.content_type || "journal_article") === contentType);
    }

    if (womenOnly) {
      results = results.filter((p) => p.is_womens_sport === 1);
    }

    if (fullTextOnly) {
      results = results.filter((p) => pdfMap.has(p.work_id));
    }

    // Sort
    const sorted = [...results];
    switch (sortBy) {
      case "citations":
        sorted.sort((a, b) => (b.cited_by_count ?? 0) - (a.cited_by_count ?? 0));
        break;
      case "fwci":
        sorted.sort((a, b) => (b.fwci ?? -1) - (a.fwci ?? -1));
        break;
      case "citations_per_year":
        sorted.sort((a, b) => (b.citations_per_year ?? -1) - (a.citations_per_year ?? -1));
        break;
      case "journal_impact":
        sorted.sort((a, b) => (b.journal_if_proxy ?? -1) - (a.journal_if_proxy ?? -1));
        break;
      case "date":
      default:
        // Already sorted by date from export
        break;
    }

    return sorted;
  }, [query, paperId, sport, theme, methodology, contentType, womenOnly, fullTextOnly, sortBy]);

  const total = filtered.length;
  const totalPages = Math.ceil(total / limit);
  const papers = filtered.slice(page * limit, (page + 1) * limit);

  const resetFilters = () => {
    setQuery("");
    setSport("");
    setTheme("");
    setMethodology("");
    setContentType("");
    setWomenOnly(false);
    setFullTextOnly(false);
    setSortBy("date");
    setPage(0);
  };

  const activeFilterCount =
    (sport ? 1 : 0) +
    (theme ? 1 : 0) +
    (methodology ? 1 : 0) +
    (contentType ? 1 : 0) +
    (womenOnly ? 1 : 0) +
    (fullTextOnly ? 1 : 0) +
    (query ? 1 : 0) +
    (sortBy !== "date" ? 1 : 0);

  // --- Export helpers ---

  function downloadFile(content: string, filename: string, mimeType: string) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function exportCSV() {
    const headers = [
      "title",
      "first_author",
      "doi",
      "year",
      "journal",
      "journal_if_proxy",
      "sport",
      "theme",
      "methodology",
      "is_womens_sport",
      "data_type",
      "cited_by_count",
      "citations_per_year",
      "fwci",
      "citation_percentile",
      "is_top_10_percent",
      "first_author_h_index",
      "ai_summary",
    ];

    const escapeCSV = (val: string | number | null | undefined): string => {
      if (val === null || val === undefined) return "";
      const s = String(val);
      if (s.includes(",") || s.includes('"') || s.includes("\n")) {
        return `"${s.replace(/"/g, '""')}"`;
      }
      return s;
    };

    const rows = filtered.map((p) =>
      [
        escapeCSV(p.title),
        escapeCSV(p.first_author_name),
        escapeCSV(p.doi),
        escapeCSV(p.pub_year),
        escapeCSV(p.journal),
        escapeCSV(p.journal_if_proxy),
        escapeCSV(p.sport),
        escapeCSV(p.theme),
        escapeCSV(p.methodology),
        escapeCSV(p.is_womens_sport),
        escapeCSV(p.data_type),
        escapeCSV(p.cited_by_count),
        escapeCSV(p.citations_per_year),
        escapeCSV(p.fwci),
        escapeCSV(p.citation_percentile),
        escapeCSV(p.is_top_10_percent),
        escapeCSV(p.first_author_h_index),
        escapeCSV(p.ai_summary),
      ].join(",")
    );

    const csv = [headers.join(","), ...rows].join("\n");
    downloadFile(csv, "sports-analytics-papers.csv", "text/csv;charset=utf-8;");
  }

  function exportBibTeX() {
    const entries = filtered
      .filter((p) => p.doi)
      .map((p) => {
        // Clean work_id to create a valid BibTeX key
        const key = (p.work_id || "unknown")
          .replace("https://openalex.org/", "")
          .replace(/[^a-zA-Z0-9_-]/g, "_");

        // Strip https://doi.org/ prefix if present
        const doi = p.doi!.startsWith("https://doi.org/")
          ? p.doi!.slice("https://doi.org/".length)
          : p.doi!.startsWith("http://doi.org/")
            ? p.doi!.slice("http://doi.org/".length)
            : p.doi!;

        const year = p.pub_year ?? "";
        const title = (p.title || "").replace(/[{}]/g, "");
        const journal = (p.journal || "").replace(/[{}]/g, "");

        return `@article{${key},
  title = {${title}},
  journal = {${journal}},
  year = {${year}},
  doi = {${doi}},
}`;
      });

    const bib = entries.join("\n\n") + "\n";
    downloadFile(bib, "sports-analytics-papers.bib", "application/x-bibtex");
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-2 text-3xl font-bold text-navy">
        Explore
      </h1>
      <p className="mb-6 text-gray-500">
        {(allPapers.length - nonJournalCount).toLocaleString()} papers
        {nonJournalCount > 0 && (
          <> &middot; <span className="text-violet-600">{blogPostCount} blog posts</span>
          {thesisCount > 0 && <> &middot; {thesisCount} theses</>}
          {conferenceCount > 0 && <> &middot; {conferenceCount} conference papers</>}
          {workingPaperCount > 0 && <> &middot; {workingPaperCount} working papers</>}
          {newsCount > 0 && <> &middot; {newsCount} news articles</>}
          </>
        )}
        {" "}&mdash; {pdfCount.toLocaleString()} with full-text PDF &mdash; search by sport, methodology, theme, or keyword
      </p>

      {/* Filters */}
      <div className="mb-6 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="grid gap-3 md:grid-cols-8">
          {/* Text search */}
          <div className="md:col-span-2">
            <input
              type="text"
              placeholder="Search title, abstract, author, or topic..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(0);
              }}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-orange focus:outline-none focus:ring-1 focus:ring-orange"
            />
          </div>

          {/* Sport filter */}
          <select
            value={sport}
            onChange={(e) => {
              setSport(e.target.value);
              setPage(0);
            }}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-orange focus:outline-none"
          >
            <option value="">All sports</option>
            {sports.map((s) => (
              <option key={s} value={s}>
                {SPORT_LABELS[s] || s}
              </option>
            ))}
          </select>

          {/* Theme filter */}
          <select
            value={theme}
            onChange={(e) => {
              setTheme(e.target.value);
              setPage(0);
            }}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-orange focus:outline-none"
          >
            <option value="">All themes</option>
            {themes.map((t) => (
              <option key={t} value={t}>
                {THEME_LABELS[t] || t}
              </option>
            ))}
          </select>

          {/* Methodology filter */}
          <select
            value={methodology}
            onChange={(e) => {
              setMethodology(e.target.value);
              setPage(0);
            }}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-orange focus:outline-none"
          >
            <option value="">All methods</option>
            {methodologies.map((m) => (
              <option key={m} value={m}>
                {METHODOLOGY_LABELS[m] || m}
              </option>
            ))}
          </select>

          {/* Content type filter */}
          <select
            value={contentType}
            onChange={(e) => {
              setContentType(e.target.value);
              setPage(0);
            }}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-orange focus:outline-none"
          >
            <option value="">All types</option>
            {contentTypes.map((ct) => (
              <option key={ct} value={ct}>
                {CONTENT_TYPE_LABELS[ct] || ct}
              </option>
            ))}
          </select>

          {/* Sort by */}
          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value as SortOption);
              setPage(0);
            }}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-orange focus:outline-none"
          >
            {Object.entries(SORT_LABELS).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>

          {/* Toggles */}
          <div className="flex gap-2">
            <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm">
              <input
                type="checkbox"
                checked={womenOnly}
                onChange={(e) => {
                  setWomenOnly(e.target.checked);
                  setPage(0);
                }}
                className="rounded text-orange focus:ring-orange"
              />
              <span>Women&apos;s</span>
            </label>
            <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm" title={`${pdfCount} papers with full-text PDF`}>
              <input
                type="checkbox"
                checked={fullTextOnly}
                onChange={(e) => {
                  setFullTextOnly(e.target.checked);
                  setPage(0);
                }}
                className="rounded text-red-500 focus:ring-red-500"
              />
              <span className="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-3.5 w-3.5 text-red-500">
                  <path d="M3 2a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1H3Zm2.5 4a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1H6a.5.5 0 0 1-.5-.5Zm0 2a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1H6a.5.5 0 0 1-.5-.5Zm0 2a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1H6a.5.5 0 0 1-.5-.5Z" />
                </svg>
                PDF
              </span>
            </label>
          </div>
        </div>

        {/* Active filters + reset */}
        {activeFilterCount > 0 && (
          <div className="mt-3 flex items-center gap-2">
            <span className="text-xs text-gray-400">
              {total.toLocaleString()} results
            </span>
            <button
              onClick={resetFilters}
              className="rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-600 hover:bg-gray-200"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* Results count + export buttons */}
      <div className="mb-4 flex items-center justify-between">
        <div className="text-sm text-gray-500">
          {total > 0 ? (
            <>
              Showing {page * limit + 1}&ndash;
              {Math.min((page + 1) * limit, total)} of{" "}
              {total.toLocaleString()} papers
            </>
          ) : (
            "No papers found matching your filters."
          )}
        </div>
        {total > 0 && (
          <div className="flex gap-2">
            <button
              onClick={exportCSV}
              className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50"
              title="Export filtered results as CSV"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
                <path d="M10.75 2.75a.75.75 0 0 0-1.5 0v8.614L6.295 8.235a.75.75 0 1 0-1.09 1.03l4.25 4.5a.75.75 0 0 0 1.09 0l4.25-4.5a.75.75 0 0 0-1.09-1.03l-2.955 3.129V2.75Z" />
                <path d="M3.5 12.75a.75.75 0 0 0-1.5 0v2.5A2.75 2.75 0 0 0 4.75 18h10.5A2.75 2.75 0 0 0 18 15.25v-2.5a.75.75 0 0 0-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5Z" />
              </svg>
              CSV
            </button>
            <button
              onClick={exportBibTeX}
              className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50"
              title="Export filtered results as BibTeX"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
                <path d="M10.75 2.75a.75.75 0 0 0-1.5 0v8.614L6.295 8.235a.75.75 0 1 0-1.09 1.03l4.25 4.5a.75.75 0 0 0 1.09 0l4.25-4.5a.75.75 0 0 0-1.09-1.03l-2.955 3.129V2.75Z" />
                <path d="M3.5 12.75a.75.75 0 0 0-1.5 0v2.5A2.75 2.75 0 0 0 4.75 18h10.5A2.75 2.75 0 0 0 18 15.25v-2.5a.75.75 0 0 0-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5Z" />
              </svg>
              BibTeX
            </button>
          </div>
        )}
      </div>

      {/* Paper cards */}
      <div className="space-y-3">
        {papers.map((p) => (
          <div
            key={p.work_id}
            className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="flex-1">
              {/* Title */}
              <h3 className="font-semibold text-navy">
                {(() => {
                  // Determine best link: source_url for blogs/grey lit, DOI for papers, OpenAlex as fallback
                  const href = p.source_url
                    ? p.source_url
                    : p.doi
                      ? (p.doi.startsWith("http") ? p.doi : `https://doi.org/${p.doi}`)
                      : p.work_id?.startsWith("https://openalex.org/")
                        ? `https://openalex.org/works/${p.work_id.replace("https://openalex.org/", "")}`
                        : null;

                  return href ? (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-orange hover:underline"
                    >
                      {p.title}
                      <span className="ml-1.5 inline-block align-text-top text-gray-400 transition-colors group-hover:text-orange">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="inline h-3.5 w-3.5">
                          <path fillRule="evenodd" d="M4.22 11.78a.75.75 0 0 1 0-1.06L9.44 5.5H5.75a.75.75 0 0 1 0-1.5h5.5a.75.75 0 0 1 .75.75v5.5a.75.75 0 0 1-1.5 0V6.56l-5.22 5.22a.75.75 0 0 1-1.06 0Z" clipRule="evenodd" />
                        </svg>
                      </span>
                    </a>
                  ) : (
                    p.title
                  );
                })()}
              </h3>

              {/* Metadata row */}
              <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-400">
                {p.first_author_name && (
                  <span className="font-medium text-gray-500">
                    {formatAuthorAP(p.first_author_name)}
                  </span>
                )}
                {p.first_author_name && p.journal && <span className="text-gray-300">&middot;</span>}
                {p.journal && (
                  <span className="rounded bg-gray-100 px-2 py-0.5" title={p.journal}>
                    {p.journal}
                    {p.journal_if_proxy != null && (
                      <span className={`ml-1 rounded px-1 py-0.5 text-xs font-semibold ${
                        p.journal_if_proxy >= 5 ? "bg-emerald-100 text-emerald-700" :
                        p.journal_if_proxy >= 2 ? "bg-blue-100 text-blue-700" :
                        "bg-gray-200 text-gray-500"
                      }`} title={`Journal Impact Factor proxy: ${p.journal_if_proxy.toFixed(1)}`}>
                        IF {p.journal_if_proxy.toFixed(1)}
                      </span>
                    )}
                  </span>
                )}
                {p.pub_date && <span>{p.pub_date}</span>}
                {p.cited_by_count > 0 && (
                  <span className="font-medium text-gray-500" title={p.citations_per_year ? `${p.citations_per_year.toFixed(1)} citations/year` : undefined}>
                    {p.cited_by_count} cited
                    {p.citations_per_year != null && p.citations_per_year > 0 && (
                      <span className="font-normal text-gray-400"> ({p.citations_per_year.toFixed(1)}/yr)</span>
                    )}
                  </span>
                )}
                {p.referenced_works_count != null && p.referenced_works_count > 0 && (
                  <span title={`References ${p.referenced_works_count} works`}>
                    {p.referenced_works_count} refs
                  </span>
                )}
                <FwciTag value={p.fwci ?? null} />
                {p.open_access === 1 && (
                  <span className="rounded bg-green-100 px-2 py-0.5 text-green-700">
                    Open Access
                  </span>
                )}
                {pdfMap.has(p.work_id) && (
                  <a
                    href={pdfMap.get(p.work_id)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 rounded bg-red-50 px-2 py-0.5 text-xs font-medium text-red-700 hover:bg-red-100 transition-colors"
                    title="View full-text PDF"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-3 w-3">
                      <path d="M3 2a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1H3Zm2.5 4a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1H6a.5.5 0 0 1-.5-.5Zm0 2a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1H6a.5.5 0 0 1-.5-.5Zm0 2a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1H6a.5.5 0 0 1-.5-.5Z" />
                    </svg>
                    PDF
                  </a>
                )}
              </div>

              {/* Classification badges */}
              <div className="mt-2 flex flex-wrap gap-1.5">
                {/* Content type badge (only for non-journal content) */}
                {p.content_type && p.content_type !== "journal_article" && (
                  <span className="rounded-full bg-violet-100 px-2.5 py-0.5 text-xs font-medium text-violet-700">
                    {CONTENT_TYPE_LABELS[p.content_type] || p.content_type}
                  </span>
                )}
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    sportColors[p.sport] || "bg-gray-100 text-gray-700"
                  }`}
                >
                  {SPORT_LABELS[p.sport] || p.sport}
                </span>
                {p.theme && (
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      themeColors[p.theme] || "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {THEME_LABELS[p.theme] || p.theme}
                  </span>
                )}
                {p.methodology && (
                  <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700">
                    {METHODOLOGY_LABELS[p.methodology] || p.methodology}
                  </span>
                )}
                {p.is_womens_sport === 1 && (
                  <span className="rounded-full bg-fuchsia-100 px-2.5 py-0.5 text-xs font-medium text-fuchsia-800">
                    Women&apos;s Sport
                  </span>
                )}
                {p.sub_theme && (
                  <span className="rounded-full border border-gray-200 px-2.5 py-0.5 text-xs text-gray-500">
                    {p.sub_theme}
                  </span>
                )}
              </div>

              {/* Abstract (preferred) or AI summary (fallback for older papers) */}
              {p.abstract ? (
                <AbstractToggle text={p.abstract} />
              ) : p.ai_summary ? (
                <AbstractToggle text={p.ai_summary} isAiSummary />
              ) : null}

              {/* Methodology extraction details (from AI analysis) */}
              {methodExtractions[p.work_id] && (() => {
                const m = methodExtractions[p.work_id];
                const sourceLabel = m.extraction_source === 'abstract' ? 'abstract' : 'full text';
                return (
                  <div className="mt-2 rounded-lg border border-indigo-100 bg-indigo-50/50 p-3">
                    <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-indigo-500">
                      Deep methodology extraction (AI from {sourceLabel})
                    </div>
                    <div className="grid gap-x-6 gap-y-1 text-xs text-gray-600 md:grid-cols-2">
                      {m.study_design && (
                        <div><span className="font-medium text-gray-700">Design:</span> {m.study_design}</div>
                      )}
                      {m.sample_size != null && (
                        <div><span className="font-medium text-gray-700">Sample:</span> n={typeof m.sample_size === "number" ? m.sample_size.toLocaleString() : m.sample_size}{m.sample_unit ? ` ${m.sample_unit}` : ""}</div>
                      )}
                      {m.primary_method && (
                        <div><span className="font-medium text-gray-700">Primary method:</span> {m.primary_method}</div>
                      )}
                      {m.temporal_scope && (
                        <div><span className="font-medium text-gray-700">Temporal scope:</span> {m.temporal_scope}</div>
                      )}
                      {m.competition_level && (
                        <div><span className="font-medium text-gray-700">Competition level:</span> {m.competition_level}</div>
                      )}
                      {m.sex_of_participants && (
                        <div><span className="font-medium text-gray-700">Participants:</span> {m.sex_of_participants}</div>
                      )}
                      {m.age_range && (
                        <div><span className="font-medium text-gray-700">Age range:</span> {m.age_range}</div>
                      )}
                      {m.sport_context && (
                        <div><span className="font-medium text-gray-700">Sport context:</span> {m.sport_context}</div>
                      )}
                      {m.data_availability && m.data_availability !== "not_stated" && (
                        <div><span className="font-medium text-gray-700">Data:</span> {m.data_availability}</div>
                      )}
                      {m.code_availability && m.code_availability !== "not_stated" && (
                        <div><span className="font-medium text-gray-700">Code:</span> {m.code_availability}</div>
                      )}
                      {m.main_result && (
                        <div className="col-span-full"><span className="font-medium text-gray-700">Main result:</span> {m.main_result}</div>
                      )}
                      {m.limitations && m.limitations.length > 0 && (
                        <div className="col-span-full"><span className="font-medium text-gray-700">Limitations:</span> {m.limitations.join("; ")}</div>
                      )}
                      {m.future_research && m.future_research.length > 0 && (
                        <div className="col-span-full"><span className="font-medium text-gray-700">Future research:</span> {m.future_research.join("; ")}</div>
                      )}
                    </div>
                    {m.all_methods && m.all_methods.length > 1 && (
                      <div className="mt-1.5 flex flex-wrap gap-1">
                        {m.all_methods.map((method, i) => (
                          <span key={i} className="rounded-full border border-indigo-200 bg-white px-2 py-0.5 text-[10px] text-indigo-700">
                            {method}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="mt-1.5 flex gap-2">
                      {m.has_effect_sizes && (
                        <span className="rounded bg-green-100 px-1.5 py-0.5 text-[10px] font-medium text-green-700">Effect sizes reported</span>
                      )}
                      {m.has_confidence_intervals && (
                        <span className="rounded bg-green-100 px-1.5 py-0.5 text-[10px] font-medium text-green-700">CIs reported</span>
                      )}
                    </div>
                  </div>
                );
              })()}

              {/* Resource extraction details (data sources, code, tools) */}
              {paperResources[p.work_id] && (() => {
                const r = paperResources[p.work_id];
                const resSourceLabel = methodExtractions[p.work_id]?.extraction_source === 'abstract' ? 'abstract' : 'full text';
                return (
                  <div className="mt-2 rounded-lg border border-teal-100 bg-teal-50/50 p-3">
                    <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-teal-600">
                      Data &amp; Code Resources (AI from {resSourceLabel})
                    </div>

                    {/* Data sources — curated resources are clickable, others are plain text */}
                    {r.data_sources && r.data_sources.length > 0 && (
                      <div className="mb-1.5">
                        <span className="text-[10px] font-medium text-gray-500">Data sources: </span>
                        <span className="flex flex-wrap gap-1 mt-0.5">
                          {r.data_sources.map((ds: Record<string, unknown>, i: number) => (
                            <span key={i} className="inline-flex items-center gap-0.5">
                              {ds.is_curated ? (
                                /* Curated resource → clickable link to Resources page */
                                <Link href={`/data?search=${encodeURIComponent(String(ds.curated_name || ds.name))}`}
                                   className="inline-flex items-center gap-0.5 rounded-full border border-teal-200 bg-white px-2 py-0.5 text-[10px] text-teal-800 hover:bg-teal-100 transition-colors">
                                  {String(ds.name)}
                                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12" fill="currentColor" className="h-2.5 w-2.5 opacity-50"><path d="M3.5 3a.5.5 0 0 0 0 1h2.793L2.146 8.146a.5.5 0 1 0 .708.708L7 4.707V7.5a.5.5 0 0 0 1 0V3H3.5z"/></svg>
                                </Link>
                              ) : (
                                /* Not curated → plain text pill, not clickable */
                                <span className="rounded-full border border-gray-200 bg-gray-50 px-2 py-0.5 text-[10px] text-gray-600">
                                  {String(ds.name)}
                                </span>
                              )}
                            </span>
                          ))}
                        </span>
                      </div>
                    )}

                    {/* Code availability */}
                    {r.code && (
                      <div className="mb-1">
                        <span className="text-[10px] font-medium text-gray-500">Code: </span>
                        {r.code.url && r.code.url_status !== "dead" ? (
                          <a href={r.code.url} target="_blank" rel="noopener noreferrer"
                             className="inline-flex items-center gap-1 rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-medium text-emerald-800 hover:bg-emerald-200 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-2.5 w-2.5"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>
                            {r.code.language ? `${r.code.language} repo` : "Code repo"}
                            {r.code.url_status === "verified" && <span className="text-green-600" title="Link verified">&#10003;</span>}
                          </a>
                        ) : (
                          <span className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${
                            r.code.status === "upon_request" ? "bg-amber-100 text-amber-700" :
                            r.code.status === "not_available" ? "bg-red-100 text-red-600" :
                            "bg-gray-100 text-gray-600"
                          }`}>
                            {r.code.status === "upon_request" ? "Upon request" :
                             r.code.status === "not_available" ? "Not available" :
                             r.code.status}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Software tools removed — not useful for users */}

                    {/* Data availability + contact */}
                    {r.data_availability && (
                      <div className="mt-1">
                        {r.data_availability.url ? (
                          <a href={r.data_availability.url} target="_blank" rel="noopener noreferrer"
                             className="inline-flex items-center gap-1 rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-medium text-emerald-800 hover:bg-emerald-200 transition-colors">
                            Data: openly available
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12" fill="currentColor" className="h-2.5 w-2.5 opacity-50"><path d="M3.5 3a.5.5 0 0 0 0 1h2.793L2.146 8.146a.5.5 0 1 0 .708.708L7 4.707V7.5a.5.5 0 0 0 1 0V3H3.5z"/></svg>
                          </a>
                        ) : r.data_availability.status === "upon_request" && r.contact?.email ? (
                          <span className="inline-flex items-center gap-1 rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium text-amber-700">
                            Data upon request: {r.contact.email}
                          </span>
                        ) : r.data_availability.status === "fully_open" ? (
                          <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-medium text-emerald-700">
                            Data: openly available
                          </span>
                        ) : r.data_availability.status !== "not_stated" ? (
                          <span className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${
                            r.data_availability.status === "upon_request" ? "bg-amber-100 text-amber-700" :
                            r.data_availability.status === "restricted" ? "bg-red-100 text-red-600" :
                            "bg-gray-100 text-gray-600"
                          }`}>
                            Data: {r.data_availability.status.replace(/_/g, " ")}
                          </span>
                        ) : null}
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm disabled:opacity-40"
          >
            Previous
          </button>
          <span className="px-4 text-sm text-gray-500">
            Page {page + 1} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}

      {/* Export filtered results */}
      {total > 0 && (
        <div className="mt-8 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-center text-sm font-medium text-navy">
            Export filtered results
          </p>
          <div className="mt-3 flex justify-center gap-3">
            <button
              onClick={exportCSV}
              className="inline-flex items-center gap-2 rounded-lg bg-navy px-4 py-2 text-xs font-medium text-white hover:bg-navy-light"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                <path d="M10.75 2.75a.75.75 0 0 0-1.5 0v8.614L6.295 8.235a.75.75 0 1 0-1.09 1.03l4.25 4.5a.75.75 0 0 0 1.09 0l4.25-4.5a.75.75 0 0 0-1.09-1.03l-2.955 3.129V2.75Z" />
                <path d="M3.5 12.75a.75.75 0 0 0-1.5 0v2.5A2.75 2.75 0 0 0 4.75 18h10.5A2.75 2.75 0 0 0 18 15.25v-2.5a.75.75 0 0 0-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5Z" />
              </svg>
              Export CSV ({total.toLocaleString()} papers)
            </button>
            <button
              onClick={exportBibTeX}
              className="inline-flex items-center gap-2 rounded-lg border border-navy px-4 py-2 text-xs font-medium text-navy hover:bg-navy/5"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                <path d="M10.75 2.75a.75.75 0 0 0-1.5 0v8.614L6.295 8.235a.75.75 0 1 0-1.09 1.03l4.25 4.5a.75.75 0 0 0 1.09 0l4.25-4.5a.75.75 0 0 0-1.09-1.03l-2.955 3.129V2.75Z" />
                <path d="M3.5 12.75a.75.75 0 0 0-1.5 0v2.5A2.75 2.75 0 0 0 4.75 18h10.5A2.75 2.75 0 0 0 18 15.25v-2.5a.75.75 0 0 0-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5Z" />
              </svg>
              Export BibTeX ({total.toLocaleString()} papers)
            </button>
          </div>
        </div>
      )}

      {/* API notice */}
      <div className="mt-4 rounded-xl border border-dashed border-gray-300 bg-gray-50 p-4 text-center text-sm text-gray-500">
        <p>
          Need this data programmatically? Download the full classification
          dataset:
        </p>
        <div className="mt-2 flex justify-center gap-3">
          <a
            href="/api/classifications.json"
            className="rounded-lg bg-navy px-4 py-2 text-xs font-medium text-white hover:bg-navy-light"
          >
            classifications.json
          </a>
          <a
            href="/api/summary.json"
            className="rounded-lg border border-navy px-4 py-2 text-xs font-medium text-navy hover:bg-navy/5"
          >
            summary.json
          </a>
        </div>
      </div>
    </div>
  );
}
