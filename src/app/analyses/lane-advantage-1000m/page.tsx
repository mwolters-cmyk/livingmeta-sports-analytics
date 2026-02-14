"use client";

import Link from "next/link";
import { useState } from "react";

/* ─── Metadata ─── */
const meta = {
  title: "Inner Lane Advantage in 1000m Speed Skating",
  version: "1.0",
  status: "Active",
  lastDataSearch: "2026-02-14",
  lastAnalysisUpdate: "2026-02-14",
  updateFrequency: "Per season / per event",
  dataRange: "2007–2026 (seasons 2007-2008 through 2025-2026)",
  nTotal: "14,774",
  nWomen: "6,884",
  nMen: "7,890",
  nTracks: "30+",
  nSeasons: "18",
};

/* ─── Literature entries ─── */
const literature: {
  id: string;
  authors: string;
  year: number;
  title: string;
  journal: string;
  doi?: string;
  finding: string;
  relevance: "core" | "supporting" | "context";
}[] = [
  {
    id: "kuper2012",
    authors: "Kuper, G.H., Kamst, R., Sierksma, G. & Talsma, B.G.",
    year: 2012,
    title: "Inner-Outer Lane Advantage in Olympic 1000 Meter Speed Skating",
    journal: "Jahrbücher für Nationalökonomie und Statistik, 232(3), 293–307",
    doi: "10.1515/jbnst-2012-0308",
    finding:
      "Women 1000m: 0.120s inner lane advantage (significant). Men: 0.030s, not significant. Data 2000–2009.",
    relevance: "core",
  },
  {
    id: "hjort1994",
    authors: "Hjort, N.L.",
    year: 1994,
    title: "Should the Olympic Sprint Skaters Run the 500 Meter Twice?",
    journal: "Statistical Research Report, University of Oslo",
    finding:
      "500m: ~0.06s inner lane advantage (significant). Led to the ISU rule change: 500m now skated twice.",
    relevance: "core",
  },
  {
    id: "kamst2010",
    authors: "Kamst, R., Kuper, G.H. & Sierksma, G.",
    year: 2010,
    title: "The Olympic 500-m Speed Skating; the Inner-Outer Lane Difference",
    journal: "Statistica Neerlandica, 64(4), 448–459",
    doi: "10.1111/j.1467-9574.2010.00457.x",
    finding:
      "500m lane advantage diminished after clap skate introduction (post-1998). No longer significant.",
    relevance: "core",
  },
  {
    id: "ma2021",
    authors: "Ma, L., et al.",
    year: 2021,
    title:
      "The Influence of the Oval, Lane and Simultaneous Entry on the Performance and Pacing Strategy of Speed Skating Men's 1500m",
    journal: "Journal of Science in Sport and Exercise, 3, 295–304",
    doi: "10.1007/s42978-021-00126-0",
    finding:
      "No lane effect on 1500m performance or pacing strategy. Altitude improves performance by ~2.52%.",
    relevance: "supporting",
  },
  {
    id: "muehlbauer2010",
    authors: "Muehlbauer, T., Schindler, C. & Panzer, S.",
    year: 2010,
    title:
      "Pacing and Sprint Performance in Speed Skating during a Competitive Season",
    journal:
      "International Journal of Sports Physiology and Performance, 5(2), 165–176",
    finding:
      "1000m pacing: start fast, peak in sector 2, slow in sector 3. Starting lane does not change the general pacing pattern.",
    relevance: "supporting",
  },
  {
    id: "hettinga2009",
    authors: "Hettinga, F.J., De Koning, J.J., et al.",
    year: 2009,
    title:
      "Optimal Pacing Strategy: From Theoretical Modelling to Reality in 1500-m Speed Skating",
    journal: "British Journal of Sports Medicine, 43(13), 1048–1052",
    finding:
      "Self-selected pacing outperforms theoretically optimal profiles. Pacing interacts with lane position.",
    relevance: "supporting",
  },
  {
    id: "koning2005",
    authors: "Koning, R.H.",
    year: 2005,
    title: "Home Advantage in Speed Skating: Evidence from Individual Data",
    journal: "Journal of Sports Sciences, 23(4), 417–427",
    finding:
      "Small but significant home advantage (men 0.2%, women 0.3%). Rink-specific effects interact with lane advantage.",
    relevance: "context",
  },
  {
    id: "li2024",
    authors: "Li, X., et al.",
    year: 2024,
    title:
      "Quantitative Analysis of the Dominant External Factors Influencing Elite Speed Skaters' Performance",
    journal: "Frontiers in Sports and Active Living, 6, 1227785",
    doi: "10.3389/fspor.2024.1227785",
    finding:
      "Performance improves at higher altitudes, especially for 1000m+. Air pressure at altitude enhances medal probability by up to 10%.",
    relevance: "context",
  },
  {
    id: "liu2022",
    authors: "Liu, Y., et al.",
    year: 2022,
    title:
      "How Ice Rink Locations Affect Performance Time in Short-Track Speed Skating",
    journal: "Frontiers in Psychology, 13, 854909",
    doi: "10.3389/fpsyg.2022.854909",
    finding:
      "Venue location can boost or impair performance by up to 3.6 seconds. Altitude optimum ~1,225m.",
    relevance: "context",
  },
  {
    id: "sun2021",
    authors: "Sun, L., Guo, T., Liu, F. & Tao, K.",
    year: 2021,
    title:
      "Champion Position Analysis in Short Track Speed Skating 2007–2019",
    journal: "Frontiers in Psychology, 12, 760900",
    doi: "10.3389/fpsyg.2021.760900",
    finding:
      "Short track: starting position 1 (innermost) wins 28% of 500m, 28% of 1000m, 22% of 1500m.",
    relevance: "context",
  },
  {
    id: "munro2022",
    authors: "Munro, D.",
    year: 2022,
    title: "Are There Lane Advantages in Track and Field?",
    journal: "PLOS ONE, 17(8), e0271670",
    doi: "10.1371/journal.pone.0271670",
    finding:
      "Athletics: outside lanes produce faster 200m times. Same natural experiment methodology as speed skating studies.",
    relevance: "context",
  },
  {
    id: "terra2023",
    authors: "Terra, W., et al.",
    year: 2023,
    title:
      "Aerodynamic Benefits of Drafting in Speed Skating: Estimates from In-Field and Wind Tunnel",
    journal:
      "Journal of Wind Engineering and Industrial Aerodynamics, 233, 105329",
    finding:
      "Drafting provides ~25.7% drag reduction at close proximity. Negligible at 50cm lateral offset.",
    relevance: "context",
  },
  {
    id: "kuper2003",
    authors: "Kuper, G.H. & Sterken, E.",
    year: 2003,
    title:
      "Endurance in Speed Skating: The Development of World Records",
    journal: "European Journal of Operational Research, 148(2), 293–301",
    doi: "10.1016/S0377-2217(02)00685-9",
    finding:
      "World records 1893–2000 converge non-linearly. Clap skate (1996/97) caused a major discontinuity.",
    relevance: "context",
  },
  {
    id: "noorbergen2020",
    authors: "Noorbergen, O.S., et al.",
    year: 2020,
    title:
      "Winning by Hiding Behind Others: An Analysis of Speed Skating Data",
    journal: "PLOS ONE, 15(8), e0237470",
    doi: "10.1371/journal.pone.0237470",
    finding:
      "Quantifies tactical drafting advantage in mass-start events using race data and aerodynamic models.",
    relevance: "context",
  },
  {
    id: "konings2015",
    authors: "Konings, M.J., et al.",
    year: 2015,
    title:
      "Performance Characteristics of Long-Track Speed Skaters: A Literature Review",
    journal: "Sports Medicine, 45(4), 505–516",
    doi: "10.1007/s40279-014-0298-z",
    finding:
      "Comprehensive review of 49 studies on performance factors: anthropometric, technical, physiological, tactical, psychological.",
    relevance: "context",
  },
];

/* ─── Key results data ─── */
const winnerData = [
  {
    label: "Women 1000m (all)",
    races: 304,
    innerWins: 192,
    pct: 63.2,
    p: 0.0,
    sig: "***",
  },
  {
    label: "Women 1000m (senior)",
    races: 251,
    innerWins: 151,
    pct: 60.2,
    p: 0.0015,
    sig: "**",
  },
  {
    label: "Men 1000m (all)",
    races: 306,
    innerWins: 178,
    pct: 58.2,
    p: 0.005,
    sig: "**",
  },
  {
    label: "Men 1000m (senior)",
    races: 253,
    innerWins: 146,
    pct: 57.7,
    p: 0.0167,
    sig: "*",
  },
];

const timeResults = [
  {
    label: "Women 1000m (senior)",
    n: 5233,
    diff: -0.034,
    pTtest: 0.6909,
    pOLS: 0.6613,
    pMixed: 0.7955,
    olsCoef: -0.0226,
    mixedCoef: -0.0176,
  },
  {
    label: "Men 1000m (senior)",
    n: 5964,
    diff: 0.019,
    pTtest: 0.7943,
    pOLS: 0.7762,
    pMixed: 0.7615,
    olsCoef: 0.0181,
    mixedCoef: 0.0189,
  },
];

const periodData = [
  {
    period: "2007–2012",
    diff: -0.147,
    p: 0.3596,
    innerWinPct: 67.5,
    n: 1598,
  },
  {
    period: "2013–2018",
    diff: 0.011,
    p: 0.938,
    innerWinPct: 59.0,
    n: 1706,
  },
  {
    period: "2019–2026",
    diff: 0.032,
    p: 0.8254,
    innerWinPct: 54.9,
    n: 1929,
  },
];

const allDistances = [
  { dist: "500m", n: 6148, diff: 0.024, p: 0.709, winPct: 52.2 },
  { dist: "1000m", n: 5233, diff: -0.034, p: 0.6909, winPct: 60.2 },
  { dist: "1500m", n: 5318, diff: 0.059, p: 0.5992, winPct: 52.3 },
  { dist: "3000m", n: 4371, diff: -0.053, p: 0.8357, winPct: 64.2 },
  { dist: "5000m", n: 1301, diff: -1.068, p: 0.1637, winPct: 62.8 },
];

/* ─── Collapsible section component ─── */
function Section({
  id,
  label,
  title,
  children,
  defaultOpen = false,
}: {
  id: string;
  label: string;
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section id={id} className="border-b border-gray-200">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-0 py-5 text-left"
      >
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-orange">
            {label}
          </div>
          <h2 className="text-xl font-bold text-navy">{title}</h2>
        </div>
        <span className="text-2xl text-gray-400">{open ? "\u2212" : "+"}</span>
      </button>
      {open && <div className="pb-8">{children}</div>}
    </section>
  );
}

/* ─── Main page ─── */
export default function LaneAdvantageAnalysis() {
  return (
    <div>
      {/* ─── STATUS BANNER ─── */}
      <div className="border-b border-green-200 bg-green-50 px-4 py-3">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-3 text-sm">
          <span className="rounded-full border border-green-300 bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-800">
            &#9679; Active
          </span>
          <span className="text-gray-500">
            v{meta.version} &middot; Last updated: {meta.lastAnalysisUpdate}
          </span>
          <span className="text-gray-400">|</span>
          <span className="text-gray-500">
            Data: {meta.dataRange}
          </span>
          <span className="text-gray-400">|</span>
          <span className="text-gray-500">
            Updates: {meta.updateFrequency}
          </span>
        </div>
      </div>

      {/* ─── TITLE & QUESTION ─── */}
      <section className="bg-navy px-4 py-14 text-white">
        <div className="mx-auto max-w-5xl">
          <Link
            href="/analyses"
            className="mb-4 inline-block text-sm text-gray-400 transition-colors hover:text-white"
          >
            &larr; All Analyses
          </Link>
          <h1 className="mb-3 text-3xl font-bold leading-tight md:text-4xl">
            Inner Lane Advantage in
            <br />
            <span className="text-orange">1000m Speed Skating</span>
          </h1>
          <p className="mb-6 max-w-2xl text-gray-300">
            Does starting in the inner lane give an unfair advantage at the
            Olympics? A replication and extension of Kuper et al. (2012) with 18
            seasons of ISU data.
          </p>
          <div className="rounded-lg border border-white/20 bg-white/10 p-4">
            <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-orange">
              Structured question
            </div>
            <p className="text-sm text-gray-200">
              <strong>Population:</strong> Elite long-track speed skaters (ISU
              World Cups, Championships, Olympics) &middot;{" "}
              <strong>Exposure:</strong> Starting in the inner lane (vs. outer)
              &middot; <strong>Outcome:</strong> Finishing time and win
              probability &middot; <strong>Design:</strong> Natural experiment
              (lane assignment by random draw)
            </p>
          </div>
        </div>
      </section>

      {/* ─── KEY FINDING ─── */}
      <section className="border-b border-gray-200 bg-orange/5 px-4 py-8">
        <div className="mx-auto max-w-5xl">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-orange">
            Key Finding
          </div>
          <p className="mb-4 text-lg font-semibold text-navy">
            There is <strong>no significant time advantage</strong> for inner
            lane starters in the 1000m (women: &minus;0.02s, p=0.80; men:
            +0.02s, p=0.76). However, inner lane starters <em>do</em> win
            disproportionately often (60% women, 58% men). This paradox
            suggests the mechanism is not aerodynamic or biomechanical, but may
            relate to pacing, psychology, or pair composition.
          </p>
          <div className="flex flex-wrap gap-3 text-sm">
            <span className="rounded-full bg-yellow-100 px-3 py-1 font-medium text-yellow-800">
              Certainty: Moderate
            </span>
            <span className="rounded-full bg-gray-100 px-3 py-1 text-gray-600">
              {meta.nTotal} observations
            </span>
            <span className="rounded-full bg-gray-100 px-3 py-1 text-gray-600">
              {meta.nSeasons} seasons
            </span>
            <span className="rounded-full bg-gray-100 px-3 py-1 text-gray-600">
              {literature.length} papers reviewed
            </span>
          </div>
        </div>
      </section>

      {/* ─── CONTENT SECTIONS ─── */}
      <div className="mx-auto max-w-5xl px-4">
        {/* ─── SUMMARY OF FINDINGS TABLE ─── */}
        <Section
          id="summary"
          label="Results at a glance"
          title="Summary of Findings"
          defaultOpen={true}
        >
          <p className="mb-4 text-sm text-gray-500">
            Following the Cochrane / GRADE Summary of Findings format. The
            &ldquo;time&rdquo; outcome uses three progressively sophisticated
            models; the &ldquo;win&rdquo; outcome uses a binomial test against
            50%.
          </p>

          {/* Table 1: Time-based */}
          <div className="mb-6 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-navy">
                  <th className="py-2 pr-4 text-left font-semibold text-navy">
                    Outcome
                  </th>
                  <th className="py-2 px-3 text-right font-semibold text-navy">
                    N
                  </th>
                  <th className="py-2 px-3 text-right font-semibold text-navy">
                    Raw diff
                  </th>
                  <th className="py-2 px-3 text-right font-semibold text-navy">
                    OLS coef
                  </th>
                  <th className="py-2 px-3 text-right font-semibold text-navy">
                    Mixed coef
                  </th>
                  <th className="py-2 px-3 text-right font-semibold text-navy">
                    p (mixed)
                  </th>
                  <th className="py-2 pl-3 text-left font-semibold text-navy">
                    Interpretation
                  </th>
                </tr>
              </thead>
              <tbody>
                {timeResults.map((r) => (
                  <tr key={r.label} className="border-b border-gray-100">
                    <td className="py-2 pr-4 font-medium">{r.label}</td>
                    <td className="py-2 px-3 text-right text-gray-600">
                      {r.n.toLocaleString()}
                    </td>
                    <td className="py-2 px-3 text-right font-mono text-gray-600">
                      {r.diff > 0 ? "+" : ""}
                      {r.diff.toFixed(3)}s
                    </td>
                    <td className="py-2 px-3 text-right font-mono text-gray-600">
                      {r.olsCoef > 0 ? "+" : ""}
                      {r.olsCoef.toFixed(4)}s
                    </td>
                    <td className="py-2 px-3 text-right font-mono text-gray-600">
                      {r.mixedCoef > 0 ? "+" : ""}
                      {r.mixedCoef.toFixed(4)}s
                    </td>
                    <td className="py-2 px-3 text-right font-mono text-gray-600">
                      {r.pMixed.toFixed(4)}
                    </td>
                    <td className="py-2 pl-3 text-gray-600">
                      <span className="rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                        Not significant
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table 2: Winner-based */}
          <h3 className="mb-2 text-sm font-semibold text-navy">
            Winner analysis (binomial test vs. 50%)
          </h3>
          <div className="mb-6 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-navy">
                  <th className="py-2 pr-4 text-left font-semibold text-navy">
                    Category
                  </th>
                  <th className="py-2 px-3 text-right font-semibold text-navy">
                    Races
                  </th>
                  <th className="py-2 px-3 text-right font-semibold text-navy">
                    Inner wins
                  </th>
                  <th className="py-2 px-3 text-right font-semibold text-navy">
                    Inner %
                  </th>
                  <th className="py-2 px-3 text-right font-semibold text-navy">
                    p-value
                  </th>
                  <th className="py-2 pl-3 text-left font-semibold text-navy">
                    Sig
                  </th>
                </tr>
              </thead>
              <tbody>
                {winnerData.map((r) => (
                  <tr key={r.label} className="border-b border-gray-100">
                    <td className="py-2 pr-4 font-medium">{r.label}</td>
                    <td className="py-2 px-3 text-right text-gray-600">
                      {r.races}
                    </td>
                    <td className="py-2 px-3 text-right text-gray-600">
                      {r.innerWins}
                    </td>
                    <td className="py-2 px-3 text-right font-semibold text-orange">
                      {r.pct.toFixed(1)}%
                    </td>
                    <td className="py-2 px-3 text-right font-mono text-gray-600">
                      {r.p < 0.001 ? "<0.001" : r.p.toFixed(4)}
                    </td>
                    <td className="py-2 pl-3">
                      <span
                        className={`rounded px-2 py-0.5 text-xs font-bold ${
                          r.sig.includes("*")
                            ? "bg-orange/10 text-orange"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {r.sig}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="rounded-lg border border-navy/10 bg-navy/5 p-4 text-sm text-gray-600">
            <strong className="text-navy">The paradox:</strong> Inner lane
            starters are not measurably faster, yet they win significantly more
            often. The time advantage of Kuper et al. (0.120s) is not
            replicated in our larger dataset, but the winner-percentage effect
            (60–63% vs. expected 50%) persists. This suggests the mechanism is
            not a pure speed advantage but something more subtle.
          </div>
        </Section>

        {/* ─── TREND OVER TIME ─── */}
        <Section
          id="trend"
          label="Temporal analysis"
          title="Is the Effect Disappearing?"
          defaultOpen={true}
        >
          <p className="mb-4 text-sm text-gray-500">
            Kuper et al. used data from 2000–2009. Has the effect changed since?
          </p>

          <div className="mb-6 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-navy">
                  <th className="py-2 pr-4 text-left font-semibold text-navy">
                    Period
                  </th>
                  <th className="py-2 px-3 text-right font-semibold text-navy">
                    N
                  </th>
                  <th className="py-2 px-3 text-right font-semibold text-navy">
                    Time diff
                  </th>
                  <th className="py-2 px-3 text-right font-semibold text-navy">
                    p-value
                  </th>
                  <th className="py-2 px-3 text-right font-semibold text-navy">
                    Inner win %
                  </th>
                  <th className="py-2 pl-3 text-left font-semibold text-navy">
                    Trend
                  </th>
                </tr>
              </thead>
              <tbody>
                {periodData.map((r) => (
                  <tr key={r.period} className="border-b border-gray-100">
                    <td className="py-2 pr-4 font-medium">{r.period}</td>
                    <td className="py-2 px-3 text-right text-gray-600">
                      {r.n.toLocaleString()}
                    </td>
                    <td className="py-2 px-3 text-right font-mono text-gray-600">
                      {r.diff > 0 ? "+" : ""}
                      {r.diff.toFixed(3)}s
                    </td>
                    <td className="py-2 px-3 text-right font-mono text-gray-600">
                      {r.p.toFixed(4)}
                    </td>
                    <td className="py-2 px-3 text-right font-semibold text-orange">
                      {r.innerWinPct.toFixed(1)}%
                    </td>
                    <td className="py-2 pl-3">
                      <div
                        className="h-3 rounded-full bg-orange/20"
                        style={{ width: `${(r.innerWinPct / 70) * 100}%` }}
                      >
                        <div
                          className="h-3 rounded-full bg-orange"
                          style={{
                            width: `${((r.innerWinPct - 50) / 20) * 100}%`,
                          }}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-sm text-gray-600">
            The inner lane winner percentage has been <strong>declining</strong>{" "}
            over time: from 67.5% (2007–2012) to 54.9% (2019–2026). The time
            difference has never been statistically significant in any period.
            This suggests the effect reported by Kuper et al. may have been
            partially a product of its era.
          </p>
        </Section>

        {/* ─── CROSS-DISTANCE COMPARISON ─── */}
        <Section
          id="distances"
          label="Cross-distance"
          title="Is the 1000m Special?"
          defaultOpen={true}
        >
          <p className="mb-4 text-sm text-gray-500">
            Testing whether the inner lane effect is unique to the 1000m or
            exists across all distances (women, senior only).
          </p>

          <div className="mb-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-navy">
                  <th className="py-2 pr-4 text-left font-semibold text-navy">
                    Distance
                  </th>
                  <th className="py-2 px-3 text-right font-semibold text-navy">
                    N
                  </th>
                  <th className="py-2 px-3 text-right font-semibold text-navy">
                    Time diff (s)
                  </th>
                  <th className="py-2 px-3 text-right font-semibold text-navy">
                    p-value
                  </th>
                  <th className="py-2 px-3 text-right font-semibold text-navy">
                    Inner win %
                  </th>
                  <th className="py-2 pl-3 text-center font-semibold text-navy">
                    Finish lane
                  </th>
                </tr>
              </thead>
              <tbody>
                {allDistances.map((r) => (
                  <tr
                    key={r.dist}
                    className={`border-b border-gray-100 ${r.dist === "1000m" ? "bg-orange/5" : ""}`}
                  >
                    <td className="py-2 pr-4 font-medium">{r.dist}</td>
                    <td className="py-2 px-3 text-right text-gray-600">
                      {r.n.toLocaleString()}
                    </td>
                    <td className="py-2 px-3 text-right font-mono text-gray-600">
                      {r.diff > 0 ? "+" : ""}
                      {r.diff.toFixed(3)}
                    </td>
                    <td className="py-2 px-3 text-right font-mono text-gray-600">
                      {r.p.toFixed(4)}
                    </td>
                    <td className="py-2 px-3 text-right font-semibold text-orange">
                      {r.winPct.toFixed(1)}%
                    </td>
                    <td className="py-2 pl-3 text-center text-gray-500">
                      {["500m", "1500m", "3000m", "10000m"].includes(r.dist)
                        ? "Outer"
                        : "Inner"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-sm text-gray-600">
            The 1000m is <strong>not unique</strong> — no time difference is
            significant at any distance. However, the inner lane winner effect
            appears across <em>all</em> distances (52–64%), most prominently at
            1000m (60.2%), 3000m (64.2%), and 5000m (62.8%). Notably, the
            finish-lane column shows that the winner effect does not simply
            correspond to finishing in the inner lane.
          </p>
        </Section>

        {/* ─── LITERATURE REVIEW ─── */}
        <Section
          id="literature"
          label="State of Knowledge"
          title="Literature Review"
        >
          <p className="mb-2 text-sm text-gray-500">
            Comprehensive search across Google Scholar, PubMed, Scopus, and
            specialist sports science databases. {literature.length} relevant
            publications identified.
          </p>
          <p className="mb-6 text-sm text-gray-500">
            The core question was first addressed by{" "}
            <strong>Hjort (1994)</strong> for the 500m, leading to the ISU rule
            change. <strong>Kamst, Kuper &amp; Sierksma (2010)</strong> showed
            the 500m effect diminished after the clap skate.{" "}
            <strong>Kuper et al. (2012)</strong> extended the analysis to 1000m,
            finding a significant effect for women. Our analysis extends this
            with 18 seasons of data.
          </p>

          <div className="space-y-3">
            {literature.map((ref) => (
              <div
                key={ref.id}
                className={`rounded-lg border p-4 ${
                  ref.relevance === "core"
                    ? "border-orange/30 bg-orange/5"
                    : ref.relevance === "supporting"
                      ? "border-navy/20 bg-navy/5"
                      : "border-gray-200 bg-white"
                }`}
              >
                <div className="mb-1 flex items-start justify-between gap-2">
                  <div className="text-sm font-medium text-navy">
                    {ref.authors} ({ref.year}).{" "}
                    <em className="text-gray-600">{ref.title}</em>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                      ref.relevance === "core"
                        ? "bg-orange/20 text-orange"
                        : ref.relevance === "supporting"
                          ? "bg-navy/10 text-navy"
                          : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {ref.relevance}
                  </span>
                </div>
                <div className="mb-1 text-xs text-gray-400">
                  {ref.journal}
                  {ref.doi && (
                    <>
                      {" "}
                      &middot;{" "}
                      <a
                        href={`https://doi.org/${ref.doi}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-navy underline hover:text-orange"
                      >
                        DOI
                      </a>
                    </>
                  )}
                </div>
                <p className="text-sm text-gray-600">{ref.finding}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* ─── BACKGROUND & CONTEXT ─── */}
        <Section id="background" label="Background" title="Why This Matters">
          <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
            <p>
              In February 2026, ahead of the Milano-Cortina Winter Olympics, NOS
              published an article citing research by Prof. Ruud Koning
              (University of Groningen) suggesting that the inner lane provides
              an unfair advantage in the 1000m speed skating event. The article
              reported that 64% of women&apos;s 1000m winners since 2007 started
              from the inner lane, and that Dutch favorites Jutta Leerdam, Femke
              Kok, and Suzanne Schulting had all drawn the outer lane.
            </p>
            <p>
              The underlying research by <strong>Kuper et al. (2012)</strong>{" "}
              found a statistically significant inner lane advantage of 0.120
              seconds for women using data from 2000–2009. The authors, based at
              the University of Groningen (Sierksma, Kuper, Kamst, Talsma),
              have a long history of speed skating analytics, including the
              landmark study that led to the 500m being skated twice since 1998.
            </p>
            <p>
              However, the 2012 study had important limitations: a relatively
              small sample focused on major championships (Olympics, World Single
              Distances), no control for altitude, track, or skater quality
              covariates, and no mixed-effects modeling for rink-specific
              variation. Furthermore, technology has changed since 2009: ice
              preparation, suit technology, and training methods have evolved.
            </p>
            <p>
              This analysis uses data from the ISU Live Results API covering
              18 seasons (2007–2026), including World Cups, Championships, and
              Olympics — a substantially larger dataset with richer covariates.
            </p>
          </div>
        </Section>

        {/* ─── METHODOLOGY ─── */}
        <Section id="methodology" label="Methods" title="Statistical Approach">
          <div className="space-y-6">
            <div>
              <h3 className="mb-2 text-sm font-semibold text-navy">
                Data Sources
              </h3>
              <p className="text-sm text-gray-600">
                All data scraped from the ISU Live Results API, covering World
                Cups, World Championships Single Distances, European
                Championships, and Olympic Games from the 2007–2008 season
                through 2025–2026. The database contains{" "}
                <strong>14,774 individual 1000m results</strong> with lane
                assignment, across <strong>30+ ice rinks</strong> worldwide.
              </p>
            </div>

            <div>
              <h3 className="mb-2 text-sm font-semibold text-navy">
                Identification Strategy
              </h3>
              <p className="text-sm text-gray-600">
                Lane assignment in speed skating is determined by random draw
                (or software-generated assignment), creating a{" "}
                <strong>natural experiment</strong>. This is the same
                identification strategy used by Hjort (1994), Kamst et al.
                (2010), Kuper et al. (2012), and Munro (2022, athletics).
              </p>
            </div>

            <div>
              <h3 className="mb-2 text-sm font-semibold text-navy">
                Statistical Models
              </h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p>
                  <strong>Test 1 — Welch&apos;s t-test:</strong> Simple
                  comparison of mean finishing times (inner vs. outer), no
                  covariates.
                </p>
                <p>
                  <strong>Test 2 — Binomial test:</strong> Winner percentage
                  against H₀: p=0.50 (fair coin).
                </p>
                <p>
                  <strong>Test 3 — OLS regression (HC3 robust SE):</strong>{" "}
                  Covariates: altitude (km), pair number (normalized), division
                  (A/B), championship indicator, season (centered), skater
                  median time (ability proxy).
                </p>
                <p>
                  <strong>Test 4 — Mixed-effects model:</strong> Random
                  intercept per track (rink) to control for unobserved
                  rink-specific variation (ice quality, bend geometry, etc.).
                  Fitted using REML with L-BFGS optimization.
                </p>
              </div>
            </div>

            <div>
              <h3 className="mb-2 text-sm font-semibold text-navy">
                Covariates
              </h3>
              <div className="grid gap-2 md:grid-cols-2">
                {[
                  ["Altitude (km)", "Higher altitude → faster times (less air resistance)"],
                  ["Pair number", "Normalized within race; later pairs = stronger skaters"],
                  ["Division (A/B)", "Division A has stronger skaters"],
                  ["Championship", "Olympic/WC/EC vs. World Cup rounds"],
                  ["Season", "Centered; captures secular trend"],
                  ["Skater ability", "Median personal time as proxy"],
                  ["Track (random)", "Random intercept in mixed model"],
                ].map(([name, desc]) => (
                  <div
                    key={name}
                    className="rounded border border-gray-200 bg-gray-50 px-3 py-2"
                  >
                    <span className="font-mono text-xs font-semibold text-navy">
                      {name}
                    </span>
                    <span className="ml-2 text-xs text-gray-500">{desc}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="mb-2 text-sm font-semibold text-navy">
                Software
              </h3>
              <p className="text-sm text-gray-600">
                Python 3.13, pandas, scipy, statsmodels. All code available on{" "}
                <a
                  href="https://github.com/mwolters-cmyk/living-sports-analytics-research/tree/main/Schaatsen"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-navy underline hover:text-orange"
                >
                  GitHub
                </a>
                .
              </p>
            </div>
          </div>
        </Section>

        {/* ─── DISCUSSION ─── */}
        <Section id="discussion" label="Discussion" title="Interpretation">
          <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
            <p>
              Our analysis partially confirms and partially contradicts the NOS
              article and the underlying Kuper et al. (2012) study.
            </p>
            <p>
              <strong>Confirmed:</strong> Inner lane starters do win more often
              than expected by chance (60.2% for women, 57.7% for men), and this
              effect is statistically significant. The NOS claim of 64% is close
              to our finding of 63.2% when including juniors.
            </p>
            <p>
              <strong>Not confirmed:</strong> The 0.120-second time advantage
              reported by Kuper et al. is not replicated. Across all four model
              specifications, the inner lane time coefficient is tiny
              (&lt;0.02s) and not significant (p &gt; 0.65). The original
              finding may have been specific to the 2000–2009 period and the
              limited sample of major championships.
            </p>
            <p>
              <strong>The paradox:</strong> How can inner lane starters win more
              often without being measurably faster? Several explanations are
              possible: (1) pair composition effects — stronger skaters may be
              preferentially paired with inner lane starters in certain
              scheduling patterns; (2) psychological effects — the inner lane
              skater leads visually in the opening meters and the outer skater
              may over-exert to keep up; (3) the effect is genuine but too small
              for our time-based analysis to detect; (4) the winner-percentage
              effect may be declining (from 67.5% in 2007–2012 to 54.9% in
              2019–2026).
            </p>

            <h3 className="font-semibold text-navy">Limitations</h3>
            <ul className="list-disc space-y-1 pl-5">
              <li>
                Our data starts in 2007; we cannot directly replicate the
                2000–2009 period used by Kuper et al.
              </li>
              <li>
                The ISU API does not provide information about pair draw
                procedures, so we assume randomness based on ISU regulations.
              </li>
              <li>
                We do not have lap-split data linked to lane assignment for all
                races, limiting pacing analysis.
              </li>
              <li>
                Environmental conditions (temperature, humidity) are not
                available.
              </li>
            </ul>

            <h3 className="font-semibold text-navy">
              Comparison with prior work
            </h3>
            <p>
              Our findings align with Ma et al. (2021) who found no lane effect
              in the 1500m, and with Kamst et al. (2010) who found the 500m
              lane advantage diminished after the clap skate. The broader
              pattern suggests that lane advantages in speed skating have been
              decreasing over time, possibly due to technological and training
              improvements.
            </p>
          </div>
        </Section>

        {/* ─── IMPLICATIONS ─── */}
        <Section
          id="implications"
          label="So what?"
          title="Implications"
        >
          <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
            <div className="rounded-lg border border-navy/20 bg-navy/5 p-4">
              <h3 className="mb-2 font-semibold text-navy">For the ISU</h3>
              <p>
                The case for skating the 1000m twice (as with the 500m since
                1998) is weaker than Kuper et al. (2012) suggested. The time
                advantage is not replicated with modern data. However, the
                persistent winner-percentage bias deserves further investigation
                before the question is closed.
              </p>
            </div>
            <div className="rounded-lg border border-navy/20 bg-navy/5 p-4">
              <h3 className="mb-2 font-semibold text-navy">For athletes</h3>
              <p>
                The inner lane is not the decisive advantage media coverage
                suggests. Athletes drawing the outer lane at Milano-Cortina 2026
                should not be psychologically disadvantaged — the data shows the
                effect is small and diminishing.
              </p>
            </div>
            <div className="rounded-lg border border-navy/20 bg-navy/5 p-4">
              <h3 className="mb-2 font-semibold text-navy">For research</h3>
              <p>
                The paradox of &ldquo;more wins but not faster times&rdquo;
                deserves biomechanical and psychological investigation. Future
                work should focus on: split-level analysis of the opening 200m,
                pair-composition effects, and comparison with short-track
                position data (where Sun et al. 2021 find strong position
                effects).
              </p>
            </div>
          </div>
        </Section>

        {/* ─── DATA & CODE ─── */}
        <Section
          id="data"
          label="Transparency"
          title="Data & Code"
        >
          <div className="grid gap-4 md:grid-cols-2">
            <a
              href="https://github.com/mwolters-cmyk/living-sports-analytics-research/tree/main/Schaatsen"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-gray-200 bg-white p-5 transition-shadow hover:shadow-md"
            >
              <div className="mb-2 text-lg">&#128187;</div>
              <h3 className="mb-1 font-semibold text-navy">Analysis Code</h3>
              <p className="text-xs text-gray-500">
                Python scripts: test_nos_claims.py, hypothesis_test.py,
                hypothesis_test_extended.py, hypothesis_pacing.py
              </p>
            </a>
            <a
              href="https://github.com/mwolters-cmyk/living-sports-analytics-research/tree/main/Schaatsen"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-gray-200 bg-white p-5 transition-shadow hover:shadow-md"
            >
              <div className="mb-2 text-lg">&#128451;</div>
              <h3 className="mb-1 font-semibold text-navy">Scrapers</h3>
              <p className="text-xs text-gray-500">
                ISU Live Results API scraper (scrape_isu.py), SpeedSkatingNews
                (scrape_ssn.py), SpeedSkatingResults (scrape_ssr.py)
              </p>
            </a>
            <a
              href="https://github.com/mwolters-cmyk/living-sports-analytics-research/tree/main/Schaatsen"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-gray-200 bg-white p-5 transition-shadow hover:shadow-md"
            >
              <div className="mb-2 text-lg">&#128190;</div>
              <h3 className="mb-1 font-semibold text-navy">Database</h3>
              <p className="text-xs text-gray-500">
                SQLite database: speedskating.db (~25 MB). Results, splits,
                skaters, events, tracks tables.
              </p>
            </a>
            <a
              href="https://github.com/mwolters-cmyk/living-sports-analytics-research"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-gray-200 bg-white p-5 transition-shadow hover:shadow-md"
            >
              <div className="mb-2 text-lg">&#127760;</div>
              <h3 className="mb-1 font-semibold text-navy">Full Repository</h3>
              <p className="text-xs text-gray-500">
                All code, data, and this website. MIT license. Contributions
                welcome.
              </p>
            </a>
          </div>
        </Section>

        {/* ─── CITATION ─── */}
        <section className="border-t border-gray-200 py-8">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-orange">
            Citation
          </div>
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 font-mono text-xs text-gray-600">
            Wolters, M. &amp; Koppius, O. (2026). Inner Lane Advantage in 1000m
            Speed Skating: A Living Analysis (v{meta.version}). Living Sports
            Analytics Platform, RSM Erasmus University Rotterdam.
            https://living-sports-analytics.vercel.app/analyses/lane-advantage-1000m
          </div>

          <div className="mt-6 text-sm text-gray-500">
            <strong className="text-navy">Authors:</strong> Matthijs Wolters
            &amp; Otto Koppius (Rotterdam School of Management, Erasmus
            University Rotterdam)
            <br />
            <strong className="text-navy">Funding:</strong> No external funding.
            Total infrastructure cost: ~€3 (API calls).
            <br />
            <strong className="text-navy">Conflicts of interest:</strong> None
            declared.
          </div>
        </section>
      </div>
    </div>
  );
}
