/**
 * Data access layer — reads from pre-exported JSON files.
 *
 * For local development with the full SQLite database, run:
 *   node scripts/export-stats.js
 *
 * The JSON files are committed to the repo so Vercel can build
 * without needing access to the SQLite database.
 */

import statsData from "@/data/stats.json";
import recentPapersData from "@/data/recent-papers.json";
import journalsData from "@/data/journals.json";

export interface Stats {
  totalPapers: number;
  totalAuthors: number;
  authorsWithGender: number;
  genderPercentage: number;
  papersWithAbstract: number;
  abstractPercentage: number;
  journalCount: number;
  oldestPaper: string;
  newestPaper: string;
  topJournals: { journal: string; count: number }[];
  genderBreakdown: { gender: string; count: number }[];
  yearlyPapers: { year: number; count: number }[];
  exportedAt?: string;
}

export interface PaperRow {
  work_id: string;
  title: string;
  pub_date: string | null;
  journal: string | null;
  cited_by_count: number;
  abstract: string | null;
  open_access: number;
  doi: string | null;
}

export function getStats(): Stats {
  return statsData as Stats;
}

export function getRecentPapers(): PaperRow[] {
  return recentPapersData as PaperRow[];
}

export function getJournalList(): string[] {
  return journalsData as string[];
}

/**
 * Client-side compatible search over pre-exported papers.
 * Filters the 500 most recent papers (exported from SQLite).
 */
export function searchPapers(
  query: string,
  journal: string,
  yearFrom: number,
  yearTo: number,
  limit: number,
  offset: number
): { papers: PaperRow[]; total: number } {
  let filtered = recentPapersData as PaperRow[];

  if (query) {
    const q = query.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        (p.title && p.title.toLowerCase().includes(q)) ||
        (p.abstract && p.abstract.toLowerCase().includes(q))
    );
  }

  if (journal) {
    filtered = filtered.filter((p) => p.journal === journal);
  }

  if (yearFrom) {
    filtered = filtered.filter(
      (p) => p.pub_date && p.pub_date >= `${yearFrom}-01-01`
    );
  }

  if (yearTo) {
    filtered = filtered.filter(
      (p) => p.pub_date && p.pub_date <= `${yearTo}-12-31`
    );
  }

  const total = filtered.length;
  const papers = filtered.slice(offset, offset + limit);

  return { papers, total };
}
