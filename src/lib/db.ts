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
import classifiedPapersData from "@/data/classified-papers.json";
import journalsData from "@/data/journals.json";
import gapAnalysesData from "@/data/gap-analyses.json";
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
  // Classification stats
  totalClassified: number;
  classifiedRelevant: number;
  classifiedNotApplicable: number;
  womensSportCount: number;
  sportDistribution: { sport: string; count: number }[];
  methodologyDistribution: { methodology: string; count: number }[];
  themeDistribution: { theme: string; count: number }[];
  dataTypeDistribution: { data_type: string; count: number }[];
  topSubThemes: { sub_theme: string; count: number }[];
  sportByYear: { year: number; sport: string; count: number }[];
  methodologyByYear: { year: number; methodology: string; count: number }[];
  contentTypeDistribution: { content_type: string; count: number }[];
  themeByYear: { year: number; theme: string; count: number }[];
  exportedAt?: string;
}

export interface ClassifiedPaper {
  work_id: string;
  title: string;
  pub_date: string | null;
  pub_year: number | null;
  journal: string | null;
  cited_by_count: number;
  abstract: string | null;
  open_access: number;
  doi: string | null;
  sport: string;
  methodology: string;
  theme: string;
  sub_theme: string | null;
  is_womens_sport: number;
  data_type: string;
  ai_summary: string | null;
  // Content type (blog_post, thesis, conference_paper, etc.)
  content_type: string | null;
  source_url: string | null;
  source_platform: string | null;
  // Impact metrics (from OpenAlex)
  fwci: number | null;
  citation_percentile: number | null;
  is_top_10_percent: number;
  citations_per_year: number | null;
  primary_topic: string | null;
  // Journal metrics (from sources table)
  journal_h_index: number | null;
  journal_if_proxy: number | null;
  // Author metrics (first author)
  first_author_name: string | null;
  first_author_h_index: number | null;
  // Reference count
  referenced_works_count: number | null;
}

// =============================================================================
// Gap Analysis types
// =============================================================================

export interface GapPaperRef {
  work_id: string;
  title: string;
  year: number | null;
  sport?: string;
  doi?: string | null;
  first_author?: string | null;
  why_key?: string;
}

/** Compact paper info for resolving inline W-references in text */
export interface GapPaperIndexEntry {
  title: string;
  year: number | null;
  first_author: string | null;
}

export interface GapFinding {
  finding: string;
  evidence_strength: "strong" | "moderate" | "weak";
  papers: GapPaperRef[];
  paper_count: number;
}

export interface Gap {
  id: string;
  type: "topic" | "methodology" | "data" | "population" | "replication" | "temporal" | "integration";
  title: string;
  description: string;
  evidence: string;
  supporting_papers: GapPaperRef[];
  importance: "high" | "medium" | "low";
  importance_rationale: string;
  feasibility: "high" | "medium" | "low";
  feasibility_rationale: string;
  confidence: "high" | "medium" | "low";
}

export interface AgendaItem {
  priority: number;
  title: string;
  description: string;
  addresses_gaps: string[];
  suggested_methodology: string;
  suggested_data: string;
  estimated_difficulty: "accessible_thesis" | "standard_phd" | "challenging_project" | "major_initiative";
  potential_impact: string;
}

export interface GapAnalysis {
  slug: string;
  question: string;
  created_at: string;
  analyzed_at: string;
  prompt_version: string;
  model: string;
  papers_analyzed: number;
  cost_usd: number;
  analysis_confidence: "high" | "medium" | "low" | "unknown";
  scope_assessment: string;
  database_coverage: string;
  confidence_explanation: string;
  landscape: {
    summary: string;
    key_findings: GapFinding[];
    methodology_profile: {
      dominant_methods: string[];
      sample_size_patterns: string;
      data_sources_used: string;
      temporal_patterns: string;
    };
    key_papers: GapPaperRef[];
  };
  gaps: Gap[];
  research_agenda: AgendaItem[];
  self_reflection: {
    synthesis_quality: string;
    strengths: string[];
    limitations: string[];
    assumptions: string[];
    database_coverage_gaps: string[];
    what_would_improve_this: string[];
    process_cost_reflection: string;
  };
}

export interface GapAnalysesData {
  generated_at: string;
  total_analyses: number;
  paper_index: Record<string, GapPaperIndexEntry>;
  analyses: GapAnalysis[];
}

export function getGapAnalyses(): GapAnalysesData {
  return gapAnalysesData as GapAnalysesData;
}

export function getStats(): Stats {
  return statsData as Stats;
}

export function getClassifiedPapers(): ClassifiedPaper[] {
  return classifiedPapersData as ClassifiedPaper[];
}

export function getJournalList(): string[] {
  return journalsData as string[];
}

/** Display-friendly labels for classification values */
export const SPORT_LABELS: Record<string, string> = {
  football: "Football/Soccer",
  american_football: "American Football",
  tennis: "Tennis",
  basketball: "Basketball",
  baseball: "Baseball/Softball",
  ice_hockey: "Ice Hockey",
  cricket: "Cricket",
  cycling: "Cycling",
  speed_skating: "Speed Skating",
  athletics: "Athletics/Running",
  swimming: "Swimming",
  rugby: "Rugby",
  volleyball: "Volleyball",
  handball: "Handball",
  esports: "eSports",
  golf: "Golf",
  boxing_mma: "Boxing/MMA",
  motorsport: "Motorsport",
  skiing: "Skiing",
  figure_skating: "Figure Skating",
  gymnastics: "Gymnastics",
  diving: "Diving",
  rowing: "Rowing/Canoeing",
  darts: "Darts",
  snooker: "Snooker/Billiards",
  badminton: "Badminton",
  table_tennis: "Table Tennis",
  water_polo: "Water Polo",
  aussie_rules: "Australian Rules Football",
  futsal: "Futsal",
  floorball: "Floorball",
  other: "Other Sport",
  multi_sport: "Multi-Sport",
};

export const THEME_LABELS: Record<string, string> = {
  performance_analysis: "Performance Analysis",
  injury_prevention: "Injury Prevention",
  tactical_analysis: "Tactical Analysis",
  betting_markets: "Betting Markets",
  player_development: "Player Development",
  player_valuation: "Player Valuation",
  transfer_market: "Transfer Market",
  gender_equity: "Gender Equity",
  bias_detection: "Bias Detection",
  data_engineering: "Data Engineering",
  fan_engagement: "Fan Engagement",
  coaching: "Coaching",
  nutrition_recovery: "Nutrition & Recovery",
  psychology: "Psychology",
  biomechanics: "Biomechanics",
  physiology: "Physiology",
  methodology: "Methodology",
  epidemiology: "Epidemiology",
  other: "Other",
};

export const CONTENT_TYPE_LABELS: Record<string, string> = {
  journal_article: "Journal Article",
  blog_post: "Blog Post",
  thesis: "Thesis",
  conference_paper: "Conference Paper",
  working_paper: "Working Paper",
  news_article: "News Article",
  report: "Report",
};

export const METHODOLOGY_LABELS: Record<string, string> = {
  statistical: "Statistical",
  machine_learning: "Machine Learning",
  deep_learning: "Deep Learning",
  NLP: "NLP",
  computer_vision: "Computer Vision",
  simulation: "Simulation",
  optimization: "Optimization",
  network_analysis: "Network Analysis",
  qualitative: "Qualitative",
  mixed_methods: "Mixed Methods",
  review: "Review",
  meta_analysis: "Meta-Analysis",
  descriptive: "Descriptive",
  other: "Other",
};

