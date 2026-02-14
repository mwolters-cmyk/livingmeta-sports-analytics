import Database from "better-sqlite3";
import path from "path";

const DB_PATH = path.join(process.cwd(), "..", "data", "living_meta.db");

let db: Database.Database | null = null;

function getDb(): Database.Database {
  if (!db) {
    db = new Database(DB_PATH, { readonly: true });
    db.pragma("journal_mode = WAL");
  }
  return db;
}

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
}

export function getStats(): Stats {
  const conn = getDb();

  const totalPapers = (
    conn.prepare("SELECT COUNT(*) as c FROM papers").get() as { c: number }
  ).c;
  const totalAuthors = (
    conn.prepare("SELECT COUNT(*) as c FROM authors").get() as { c: number }
  ).c;
  const authorsWithGender = (
    conn
      .prepare(
        "SELECT COUNT(*) as c FROM authors WHERE inferred_gender IS NOT NULL AND inferred_gender != 'unknown'"
      )
      .get() as { c: number }
  ).c;
  const papersWithAbstract = (
    conn
      .prepare(
        "SELECT COUNT(*) as c FROM papers WHERE abstract IS NOT NULL AND abstract != ''"
      )
      .get() as { c: number }
  ).c;

  const dateRange = conn
    .prepare(
      "SELECT MIN(pub_date) as oldest, MAX(pub_date) as newest FROM papers WHERE pub_date IS NOT NULL"
    )
    .get() as { oldest: string; newest: string };

  const topJournals = conn
    .prepare(
      `SELECT journal_name as journal, COUNT(*) as count FROM papers
       WHERE journal_name IS NOT NULL AND journal_name != ''
       GROUP BY journal_name ORDER BY count DESC LIMIT 15`
    )
    .all() as { journal: string; count: number }[];

  const genderBreakdown = conn
    .prepare(
      `SELECT COALESCE(inferred_gender, 'unknown') as gender, COUNT(*) as count
       FROM authors GROUP BY inferred_gender ORDER BY count DESC`
    )
    .all() as { gender: string; count: number }[];

  const yearlyPapers = conn
    .prepare(
      `SELECT pub_year as year, COUNT(*) as count
       FROM papers WHERE pub_year IS NOT NULL AND pub_year > 0
       GROUP BY pub_year ORDER BY pub_year`
    )
    .all() as { year: number; count: number }[];

  const journalCount = (
    conn
      .prepare(
        "SELECT COUNT(DISTINCT journal_name) as c FROM papers WHERE journal_name IS NOT NULL AND journal_name != ''"
      )
      .get() as { c: number }
  ).c;

  return {
    totalPapers,
    totalAuthors,
    authorsWithGender,
    genderPercentage: Math.round((authorsWithGender / totalAuthors) * 1000) / 10,
    papersWithAbstract,
    abstractPercentage:
      Math.round((papersWithAbstract / totalPapers) * 1000) / 10,
    journalCount,
    oldestPaper: dateRange.oldest || "N/A",
    newestPaper: dateRange.newest || "N/A",
    topJournals,
    genderBreakdown,
    yearlyPapers,
  };
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

export function searchPapers(
  query: string,
  journal: string,
  yearFrom: number,
  yearTo: number,
  limit: number,
  offset: number
): { papers: PaperRow[]; total: number } {
  const conn = getDb();
  const conditions: string[] = [];
  const params: (string | number)[] = [];

  if (query) {
    conditions.push("(p.title LIKE ? OR p.abstract LIKE ?)");
    params.push(`%${query}%`, `%${query}%`);
  }
  if (journal) {
    conditions.push("p.journal_name = ?");
    params.push(journal);
  }
  if (yearFrom) {
    conditions.push("p.pub_date >= ?");
    params.push(`${yearFrom}-01-01`);
  }
  if (yearTo) {
    conditions.push("p.pub_date <= ?");
    params.push(`${yearTo}-12-31`);
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  const total = (
    conn.prepare(`SELECT COUNT(*) as c FROM papers p ${where}`).get(...params) as {
      c: number;
    }
  ).c;

  const papers = conn
    .prepare(
      `SELECT p.work_id, p.title, p.pub_date, p.journal_name as journal, p.cited_by_count,
              SUBSTR(p.abstract, 1, 300) as abstract, p.open_access, p.doi
       FROM papers p ${where}
       ORDER BY p.pub_date DESC, p.cited_by_count DESC
       LIMIT ? OFFSET ?`
    )
    .all(...params, limit, offset) as PaperRow[];

  return { papers, total };
}

export function getJournalList(): string[] {
  const conn = getDb();
  return (
    conn
      .prepare(
        `SELECT DISTINCT journal_name as journal FROM papers
         WHERE journal_name IS NOT NULL AND journal_name != ''
         ORDER BY journal_name`
      )
      .all() as { journal: string }[]
  ).map((r) => r.journal);
}
