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
const PUBLIC_DIR = path.join(__dirname, "..", "public", "api");

console.log(`Reading database from: ${DB_PATH}`);

const db = new Database(DB_PATH, { readonly: true });
db.pragma("journal_mode = WAL");

// =============================================================================
// BEST CLASSIFICATION PER PAPER
// When a paper has multiple classifications (e.g., source:inherited + ai:haiku),
// prefer the AI classification. This CTE deduplicates to one row per paper.
// Priority: ai:haiku > source:vanhaaren_review > source:inherited
// =============================================================================

// CTE that picks the best classification per paper, then filters to rn=1
const BEST_CTE = `
  WITH ranked AS (
    SELECT *, ROW_NUMBER() OVER (
      PARTITION BY paper_id
      ORDER BY CASE classified_by
        WHEN 'ai:haiku' THEN 1
        WHEN 'ai:haiku_bib_screen' THEN 2
        WHEN 'source:vanhaaren_review' THEN 3
        WHEN 'source:inherited' THEN 4
        ELSE 5
      END
    ) AS rn
    FROM classifications
  ),
  best_class AS (
    SELECT * FROM ranked
    WHERE rn = 1
      AND json_extract(relevance_json, '$.sports_analytics') >= 5
  )
`;

// =============================================================================
// BASIC STATS (existing)
// =============================================================================

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

// =============================================================================
// CLASSIFICATION STATS (new)
// =============================================================================

const totalClassified = db
  .prepare(`${BEST_CTE} SELECT COUNT(*) as c FROM best_class`)
  .get().c;

const classifiedRelevant = db
  .prepare(
    `${BEST_CTE} SELECT COUNT(*) as c FROM best_class WHERE sport != 'not_applicable'`
  )
  .get().c;

// Sport distribution (excluding not_applicable)
const sportDistribution = db
  .prepare(
    `${BEST_CTE} SELECT sport, COUNT(*) as count
     FROM best_class
     WHERE sport != 'not_applicable'
     GROUP BY sport ORDER BY count DESC`
  )
  .all();

// Methodology distribution (only relevant papers)
const methodologyDistribution = db
  .prepare(
    `${BEST_CTE} SELECT methodology, COUNT(*) as count
     FROM best_class
     WHERE sport != 'not_applicable'
     GROUP BY methodology ORDER BY count DESC`
  )
  .all();

// Theme distribution (only relevant papers)
const themeDistribution = db
  .prepare(
    `${BEST_CTE} SELECT theme, COUNT(*) as count
     FROM best_class
     WHERE sport != 'not_applicable'
     GROUP BY theme ORDER BY count DESC`
  )
  .all();

// Women's sport count
const womensSportCount = db
  .prepare(
    `${BEST_CTE} SELECT COUNT(*) as c FROM best_class WHERE is_womens_sport = 1 AND sport != 'not_applicable'`
  )
  .get().c;

// Data type distribution
const dataTypeDistribution = db
  .prepare(
    `${BEST_CTE} SELECT data_type, COUNT(*) as count
     FROM best_class
     WHERE sport != 'not_applicable'
     GROUP BY data_type ORDER BY count DESC`
  )
  .all();

// Sport x year (for trend charts)
const sportByYear = db
  .prepare(
    `${BEST_CTE} SELECT p.pub_year as year, c.sport, COUNT(*) as count
     FROM best_class c
     JOIN papers p ON c.paper_id = p.work_id
     WHERE c.sport != 'not_applicable' AND p.pub_year IS NOT NULL AND p.pub_year >= 2014
     GROUP BY p.pub_year, c.sport
     ORDER BY p.pub_year, count DESC`
  )
  .all();

// Methodology x year
const methodologyByYear = db
  .prepare(
    `${BEST_CTE} SELECT p.pub_year as year, c.methodology, COUNT(*) as count
     FROM best_class c
     JOIN papers p ON c.paper_id = p.work_id
     WHERE c.sport != 'not_applicable' AND p.pub_year IS NOT NULL AND p.pub_year >= 2014
     GROUP BY p.pub_year, c.methodology
     ORDER BY p.pub_year, count DESC`
  )
  .all();

// Theme x year
const themeByYear = db
  .prepare(
    `${BEST_CTE} SELECT p.pub_year as year, c.theme, COUNT(*) as count
     FROM best_class c
     JOIN papers p ON c.paper_id = p.work_id
     WHERE c.sport != 'not_applicable' AND p.pub_year IS NOT NULL AND p.pub_year >= 2014
     GROUP BY p.pub_year, c.theme
     ORDER BY p.pub_year, count DESC`
  )
  .all();

// Top sub-themes
const topSubThemes = db
  .prepare(
    `${BEST_CTE} SELECT sub_theme, COUNT(*) as count
     FROM best_class
     WHERE sport != 'not_applicable' AND sub_theme IS NOT NULL AND sub_theme != ''
     GROUP BY sub_theme ORDER BY count DESC LIMIT 30`
  )
  .all();

// Content type distribution (blog_post, thesis, conference_paper, etc.)
const contentTypeDistribution = db
  .prepare(
    `${BEST_CTE} SELECT COALESCE(p.content_type, 'journal_article') as content_type, COUNT(*) as count
     FROM best_class c
     JOIN papers p ON c.paper_id = p.work_id
     WHERE c.sport != 'not_applicable'
     GROUP BY content_type ORDER BY count DESC`
  )
  .all();

// =============================================================================
// BUILD STATS OBJECT
// =============================================================================

const stats = {
  totalPapers,
  totalAuthors,
  authorsWithGender,
  genderPercentage:
    Math.round((authorsWithGender / totalAuthors) * 1000) / 10,
  papersWithAbstract,
  abstractPercentage:
    Math.round((papersWithAbstract / totalPapers) * 1000) / 10,
  journalCount,
  oldestPaper: dateRange.oldest || "N/A",
  newestPaper: dateRange.newest || "N/A",
  topJournals,
  genderBreakdown,
  yearlyPapers,
  // Classification stats
  totalClassified,
  classifiedRelevant,
  classifiedNotApplicable: totalClassified - classifiedRelevant,
  womensSportCount,
  sportDistribution,
  methodologyDistribution,
  themeDistribution,
  dataTypeDistribution,
  topSubThemes,
  contentTypeDistribution,
  sportByYear,
  methodologyByYear,
  themeByYear,
  exportedAt: new Date().toISOString(),
};

// =============================================================================
// CLASSIFIED PAPERS (for explore page — all relevant classified papers)
// =============================================================================

const classifiedPapers = db
  .prepare(
    `${BEST_CTE}
     SELECT p.work_id, p.title, p.pub_date, p.journal_name as journal,
            p.cited_by_count, p.abstract,
            p.open_access, p.doi, p.pub_year,
            c.sport, c.methodology, c.theme, c.sub_theme,
            c.is_womens_sport, c.data_type, c.summary as ai_summary,
            -- Content type (blog_post, thesis, etc.)
            COALESCE(p.content_type, 'journal_article') as content_type,
            p.source_url, p.source_platform,
            -- Impact metrics
            p.fwci, p.citation_percentile, p.is_top_10_percent,
            p.citations_per_year, p.primary_topic, p.referenced_works_count,
            -- Journal metrics (from sources table)
            s.h_index as journal_h_index,
            s.two_yr_mean_citedness as journal_if_proxy,
            -- First author metrics
            fa.name as first_author_name,
            fa.h_index as first_author_h_index
     FROM best_class c
     JOIN papers p ON c.paper_id = p.work_id
     LEFT JOIN sources s ON p.source_id = s.source_id
     LEFT JOIN paper_authors pa ON p.work_id = pa.paper_id AND pa.is_first = 1
     LEFT JOIN authors fa ON pa.author_id = fa.author_id
     WHERE c.sport != 'not_applicable'
     ORDER BY p.pub_date DESC, p.cited_by_count DESC`
  )
  .all();

// =============================================================================
// EXPORT JOURNAL LIST
// =============================================================================

const journals = db
  .prepare(
    `SELECT DISTINCT journal_name as journal FROM papers
     WHERE journal_name IS NOT NULL AND journal_name != ''
     ORDER BY journal_name`
  )
  .all()
  .map((r) => r.journal);

// =============================================================================
// WRITE FILES
// =============================================================================

fs.mkdirSync(OUTPUT_DIR, { recursive: true });
fs.mkdirSync(PUBLIC_DIR, { recursive: true });

// Internal data files (imported by Next.js pages)
fs.writeFileSync(
  path.join(OUTPUT_DIR, "stats.json"),
  JSON.stringify(stats, null, 2)
);
console.log(
  `Exported stats: ${totalPapers} papers, ${totalAuthors} authors, ${totalClassified} classified`
);

fs.writeFileSync(
  path.join(OUTPUT_DIR, "classified-papers.json"),
  JSON.stringify(classifiedPapers)
);
console.log(
  `Exported ${classifiedPapers.length} classified papers (relevant only)`
);

fs.writeFileSync(
  path.join(OUTPUT_DIR, "journals.json"),
  JSON.stringify(journals)
);
console.log(`Exported ${journals.length} journals`);

// =============================================================================
// PUBLIC API FILES (downloadable by AI agents, researchers, students)
// =============================================================================

// Full classification export — only relevant papers (sport != not_applicable)
// Uses BEST_CTE to pick best classification per paper (avoids duplicates)
// Excludes not_applicable papers to keep file size manageable for Git (~25 MB vs ~56 MB)
const fullClassifications = db
  .prepare(
    `${BEST_CTE}
     SELECT p.work_id, p.doi, p.title, p.pub_date, p.pub_year,
            p.journal_name as journal, p.cited_by_count, p.open_access,
            COALESCE(p.content_type, 'journal_article') as content_type,
            p.source_url, p.source_platform,
            p.fwci, p.citation_percentile, p.is_top_10_percent,
            p.citations_per_year, p.primary_topic, p.referenced_works_count,
            s.h_index as journal_h_index,
            s.two_yr_mean_citedness as journal_if_proxy,
            c.sport, c.methodology, c.theme, c.sub_theme,
            c.is_womens_sport, c.data_type, c.summary,
            c.relevance_json, c.classified_by, c.classified_at
     FROM best_class c
     JOIN papers p ON c.paper_id = p.work_id
     LEFT JOIN sources s ON p.source_id = s.source_id
     WHERE c.sport != 'not_applicable'
     ORDER BY p.pub_date DESC`
  )
  .all()
  .map((r) => ({
    ...r,
    relevance: r.relevance_json ? JSON.parse(r.relevance_json) : null,
    relevance_json: undefined,
  }));

fs.writeFileSync(
  path.join(PUBLIC_DIR, "classifications.json"),
  JSON.stringify({
    description:
      "AI-classified sports analytics research papers from the Living Sports Analytics platform. Only includes relevant papers (sport != not_applicable).",
    source: "https://living-sports-analytics.vercel.app",
    github:
      "https://github.com/mwolters-cmyk/living-sports-analytics-research",
    license: "CC-BY-4.0",
    exported_at: new Date().toISOString(),
    total: fullClassifications.length,
    schema: {
      sport:
        "Primary sport (football, basketball, tennis, etc.)",
      methodology:
        "Research methodology (statistical, machine_learning, deep_learning, review, etc.)",
      theme:
        "Research theme (performance_analysis, injury_prevention, tactical_analysis, etc.)",
      is_womens_sport: "Whether the study focuses on women's/girls' sport",
      data_type: "Primary data type (event, tracking, video, survey, etc.)",
      summary: "AI-generated one-sentence summary of the key finding",
      relevance:
        "Relevance scores (0-10) for sports_analytics, sports_medicine, sports_management",
      fwci: "Field-Weighted Citation Impact (1.0 = world average, from OpenAlex)",
      citation_percentile: "Citation percentile within field (0-100, from OpenAlex)",
      is_top_10_percent: "Whether this paper is in the top 10% most cited in its field",
      citations_per_year: "Average citations per year since publication",
      journal_h_index: "Journal h-index (from OpenAlex)",
      journal_if_proxy: "Journal 2-year mean citedness (Impact Factor proxy, from OpenAlex)",
    },
    data: fullClassifications,
  })
);
console.log(
  `Exported public API: ${fullClassifications.length} relevant classifications`
);

// Compact summary for quick consumption
const summaryApi = {
  description: "Summary statistics for the Living Sports Analytics platform",
  exported_at: new Date().toISOString(),
  papers: {
    total: totalPapers,
    with_abstract: papersWithAbstract,
    classified: totalClassified,
    relevant: classifiedRelevant,
  },
  authors: {
    total: totalAuthors,
    with_gender: authorsWithGender,
  },
  distributions: {
    sport: sportDistribution,
    methodology: methodologyDistribution,
    theme: themeDistribution,
    data_type: dataTypeDistribution,
  },
  womens_sport: womensSportCount,
  trends: {
    sport_by_year: sportByYear,
    methodology_by_year: methodologyByYear,
    theme_by_year: themeByYear,
  },
};

fs.writeFileSync(
  path.join(PUBLIC_DIR, "summary.json"),
  JSON.stringify(summaryApi, null, 2)
);
console.log("Exported public API summary");

// =============================================================================
// CONTENT SOURCES (for /sources page)
// =============================================================================

try {
  const contentSources = db
    .prepare(
      `SELECT cs.id, cs.name, cs.platform, cs.url, cs.feed_url, cs.feed_type,
              cs.sitemap_url, cs.sport_focus, cs.category, cs.description,
              cs.author_name, cs.active, cs.last_checked, cs.last_new_item,
              cs.check_frequency,
              (SELECT COUNT(*) FROM papers p
               WHERE p.journal_name = cs.name
                 AND p.content_type != 'journal_article') as item_count,
              (SELECT MAX(p.pub_date) FROM papers p
               WHERE p.journal_name = cs.name
                 AND p.content_type != 'journal_article') as latest_item_date
       FROM content_sources cs
       WHERE cs.active = 1
       ORDER BY cs.category, cs.name`
    )
    .all();

  // Thesis repos with working scrapers in scrape_theses.py
  const thesisRepoNames = new Set([
    "EUR Thesis Repository (Erasmus University)",
    "Utrecht University Student Theses",
    "UvA Scripties (University of Amsterdam)",
    "Radboud University Thesis Repository",
    "TU Eindhoven Research Portal",
    "Leiden University Student Repository",
    "University of Twente Essay Repository",
    "TU Delft Repository",
  ]);

  // SSAC scraper sources
  const ssacNames = new Set([
    "MIT SSAC Research Paper Competition",
  ]);

  // Compute collection_method for each source
  for (const src of contentSources) {
    if (src.feed_url) {
      src.collection_method = "rss";
    } else if (src.sitemap_url) {
      src.collection_method = "sitemap";
    } else if (thesisRepoNames.has(src.name)) {
      src.collection_method = "thesis_scraper";
    } else if (ssacNames.has(src.name)) {
      src.collection_method = "ssac_scraper";
    } else {
      src.collection_method = null;
    }
  }

  // Exclude categories that are NOT non-OA collection targets
  // Corporate blogs are tracked for awareness but collected via OpenAlex
  // Journals are monitored via OpenAlex watcher, not via RSS
  // Data platforms, podcasts, conferences have no automated collectors
  const EXCLUDED_CATEGORIES = new Set([
    "corporate_blog",
    "journal",
    "data_platform",
    "podcast",
    "conference",
  ]);

  // Only export sources that have a working collection method AND are non-OA sources
  const collectableSources = contentSources.filter(
    (s) => s.collection_method !== null && !EXCLUDED_CATEGORIES.has(s.category)
  );

  fs.writeFileSync(
    path.join(OUTPUT_DIR, "content-sources.json"),
    JSON.stringify(collectableSources)
  );
  console.log(
    `Exported ${collectableSources.length} content sources with collectors (${contentSources.length - collectableSources.length} without collector excluded)`
  );
} catch (e) {
  console.log(`No content_sources table found: ${e.message}`);
}

// =============================================================================
// PAPER PDFs (source URLs from Zotero — replaces Vercel Blob)
// =============================================================================

try {
  const paperPdfs = db
    .prepare(
      `SELECT p.work_id,
              REPLACE(p.work_id, 'https://openalex.org/', '') as short_id,
              p.pdf_source_url as pdf_url,
              p.title,
              p.pub_date
       FROM papers p
       JOIN classifications c ON p.work_id = c.paper_id
       WHERE p.pdf_source_url IS NOT NULL
         AND c.sport != 'not_applicable'
         AND json_extract(c.relevance_json, '$.sports_analytics') >= 5
       ORDER BY p.pub_date DESC`
    )
    .all();

  fs.writeFileSync(
    path.join(PUBLIC_DIR, "paper-pdfs.json"),
    JSON.stringify({
      description: "Full-text PDF source URLs for classified sports analytics papers",
      note: "These are direct links to publisher/repository PDFs (OA or institutional access). Not hosted by us.",
      exported_at: new Date().toISOString(),
      total: paperPdfs.length,
      papers: paperPdfs,
    })
  );
  console.log(`Exported ${paperPdfs.length} paper PDF source URLs`);
} catch (e) {
  console.log(`paper-pdfs export failed: ${e.message}`);
}

// =============================================================================
// PIPELINE.JSON — Machine-readable pipeline config for AI agents
// =============================================================================

try {
  // Get whitelisted domains from active content sources
  const whitelistedSources = db
    .prepare(
      `SELECT DISTINCT url, name, category
       FROM content_sources
       WHERE active = 1
       ORDER BY name`
    )
    .all();

  const pipelineConfig = {
    description:
      "Machine-readable pipeline configuration for the Living Sports Analytics platform. Use this to understand how to contribute sources, what classification taxonomy is used, and how papers are processed.",
    exported_at: new Date().toISOString(),
    version: "1.0",
    platform_url: "https://living-sports-analytics.vercel.app",

    classification_taxonomy: {
      sports: [
        "football", "american_football", "tennis", "basketball", "baseball",
        "ice_hockey", "cricket", "cycling", "speed_skating", "athletics",
        "swimming", "rugby", "volleyball", "handball", "esports", "golf",
        "boxing_mma", "motorsport", "skiing", "figure_skating", "gymnastics",
        "diving", "rowing", "darts", "snooker", "badminton", "table_tennis",
        "water_polo", "aussie_rules", "futsal", "floorball", "other", "multi_sport",
      ],
      methodologies: [
        "statistical", "machine_learning", "deep_learning", "NLP",
        "computer_vision", "simulation", "optimization", "network_analysis",
        "qualitative", "mixed_methods", "review", "meta_analysis", "other",
      ],
      themes: [
        "performance_analysis", "injury_prevention", "tactical_analysis",
        "betting_markets", "player_development", "player_valuation",
        "transfer_market", "gender_equity", "bias_detection",
        "data_engineering", "fan_engagement", "coaching",
        "nutrition_recovery", "psychology", "biomechanics", "methodology", "other",
      ],
      relevance_scale: {
        min: 1,
        max: 10,
        threshold_for_inclusion: 5,
        description:
          "1-4: not sports analytics. 5-6: tangentially related. 7-8: clearly relevant. 9-10: core sports analytics.",
      },
    },

    ingestion: {
      description:
        "How to add new sources to the platform. Clone the GitHub repo and run scripts locally.",
      script: "scripts/ingest_source.py",
      repository: "https://github.com/mwolters-cmyk/living-sports-analytics-research",
      types: {
        type_a: {
          description:
            "Source WITH abstract (thesis, preprint, conference paper). Free insert into DB — no API key needed. Classification and extraction run later via the standard pipeline.",
          valid_content_types: ["thesis", "working_paper", "conference_paper"],
          required_fields: ["url", "type", "abstract", "title"],
          optional_fields: ["author", "source", "pub_date"],
          cost: "$0 (no Haiku call)",
        },
        type_b: {
          description:
            "Source WITHOUT abstract (blog post, news article, report). Fetches HTML and runs a single Claude Haiku call for classification + abstract generation + author extraction + methodology/resource extraction.",
          valid_content_types: ["blog_post", "news_article", "report"],
          required_fields: ["url", "type"],
          optional_fields: ["title", "author", "source", "pub_date"],
          cost: "~$0.03/source (Claude Haiku)",
        },
      },
      batch_format: {
        description: "JSONL file with one JSON object per line",
        example_type_a: {
          url: "https://repository.tudelft.nl/record/uuid:abc123",
          type: "thesis",
          title: "Machine Learning for Football Analytics",
          abstract: "This thesis examines...",
          author: "Jan de Vries",
          source: "TU Delft",
        },
        example_type_b: {
          url: "https://statsbomb.com/articles/soccer/new-xg-model",
          type: "blog_post",
        },
      },
      commands: {
        single_type_a:
          'python scripts/ingest_source.py --url "<URL>" --type thesis --title "<TITLE>" --abstract "<ABSTRACT>"',
        single_type_b:
          'python scripts/ingest_source.py --url "<URL>" --type blog_post',
        batch: "python scripts/ingest_source.py --batch sources.jsonl",
        dry_run:
          'python scripts/ingest_source.py --url "<URL>" --type blog_post --dry-run',
      },
      quality_gate:
        "All sources are classified by AI (Claude Haiku). Only sources with sports_analytics relevance >= 5 appear on the website. Sources scoring < 5 are stored but hidden.",
      api_key_policy:
        "External contributors MUST use their own ANTHROPIC_API_KEY environment variable. The platform does not provide API keys. Type A ingestion (with abstract) is free and requires no API key. Type B ingestion requires a key for the Haiku classification call.",
    },

    collection_methods: {
      openalex: {
        description:
          "Primary source for peer-reviewed academic publications. Polls the OpenAlex API weekly for new papers from 28 target journals and ~100 keyword queries.",
        script: "living_meta/watcher.py",
        frequency: "weekly",
        coverage: "Peer-reviewed journal articles across all sports analytics domains",
      },
      feeds: {
        description:
          "RSS/Atom feeds, sitemaps, thesis repository scrapers, and conference paper scrapers for grey literature.",
        script: "scripts/collect_sources.py",
        modes: ["--feeds", "--sitemaps", "--ssac", "--theses", "--all"],
      },
    },

    whitelisted_sources: whitelistedSources.map((s) => ({
      name: s.name,
      url: s.url,
      category: s.category,
    })),

    extraction_schema: {
      description:
        "After ingestion, each paper is analyzed by Claude Haiku to extract structured methodology and resource information.",
      methodology_fields: [
        "study_design",
        "sample_size",
        "data_sources",
        "key_techniques",
        "validation_approach",
        "limitations",
      ],
      resource_fields: [
        "data_sources",
        "instruments",
        "code_availability",
        "data_availability",
      ],
      other_fields: ["future_research"],
      prompt_reference:
        "Full extraction schemas are defined in living_meta/paper_extractor.py (SYSTEM_PROMPT for PDFs, ABSTRACT_SYSTEM_PROMPT for abstracts, UNIFIED_NONOA_PROMPT for grey literature)",
    },

    api_endpoints: {
      summary: "/api/summary.json",
      classifications: "/api/classifications.json",
      paper_pdfs: "/api/paper-pdfs.json",
      pipeline: "/api/pipeline.json",
      feed_xml: "/feed.xml",
    },
  };

  fs.writeFileSync(
    path.join(PUBLIC_DIR, "pipeline.json"),
    JSON.stringify(pipelineConfig, null, 2)
  );
  console.log(
    `Exported pipeline config: ${pipelineConfig.classification_taxonomy.sports.length} sports, ${pipelineConfig.classification_taxonomy.methodologies.length} methodologies, ${pipelineConfig.classification_taxonomy.themes.length} themes, ${pipelineConfig.whitelisted_sources.length} whitelisted sources`
  );
} catch (e) {
  console.log(`pipeline.json export failed: ${e.message}`);
}

// =============================================================================
// RSS FEED (static, regenerated on each export)
// =============================================================================

const recentItems = db
  .prepare(
    `${BEST_CTE}
     SELECT p.work_id, p.title, p.pub_date, p.doi, p.source_url,
            COALESCE(p.content_type, 'journal_article') as content_type,
            p.journal_name, p.abstract,
            c.sport, c.theme, c.summary
     FROM best_class c
     JOIN papers p ON c.paper_id = p.work_id
     WHERE c.sport != 'not_applicable'
     ORDER BY p.created_at DESC LIMIT 50`
  )
  .all();

function escapeXml(str) {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function buildRssFeed(items) {
  const now = new Date().toUTCString();
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Living Sports Analytics</title>
    <link>https://living-sports-analytics.vercel.app</link>
    <description>Latest sports analytics research papers, blog posts, and grey literature — curated and classified by AI</description>
    <language>en</language>
    <lastBuildDate>${now}</lastBuildDate>
    <atom:link href="https://living-sports-analytics.vercel.app/feed.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>https://living-sports-analytics.vercel.app/icon.png</url>
      <title>Living Sports Analytics</title>
      <link>https://living-sports-analytics.vercel.app</link>
    </image>\n`;

  for (const item of items) {
    const link = item.source_url || (item.doi ? (item.doi.startsWith("http") ? item.doi : `https://doi.org/${item.doi}`) : `https://living-sports-analytics.vercel.app/explore`);
    const desc = item.summary || item.abstract || "";
    const pubDate = item.pub_date ? new Date(item.pub_date).toUTCString() : now;
    const categories = [item.sport, item.theme, item.content_type].filter(Boolean);

    xml += `    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${escapeXml(link)}</link>
      <description>${escapeXml(desc)}</description>
      <pubDate>${pubDate}</pubDate>
      <guid isPermaLink="false">${escapeXml(item.work_id)}</guid>
      <source url="https://living-sports-analytics.vercel.app">${escapeXml(item.journal_name || "Living Sports Analytics")}</source>\n`;
    for (const cat of categories) {
      xml += `      <category>${escapeXml(cat)}</category>\n`;
    }
    xml += `    </item>\n`;
  }

  xml += `  </channel>\n</rss>\n`;
  return xml;
}

const rssXml = buildRssFeed(recentItems);
fs.writeFileSync(path.join(__dirname, "..", "public", "feed.xml"), rssXml);
console.log(`Exported RSS feed: ${recentItems.length} items`);

console.log(`\nAll data exported to:`);
console.log(`  Internal: ${OUTPUT_DIR}`);
console.log(`  Public API: ${PUBLIC_DIR}`);
db.close();
