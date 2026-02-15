"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import linkedResourcesData from "@/data/paper-linked-resources.json";

/* ─── Types ─── */

/* Paper-linked resource from AI extraction */
interface LinkedResource {
  name: string;
  url: string | null;
  type: string;
  category: string;
  access?: string;
  platform?: string;
  language?: string;
  url_status?: "verified" | "dead";
  paper_count: number;
  papers: { work_id: string; title: string; sport: string; year: number | null }[];
}

interface LinkedResourcesData {
  generated_at: string;
  total_papers: number;
  total_resources: number;
  resources: LinkedResource[];
}

const linkedResources = linkedResourcesData as LinkedResourcesData;
type SportTag =
  | "football"
  | "tennis"
  | "basketball"
  | "baseball"
  | "ice_hockey"
  | "cricket"
  | "american_football"
  | "cycling"
  | "athletics"
  | "swimming"
  | "rugby"
  | "esports"
  | "golf"
  | "motorsport"
  | "multi_sport"
  | "handball"
  | "volleyball"
  | "speed_skating"
  | "boxing_mma"
  | "skiing"
  | "triathlon"
  | "figure_skating"
  | "gymnastics"
  | "diving"
  | "ski_jumping"
  | "artistic_swimming"
  | "australian_football";

type ResourceCategory = "dataset" | "scraper" | "library" | "api";

type Resource = {
  name: string;
  url: string;
  desc: string;
  sports: SportTag[];
  category: ResourceCategory;
  access: "free" | "freemium" | "paid";
  language?: string;
  onPlatform?: string;
};

/* ─── Sport display labels ─── */
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

const CATEGORY_LABELS: Record<ResourceCategory, string> = {
  dataset: "Datasets & Data Sources",
  scraper: "Scrapers & Data Tools",
  library: "Python/R Libraries",
  api: "Paid APIs",
};

const CATEGORY_ICONS: Record<ResourceCategory, string> = {
  dataset: "\u{1F4CA}",
  scraper: "\u{1F527}",
  library: "\u{1F4E6}",
  api: "\u{1F4B3}",
};

const CATEGORY_DESCS: Record<ResourceCategory, string> = {
  dataset:
    "Publicly accessible datasets, open data repositories, and free data sources for sports analytics research.",
  scraper:
    "Open-source scrapers and data collection tools. GitHub repos that help you gather structured sports data.",
  library:
    "Python and R libraries for loading, processing, analyzing, and visualizing sports data.",
  api: "Commercial data providers and paid APIs. Most offer free tiers for academic/non-commercial use.",
};

const ACCESS_BADGES: Record<string, { label: string; className: string }> = {
  free: { label: "Free", className: "bg-green-100 text-green-700" },
  freemium: { label: "Freemium", className: "bg-amber-100 text-amber-700" },
  paid: { label: "Paid", className: "bg-red-100 text-red-700" },
};

/* ═══════════════════════════════════════════════════════════════
   RESOURCE DATABASE
   ═══════════════════════════════════════════════════════════════ */

const resources: Resource[] = [
  // ── DATASETS ── Football ──────────────────────────────────────
  {
    name: "StatsBomb Open Data",
    url: "https://github.com/statsbomb/open-data",
    desc: "Event data and 360 tracking data for domestic leagues and international tournaments. Includes men's and women's competitions \u2014 the gold standard for open football analytics data.",
    sports: ["football"],
    category: "dataset",
    access: "free",
    onPlatform: "624 women's matches in our database.",
  },
  {
    name: "Wyscout Match Event Dataset",
    url: "https://figshare.com/collections/Soccer_match_event_dataset/4415000",
    desc: "World Cup 2018, Euro 2016, and top-5 league match event data. Academic-licensed dataset by Pappalardo et al. with accompanying research paper.",
    sports: ["football"],
    category: "dataset",
    access: "free",
  },
  {
    name: "SkillCorner Open Data",
    url: "https://github.com/SkillCorner/opendata",
    desc: "Broadcast tracking data (x, y positions at 10 Hz) for the Australian A-League 2024/2025. One of the few open tracking datasets available.",
    sports: ["football"],
    category: "dataset",
    access: "free",
  },
  {
    name: "Metrica Sports Sample Data",
    url: "https://github.com/metrica-sports/sample-data",
    desc: "Broadcast tracking and event data for anonymized sample matches. Ideal for learning tracking data analysis techniques.",
    sports: ["football"],
    category: "dataset",
    access: "free",
  },
  {
    name: "International Football Results",
    url: "https://github.com/martj42/international_results",
    desc: "47,000+ international football match results from 1872 to present, continuously updated. Includes men's and women's results.",
    sports: ["football"],
    category: "dataset",
    access: "free",
    onPlatform: "11,177 women's international results in our database.",
  },
  {
    name: "English Women's Football (EWF) Database",
    url: "https://github.com/probball/EWFdata",
    desc: "English Women's Super League and Championship match results, appearances, and standings since 2011.",
    sports: ["football"],
    category: "dataset",
    access: "free",
    onPlatform: "2,540 matches in our database.",
  },
  {
    name: "FBref / Sports Reference",
    url: "https://fbref.com",
    desc: "Comprehensive football statistics powered by Opta data. Player stats, match reports, xG, and advanced metrics for 100+ competitions.",
    sports: ["football"],
    category: "dataset",
    access: "free",
    onPlatform: "198,372 player-match rows for men's football.",
  },
  {
    name: "Transfermarkt",
    url: "https://www.transfermarkt.com",
    desc: "Market valuations, transfer history, and squad data for 800+ leagues. The most comprehensive transfer and valuation database in football.",
    sports: ["football"],
    category: "dataset",
    access: "free",
  },
  {
    name: "Understat",
    url: "https://understat.com",
    desc: "Expected goals (xG) data for the Big 5 European leagues and Russian Premier League. Shot-level xG data since 2014/15.",
    sports: ["football"],
    category: "dataset",
    access: "free",
  },
  {
    name: "Club Elo",
    url: "http://clubelo.com",
    desc: "Elo ratings for European football clubs with historical data back to the 1940s. API available for programmatic access.",
    sports: ["football"],
    category: "dataset",
    access: "free",
  },
  {
    name: "football-data.co.uk",
    url: "https://www.football-data.co.uk",
    desc: "Historical match results and bookmaker odds data for 30+ football leagues. Updated weekly.",
    sports: ["football"],
    category: "dataset",
    access: "free",
  },

  // ── DATASETS ── Tennis ────────────────────────────────────────
  {
    name: "Jeff Sackmann Tennis Data",
    url: "https://github.com/JeffSackmann/tennis_atp",
    desc: "Comprehensive ATP and WTA match data, rankings, and player stats from 1968 to present. The definitive open tennis dataset. CC-BY-NC-SA 4.0.",
    sports: ["tennis"],
    category: "dataset",
    access: "free",
    onPlatform: "~90K ATP + WTA matches (2008\u20132024) in our database.",
  },
  {
    name: "Tennis Abstract / Match Charting Project",
    url: "http://tennisabstract.com",
    desc: "Player profiles, Elo ratings, and point-by-point match data from the Match Charting Project. By Jeff Sackmann.",
    sports: ["tennis"],
    category: "dataset",
    access: "free",
  },

  // ── DATASETS ── Basketball ────────────────────────────────────
  {
    name: "Basketball Reference",
    url: "https://www.basketball-reference.com",
    desc: "Comprehensive NBA and WNBA statistics: player stats, team stats, box scores, advanced metrics, and historical data back to the BAA.",
    sports: ["basketball"],
    category: "dataset",
    access: "free",
  },
  {
    name: "NBA Stats API",
    url: "https://www.nba.com/stats",
    desc: "Official NBA/WNBA statistics API. JSON endpoints for player stats, shot charts, tracking data, and play-by-play. WNBA uses LeagueID=10.",
    sports: ["basketball"],
    category: "dataset",
    access: "free",
  },

  // ── DATASETS ── Baseball ──────────────────────────────────────
  {
    name: "Retrosheet",
    url: "https://www.retrosheet.org",
    desc: "Play-by-play data for every MLB game since 1921. The most comprehensive historical baseball dataset, maintained by volunteers.",
    sports: ["baseball"],
    category: "dataset",
    access: "free",
  },
  {
    name: "Lahman Baseball Database",
    url: "https://www.seanlahman.com/baseball-archive/statistics/",
    desc: "Complete batting, pitching, and fielding statistics for every MLB player since 1871. CSV and SQL formats. Updated annually.",
    sports: ["baseball"],
    category: "dataset",
    access: "free",
  },
  {
    name: "FanGraphs",
    url: "https://www.fangraphs.com",
    desc: "Advanced MLB statistics, leaderboards, projections, and WAR values. CSV exports available for many data views.",
    sports: ["baseball"],
    category: "dataset",
    access: "freemium",
  },
  {
    name: "Baseball Savant (Statcast)",
    url: "https://baseballsavant.mlb.com",
    desc: "MLB Statcast data: exit velocity, launch angle, spin rate, sprint speed, and pitch tracking. CSV search and download.",
    sports: ["baseball"],
    category: "dataset",
    access: "free",
  },

  // ── DATASETS ── American Football ─────────────────────────────
  {
    name: "nflverse Data",
    url: "https://github.com/nflverse/nflverse-data",
    desc: "Pre-compiled NFL play-by-play, player stats, rosters, and combine results. Central data repository for the nflverse ecosystem.",
    sports: ["american_football"],
    category: "dataset",
    access: "free",
  },
  {
    name: "NFL Big Data Bowl",
    url: "https://www.kaggle.com/competitions/nfl-big-data-bowl-2025",
    desc: "Annual Kaggle competition with NFL player tracking data (GPS at 10 Hz). Previous editions available as open datasets.",
    sports: ["american_football"],
    category: "dataset",
    access: "free",
  },
  {
    name: "Pro Football Reference",
    url: "https://www.pro-football-reference.com",
    desc: "Comprehensive NFL statistics: player, team, game logs, draft data, and historical records back to 1920.",
    sports: ["american_football"],
    category: "dataset",
    access: "free",
  },

  // ── DATASETS ── Ice Hockey ────────────────────────────────────
  {
    name: "MoneyPuck",
    url: "https://moneypuck.com",
    desc: "NHL expected goals (xG) models, shot data, and player/team analytics. CSV downloads for all NHL seasons since 2007.",
    sports: ["ice_hockey"],
    category: "dataset",
    access: "free",
  },
  {
    name: "Natural Stattrick",
    url: "https://www.naturalstattrick.com",
    desc: "NHL advanced stats: Corsi, Fenwick, expected goals, shot maps. Game-level and season-level data exports.",
    sports: ["ice_hockey"],
    category: "dataset",
    access: "free",
  },
  {
    name: "NHL API",
    url: "https://api-web.nhle.com/v1/",
    desc: "Official NHL JSON API: schedules, rosters, game stats, standings, and play-by-play. No authentication required.",
    sports: ["ice_hockey"],
    category: "dataset",
    access: "free",
  },
  {
    name: "Evolving Hockey",
    url: "https://evolving-hockey.com",
    desc: "NHL GAR (Goals Above Replacement), WAR, contract projections, and advanced analytics. Partial free access, full requires subscription.",
    sports: ["ice_hockey"],
    category: "dataset",
    access: "freemium",
  },

  // ── DATASETS ── Cricket ───────────────────────────────────────
  {
    name: "Cricsheet",
    url: "https://cricsheet.org",
    desc: "Ball-by-ball data for 16,000+ international and domestic cricket matches. YAML and JSON formats. Men's and women's.",
    sports: ["cricket"],
    category: "dataset",
    access: "free",
  },
  {
    name: "ESPNcricinfo Statsguru",
    url: "https://stats.espncricinfo.com/ci/engine/stats/index.html",
    desc: "The most comprehensive cricket statistics database: batting, bowling, fielding records for all international and major domestic cricket.",
    sports: ["cricket"],
    category: "dataset",
    access: "free",
  },
  {
    name: "Howstat",
    url: "http://www.howstat.com",
    desc: "Cricket statistics and records for international matches. Player profiles, match data, and historical records.",
    sports: ["cricket"],
    category: "dataset",
    access: "free",
  },

  // ── DATASETS ── Cycling ───────────────────────────────────────
  {
    name: "ProCyclingStats",
    url: "https://www.procyclingstats.com",
    desc: "Race results, rider profiles, rankings, and stage data for men's and women's professional cycling.",
    sports: ["cycling"],
    category: "dataset",
    access: "free",
  },
  {
    name: "FirstCycling",
    url: "https://firstcycling.com",
    desc: "Professional cycling results and statistics: race results, rider profiles, and rankings for both genders.",
    sports: ["cycling"],
    category: "dataset",
    access: "free",
  },

  // ── DATASETS ── Athletics ─────────────────────────────────────
  {
    name: "World Athletics",
    url: "https://worldathletics.org/records",
    desc: "Official records, rankings, and results for track & field. GraphQL API available. Men's and women's data.",
    sports: ["athletics"],
    category: "dataset",
    access: "free",
  },
  {
    name: "Tilastopaja",
    url: "https://www.tilastopaja.eu",
    desc: "Finnish athletics statistics service. Comprehensive results database with API access. Historical data going back decades.",
    sports: ["athletics"],
    category: "dataset",
    access: "free",
  },
  {
    name: "Sporthive / MYLAPS",
    url: "https://results.sporthive.com",
    desc: "Public race results API (MYLAPS chip timing). Covers 1000+ running and cycling events worldwide: marathons, half marathons, sportives. JSON API with split times, gender, age categories, nationality.",
    sports: ["athletics", "cycling"],
    category: "dataset",
    access: "free",
    onPlatform: "35+ running events (Dam tot Dam, Amsterdam/Rotterdam Marathon, Cardiff/Manchester Half, etc.) and 20 cycling sportives in our database.",
  },
  {
    name: "Kaggle Marathon Datasets",
    url: "https://www.kaggle.com/datasets?tags=5000-Sports&search=marathon",
    desc: "Pre-downloaded marathon results: Chicago (886K), NYC (1.46M), Boston 2024 (17K), US marathons 2023-2024 (1M+). Gender, age, finish times.",
    sports: ["athletics"],
    category: "dataset",
    access: "free",
    onPlatform: "~5.4 million marathon results across 6 Kaggle datasets in our data directory.",
  },

  // ── DATASETS ── Speed Skating ─────────────────────────────────
  {
    name: "SpeedSkatingResults.com",
    url: "https://speedskatingresults.com",
    desc: "Comprehensive speed skating results database with JSON API. Season bests, world records, competition results.",
    sports: ["speed_skating"],
    category: "dataset",
    access: "free",
    onPlatform: "Full performance and participation data in our database.",
  },

  // ── DATASETS ── eSports ───────────────────────────────────────
  {
    name: "HLTV.org",
    url: "https://www.hltv.org",
    desc: "Counter-Strike match results, player statistics, team rankings, and tournament data.",
    sports: ["esports"],
    category: "dataset",
    access: "free",
  },
  {
    name: "Liquipedia",
    url: "https://liquipedia.net",
    desc: "Community-maintained wiki with results and brackets for LoL, Dota 2, CS, Valorant, and 30+ esports titles.",
    sports: ["esports"],
    category: "dataset",
    access: "free",
  },
  {
    name: "Oracle's Elixir",
    url: "https://oracleselixir.com",
    desc: "League of Legends match data and analytics. CSV downloads for professional LoL match data with advanced metrics.",
    sports: ["esports"],
    category: "dataset",
    access: "free",
  },

  // ── DATASETS ── Rugby ─────────────────────────────────────────
  {
    name: "World Rugby Pulse Live API",
    url: "https://api.wr-rims-prod.pulselive.com/rugby/v3/match",
    desc: "Public API for all World Rugby matches from 1950 to present. Men's 15s, Women's 15s, 7s, U20. Scores, venues, attendance, competitions. No auth required. ~2,000+ matches/year across all formats.",
    sports: ["rugby"],
    category: "dataset",
    access: "free",
    onPlatform: "14,329 matches (2015-2026) in our database via our Python scraper.",
  },
  {
    name: "ESPN Scrum",
    url: "https://www.espn.co.uk/rugby/",
    desc: "Rugby union statistics and match data for international and domestic competitions via ESPN.",
    sports: ["rugby"],
    category: "dataset",
    access: "free",
  },

  // ── DATASETS ── Lacrosse ─────────────────────────────────────
  {
    name: "NCAA Lacrosse Data (octonion/lacrosse)",
    url: "https://github.com/octonion/lacrosse",
    desc: "NCAA men's and women's lacrosse data: match results, play-by-play, D1/D2/D3, MLL, and NLL. SQL analytics with SOS models. Ruby scrapers from NCAA website.",
    sports: ["multi_sport"],
    category: "dataset",
    access: "free",
  },

  // ── DATASETS ── Boxing/MMA ───────────────────────────────────
  {
    name: "BoxRec Data (octonion/boxing)",
    url: "https://github.com/octonion/boxing",
    desc: "Comprehensive professional boxing fight data scraped from BoxRec: all 17 weight divisions with fighter records, fight results, and bout details. 90+ MB of CSV data. Ruby scrapers included.",
    sports: ["boxing_mma"],
    category: "dataset",
    access: "free",
  },

  // ── DATASETS ── AFL ─────────────────────────────────────────
  {
    name: "AFL Match Data (octonion/afl)",
    url: "https://github.com/octonion/afl",
    desc: "Australian Football League match data 2017-2025, updated weekly during season. CSV format with scores, teams, and SOS (Strength of Schedule) analytics. PostgreSQL schema included.",
    sports: ["australian_football"],
    category: "dataset",
    access: "free",
  },

  // ── DATASETS ── Motorsport ────────────────────────────────────
  {
    name: "OpenF1",
    url: "https://openf1.org",
    desc: "Free, open API for real-time and historical Formula 1 data: car telemetry, lap times, radio messages, and pit stops.",
    sports: ["motorsport"],
    category: "dataset",
    access: "free",
  },
  {
    name: "Jolpica-F1 API (formerly Ergast)",
    url: "https://github.com/jolpica/jolpica-f1",
    desc: "Community continuation of the Ergast F1 API. Race results, driver standings, lap times, and circuit data from 1950 to present.",
    sports: ["motorsport"],
    category: "dataset",
    access: "free",
  },

  // ── DATASETS ── Golf ──────────────────────────────────────────
  {
    name: "DataGolf",
    url: "https://datagolf.com",
    desc: "Golf analytics and predictions. Historical tournament data, strokes gained metrics, and predictive models for PGA Tour and beyond.",
    sports: ["golf"],
    category: "dataset",
    access: "freemium",
  },

  // ── DATASETS ── Figure Skating ───────────────────────────────
  {
    name: "ISU Results & Protocols",
    url: "https://www.isuresults.com/results",
    desc: "Official International Skating Union competition results. Includes Judges Details per Skater PDFs with element-by-element GOE scores (J1-J9) and component scores for World Championships, Olympics, Europeans, Four Continents from 2004-present.",
    sports: ["figure_skating"],
    category: "dataset",
    access: "free",
    onPlatform: "108,000+ element/component scores parsed from ISU protocol PDFs (2010-2024).",
  },
  {
    name: "SkatingScores.com",
    url: "https://skatingscores.com",
    desc: "Community-maintained figure skating results database. Competition results for senior men, women, pairs, and ice dance from ISU championships, Grand Prix, Olympics from 2003-present. Partially behind Patreon paywall for detailed data.",
    sports: ["figure_skating"],
    category: "dataset",
    access: "freemium",
    onPlatform: "3,134 competition results scraped (2003-2025 seasons).",
  },
  {
    name: "BuzzFeed Figure Skating Bias Analysis",
    url: "https://github.com/BuzzFeedNews/2018-02-figure-skating-analysis",
    desc: "BuzzFeed News investigation into nationalistic bias in figure skating judging. 214,531 individual judge scores (J1-J9 per element) across 17 major ISU competitions (2016-2017). Includes judge nationality mapping and GOE translations.",
    sports: ["figure_skating"],
    category: "dataset",
    access: "free",
    onPlatform: "Full dataset (214K+ judge scores) available on our platform.",
  },
  {
    name: "BuzzFeed 2018 Olympic Figure Skating",
    url: "https://github.com/BuzzFeedNews/2018-02-olympic-figure-skating-analysis",
    desc: "Judge-level scoring data from the 2018 PyeongChang Winter Olympics figure skating events. Individual judge scores, performances, and judge nationality data for bias analysis.",
    sports: ["figure_skating"],
    category: "dataset",
    access: "free",
  },

  // ── DATASETS ── Gymnastics ─────────────────────────────────────
  {
    name: "UCSAS Gymnastics Data (gym2024)",
    url: "https://github.com/ucsas/gym2024data",
    desc: "Comprehensive artistic gymnastics dataset from UCSAS 2024 Data Challenge. 25,483 routines across 40+ competitions (2017-2023): D-score, E-score, penalties per apparatus. 200+ original FIG PDFs included. Men's and women's events.",
    sports: ["gymnastics"],
    category: "dataset",
    access: "free",
    onPlatform: "Full dataset (25K+ routines) available on our platform.",
  },

  // ── DATASETS ── Diving ─────────────────────────────────────────
  {
    name: "Yale Diving 2000 (Sydney Olympics)",
    url: "https://doi.org/10.1016/j.econedurev.2004.06.001",
    desc: "Academic dataset from Emerson et al. (Yale) on nationalistic bias in Olympic diving. 10,787 individual judge scores from the 2000 Sydney Olympics across all diving events. Includes judge nationality, diver nationality, difficulty, and scores.",
    sports: ["diving"],
    category: "dataset",
    access: "free",
    onPlatform: "Full dataset (10,787 judge scores) available on our platform.",
  },

  // ── DATASETS ── Swimming ──────────────────────────────────────
  {
    name: "World Aquatics Results",
    url: "https://www.worldaquatics.com/swimming/results",
    desc: "Official World Aquatics competition results database for swimming, diving, water polo, and artistic swimming.",
    sports: ["swimming"],
    category: "dataset",
    access: "free",
  },

  // ── DATASETS ── Volleyball ────────────────────────────────────
  {
    name: "OpenVolley Data",
    url: "https://github.com/openvolley",
    desc: "Open-source volleyball analytics: match data, play-by-play files, and DataVolley format tools for men's and women's volleyball.",
    sports: ["volleyball"],
    category: "dataset",
    access: "free",
  },

  // ── DATASETS ── Multi-sport & Cross-sport ─────────────────────
  {
    name: "octonion/soccer — Multi-League Data",
    url: "https://github.com/octonion/soccer",
    desc: "161-star soccer analytics repo: EPL, MLS, La Liga, Bundesliga, Serie A, Ligue 1, Scottish Premiership, FIFA tournaments, Copa Am\u00e9rica, DSTV, and UEFA data. SQL schemas, CSV data, SOS models, Elo ratings, and predictions. Men's + women's.",
    sports: ["football"],
    category: "dataset",
    access: "free",
  },
  {
    name: "Transfermarkt Datasets (GitHub)",
    url: "https://github.com/dcaribou/transfermarkt-datasets",
    desc: "Clean, weekly-updated CSV exports of Transfermarkt data: 60K+ matches, 30K+ players, 400K+ market valuations, 1.2M+ appearance records. CC0 licensed. Also on Kaggle (61K downloads).",
    sports: ["football"],
    category: "dataset",
    access: "free",
  },
  {
    name: "NBA Database 1947–Present (Kaggle)",
    url: "https://www.kaggle.com/datasets/eoinamoore/historical-nba-data-and-player-box-scores",
    desc: "Daily-updated NBA dataset: every player box score, team box score, and game since 1947. Plus play-by-play since 1996-97. 917 MB, CC0 license. Source: NBA.com.",
    sports: ["basketball"],
    category: "dataset",
    access: "free",
  },
  {
    name: "ESPN Soccer Data",
    url: "https://www.kaggle.com/datasets/excel4soccer/espn-soccer-data",
    desc: "Daily-updated dataset from ESPN Soccer API: 30K+ match fixtures, lineups, play-by-play, commentary, and player stats across 400+ leagues worldwide. 170 MB.",
    sports: ["football"],
    category: "dataset",
    access: "free",
  },
  {
    name: "Sports Betting Analytics (octonion/betting)",
    url: "https://github.com/octonion/betting",
    desc: "Kelly criterion implementations, horse racing analytics, and betting strategy experiments. Python tools for analyzing odds, calculating optimal bet sizes, and simulating strategies. 42 stars, includes academic papers.",
    sports: ["multi_sport"],
    category: "dataset",
    access: "free",
  },
  {
    name: "Betfair Starting Prices (Kaggle)",
    url: "https://www.kaggle.com/datasets/eonsky/betfair-sp",
    desc: "Historical Betfair exchange starting prices across multiple sports. 1.3 GB, daily updated. Useful for betting market efficiency research and odds modeling.",
    sports: ["multi_sport"],
    category: "dataset",
    access: "free",
  },
  {
    name: "NFL Scores & Betting Data",
    url: "https://www.kaggle.com/datasets/tobycrabtree/nfl-scores-and-betting-data",
    desc: "NFL game scores with point spreads, over/unders, and actual outcomes. Updated weekly through current season. 500+ votes, actively maintained.",
    sports: ["american_football"],
    category: "dataset",
    access: "free",
  },
  {
    name: "UFC Betting Odds (Daily Updated)",
    url: "https://www.kaggle.com/datasets/jerzyszocik/ufc-betting-odds-daily-dataset",
    desc: "Daily-updated UFC/MMA betting odds dataset. Opening and closing lines, fighter stats. Useful for combat sports analytics and prediction models.",
    sports: ["boxing_mma"],
    category: "dataset",
    access: "free",
  },
  {
    name: "Olympedia Web Scraping Dataset",
    url: "https://github.com/josephwccheng/olympedia_web_scraping",
    desc: "Complete Olympic athlete and event results from Athens 1896 to Beijing 2022 Winter. 314,907 athlete-event results with biographical data, medal tallies, and event details. Scraped from olympedia.org with data validation and cleaning.",
    sports: ["multi_sport"],
    category: "dataset",
    access: "free",
    onPlatform: "Full dataset (314K+ Olympic results, 1896-2022) available on our platform.",
  },
  {
    name: "120 Years of Olympic History",
    url: "https://www.kaggle.com/datasets/heesoo37/120-years-of-olympic-history-athletes-and-results",
    desc: "All Olympic athletes and results from Athens 1896 to Rio 2016. 270K records with gender, age, height, weight, team, medals. 225K downloads, the definitive Olympics dataset.",
    sports: ["multi_sport"],
    category: "dataset",
    access: "free",
  },
  {
    name: "octonion Sports Analytics Collection",
    url: "https://github.com/octonion?tab=repositories",
    desc: "Massive multi-sport analytics collection by Christopher Long. 20+ repos covering rugby, soccer, basketball, hockey, baseball, boxing, lacrosse, AFL, volleyball, cricket, and more. Ruby/SQL scrapers with CSV data. Rugby repo updated daily from World Rugby API (1950-present).",
    sports: ["multi_sport"],
    category: "dataset",
    access: "free",
  },
  {
    name: "OpenAlex",
    url: "https://openalex.org",
    desc: "Open catalog of scholarly research. We use it to discover and index sports analytics publications. REST API with generous rate limits.",
    sports: ["multi_sport"],
    category: "dataset",
    access: "free",
    onPlatform: "39,480 papers indexed from OpenAlex.",
  },
  {
    name: "Sports Reference",
    url: "https://www.sports-reference.com",
    desc: "Family of sports statistics sites: Baseball-Reference, Basketball-Reference, Hockey-Reference, Pro-Football-Reference, and FBref.",
    sports: ["multi_sport"],
    category: "dataset",
    access: "free",
  },

  // ═════════════════════════════════════════════════════════════
  //  SCRAPERS & DATA TOOLS
  // ═════════════════════════════════════════════════════════════

  // ── Football ──────────────────────────────────────────────────
  {
    name: "soccerdata",
    url: "https://github.com/probberechts/soccerdata",
    desc: "Python package to scrape football data from Club Elo, ESPN, FBref, FiveThirtyEight, SoFIFA, Understat, and WhoScored.",
    sports: ["football"],
    category: "scraper",
    access: "free",
    language: "Python",
  },
  {
    name: "Our scraper: Transfermarkt",
    url: "https://github.com/mwolters-cmyk/living-sports-analytics-research",
    desc: "Generic, self-contained Transfermarkt scraper built on Scrapy. 9 data types: competitions, clubs, players, profiles, games, lineups, appearances, market values, player search. Supports single queries and batch mode (JSONL piping). Rate-limited with HTTP caching.",
    sports: ["football"],
    category: "scraper",
    access: "free",
    language: "Python",
    onPlatform: "scrapers/scrape_transfermarkt.py — pip install scrapy inflection",
  },
  {
    name: "Our scraper: FBref",
    url: "https://github.com/mwolters-cmyk/living-sports-analytics-research",
    desc: "Generic, self-contained FBref scraper. Extracts schedules, player minutes per match, and player IDs for 63 competitions across 25+ countries. Includes Cloudflare bypass via cookie import, bulk scraping with pause/resume, and hidden HTML comment table extraction.",
    sports: ["football"],
    category: "scraper",
    access: "free",
    language: "Python",
    onPlatform: "scrapers/scrape_fbref.py — pip install requests beautifulsoup4 pandas cloudscraper",
  },
  {
    name: "ScraperFC",
    url: "https://github.com/oseymour/ScraperFC",
    desc: "Python scraper for FBref, Transfermarkt, Understat, Capology (wages), FotMob, and SofaScore.",
    sports: ["football"],
    category: "scraper",
    access: "free",
    language: "Python",
  },
  {
    name: "worldfootballR",
    url: "https://github.com/JaseZiv/worldfootballR",
    desc: "R package for extracting football data from FBref, Transfermarkt, Understat, and Fotmob. CRAN-installable.",
    sports: ["football"],
    category: "scraper",
    access: "free",
    language: "R",
  },
  {
    name: "Open Football",
    url: "https://github.com/openfootball",
    desc: "Open football data project: league standings, match results, and schedules as structured text files for 50+ leagues.",
    sports: ["football"],
    category: "scraper",
    access: "free",
    language: "Any",
  },
  {
    name: "Our scraper: StatsBomb + Open Data",
    url: "https://github.com/mwolters-cmyk/living-sports-analytics-research",
    desc: "Downloads StatsBomb open data, martj42 international results, and EWF database. Produces normalized CSVs with gender tagging.",
    sports: ["football"],
    category: "scraper",
    access: "free",
    language: "Python",
    onPlatform: "scrapers/scrape_football_opendata.py",
  },
  {
    name: "Our scraper: API-Football Women's",
    url: "https://github.com/mwolters-cmyk/living-sports-analytics-research",
    desc: "Scraper for API-Football targeting 8 women's leagues: NWSL, Frauen BL, D1F, Liga F, Serie A W, Eredivisie W, UWCL, WWC.",
    sports: ["football"],
    category: "scraper",
    access: "free",
    language: "Python",
    onPlatform: "scrapers/scrape_apifootball_women.py (requires API key)",
  },
  {
    name: "Our scraper: Women's Football (StatsBomb + soccerdata)",
    url: "https://github.com/mwolters-cmyk/living-sports-analytics-research",
    desc: "Uses StatsBomb open data (CC-BY-NC-SA) and soccerdata package for FBref access. Women's matches, lineups, and team stats. Ethical: no direct HTML scraping.",
    sports: ["football"],
    category: "scraper",
    access: "free",
    language: "Python",
    onPlatform: "scrapers/scrape_fbref_womens_football.py",
  },

  {
    name: "Our scraper: Oddschecker Odds",
    url: "https://github.com/mwolters-cmyk/living-sports-analytics-research",
    desc: "Scrapes 1x2 betting odds from Oddschecker.com for Bet365, Unibet, BetMGM UK (configurable). Self-discovering: finds match URLs by scraping competition pages. Fuzzy team name matching. Extracts embedded JSON from page scripts.",
    sports: ["football"],
    category: "scraper",
    access: "free",
    language: "Python",
    onPlatform: "footballelo/fapi_elo/pipeline/scrapers/oddschecker_scraper.py — requires undetected-chromedriver + Chrome.",
  },
  {
    name: "Our scraper: OddsPortal Odds",
    url: "https://github.com/mwolters-cmyk/living-sports-analytics-research",
    desc: "Backup odds scraper using Playwright to scrape OddsPortal.com for Bet365 and Pinnacle odds. League-level match discovery, same interface as Oddschecker scraper for easy swapping.",
    sports: ["football"],
    category: "scraper",
    access: "free",
    language: "Python",
    onPlatform: "footballelo/fapi_elo/pipeline/scrapers/oddsportal_scraper.py — requires playwright + chromium.",
  },

  // ── Tennis ────────────────────────────────────────────────────
  {
    name: "Our scraper: WTA/ATP Tennis",
    url: "https://github.com/mwolters-cmyk/living-sports-analytics-research",
    desc: "Downloads Jeff Sackmann's WTA and ATP match data from GitHub. Consolidated CSVs with gender tagging.",
    sports: ["tennis"],
    category: "scraper",
    access: "free",
    language: "Python",
    onPlatform: "scrapers/scrape_wta_tennis.py",
  },

  // ── Basketball ────────────────────────────────────────────────
  {
    name: "nba_api",
    url: "https://github.com/swar/nba_api",
    desc: "Python client for the official NBA Stats API. Access all endpoints for NBA and WNBA: player stats, shot charts, tracking, play-by-play.",
    sports: ["basketball"],
    category: "scraper",
    access: "free",
    language: "Python",
  },
  {
    name: "pbpstats",
    url: "https://github.com/dblackrun/pbpstats",
    desc: "Python package to scrape and parse NBA, WNBA, and G-League play-by-play data. Possession-level analysis with shot clock data. Verified: loads boxscores and play-by-play from stats.nba.com.",
    sports: ["basketball"],
    category: "scraper",
    access: "free",
    language: "Python",
    onPlatform: "pip install pbpstats \u2014 tested: NBA 2024-25 game data loads successfully.",
  },
  {
    name: "hoopR",
    url: "https://github.com/sportsdataverse/hoopR",
    desc: "R package for accessing NBA and men's college basketball data. Part of the SportsDataverse ecosystem.",
    sports: ["basketball"],
    category: "scraper",
    access: "free",
    language: "R",
  },
  {
    name: "wehoop",
    url: "https://github.com/sportsdataverse/wehoop",
    desc: "R package for WNBA and women's college basketball data. Mirrors hoopR for women's basketball.",
    sports: ["basketball"],
    category: "scraper",
    access: "free",
    language: "R",
  },
  {
    name: "Our scraper: WNBA/NBA (nba_api)",
    url: "https://github.com/mwolters-cmyk/living-sports-analytics-research",
    desc: "Uses nba_api package for official NBA/WNBA stats. Team stats, player stats, all-time player directory. Ethical: official API, no HTML scraping.",
    sports: ["basketball"],
    category: "scraper",
    access: "free",
    language: "Python",
    onPlatform: "scrapers/scrape_wnba.py",
  },

  {
    name: "Our scraper: Baseball (pybaseball)",
    url: "https://github.com/mwolters-cmyk/living-sports-analytics-research",
    desc: "Uses pybaseball for FanGraphs batting/pitching stats and Statcast exit velocity data. Configurable seasons, stat types. Ethical: uses official public APIs.",
    sports: ["baseball"],
    category: "scraper",
    access: "free",
    language: "Python",
    onPlatform: "scrapers/scrape_baseball.py",
  },

  // ── Baseball ──────────────────────────────────────────────────
  {
    name: "pybaseball",
    url: "https://github.com/jldbc/pybaseball",
    desc: "Python package for Baseball Reference, FanGraphs, and Statcast data including pitch-level tracking.",
    sports: ["baseball"],
    category: "scraper",
    access: "free",
    language: "Python",
  },
  {
    name: "baseballr",
    url: "https://github.com/BillPetti/baseballr",
    desc: "R package for MLB Stats API, Statcast, FanGraphs, and Baseball Reference data.",
    sports: ["baseball"],
    category: "scraper",
    access: "free",
    language: "R",
  },

  // ── American Football ─────────────────────────────────────────
  {
    name: "nflreadpy (replaces nfl_data_py)",
    url: "https://github.com/nflverse/nflreadpy",
    desc: "Python package for downloading NFL data from nflverse. Successor to the archived nfl_data_py. Rosters, player stats, schedules, combine results, snap counts, draft picks, and play-by-play. Uses Polars for fast data loading. CC-BY 4.0.",
    sports: ["american_football"],
    category: "scraper",
    access: "free",
    language: "Python",
    onPlatform: "pip install nflreadpy \u2014 tested: 3,216 rosters, 18,981 player stats, 285 games (2024 season).",
  },
  {
    name: "nflfastR",
    url: "https://github.com/nflverse/nflfastR",
    desc: "R package for fast NFL play-by-play data with EPA (Expected Points Added) and WPA calculations. The standard in NFL analytics.",
    sports: ["american_football"],
    category: "scraper",
    access: "free",
    language: "R",
  },

  {
    name: "Our scraper: Hockey (MoneyPuck + NHL API)",
    url: "https://github.com/mwolters-cmyk/living-sports-analytics-research",
    desc: "Downloads MoneyPuck CSV data (skaters, goalies, teams) and NHL Stats API standings. Includes PWHL women's hockey. Ethical: free CSV downloads + public APIs.",
    sports: ["ice_hockey"],
    category: "scraper",
    access: "free",
    language: "Python",
    onPlatform: "scrapers/scrape_hockey.py",
  },

  // ── Ice Hockey ────────────────────────────────────────────────
  {
    name: "hockey-scraper",
    url: "https://github.com/HarryShomer/Hockey-Scraper",
    desc: "Python package to scrape NHL play-by-play, shift, and schedule data from NHL.com and ESPN.",
    sports: ["ice_hockey"],
    category: "scraper",
    access: "free",
    language: "Python",
  },
  {
    name: "fastRhockey",
    url: "https://github.com/sportsdataverse/fastRhockey",
    desc: "R package for NHL and PHF (women's hockey) data. Part of the SportsDataverse ecosystem.",
    sports: ["ice_hockey"],
    category: "scraper",
    access: "free",
    language: "R",
  },

  {
    name: "Our scraper: Cricket (Cricsheet)",
    url: "https://github.com/mwolters-cmyk/living-sports-analytics-research",
    desc: "Downloads Cricsheet ball-by-ball data (CC-BY 4.0). Tests, ODIs, T20s plus IPL, BBL, WBBL, WPL. Both genders. Ethical: free open data downloads.",
    sports: ["cricket"],
    category: "scraper",
    access: "free",
    language: "Python",
    onPlatform: "scrapers/scrape_cricket.py",
  },

  // ── Cricket ───────────────────────────────────────────────────
  {
    name: "cricketdata (R)",
    url: "https://github.com/robjhyndman/cricketdata",
    desc: "R package by Rob Hyndman for fetching ball-by-ball, match, and player data from ESPNcricinfo and Cricsheet.",
    sports: ["cricket"],
    category: "scraper",
    access: "free",
    language: "R",
  },
  {
    name: "python-espncricinfo",
    url: "https://github.com/dwillis/python-espncricinfo",
    desc: "Python client for ESPNcricinfo: player profiles, match details, and batting/bowling scorecards.",
    sports: ["cricket"],
    category: "scraper",
    access: "free",
    language: "Python",
  },

  // ── Cycling ───────────────────────────────────────────────────
  {
    name: "Our scraper: Cycling (Open Data + GitHub)",
    url: "https://github.com/mwolters-cmyk/living-sports-analytics-research",
    desc: "Downloads cycling data from GitHub open datasets and CyclingArchives. UCI rankings, race results. Ethical: public datasets only, no scraping of blocked sites.",
    sports: ["cycling"],
    category: "scraper",
    access: "free",
    language: "Python",
    onPlatform: "scrapers/scrape_firstcycling_women.py + scrape_cycling_github.py",
  },

  // ── Athletics ─────────────────────────────────────────────────
  {
    name: "Our scraper: World Athletics",
    url: "https://github.com/mwolters-cmyk/living-sports-analytics-research",
    desc: "Uses World Athletics API endpoints for records and all-time top lists. Women's and men's events. Ethical: public API, respects rate limits.",
    sports: ["athletics"],
    category: "scraper",
    access: "free",
    language: "Python",
    onPlatform: "scrapers/scrape_world_athletics.py",
  },
  {
    name: "Our scraper: Sporthive Running (35+ events)",
    url: "https://github.com/mwolters-cmyk/living-sports-analytics-research",
    desc: "Scrapes results from 35+ major running events via Sporthive/MYLAPS API: marathons (Amsterdam, Rotterdam, Eindhoven, Lisbon), half marathons (Cardiff, Manchester, Egmond, London Landmarks), Dam tot Damloop (52K), Zevenheuvelenloop. Chip times, splits, gender, age category, nationality. Also indexes ~5.4M Kaggle marathon results. Ethical: public API, rate limited.",
    sports: ["athletics"],
    category: "scraper",
    access: "free",
    language: "Python",
    onPlatform: "scrapers/scrape_sporthive.py",
  },
  {
    name: "Our scraper: Sporthive Cycling (20 sportives)",
    url: "https://github.com/mwolters-cmyk/living-sports-analytics-research",
    desc: "Scrapes results from 20 major cycling sportives via Sporthive/MYLAPS API: Cyclassics Hamburg (12K), Dragon Ride, GP Egmond-Pier-Egmond, Etape Caledonia, L'Etape by Tour de France, London to Brighton, Bartje 200, Veldslag om Norg, and more. Finish times, gender, nationality. Ethical: public API, rate limited.",
    sports: ["cycling"],
    category: "scraper",
    access: "free",
    language: "Python",
    onPlatform: "scrapers/scrape_sporthive.py",
  },

  // ── Speed Skating ─────────────────────────────────────────────
  {
    name: "Our scraper: Speed Skating",
    url: "https://github.com/mwolters-cmyk/living-sports-analytics-research",
    desc: "SpeedSkatingResults.com API + ISU database extraction. Season bests, world records, participation counts by gender.",
    sports: ["speed_skating"],
    category: "scraper",
    access: "free",
    language: "Python",
    onPlatform: "scrapers/scrape_speedskating_gender.py",
  },

  {
    name: "Our scraper: Formula 1 (Jolpica + OpenF1)",
    url: "https://github.com/mwolters-cmyk/living-sports-analytics-research",
    desc: "Uses Jolpica-F1 API (Ergast successor) for historical race results, standings, and drivers. Plus OpenF1 for real-time session data. Ethical: free public APIs.",
    sports: ["motorsport"],
    category: "scraper",
    access: "free",
    language: "Python",
    onPlatform: "scrapers/scrape_f1.py",
  },

  // ── Motorsport ─────────────────────────────────────────────────
  {
    name: "FastF1",
    url: "https://github.com/theOehrly/Fast-F1",
    desc: "Python package for accessing F1 timing data, telemetry, session results, and weather data. pip install fastf1.",
    sports: ["motorsport"],
    category: "scraper",
    access: "free",
    language: "Python",
  },

  // ── eSports ───────────────────────────────────────────────────
  {
    name: "awpy",
    url: "https://github.com/pnxenopoulos/awpy",
    desc: "Python library for parsing and analyzing CS2 demo files. Extract round-by-round events, player positions, and utility usage.",
    sports: ["esports"],
    category: "scraper",
    access: "free",
    language: "Python",
  },

  // ── Volleyball ────────────────────────────────────────────────
  {
    name: "pydatavolley",
    url: "https://github.com/openvolley/pydatavolley",
    desc: "Python package for reading DataVolley files (the standard format for professional volleyball analytics).",
    sports: ["volleyball"],
    category: "scraper",
    access: "free",
    language: "Python",
  },

  // ── Multi-sport ───────────────────────────────────────────────
  {
    name: "espn_scraper",
    url: "https://github.com/andr3w321/espn_scraper",
    desc: "Python package to scrape ESPN scoreboards, boxscores, and play-by-play for 8 leagues: NFL, NBA, MLB, NHL, NCAAF, NCAAB, NCAAW, and WNBA. Returns parsed JSON from ESPN's API. Includes schedule URLs by date range.",
    sports: ["american_football", "basketball", "baseball", "ice_hockey"],
    category: "scraper",
    access: "free",
    language: "Python",
    onPlatform: "pip install espn-scraper \u2014 tested: NBA scoreboards, NFL teams load correctly.",
  },
  {
    name: "SportsDataverse",
    url: "https://sportsdataverse.org",
    desc: "Ecosystem of R and Python packages for sports data: hoopR, wehoop, fastRhockey, cfbfastR, baseballr, and more.",
    sports: ["multi_sport"],
    category: "scraper",
    access: "free",
    language: "R",
  },

  // ═════════════════════════════════════════════════════════════
  //  PYTHON / R LIBRARIES
  // ═════════════════════════════════════════════════════════════

  // ── Football ──────────────────────────────────────────────────
  {
    name: "kloppy",
    url: "https://kloppy.pysport.org",
    desc: "Load event and tracking data from StatsBomb, Opta, Metrica, SkillCorner, Wyscout, and more into a standardized format.",
    sports: ["football"],
    category: "library",
    access: "free",
    language: "Python",
  },
  {
    name: "socceraction",
    url: "https://socceraction.readthedocs.io",
    desc: "SPADL/Atomic-SPADL representations and action valuations (VAEP, xT). Developed at KU Leuven by Tom Decroos and Lotte Bransen.",
    sports: ["football"],
    category: "library",
    access: "free",
    language: "Python",
  },
  {
    name: "databallpy",
    url: "https://databallpy.readthedocs.io",
    desc: "Load, synchronize and analyze football event and tracking data from multiple providers.",
    sports: ["football"],
    category: "library",
    access: "free",
    language: "Python",
  },
  {
    name: "floodlight",
    url: "https://floodlight.readthedocs.io",
    desc: "Geometric, kinematic, and metabolic power metrics from tracking data. Supports Tracab, DFL, and Kinexon.",
    sports: ["football"],
    category: "library",
    access: "free",
    language: "Python",
  },
  {
    name: "statsbombpy",
    url: "https://github.com/statsbomb/statsbombpy",
    desc: "Official StatsBomb Python library. Load free and licensed event data into pandas DataFrames.",
    sports: ["football"],
    category: "library",
    access: "free",
    language: "Python",
  },
  {
    name: "mplsoccer",
    url: "https://mplsoccer.readthedocs.io",
    desc: "Pitch plots, heatmaps, pass maps, shot maps, Voronoi diagrams, and other football visualizations with matplotlib.",
    sports: ["football"],
    category: "library",
    access: "free",
    language: "Python",
  },
  {
    name: "soccer_xg",
    url: "https://github.com/ML-KULeuven/soccer_xg",
    desc: "Train and analyze expected goals (xG) models. By the ML group at KU Leuven. Custom feature engineering support.",
    sports: ["football"],
    category: "library",
    access: "free",
    language: "Python",
  },
  {
    name: "penaltyblog",
    url: "https://github.com/martineastwood/penaltyblog",
    desc: "Dixon-Coles, Bivariate Poisson, and other models for estimating team abilities and predicting match outcomes.",
    sports: ["football"],
    category: "library",
    access: "free",
    language: "Python",
  },
  {
    name: "football-data-analytics",
    url: "https://github.com/jakeyk11/football-data-analytics",
    desc: "Ready-made analysis scripts for player, team, and match analyses using StatsBomb data. Great for learning.",
    sports: ["football"],
    category: "library",
    access: "free",
    language: "Python",
  },
  {
    name: "codeball",
    url: "https://github.com/metrica-sports/codeball",
    desc: "Pitch control models, passing models, and tracking data analysis tools by Metrica Sports.",
    sports: ["football"],
    category: "library",
    access: "free",
    language: "Python",
  },
  {
    name: "understatapi",
    url: "https://github.com/collinb9/understatapi",
    desc: "Python client for Understat.com xG data. League team stats, player shot data (1,462 Messi shots with xG/position), and match-level shot maps. Covers Big 5 + Russian Premier League since 2014/15.",
    sports: ["football"],
    category: "library",
    access: "free",
    language: "Python",
    onPlatform: "pip install understatapi — tested: EPL 2024 (20 teams), player xG shots, match shot maps all load correctly.",
  },

  // ── Multi-sport / General ─────────────────────────────────────
  {
    name: "PySport",
    url: "https://pysport.org",
    desc: "Directory of 40+ open-source Python projects for sports analytics. Curated ecosystem overview across all sports.",
    sports: ["multi_sport"],
    category: "library",
    access: "free",
    language: "Python",
  },
  {
    name: "sportsipy",
    url: "https://github.com/roclark/sportsipy",
    desc: "Python wrapper for Sports Reference sites: MLB, NBA, NFL, NHL, NCAAB, and NCAAF through a unified interface.",
    sports: ["multi_sport"],
    category: "library",
    access: "free",
    language: "Python",
  },
  {
    name: "great_tables",
    url: "https://posit-dev.github.io/great-tables/articles/intro.html",
    desc: "Publication-quality data tables in Python. Not sport-specific, but widely used for presenting analytics output.",
    sports: ["multi_sport"],
    category: "library",
    access: "free",
    language: "Python",
  },
  {
    name: "sportypy",
    url: "https://github.com/sportsdataverse/sportypy",
    desc: "Draw regulation-accurate playing surfaces for 7 sports: soccer, basketball (NBA/NCAA/WNBA/FIBA), American football (NFL/NCAA), ice hockey (NHL/IIHF), baseball (MLB), tennis (ATP/WTA/ITF), and curling. Matplotlib-based.",
    sports: ["multi_sport"],
    category: "library",
    access: "free",
    language: "Python",
    onPlatform: "pip install sportypy — tested: SoccerPitch, NBACourt, NFLField, NHLRink, MLBField, TennisCourt all render correctly.",
  },
  {
    name: "highlight_text",
    url: "https://github.com/znstrider/highlight_text",
    desc: "Create colored/styled inline text annotations in matplotlib plots. Widely used in sports analytics for team-colored labels, match reports, and branded visualizations.",
    sports: ["multi_sport"],
    category: "library",
    access: "free",
    language: "Python",
    onPlatform: "pip install highlight_text — tested: ax_text() and fig_text() work for colored team name annotations.",
  },

  // ═════════════════════════════════════════════════════════════
  //  PAID APIs
  // ═════════════════════════════════════════════════════════════

  {
    name: "API-Football",
    url: "https://www.api-football.com",
    desc: "RESTful API: live scores, match stats, lineups, standings, odds for 800+ leagues. Free tier: 100 req/day.",
    sports: ["football"],
    category: "api",
    access: "freemium",
    onPlatform: "5,047 women's matches scraped via Pro plan.",
  },
  {
    name: "Opta / Stats Perform",
    url: "https://www.statsperform.com/opta/",
    desc: "Premium event data provider used by most professional clubs and broadcasters. The gold standard for commercial football data.",
    sports: ["football"],
    category: "api",
    access: "paid",
  },
  {
    name: "Sportradar",
    url: "https://sportradar.com",
    desc: "Multi-sport data API covering 60+ sports. Live odds, statistics, play-by-play. Powers many betting and media companies.",
    sports: ["multi_sport"],
    category: "api",
    access: "paid",
  },
  {
    name: "Genius Sports",
    url: "https://geniussports.com",
    desc: "Official data partner for NFL, NCAA, Premier League. Live data, tracking, and integrity services.",
    sports: ["multi_sport"],
    category: "api",
    access: "paid",
  },
  {
    name: "Betfair Exchange API",
    url: "https://developer.betfair.com",
    desc: "Betfair exchange odds and market data via API. Historical data available for research. Free API key for registered users.",
    sports: ["multi_sport"],
    category: "api",
    access: "freemium",
  },
  {
    name: "The Odds API",
    url: "https://the-odds-api.com",
    desc: "Aggregated odds from 30+ bookmakers for football, basketball, tennis, baseball, and more. 500 free requests/month.",
    sports: ["multi_sport"],
    category: "api",
    access: "freemium",
  },
  {
    name: "Football-Data.org",
    url: "https://www.football-data.org",
    desc: "RESTful API for competitions, teams, matches, and standings. Free tier covers major European leagues.",
    sports: ["football"],
    category: "api",
    access: "freemium",
  },
  {
    name: "SofaScore API",
    url: "https://www.sofascore.com",
    desc: "Live scores and detailed match statistics for 20+ sports. Used by ScraperFC for programmatic access.",
    sports: ["multi_sport"],
    category: "api",
    access: "paid",
  },
  {
    name: "Catapult / Second Spectrum",
    url: "https://www.catapultsports.com",
    desc: "Optical tracking and wearable sensor data. Used by 3,000+ professional teams for performance and tactical analysis.",
    sports: ["multi_sport"],
    category: "api",
    access: "paid",
  },
  {
    name: "SkillCorner (Commercial)",
    url: "https://skillcorner.com",
    desc: "Broadcast-derived tracking data for 50+ football competitions. Physical and tactical metrics. Academic pricing available.",
    sports: ["football"],
    category: "api",
    access: "paid",
  },
  {
    name: "Wyscout (Commercial)",
    url: "https://wyscout.com",
    desc: "Professional video and data platform for football scouting. Event data for 200+ competitions. Academic access available.",
    sports: ["football"],
    category: "api",
    access: "paid",
  },
  {
    name: "InStat",
    url: "https://instatsport.com",
    desc: "Video analysis and event data for football, basketball, ice hockey, and handball. Used by 1,000+ professional teams.",
    sports: ["football", "basketball", "ice_hockey", "handball"],
    category: "api",
    access: "paid",
  },

  /* ─── Triathlon & Endurance ─── */
  {
    name: "World Triathlon API",
    url: "https://developers.triathlon.org/",
    desc: "Official World Triathlon (ITU) API with events, results, athletes, rankings, and live timing. Free API key registration. Covers all WTCS, World Cup, and Olympic events.",
    sports: ["triathlon"],
    category: "dataset",
    access: "free",
    onPlatform: "24,786 results from 130 events (WTCS, Continental Cups, Age Groups, Para) in our database.",
  },
  {
    name: "IRONMAN Results (competitor.com)",
    url: "https://github.com/colinlord/ironman-results",
    desc: "IRONMAN and 70.3 race results from competitor.com. 30+ fields per athlete: swim/bike/run splits, transitions, rankings. Open-source scraper available.",
    sports: ["triathlon"],
    category: "dataset",
    access: "free",
  },
  {
    name: "PTO Stats",
    url: "https://stats.protriathletes.org/results",
    desc: "Professional Triathletes Organisation stats: race results, PTO World Rankings, T100 standings. Swim/bike/run splits and PTO points for pro athletes.",
    sports: ["triathlon"],
    category: "dataset",
    access: "free",
    onPlatform: "1,754 pro results from 50 races in our database.",
  },
  {
    name: "RunSignup API",
    url: "https://runsignup.com/API",
    desc: "JSON API for 28,000+ US running events. Gender, age, splits, pace, chip time. Free API key registration required for results access. The largest US race results platform.",
    sports: ["athletics"],
    category: "dataset",
    access: "freemium",
  },
  {
    name: "ChronoRace",
    url: "https://prod.chronorace.be/angular/results.html",
    desc: "Belgian timing company with public API for European cycling and running events. Split times in ms, nationality, birth date, team. Times UCI races and major sportives.",
    sports: ["cycling", "athletics"],
    category: "dataset",
    access: "free",
  },
  {
    name: "Berlin Marathon (SCC Events)",
    url: "https://results.bmw-berlin-marathon.com",
    desc: "BMW Berlin Marathon results on mikatiming.com platform. Gender, nationality, age class, net/gun times. One of the World Marathon Majors. 48K+ finishers per year.",
    sports: ["athletics"],
    category: "dataset",
    access: "free",
    onPlatform: "4,000 results (2019-2024) in our database.",
  },
  {
    name: "MarathonGuide.com",
    url: "https://marathonguide.com",
    desc: "US marathon race directory and calendar. Formerly a comprehensive results database (2000-2024). Site redesigned in 2025 — individual results no longer publicly accessible.",
    sports: ["athletics"],
    category: "dataset",
    access: "free",
  },
  {
    name: "Ultra-Marathon Dataset (Kaggle)",
    url: "https://www.kaggle.com/datasets/aiaiaidavid/the-big-dataset-of-ultra-marathon-running",
    desc: "7M+ ultra-marathon race records from 1798-2022. The largest publicly available endurance running dataset.",
    sports: ["athletics"],
    category: "dataset",
    access: "free",
  },

  /* ─── Our Triathlon & Endurance Scrapers ─── */
  {
    name: "Our scraper: RunSignup (US Running)",
    url: "https://github.com/Rotterdam-Sports-Analytics/Living-Meta/blob/main/scrapers/scrape_runsignup.py",
    desc: "Scrapes US running race results via RunSignup's open JSON API. Major US marathons and races with gender, age, splits, and pace.",
    sports: ["athletics"],
    category: "scraper",
    access: "free",
    language: "Python",
    onPlatform: "Our Platform",
  },
  {
    name: "Our scraper: World Triathlon (ITU)",
    url: "https://github.com/Rotterdam-Sports-Analytics/Living-Meta/blob/main/scrapers/scrape_world_triathlon.py",
    desc: "Scrapes ITU/World Triathlon race results via official API. Auto-discovers WTCS, World Cup, and Olympic events with swim/bike/run splits.",
    sports: ["triathlon"],
    category: "scraper",
    access: "free",
    language: "Python",
    onPlatform: "Our Platform",
  },
  {
    name: "Our scraper: IRONMAN Triathlon",
    url: "https://github.com/Rotterdam-Sports-Analytics/Living-Meta/blob/main/scrapers/scrape_ironman.py",
    desc: "Template scraper for IRONMAN/70.3 results from competitor.com. Currently blocked by Cloudflare bot protection. Use PTO Stats for pro results instead.",
    sports: ["triathlon"],
    category: "scraper",
    access: "free",
    language: "Python",
    onPlatform: "Our Platform",
  },
  {
    name: "Our scraper: ChronoRace (EU Cycling)",
    url: "https://github.com/Rotterdam-Sports-Analytics/Living-Meta/blob/main/scrapers/scrape_chronorace.py",
    desc: "Scrapes European cycling and running results from ChronoRace's public API. UCI races, sportives, and Belgian running events.",
    sports: ["cycling", "athletics"],
    category: "scraper",
    access: "free",
    language: "Python",
    onPlatform: "Our Platform",
  },
  {
    name: "Our scraper: Berlin Marathon",
    url: "https://github.com/Rotterdam-Sports-Analytics/Living-Meta/blob/main/scrapers/scrape_berlin_marathon.py",
    desc: "Scrapes Berlin Marathon results from mikatiming.com HTML. Gender, nationality, age group, net/gun times. Privacy: names are hashed.",
    sports: ["athletics"],
    category: "scraper",
    access: "free",
    language: "Python",
    onPlatform: "Our Platform",
  },
  {
    name: "Our scraper: MarathonGuide (US)",
    url: "https://github.com/Rotterdam-Sports-Analytics/Living-Meta/blob/main/scrapers/scrape_marathonguide.py",
    desc: "Template scraper for MarathonGuide.com. Currently inactive — site redesigned as Next.js app, individual results no longer publicly accessible.",
    sports: ["athletics"],
    category: "scraper",
    access: "free",
    language: "Python",
    onPlatform: "Our Platform",
  },
  {
    name: "rugbypy",
    url: "https://github.com/seanyboi/rugbypy",
    desc: "Python package for rugby data: 8,444 players, 289 teams, 6,171 matches (2022-2026) across 23 competitions including Six Nations, Premiership, Top 14, Japan League One, and Women's Six Nations. Match details, player stats, team lookups.",
    sports: ["rugby"],
    category: "scraper",
    access: "free",
    language: "Python",
    onPlatform: "pip install rugbypy — tested: 23 competitions, 289 teams, 6,171 matches, 8,444 players all load correctly.",
  },
  {
    name: "Our scraper: World Rugby",
    url: "https://github.com/mwolters-cmyk/living-sports-analytics-research",
    desc: "Scrapes World Rugby match results via public Pulse Live API. All international and club rugby: Men's 15s, Women's 15s, 7s, U20 from 2015-present. Scores, venues, attendance, competitions. Based on octonion/rugby API patterns. Ethical: public API, no auth needed.",
    sports: ["rugby"],
    category: "scraper",
    access: "free",
    language: "Python",
    onPlatform: "scrapers/scrape_world_rugby.py",
  },
  {
    name: "Our scraper: PTO Stats (Pro Triathlon)",
    url: "https://github.com/Rotterdam-Sports-Analytics/Living-Meta/blob/main/scrapers/scrape_pto.py",
    desc: "Scrapes professional triathlon results from PTO Stats. IRONMAN Worlds, T100, and major races with swim/bike/run splits and PTO points.",
    sports: ["triathlon"],
    category: "scraper",
    access: "free",
    language: "Python",
    onPlatform: "Our Platform",
  },
  {
    name: "Our scraper: SkatingScores.com",
    url: "https://github.com/mwolters-cmyk/living-sports-analytics-research",
    desc: "Scrapes ISU figure skating competition results from SkatingScores.com. Senior + Junior men, women, pairs, ice dance across all ISU championships, Grand Prix, Junior Grand Prix, Challenger Series, Olympics (2003-2025). Also scrapes ISU World Standings and Season's Best scores. Uses curl-based TLS fingerprint bypass.",
    sports: ["figure_skating"],
    category: "scraper",
    access: "free",
    language: "Python",
    onPlatform: "Jurysporten/scripts/scrape_skatingscores.py",
  },
  {
    name: "Our scraper: ISU Protocol PDF Parser",
    url: "https://github.com/mwolters-cmyk/living-sports-analytics-research",
    desc: "Parses official ISU Judges Details per Skater PDFs. Extracts element-by-element GOE scores (J1-J9) and component scores from World Championships, Olympics, Europeans, Four Continents, Grand Prix, World Team Trophy + Synchronized Skating (2010-2025). Auto-detects PDF links from competition pages.",
    sports: ["figure_skating"],
    category: "scraper",
    access: "free",
    language: "Python",
    onPlatform: "Jurysporten/scripts/parse_isu_protocols.py",
  },
  // --- Diving scrapers ---
  {
    name: "Our scraper: World Aquatics Diving",
    url: "https://github.com/mwolters-cmyk/living-sports-analytics-research",
    desc: "Scrapes dive-by-dive results with individual J1-J7 judge scores via the World Aquatics (formerly FINA) REST API. Covers Grand Prix, World Cups, World Championships, Olympics, Junior Championships (2017-2025). Outputs athlete results + individual dive scores to CSV.",
    sports: ["diving"],
    category: "scraper",
    access: "free",
    language: "Python",
    onPlatform: "82,074 dive scores with individual judge marks from 112 competitions and 2,794 athletes in our database.",
  },
  {
    name: "Our scraper: DiveMeets.com",
    url: "https://github.com/mwolters-cmyk/living-sports-analytics-research",
    desc: "Scrapes the largest diving results database in the world (26.6M individual judge scores, 5.9M dive scores). Covers NCAA, USA Diving, AAU competitions with per-dive judge score detail. Requires session cookie management for access.",
    sports: ["diving"],
    category: "scraper",
    access: "free",
    language: "Python",
    onPlatform: "scrapers/scrape_divemeets.py",
  },
  {
    name: "DiveMeets.com",
    url: "https://secure.meetcontrol.com/divemeets/system/index.php",
    desc: "The world's largest diving results database with 883K+ dive sheets and 26.6M individual judge scores. Covers NCAA Division I/II/III, USA Diving nationals, AAU, high school championships (US focus). Active since 2004.",
    sports: ["diving"],
    category: "dataset",
    access: "free",
  },
  // --- Ski Jumping scraper ---
  {
    name: "Ski Jumping Data Center (GitHub)",
    url: "https://github.com/wrotki8778/Ski_jumping_data_center",
    desc: "Comprehensive FIS ski jumping dataset: 288,012 results (154K with 5 style judge scores), 4,596 competitions across 92 venues. Men, Women, Mixed events from Continental Cup to World Cup (2009-2022). Ideal for judging bias analysis.",
    sports: ["ski_jumping"],
    category: "dataset",
    access: "free",
    onPlatform: "288K results with 5-judge style scores in our database.",
  },
  {
    name: "FIS Ski Jumping Results Database",
    url: "https://www.fis-ski.com/DB/ski-jumping/calendar-results.html",
    desc: "Official FIS ski jumping results database. Includes distance points, 5 style judge scores (0-20), wind/gate compensation. All World Cup, World Championships, Olympics events. JS-rendered site (no API).",
    sports: ["ski_jumping"],
    category: "dataset",
    access: "free",
  },
  {
    name: "Our scraper: FIS Ski Jumping",
    url: "https://github.com/mwolters-cmyk/living-sports-analytics-research",
    desc: "FIS ski jumping scraper prototype. Note: fis-ski.com is fully JS-rendered with no public API. Uses the Ski Jumping Data Center dataset (288K results) as primary data source instead.",
    sports: ["ski_jumping"],
    category: "scraper",
    access: "free",
    language: "Python",
    onPlatform: "scrapers/scrape_fis_skijumping.py",
  },
  {
    name: "World Aquatics Results",
    url: "https://www.worldaquatics.com/results",
    desc: "Official results for all World Aquatics disciplines including diving, artistic swimming, and open water swimming. Covers World Championships, World Cups, Grand Prix, Olympics. REST API provides dive-by-dive results with individual J1-J7 judge scores.",
    sports: ["diving", "artistic_swimming", "swimming"],
    category: "dataset",
    access: "free",
    onPlatform: "82,074 dive scores with J1-J7 individual judge marks from 112 international competitions (2017-2025) in our database.",
  },
];

/* ─── Derived data ─── */
const allSports = Array.from(
  new Set(resources.flatMap((r) => r.sports))
).sort((a, b) => (SPORT_LABELS[a] || a).localeCompare(SPORT_LABELS[b] || b));

const categoryOrder: ResourceCategory[] = [
  "dataset",
  "scraper",
  "library",
  "api",
];

/* ─── Cross-reference: match curated resources to paper-extracted ones ─── */
function normalizeUrl(url: string): string {
  return url.replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/$/, "").toLowerCase();
}
function normalizeName(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]/g, "");
}

/** Build a map from curated resource name -> paper mentions from the linked resources data */
const paperMentionsMap: Record<string, LinkedResource[]> = {};
for (const curated of resources) {
  const curatedUrlNorm = normalizeUrl(curated.url);
  const curatedNameNorm = normalizeName(curated.name);
  const matches: LinkedResource[] = [];

  for (const linked of linkedResources.resources) {
    // Match by URL (most reliable)
    if (linked.url && curatedUrlNorm && normalizeUrl(linked.url) === curatedUrlNorm) {
      matches.push(linked);
      continue;
    }
    // Match by URL containment (e.g., github.com/statsbomb/open-data contains statsbomb)
    // Skip domain-only URLs to prevent overly broad matches
    const linkedUrlNorm = linked.url ? normalizeUrl(linked.url) : "";
    const linkedHasPath = linkedUrlNorm.includes("/") && linkedUrlNorm.split("/").filter(Boolean).length > 1;
    const curatedHasPath = curatedUrlNorm.includes("/") && curatedUrlNorm.split("/").filter(Boolean).length > 1;
    if (linkedUrlNorm && curatedUrlNorm && linkedHasPath && curatedHasPath && (
      linkedUrlNorm.includes(curatedUrlNorm) ||
      curatedUrlNorm.includes(linkedUrlNorm)
    )) {
      matches.push(linked);
      continue;
    }
    // Match by name similarity
    const linkedNameNorm = normalizeName(linked.name);
    if (curatedNameNorm.length >= 4 && linkedNameNorm.length >= 4 && (
      linkedNameNorm.includes(curatedNameNorm) ||
      curatedNameNorm.includes(linkedNameNorm)
    )) {
      matches.push(linked);
    }
  }

  if (matches.length > 0) {
    paperMentionsMap[curated.name] = matches;
  }
}

/* ─── Resource Card ─── */
function ResourceCard({ r }: { r: Resource }) {
  const mentions = paperMentionsMap[r.name];
  // Deduplicate papers across all matching linked resources
  const paperSet = new Map<string, { work_id: string; title: string; sport: string; year: number | null }>();
  if (mentions) {
    for (const m of mentions) {
      for (const p of m.papers) {
        if (!paperSet.has(p.work_id)) {
          paperSet.set(p.work_id, p);
        }
      }
    }
  }
  const paperCount = paperSet.size;
  return (
    <a
      href={r.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block rounded-xl border border-gray-200 bg-white p-5 transition-all hover:border-orange/40 hover:shadow-md"
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <h3 className="font-semibold text-navy group-hover:text-orange transition-colors">
          {r.name}
        </h3>
        <div className="flex items-center gap-2 shrink-0">
          {r.language && (
            <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-500">
              {r.language}
            </span>
          )}
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${ACCESS_BADGES[r.access].className}`}
          >
            {ACCESS_BADGES[r.access].label}
          </span>
          <span className="text-xs text-gray-400 group-hover:text-orange transition-colors">
            &#8599;
          </span>
        </div>
      </div>
      <p className="mb-3 text-sm text-gray-600 leading-relaxed">{r.desc}</p>
      <div className="flex flex-wrap gap-1">
        {r.sports.map((sport) => (
          <span
            key={sport}
            className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${SPORT_COLORS[sport] || "bg-gray-100 text-gray-700"}`}
          >
            {SPORT_LABELS[sport] || sport}
          </span>
        ))}
      </div>
      {r.onPlatform && (
        <div className="mt-3 rounded-md bg-green-50 border border-green-200 px-2.5 py-1.5 text-xs text-green-700">
          <span className="font-medium">On this platform:</span>{" "}
          {r.onPlatform}
        </div>
      )}
      {paperCount > 0 && (
        <div className="mt-2 rounded-md bg-blue-50 border border-blue-200 px-2.5 py-1.5 text-xs text-blue-700">
          <span className="font-medium">Referenced in {paperCount} paper{paperCount !== 1 ? "s" : ""}:</span>{" "}
          {Array.from(paperSet.values()).slice(0, 3).map((p, i) => (
            <span key={p.work_id}>
              {i > 0 && ", "}
              <Link
                href={`/explore?search=${encodeURIComponent(p.title.slice(0, 40))}`}
                className="underline hover:text-blue-900"
                onClick={(e) => e.stopPropagation()}
              >
                {p.title.length > 50 ? p.title.slice(0, 50) + "..." : p.title}
              </Link>
              {p.year && <span className="text-blue-500"> ({p.year})</span>}
            </span>
          ))}
          {paperCount > 3 && <span className="text-blue-500"> +{paperCount - 3} more</span>}
        </div>
      )}
    </a>
  );
}

/* ─── Paper-Extracted Resources Section ─── */

const LINKED_CATEGORY_LABELS: Record<string, string> = {
  dataset: "Data Sources",
  tool: "Software & Tools",
  library: "Libraries & Packages",
  code: "Code Repositories",
  instrument: "Instruments & Scales",
};

const LINKED_CATEGORY_ICONS: Record<string, string> = {
  dataset: "\u{1F4CA}",
  tool: "\u{1F6E0}\u{FE0F}",
  library: "\u{1F4E6}",
  code: "\u{1F4BB}",
  instrument: "\u{1F4CF}",
};

const URL_STATUS_BADGES: Record<string, { label: string; className: string }> = {
  verified: { label: "Link verified", className: "bg-green-100 text-green-700" },
  dead: { label: "Link broken", className: "bg-red-100 text-red-700 line-through" },
};

function PaperExtractedSection() {
  const [showAll, setShowAll] = useState(false);
  const [linkedCategory, setLinkedCategory] = useState<string>("all");

  // Group linked resources by category, only those with URLs (most useful)
  const categorized = useMemo(() => {
    const cats: Record<string, LinkedResource[]> = {};
    for (const r of linkedResources.resources) {
      // Skip dead URLs
      if (r.url_status === "dead") continue;
      const cat = r.category;
      if (!cats[cat]) cats[cat] = [];
      cats[cat].push(r);
    }
    return cats;
  }, []);

  const filteredLinked = useMemo(() => {
    const all = linkedCategory === "all"
      ? linkedResources.resources.filter(r => r.url_status !== "dead")
      : (categorized[linkedCategory] || []);
    // Prioritize resources with URLs
    return all.sort((a, b) => {
      if (a.url && !b.url) return -1;
      if (!a.url && b.url) return 1;
      return b.paper_count - a.paper_count;
    });
  }, [linkedCategory, categorized]);

  const displayedLinked = showAll ? filteredLinked : filteredLinked.slice(0, 20);

  return (
    <section className="mt-14">
      <div className="mb-2 flex items-center gap-2">
        <span className="text-2xl">{"\uD83D\uDD0D"}</span>
        <h2 className="text-xl font-bold text-navy">
          Discovered in Research Papers
        </h2>
        <span className="rounded-full bg-teal-100 px-2 py-0.5 text-xs text-teal-700 font-medium">
          AI-extracted
        </span>
      </div>
      <p className="mb-4 text-sm text-gray-500">
        Data sources, software tools, and instruments extracted by AI from the full text of{" "}
        {linkedResources.total_papers} academic papers. URLs are validated before display.
      </p>

      {/* Category filter */}
      <div className="mb-4 flex flex-wrap gap-1.5">
        <button
          onClick={() => setLinkedCategory("all")}
          className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
            linkedCategory === "all"
              ? "bg-teal-600 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-teal-50 hover:text-teal-700"
          }`}
        >
          All ({linkedResources.resources.filter(r => r.url_status !== "dead").length})
        </button>
        {Object.entries(categorized).map(([cat, items]) => (
          <button
            key={cat}
            onClick={() => setLinkedCategory(cat)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              linkedCategory === cat
                ? "bg-teal-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-teal-50 hover:text-teal-700"
            }`}
          >
            {LINKED_CATEGORY_ICONS[cat] || ""} {LINKED_CATEGORY_LABELS[cat] || cat} ({items.length})
          </button>
        ))}
      </div>

      {/* Linked resource cards */}
      <div className="grid gap-3 md:grid-cols-2">
        {displayedLinked.map((r, idx) => (
          <div
            key={`${r.name}-${idx}`}
            className="rounded-xl border border-gray-200 bg-white p-4 transition-all hover:border-teal-300 hover:shadow-sm"
          >
            <div className="mb-1.5 flex items-start justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <span className="text-sm">
                  {LINKED_CATEGORY_ICONS[r.category] || "\u{1F4C4}"}
                </span>
                {r.url ? (
                  <a
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-navy hover:text-teal-700 transition-colors"
                  >
                    {r.name} <span className="text-xs text-gray-400">\u2197</span>
                  </a>
                ) : (
                  <span className="font-semibold text-navy">{r.name}</span>
                )}
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                {r.url_status && URL_STATUS_BADGES[r.url_status] && (
                  <span className={`rounded-full px-1.5 py-0.5 text-[9px] font-medium ${URL_STATUS_BADGES[r.url_status].className}`}>
                    {URL_STATUS_BADGES[r.url_status].label}
                  </span>
                )}
                <span className="rounded-full bg-teal-100 px-1.5 py-0.5 text-[10px] font-medium text-teal-700">
                  {r.paper_count} paper{r.paper_count !== 1 ? "s" : ""}
                </span>
              </div>
            </div>
            {r.access && r.access !== "not_stated" && (
              <span className={`inline-block rounded-full px-1.5 py-0.5 text-[9px] font-medium mb-1.5 ${
                r.access === "fully_open" ? "bg-green-100 text-green-700" :
                r.access === "upon_request" ? "bg-amber-100 text-amber-700" :
                r.access === "proprietary" ? "bg-red-100 text-red-700" :
                "bg-gray-100 text-gray-600"
              }`}>
                {r.access.replace(/_/g, " ")}
              </span>
            )}
            {/* Paper references */}
            <div className="mt-1.5 text-xs text-gray-500">
              {r.papers.slice(0, 2).map((p, i) => (
                <span key={p.work_id}>
                  {i > 0 && " \u2022 "}
                  <Link
                    href={`/explore?search=${encodeURIComponent(p.title.slice(0, 40))}`}
                    className="text-gray-500 hover:text-teal-700 underline decoration-dotted"
                  >
                    {p.title.length > 55 ? p.title.slice(0, 55) + "\u2026" : p.title}
                  </Link>
                  {p.year && <span className="text-gray-400"> ({p.year})</span>}
                </span>
              ))}
              {r.papers.length > 2 && (
                <span className="text-gray-400"> +{r.papers.length - 2} more</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Show more */}
      {filteredLinked.length > 20 && (
        <div className="mt-4 text-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-sm font-medium text-teal-700 hover:text-teal-900 underline"
          >
            {showAll ? "Show less" : `Show all ${filteredLinked.length} resources`}
          </button>
        </div>
      )}
    </section>
  );
}

/* ─── Main Page ─── */
export default function ResourcesPage() {
  const [activeCategory, setActiveCategory] = useState<
    ResourceCategory | "all"
  >("all");
  const [activeSport, setActiveSport] = useState<string | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = useMemo(() => {
    return resources.filter((r) => {
      if (activeCategory !== "all" && r.category !== activeCategory)
        return false;
      if (activeSport !== "all" && !r.sports.includes(activeSport as SportTag))
        return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          r.name.toLowerCase().includes(q) ||
          r.desc.toLowerCase().includes(q) ||
          r.sports.some(
            (s) =>
              s.includes(q) ||
              (SPORT_LABELS[s] || "").toLowerCase().includes(q)
          )
        );
      }
      return true;
    });
  }, [activeCategory, activeSport, searchQuery]);

  const grouped = useMemo(() => {
    const groups: Record<ResourceCategory, Resource[]> = {
      dataset: [],
      scraper: [],
      library: [],
      api: [],
    };
    for (const r of filtered) {
      groups[r.category].push(r);
    }
    return groups;
  }, [filtered]);

  return (
    <div>
      {/* Header */}
      <section className="bg-navy px-4 py-14 text-white">
        <div className="mx-auto max-w-5xl">
          <h1 className="mb-3 text-3xl font-bold">
            Resources for Sports Analytics
          </h1>
          <p className="mb-4 max-w-2xl text-lg text-gray-300">
            {resources.length} curated datasets, scrapers, libraries, and APIs &mdash; plus{" "}
            {linkedResources.total_resources} resources discovered across{" "}
            {linkedResources.total_papers} papers by AI extraction. Designed as a launchpad for
            researchers and AI agents.
          </p>
          <div className="rounded-lg border border-white/20 bg-white/10 p-4">
            <p className="text-sm text-gray-300">
              This collection extends the excellent{" "}
              <a
                href="https://www.janvanhaaren.be/resources.html"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-orange hover:underline"
              >
                resources page
              </a>{" "}
              by{" "}
              <a
                href="https://www.janvanhaaren.be"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-white hover:underline"
              >
                Jan Van Haaren
              </a>{" "}
              (KU Leuven) with multi-sport coverage, our own scrapers, and sport
              tags for easy filtering. See also{" "}
              <Link
                href="/miscellaneous"
                className="font-medium text-white hover:underline"
              >
                books, learning resources &amp; career advice
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <div className="sticky top-[57px] z-40 border-b border-gray-200 bg-white/95 backdrop-blur">
        <div className="mx-auto max-w-5xl px-4 py-3">
          {/* Category pills */}
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider mr-1">
              Type:
            </span>
            <button
              onClick={() => setActiveCategory("all")}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                activeCategory === "all"
                  ? "bg-navy text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-navy/10 hover:text-navy"
              }`}
            >
              All ({resources.length})
            </button>
            {categoryOrder.map((cat) => {
              const count = resources.filter(
                (r) =>
                  r.category === cat &&
                  (activeSport === "all" ||
                    r.sports.includes(activeSport as SportTag))
              ).length;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                    activeCategory === cat
                      ? "bg-navy text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-navy/10 hover:text-navy"
                  }`}
                >
                  {CATEGORY_ICONS[cat]} {CATEGORY_LABELS[cat]} ({count})
                </button>
              );
            })}
          </div>
          {/* Sport pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider mr-1">
              Sport:
            </span>
            <button
              onClick={() => setActiveSport("all")}
              className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium transition-colors ${
                activeSport === "all"
                  ? "bg-navy text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-navy/10"
              }`}
            >
              All
            </button>
            {allSports.map((sport) => (
              <button
                key={sport}
                onClick={() =>
                  setActiveSport(sport === activeSport ? "all" : sport)
                }
                className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium transition-colors ${
                  activeSport === sport
                    ? "bg-navy text-white"
                    : `${SPORT_COLORS[sport] || "bg-gray-100 text-gray-700"} hover:opacity-80`
                }`}
              >
                {SPORT_LABELS[sport] || sport}
              </button>
            ))}
          </div>
          {/* Search */}
          <div className="mt-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search resources by name, description, or sport..."
              className="w-full rounded-lg border border-gray-200 px-3 py-1.5 text-sm focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy"
            />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-10">
        {/* Grouped or flat display */}
        {activeCategory === "all" ? (
          categoryOrder.map((cat) => {
            const items = grouped[cat];
            if (items.length === 0) return null;
            return (
              <section key={cat} className="mb-14">
                <div className="mb-2 flex items-center gap-2">
                  <span className="text-2xl">{CATEGORY_ICONS[cat]}</span>
                  <h2 className="text-xl font-bold text-navy">
                    {CATEGORY_LABELS[cat]}
                  </h2>
                  <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
                    {items.length}
                  </span>
                </div>
                <p className="mb-5 text-sm text-gray-500">
                  {CATEGORY_DESCS[cat]}
                </p>
                <div className="grid gap-4 md:grid-cols-2">
                  {items.map((r) => (
                    <ResourceCard key={r.name} r={r} />
                  ))}
                </div>
              </section>
            );
          })
        ) : (
          <>
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl">
                  {CATEGORY_ICONS[activeCategory]}
                </span>
                <h2 className="text-xl font-bold text-navy">
                  {CATEGORY_LABELS[activeCategory]}
                </h2>
                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
                  {filtered.length}
                </span>
              </div>
              <p className="text-sm text-gray-500">
                {CATEGORY_DESCS[activeCategory]}
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {filtered.map((r) => (
                <ResourceCard key={r.name} r={r} />
              ))}
            </div>
          </>
        )}

        {filtered.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-lg text-gray-400">
              No resources found for this combination of filters.
            </p>
            <button
              onClick={() => {
                setActiveCategory("all");
                setActiveSport("all");
                setSearchQuery("");
              }}
              className="mt-3 text-sm text-navy underline hover:text-orange"
            >
              Clear all filters
            </button>
          </div>
        )}

        {/* Paper-extracted Resources section */}
        {linkedResources.total_resources > 0 && (
          <PaperExtractedSection />
        )}

        {/* For AI Agents section */}
        <section className="mt-14 rounded-xl border-2 border-dashed border-navy/20 bg-navy/5 p-8">
          <h2 className="mb-3 text-lg font-bold text-navy">
            For AI Agents &amp; Automated Workflows
          </h2>
          <p className="mb-4 text-sm text-gray-600">
            This page is designed as a starting point for Claude Code agents and
            other AI tools that need to work with sports data. Here&apos;s how
            to get started:
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <h3 className="mb-2 text-sm font-semibold text-navy">
                1. Pick a Dataset
              </h3>
              <p className="text-xs text-gray-600">
                Filter by sport above. Resources marked &ldquo;On this
                platform&rdquo; are already downloaded. For new data, check the
                Scrapers section.
              </p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <h3 className="mb-2 text-sm font-semibold text-navy">
                2. Choose a Scraper
              </h3>
              <p className="text-xs text-gray-600">
                Our scrapers live in{" "}
                <code className="text-navy">scrapers/</code> and use{" "}
                <code className="text-navy">RateLimitedSession</code> from{" "}
                <code className="text-navy">base.py</code>. Run{" "}
                <code className="text-navy">
                  python scrapers/scrape_all.py stats
                </code>{" "}
                to see the data inventory.
              </p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <h3 className="mb-2 text-sm font-semibold text-navy">
                3. Install Libraries
              </h3>
              <p className="text-xs text-gray-600">
                Key installs:{" "}
                <code className="text-navy">
                  pip install kloppy statsbombpy mplsoccer socceraction
                </code>{" "}
                for football,{" "}
                <code className="text-navy">
                  pip install nba_api pybaseball nfl_data_py
                </code>{" "}
                for US sports.
              </p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <h3 className="mb-2 text-sm font-semibold text-navy">
                4. Academic Context
              </h3>
              <p className="text-xs text-gray-600">
                Browse our{" "}
                <Link href="/explore" className="text-navy underline">
                  paper database
                </Link>{" "}
                to find research papers that used these data sources and methods.
              </p>
            </div>
          </div>
        </section>

        {/* Attribution */}
        <section className="mt-10 rounded-xl border border-navy/20 bg-navy/5 p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div>
              <h3 className="mb-2 text-lg font-semibold text-navy">
                Acknowledgment
              </h3>
              <p className="max-w-lg text-sm text-gray-600">
                This collection builds on the work of{" "}
                <a
                  href="https://www.janvanhaaren.be"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-navy underline hover:text-orange"
                >
                  Jan Van Haaren
                </a>{" "}
                (KU Leuven) and the PySport and SportsDataverse communities. For
                books, learning resources, and career advice, see{" "}
                <Link
                  href="/miscellaneous"
                  className="font-medium text-navy underline hover:text-orange"
                >
                  Miscellaneous
                </Link>
                .
              </p>
            </div>
            <div className="flex shrink-0 flex-col gap-2">
              <a
                href="https://www.janvanhaaren.be/resources.html"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block rounded-lg border border-navy/30 bg-white px-4 py-2 text-center text-sm font-medium text-navy transition-colors hover:bg-navy hover:text-white"
              >
                Van Haaren&apos;s Resources
              </a>
              <Link
                href="/contribute"
                className="inline-block rounded-lg bg-orange px-4 py-2 text-center text-sm font-medium text-white transition-colors hover:bg-orange-light"
              >
                Contribute to Platform
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
