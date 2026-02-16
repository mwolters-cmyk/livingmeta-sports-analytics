import Link from "next/link";
import { getStats, getClassifiedPapers } from "@/lib/db";
import { SPORT_LABELS, THEME_LABELS, METHODOLOGY_LABELS } from "@/lib/db";

const BAR_COLORS = [
  "bg-navy", "bg-orange", "bg-emerald-500", "bg-blue-500",
  "bg-purple-500", "bg-red-500", "bg-amber-500", "bg-teal-500",
  "bg-pink-500", "bg-lime-500", "bg-indigo-500", "bg-cyan-500",
  "bg-rose-500", "bg-sky-500",
];

/** Heatmap cell color based on intensity 0..1 */
function heatColor(intensity: number): string {
  if (intensity === 0) return "bg-gray-50 text-gray-300";
  if (intensity < 0.05) return "bg-orange/10 text-orange/70";
  if (intensity < 0.15) return "bg-orange/20 text-orange/80";
  if (intensity < 0.3) return "bg-orange/40 text-white";
  if (intensity < 0.5) return "bg-orange/60 text-white";
  return "bg-orange text-white";
}

export default function GapsPage() {
  const stats = getStats();
  const papers = getClassifiedPapers();

  const totalRelevant = stats.classifiedRelevant || 0;
  const sportDist = stats.sportDistribution || [];
  const themeDist = stats.themeDistribution || [];
  const methodDist = stats.methodologyDistribution || [];
  const womensSportCount = stats.womensSportCount || 0;

  // --- Build sport x theme cross-tabulation from classified papers ---
  // Exclude "multi_sport" and "other" from the heatmap (not actionable gaps)
  const excludedSports = new Set(["multi_sport", "other"]);
  const heatmapSports = sportDist
    .filter((s) => !excludedSports.has(s.sport))
    .slice(0, 12);
  const heatmapThemes = themeDist
    .filter((t) => t.theme && t.theme !== "other")
    .slice(0, 10);

  const sportThemeMatrix: Record<string, Record<string, number>> = {};
  for (const s of heatmapSports) {
    sportThemeMatrix[s.sport] = {};
    for (const t of heatmapThemes) {
      sportThemeMatrix[s.sport][t.theme] = 0;
    }
  }

  for (const p of papers) {
    if (sportThemeMatrix[p.sport] && sportThemeMatrix[p.sport][p.theme] !== undefined) {
      sportThemeMatrix[p.sport][p.theme]++;
    }
  }

  // Find max cell value for intensity scaling
  let maxCell = 1;
  for (const s of heatmapSports) {
    for (const t of heatmapThemes) {
      const v = sportThemeMatrix[s.sport]?.[t.theme] || 0;
      if (v > maxCell) maxCell = v;
    }
  }

  // --- Build sport x methodology cross-tab ---
  const sportMethodMatrix: Record<string, Record<string, number>> = {};
  const topMethods = methodDist.filter((m) => m.methodology !== "other").slice(0, 6);
  for (const s of heatmapSports.slice(0, 8)) {
    sportMethodMatrix[s.sport] = {};
    for (const m of topMethods) {
      sportMethodMatrix[s.sport][m.methodology] = 0;
    }
  }
  for (const p of papers) {
    if (sportMethodMatrix[p.sport] && sportMethodMatrix[p.sport][p.methodology] !== undefined) {
      sportMethodMatrix[p.sport][p.methodology]++;
    }
  }
  let maxMethodCell = 1;
  for (const s of heatmapSports.slice(0, 8)) {
    for (const m of topMethods) {
      const v = sportMethodMatrix[s.sport]?.[m.methodology] || 0;
      if (v > maxMethodCell) maxMethodCell = v;
    }
  }

  // --- Under-researched sports (fewer than 20 papers) ---
  const underResearchedSports = sportDist.filter(
    (s) => s.count < 20 && !excludedSports.has(s.sport)
  );

  // --- Under-researched themes (fewer than 30 papers) ---
  const underResearchedThemes = themeDist.filter(
    (t) => t.count < 30 && t.theme !== "other"
  );

  // --- Zero cells in the heatmap = thesis opportunities ---
  const zeroCells: { sport: string; theme: string }[] = [];
  for (const s of heatmapSports) {
    for (const t of heatmapThemes) {
      if ((sportThemeMatrix[s.sport]?.[t.theme] || 0) === 0) {
        zeroCells.push({ sport: s.sport, theme: t.theme });
      }
    }
  }

  // Women's sport percentage
  const womensPct =
    totalRelevant > 0 ? ((womensSportCount / totalRelevant) * 100).toFixed(1) : "0";

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="mb-2 text-3xl font-bold text-navy">Research Gaps</h1>
      <p className="mb-8 text-gray-500">
        Where is sports analytics research missing? Based on{" "}
        {totalRelevant.toLocaleString()} AI-classified papers.
      </p>

      {/* Key gap stats */}
      <section className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="text-3xl font-bold text-orange">
            {womensPct}%
          </div>
          <div className="mt-1 text-sm text-gray-500">
            of classified papers study women&apos;s sport
          </div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="text-3xl font-bold text-orange">
            {underResearchedSports.length}
          </div>
          <div className="mt-1 text-sm text-gray-500">
            sports with fewer than 20 papers
          </div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="text-3xl font-bold text-orange">
            {zeroCells.length}
          </div>
          <div className="mt-1 text-sm text-gray-500">
            sport-theme combinations with zero papers
          </div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="text-3xl font-bold text-navy">
            {totalRelevant.toLocaleString()}
          </div>
          <div className="mt-1 text-sm text-gray-500">
            papers classified so far
          </div>
        </div>
      </section>

      {/* Women's Sport Gap */}
      <section className="mb-10">
        <h2 className="mb-4 text-xl font-semibold text-navy">
          Women&apos;s Sport Research Gap
        </h2>
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-4">
            <div className="flex-1">
              <div className="mb-2 flex items-baseline justify-between">
                <span className="text-sm font-medium text-gray-600">
                  Women&apos;s sport papers
                </span>
                <span className="text-sm font-bold text-orange">
                  {womensSportCount.toLocaleString()} of{" "}
                  {totalRelevant.toLocaleString()}
                </span>
              </div>
              <div className="h-6 w-full rounded-full bg-gray-100">
                <div
                  className="flex h-6 items-center rounded-full bg-orange px-3 text-xs font-bold text-white"
                  style={{
                    width: `${Math.max(
                      parseFloat(womensPct),
                      3
                    )}%`,
                  }}
                >
                  {womensPct}%
                </div>
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-500">
            Only {womensPct}% of classified sports analytics research explicitly
            focuses on women&apos;s sport. This is a significant gap given that
            women&apos;s sport viewership and participation are growing rapidly.
            Women&apos;s leagues are also underserved by commercial analytics
            providers, making academic contributions especially valuable.
          </p>
        </div>
      </section>

      {/* Sport x Theme Heatmap */}
      <section className="mb-10">
        <h2 className="mb-4 text-xl font-semibold text-navy">
          Sport &times; Theme Coverage Map
        </h2>
        <p className="mb-4 text-sm text-gray-500">
          Darker cells indicate more research. Empty or light cells represent
          gaps &mdash; potential thesis or research opportunities. Based on
          cross-tabulation of {totalRelevant.toLocaleString()} classified papers.
        </p>
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
          <table className="w-full text-xs">
            <thead>
              <tr>
                <th className="sticky left-0 z-10 bg-white px-3 py-2 text-left font-semibold text-navy">
                  Sport
                </th>
                {heatmapThemes.map((t) => (
                  <th
                    key={t.theme}
                    className="px-2 py-2 text-center font-medium text-gray-500"
                    style={{ minWidth: "70px" }}
                  >
                    <div className="whitespace-nowrap">
                      {(THEME_LABELS[t.theme] || t.theme || "Unknown")
                        .split(" ")
                        .map((word, i) => (
                          <span key={i}>
                            {word}
                            <br />
                          </span>
                        ))}
                    </div>
                  </th>
                ))}
                <th className="px-3 py-2 text-center font-semibold text-navy">
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              {heatmapSports.map((s, si) => {
                const sportTotal = sportDist.find(
                  (x) => x.sport === s.sport
                )?.count || 0;
                return (
                  <tr
                    key={s.sport}
                    className={si % 2 === 0 ? "bg-gray-50/50" : ""}
                  >
                    <td className="sticky left-0 z-10 whitespace-nowrap bg-white px-3 py-2 font-medium text-navy">
                      {SPORT_LABELS[s.sport] || s.sport}
                    </td>
                    {heatmapThemes.map((t) => {
                      const val =
                        sportThemeMatrix[s.sport]?.[t.theme] || 0;
                      const intensity = val / maxCell;
                      return (
                        <td
                          key={t.theme}
                          className={`px-2 py-2 text-center font-medium ${heatColor(
                            intensity
                          )}`}
                        >
                          {val > 0 ? val : "\u2014"}
                        </td>
                      );
                    })}
                    <td className="px-3 py-2 text-center font-bold text-navy">
                      {sportTotal}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="mt-3 flex items-center gap-4 text-xs text-gray-400">
          <span>Intensity scale:</span>
          <span className="inline-block h-4 w-8 rounded bg-gray-50 border border-gray-200" /> 0
          <span className="inline-block h-4 w-8 rounded bg-orange/20" /> Low
          <span className="inline-block h-4 w-8 rounded bg-orange/40" /> Medium
          <span className="inline-block h-4 w-8 rounded bg-orange" /> High
        </div>
      </section>

      {/* Sport Research Volume */}
      <section className="mb-10">
        <h2 className="mb-4 text-xl font-semibold text-navy">
          Research Volume by Sport
        </h2>
        <p className="mb-4 text-sm text-gray-500">
          How many papers exist per sport? Sports at the bottom have the largest
          gap between their global popularity and academic attention.
        </p>
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
          {sportDist
            .filter((s) => !excludedSports.has(s.sport))
            .map((s, i, arr) => {
              const maxSport = arr[0]?.count || 1;
              const pct = (s.count / totalRelevant) * 100;
              const isUnder = s.count < 20;
              return (
                <div
                  key={s.sport}
                  className={`flex items-center gap-4 px-6 py-3 ${
                    i < arr.length - 1 ? "border-b border-gray-100" : ""
                  }`}
                >
                  <span className="w-6 text-right text-sm font-medium text-gray-400">
                    {i + 1}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        {SPORT_LABELS[s.sport] || s.sport}
                      </span>
                      {isUnder && (
                        <span className="rounded-full bg-orange/10 px-2 py-0.5 text-xs font-medium text-orange">
                          Under-researched
                        </span>
                      )}
                    </div>
                    <div className="mt-1 h-2 rounded-full bg-gray-100">
                      <div
                        className={`h-2 rounded-full ${
                          isUnder ? "bg-orange" : "bg-navy"
                        }`}
                        style={{
                          width: `${(s.count / maxSport) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">
                      {s.count.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-400">
                      {pct.toFixed(1)}%
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </section>

      {/* Methodology Coverage by Sport */}
      <section className="mb-10">
        <h2 className="mb-4 text-xl font-semibold text-navy">
          Methodology Coverage by Sport
        </h2>
        <p className="mb-4 text-sm text-gray-500">
          Which analytical methods dominate each sport? Empty cells indicate
          methodological gaps &mdash; applying a new method to a sport can be a
          valuable research contribution.
        </p>
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
          <table className="w-full text-xs">
            <thead>
              <tr>
                <th className="sticky left-0 z-10 bg-white px-3 py-2 text-left font-semibold text-navy">
                  Sport
                </th>
                {topMethods.map((m) => (
                  <th
                    key={m.methodology}
                    className="px-2 py-2 text-center font-medium text-gray-500"
                    style={{ minWidth: "80px" }}
                  >
                    {METHODOLOGY_LABELS[m.methodology] || m.methodology}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {heatmapSports.slice(0, 8).map((s, si) => (
                <tr
                  key={s.sport}
                  className={si % 2 === 0 ? "bg-gray-50/50" : ""}
                >
                  <td className="sticky left-0 z-10 whitespace-nowrap bg-white px-3 py-2 font-medium text-navy">
                    {SPORT_LABELS[s.sport] || s.sport}
                  </td>
                  {topMethods.map((m) => {
                    const val =
                      sportMethodMatrix[s.sport]?.[m.methodology] || 0;
                    const intensity = val / maxMethodCell;
                    return (
                      <td
                        key={m.methodology}
                        className={`px-2 py-2 text-center font-medium ${heatColor(
                          intensity
                        )}`}
                      >
                        {val > 0 ? val : "\u2014"}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Under-researched Themes */}
      {underResearchedThemes.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-4 text-xl font-semibold text-navy">
            Under-researched Themes
          </h2>
          <p className="mb-4 text-sm text-gray-500">
            These research themes have fewer than 30 papers across all sports
            &mdash; wide open for new contributions.
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {underResearchedThemes.map((t) => (
              <div
                key={t.theme}
                className="rounded-xl border border-orange/30 bg-orange/5 p-4"
              >
                <div className="flex items-baseline justify-between">
                  <h3 className="font-semibold text-navy">
                    {THEME_LABELS[t.theme] || t.theme}
                  </h3>
                  <span className="text-sm font-bold text-orange">
                    {t.count} papers
                  </span>
                </div>
                <div className="mt-2 h-1.5 rounded-full bg-gray-100">
                  <div
                    className="h-1.5 rounded-full bg-orange"
                    style={{
                      width: `${(t.count / (themeDist[0]?.count || 1)) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Thesis Opportunity Finder — zero-cell combos */}
      <section className="mb-10">
        <h2 className="mb-4 text-xl font-semibold text-navy">
          Thesis Opportunities: Unexplored Combinations
        </h2>
        <p className="mb-4 text-sm text-gray-500">
          The following sport-theme combinations have zero classified papers.
          Each represents a concrete opportunity for a thesis or research
          project.
        </p>
        {zeroCells.length > 0 ? (
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {zeroCells.slice(0, 18).map((cell) => (
              <div
                key={`${cell.sport}-${cell.theme}`}
                className="flex items-center gap-2 rounded-lg border border-dashed border-gray-300 bg-white px-4 py-3"
              >
                <span className="shrink-0 text-lg text-orange">&#9679;</span>
                <div className="text-sm">
                  <span className="font-medium text-navy">
                    {SPORT_LABELS[cell.sport] || cell.sport}
                  </span>
                  {" "}
                  <span className="text-gray-400">&times;</span>{" "}
                  <span className="text-gray-600">
                    {THEME_LABELS[cell.theme] || cell.theme}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400">
            All sport-theme combinations have at least one paper.
          </p>
        )}
        {zeroCells.length > 18 && (
          <p className="mt-3 text-sm text-gray-400">
            ... and {zeroCells.length - 18} more unexplored combinations.
          </p>
        )}
      </section>

      {/* Under-researched Sports detail */}
      {underResearchedSports.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-4 text-xl font-semibold text-navy">
            Sports With the Least Research
          </h2>
          <p className="mb-4 text-sm text-gray-500">
            These sports have fewer than 20 classified papers. Given their
            global audience sizes, they represent significant research
            opportunities.
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {underResearchedSports.map((s) => (
              <div
                key={s.sport}
                className="rounded-xl border border-orange/30 bg-orange/5 p-4"
              >
                <div className="flex items-baseline justify-between">
                  <h3 className="font-semibold text-navy">
                    {SPORT_LABELS[s.sport] || s.sport}
                  </h3>
                  <span className="text-sm font-bold text-orange">
                    {s.count} papers
                  </span>
                </div>
                <div className="mt-2 h-1.5 rounded-full bg-gray-100">
                  <div
                    className="h-1.5 rounded-full bg-orange"
                    style={{
                      width: `${(s.count / (sportDist[0]?.count || 1)) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Thesis connection CTA */}
      <section className="rounded-xl bg-navy/5 p-8 text-center">
        <h2 className="mb-3 text-xl font-bold text-navy">
          Turn a Research Gap Into a Thesis
        </h2>
        <p className="mb-4 text-gray-600">
          Found an interesting gap? We have data, infrastructure, and
          supervision available for BSc and MSc thesis projects at RSM Erasmus
          University.
        </p>
        <Link
          href="/contribute"
          className="inline-block rounded-lg bg-orange px-6 py-3 font-semibold text-white transition-colors hover:bg-orange-light"
        >
          View Thesis Projects
        </Link>
      </section>
    </div>
  );
}
