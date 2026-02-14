"use client";

import { useState, useMemo } from "react";
import classifiedPapersData from "@/data/classified-papers.json";
import {
  SPORT_LABELS,
  THEME_LABELS,
  METHODOLOGY_LABELS,
} from "@/lib/db";
import type { ClassifiedPaper } from "@/lib/db";

const allPapers = classifiedPapersData as ClassifiedPaper[];

// Build filter options from actual data
const sports = [...new Set(allPapers.map((p) => p.sport))].sort();
const themes = [...new Set(allPapers.map((p) => p.theme))].sort();
const methodologies = [...new Set(allPapers.map((p) => p.methodology))].sort();

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
  const [query, setQuery] = useState("");
  const [sport, setSport] = useState("");
  const [theme, setTheme] = useState("");
  const [methodology, setMethodology] = useState("");
  const [womenOnly, setWomenOnly] = useState(false);
  const [page, setPage] = useState(0);
  const limit = 25;

  const filtered = useMemo(() => {
    let results = allPapers;

    if (query) {
      const q = query.toLowerCase();
      results = results.filter(
        (p) =>
          (p.title && p.title.toLowerCase().includes(q)) ||
          (p.abstract && p.abstract.toLowerCase().includes(q)) ||
          (p.ai_summary && p.ai_summary.toLowerCase().includes(q)) ||
          (p.sub_theme && p.sub_theme.toLowerCase().includes(q))
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

    if (womenOnly) {
      results = results.filter((p) => p.is_womens_sport === 1);
    }

    return results;
  }, [query, sport, theme, methodology, womenOnly]);

  const total = filtered.length;
  const totalPages = Math.ceil(total / limit);
  const papers = filtered.slice(page * limit, (page + 1) * limit);

  const resetFilters = () => {
    setQuery("");
    setSport("");
    setTheme("");
    setMethodology("");
    setWomenOnly(false);
    setPage(0);
  };

  const activeFilterCount =
    (sport ? 1 : 0) +
    (theme ? 1 : 0) +
    (methodology ? 1 : 0) +
    (womenOnly ? 1 : 0) +
    (query ? 1 : 0);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-2 text-3xl font-bold text-navy">
        Explore Classified Papers
      </h1>
      <p className="mb-6 text-gray-500">
        {allPapers.length.toLocaleString()} AI-classified sports analytics
        papers &mdash; search by sport, methodology, theme, or keyword
      </p>

      {/* Filters */}
      <div className="mb-6 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="grid gap-3 md:grid-cols-6">
          {/* Text search */}
          <div className="md:col-span-2">
            <input
              type="text"
              placeholder="Search title, abstract, or AI summary..."
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

          {/* Women's sport toggle */}
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
            <span>Women&apos;s sport</span>
          </label>
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

      {/* Results count */}
      <div className="mb-4 text-sm text-gray-500">
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
                {p.doi ? (
                  <a
                    href={`https://doi.org/${p.doi}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-orange hover:underline"
                  >
                    {p.title}
                  </a>
                ) : (
                  p.title
                )}
              </h3>

              {/* Metadata row */}
              <div className="mt-1 flex flex-wrap gap-2 text-xs text-gray-400">
                {p.journal && (
                  <span className="rounded bg-gray-100 px-2 py-0.5">
                    {p.journal}
                  </span>
                )}
                {p.pub_date && <span>{p.pub_date}</span>}
                {p.cited_by_count > 0 && (
                  <span>{p.cited_by_count} citations</span>
                )}
                {p.open_access === 1 && (
                  <span className="rounded bg-green-100 px-2 py-0.5 text-green-700">
                    Open Access
                  </span>
                )}
              </div>

              {/* Classification badges */}
              <div className="mt-2 flex flex-wrap gap-1.5">
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    sportColors[p.sport] || "bg-gray-100 text-gray-700"
                  }`}
                >
                  {SPORT_LABELS[p.sport] || p.sport}
                </span>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    themeColors[p.theme] || "bg-gray-100 text-gray-700"
                  }`}
                >
                  {THEME_LABELS[p.theme] || p.theme}
                </span>
                <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700">
                  {METHODOLOGY_LABELS[p.methodology] || p.methodology}
                </span>
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

              {/* AI Summary */}
              {p.ai_summary && (
                <p className="mt-2 text-sm italic text-gray-600">
                  {p.ai_summary}
                </p>
              )}

              {/* Abstract preview (fallback if no summary) */}
              {p.abstract && !p.ai_summary && (
                <p className="mt-2 text-sm text-gray-500 line-clamp-2">
                  {p.abstract}
                </p>
              )}
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

      {/* API notice */}
      <div className="mt-8 rounded-xl border border-dashed border-gray-300 bg-gray-50 p-4 text-center text-sm text-gray-500">
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
