/**
 * Export database stats to JSON for static deployment.
 * Run this before building the website for Vercel deployment.
 *
 * Usage: node scripts/export-stats.js
 */

const Database = require("better-sqlite3");
const path = require("path");
const fs = require("fs");

const DB_PATH = path.join(__dirname, "..", "..", "data", "living_meta.db");
const OUTPUT_DIR = path.join(__dirname, "..", "src", "data");

console.log(`Reading database from: ${DB_PATH}`);

const db = new Database(DB_PATH, { readonly: true });
db.pragma("journal_mode = WAL");

// Export stats
const totalPapers = db.prepare("SELECT COUNT(*) as c FROM papers").get().c;
const totalAuthors = db.prepare("SELECT COUNT(*) as c FROM authors").get().c;
const authorsWithGender = db
  .prepare(
    "SELECT COUNT(*) as c FROM authors WHERE inferred_gender IS NOT NULL AND inferred_gender != 'unknown'"
  )
  .get().c;
const papersWithAbstract = db
  .prepare(
    "SELECT COUNT(*) as c FROM papers WHERE abstract IS NOT NULL AND abstract != ''"
  )
  .get().c;

const dateRange = db
  .prepare(
    "SELECT MIN(pub_date) as oldest, MAX(pub_date) as newest FROM papers WHERE pub_date IS NOT NULL"
  )
  .get();

const topJournals = db
  .prepare(
    `SELECT journal_name as journal, COUNT(*) as count FROM papers
     WHERE journal_name IS NOT NULL AND journal_name != ''
     GROUP BY journal_name ORDER BY count DESC LIMIT 15`
  )
  .all();

const genderBreakdown = db
  .prepare(
    `SELECT COALESCE(inferred_gender, 'unknown') as gender, COUNT(*) as count
     FROM authors GROUP BY inferred_gender ORDER BY count DESC`
  )
  .all();

const yearlyPapers = db
  .prepare(
    `SELECT pub_year as year, COUNT(*) as count
     FROM papers WHERE pub_year IS NOT NULL AND pub_year > 0
     GROUP BY pub_year ORDER BY pub_year`
  )
  .all();

const journalCount = db
  .prepare(
    "SELECT COUNT(DISTINCT journal_name) as c FROM papers WHERE journal_name IS NOT NULL AND journal_name != ''"
  )
  .get().c;

const stats = {
  totalPapers,
  totalAuthors,
  authorsWithGender,
  genderPercentage: Math.round((authorsWithGender / totalAuthors) * 1000) / 10,
  papersWithAbstract,
  abstractPercentage: Math.round((papersWithAbstract / totalPapers) * 1000) / 10,
  journalCount,
  oldestPaper: dateRange.oldest || "N/A",
  newestPaper: dateRange.newest || "N/A",
  topJournals,
  genderBreakdown,
  yearlyPapers,
  exportedAt: new Date().toISOString(),
};

// Export recent papers (top 500 by date, for static explore page)
const recentPapers = db
  .prepare(
    `SELECT work_id, title, pub_date, journal_name as journal, cited_by_count,
            SUBSTR(abstract, 1, 300) as abstract, open_access, doi
     FROM papers
     ORDER BY pub_date DESC, cited_by_count DESC
     LIMIT 500`
  )
  .all();

// Export journal list
const journals = db
  .prepare(
    `SELECT DISTINCT journal_name as journal FROM papers
     WHERE journal_name IS NOT NULL AND journal_name != ''
     ORDER BY journal_name`
  )
  .all()
  .map((r) => r.journal);

// Write files
fs.mkdirSync(OUTPUT_DIR, { recursive: true });

fs.writeFileSync(
  path.join(OUTPUT_DIR, "stats.json"),
  JSON.stringify(stats, null, 2)
);
console.log(`Exported stats: ${totalPapers} papers, ${totalAuthors} authors`);

fs.writeFileSync(
  path.join(OUTPUT_DIR, "recent-papers.json"),
  JSON.stringify(recentPapers)
);
console.log(`Exported ${recentPapers.length} recent papers`);

fs.writeFileSync(
  path.join(OUTPUT_DIR, "journals.json"),
  JSON.stringify(journals)
);
console.log(`Exported ${journals.length} journals`);

console.log(`\nAll data exported to: ${OUTPUT_DIR}`);
db.close();
