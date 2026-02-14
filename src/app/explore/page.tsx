"use client";

import { useState, useMemo } from "react";
import recentPapersData from "@/data/recent-papers.json";
import journalsData from "@/data/journals.json";

interface Paper {
  work_id: string;
  title: string;
  pub_date: string | null;
  journal: string | null;
  cited_by_count: number;
  abstract: string | null;
  open_access: number;
  doi: string | null;
}

const allPapers = recentPapersData as Paper[];
// Only show journals that appear in our exported papers for the filter dropdown
const paperJournals = [
  ...new Set(allPapers.map((p) => p.journal).filter(Boolean)),
].sort() as string[];

export default function ExplorePage() {
  const [query, setQuery] = useState("");
  const [journal, setJournal] = useState("");
  const [yearFrom, setYearFrom] = useState("");
  const [yearTo, setYearTo] = useState("");
  const [page, setPage] = useState(0);
  const limit = 25;

  const filtered = useMemo(() => {
    let results = allPapers;

    if (query) {
      const q = query.toLowerCase();
      results = results.filter(
        (p) =>
          (p.title && p.title.toLowerCase().includes(q)) ||
          (p.abstract && p.abstract.toLowerCase().includes(q))
      );
    }

    if (journal) {
      results = results.filter((p) => p.journal === journal);
    }

    if (yearFrom) {
      results = results.filter(
        (p) => p.pub_date && p.pub_date >= `${yearFrom}-01-01`
      );
    }

    if (yearTo) {
      results = results.filter(
        (p) => p.pub_date && p.pub_date <= `${yearTo}-12-31`
      );
    }

    return results;
  }, [query, journal, yearFrom, yearTo]);

  const total = filtered.length;
  const totalPages = Math.ceil(total / limit);
  const papers = filtered.slice(page * limit, (page + 1) * limit);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(0);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-2 text-3xl font-bold text-navy">Explore Papers</h1>
      <p className="mb-6 text-gray-500">
        Browse the {allPapers.length.toLocaleString()} most recent sports
        analytics research papers
      </p>

      {/* Search / Filters */}
      <form
        onSubmit={handleSearch}
        className="mb-6 rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
      >
        <div className="grid gap-3 md:grid-cols-5">
          <div className="md:col-span-2">
            <input
              type="text"
              placeholder="Search title or abstract..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(0);
              }}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-orange focus:outline-none focus:ring-1 focus:ring-orange"
            />
          </div>
          <select
            value={journal}
            onChange={(e) => {
              setJournal(e.target.value);
              setPage(0);
            }}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-orange focus:outline-none"
          >
            <option value="">All journals</option>
            {paperJournals.map((j) => (
              <option key={j} value={j}>
                {j}
              </option>
            ))}
          </select>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="From year"
              value={yearFrom}
              onChange={(e) => {
                setYearFrom(e.target.value);
                setPage(0);
              }}
              min="2000"
              max="2030"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-orange focus:outline-none"
            />
            <input
              type="number"
              placeholder="To year"
              value={yearTo}
              onChange={(e) => {
                setYearTo(e.target.value);
                setPage(0);
              }}
              min="2000"
              max="2030"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-orange focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="rounded-lg bg-navy px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-navy-light"
          >
            Search
          </button>
        </div>
      </form>

      {/* Results */}
      <div className="mb-4 text-sm text-gray-500">
        {total > 0 ? (
          <>
            Showing {page * limit + 1}&ndash;
            {Math.min((page + 1) * limit, total)} of{" "}
            {total.toLocaleString()} results
          </>
        ) : (
          "No papers found matching your filters."
        )}
      </div>

      <div className="space-y-3">
        {papers.map((p) => (
          <div
            key={p.work_id}
            className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
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
                {p.abstract && (
                  <p className="mt-2 text-sm text-gray-500 line-clamp-2">
                    {p.abstract}
                  </p>
                )}
              </div>
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
    </div>
  );
}
