import { getStats } from "@/lib/db";
import { SPORT_LABELS, THEME_LABELS, METHODOLOGY_LABELS } from "@/lib/db";

const BAR_COLORS = [
  "bg-navy", "bg-orange", "bg-emerald-500", "bg-blue-500",
  "bg-purple-500", "bg-red-500", "bg-amber-500", "bg-teal-500",
  "bg-pink-500", "bg-lime-500", "bg-indigo-500", "bg-cyan-500",
  "bg-rose-500", "bg-sky-500",
];

export default function TrendsPage() {
  const stats = getStats();
  const recentYears = stats.yearlyPapers.filter((y) => y.year >= 2010);
  const maxCount = Math.max(...recentYears.map((y) => y.count));

  // Classification data
  const sportDist = stats.sportDistribution || [];
  const themeDist = stats.themeDistribution || [];
  const methodDist = stats.methodologyDistribution || [];
  const sportMax = sportDist[0]?.count || 1;
  const themeMax = themeDist[0]?.count || 1;
  const methodMax = methodDist[0]?.count || 1;
  const totalRelevant = stats.classifiedRelevant || 0;

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="mb-2 text-3xl font-bold text-navy">Research Trends</h1>
      <p className="mb-8 text-gray-500">
        How sports analytics research is distributed across sports, methods, and
        themes &mdash; based on {totalRelevant.toLocaleString()} AI-classified
        papers
      </p>

      {/* Publication growth */}
      <section className="mb-10">
        <h2 className="mb-4 text-xl font-semibold text-navy">
          Publication Volume (2010&ndash;present)
        </h2>
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-end gap-1" style={{ height: "300px" }}>
            {recentYears.map((y) => {
              const height = (y.count / maxCount) * 100;
              return (
                <div
                  key={y.year}
                  className="group relative flex flex-1 flex-col items-center"
                >
                  <div className="absolute -top-8 hidden rounded bg-navy px-2 py-1 text-xs text-white group-hover:block">
                    {y.count.toLocaleString()} papers
                  </div>
                  <div
                    className="w-full rounded-t bg-navy transition-colors group-hover:bg-orange"
                    style={{ height: `${height}%` }}
                  />
                  <div className="mt-2 origin-top-left -rotate-45 text-xs text-gray-400">
                    {y.year}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Sport distribution */}
      {sportDist.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-4 text-xl font-semibold text-navy">
            Research by Sport
          </h2>
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
            {sportDist.slice(0, 15).map((s, i) => {
              const pct = (s.count / totalRelevant) * 100;
              return (
                <div
                  key={s.sport}
                  className={`flex items-center gap-4 px-6 py-3 ${
                    i < Math.min(sportDist.length, 15) - 1
                      ? "border-b border-gray-100"
                      : ""
                  }`}
                >
                  <span className="w-6 text-right text-sm font-medium text-gray-400">
                    {i + 1}
                  </span>
                  <div className="flex-1">
                    <div className="text-sm font-medium">
                      {SPORT_LABELS[s.sport] || s.sport}
                    </div>
                    <div className="mt-1 h-2 rounded-full bg-gray-100">
                      <div
                        className={`h-2 rounded-full ${BAR_COLORS[i % BAR_COLORS.length]}`}
                        style={{
                          width: `${(s.count / sportMax) * 100}%`,
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
      )}

      {/* Theme distribution */}
      {themeDist.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-4 text-xl font-semibold text-navy">
            Research by Theme
          </h2>
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
            {themeDist.slice(0, 15).map((t, i) => {
              const pct = (t.count / totalRelevant) * 100;
              return (
                <div
                  key={t.theme}
                  className={`flex items-center gap-4 px-6 py-3 ${
                    i < Math.min(themeDist.length, 15) - 1
                      ? "border-b border-gray-100"
                      : ""
                  }`}
                >
                  <span className="w-6 text-right text-sm font-medium text-gray-400">
                    {i + 1}
                  </span>
                  <div className="flex-1">
                    <div className="text-sm font-medium">
                      {THEME_LABELS[t.theme] || t.theme}
                    </div>
                    <div className="mt-1 h-2 rounded-full bg-gray-100">
                      <div
                        className={`h-2 rounded-full ${BAR_COLORS[i % BAR_COLORS.length]}`}
                        style={{
                          width: `${(t.count / themeMax) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">
                      {t.count.toLocaleString()}
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
      )}

      {/* Methodology distribution */}
      {methodDist.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-4 text-xl font-semibold text-navy">
            Research by Methodology
          </h2>
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
            {methodDist.map((m, i) => {
              const pct = (m.count / totalRelevant) * 100;
              return (
                <div
                  key={m.methodology}
                  className={`flex items-center gap-4 px-6 py-3 ${
                    i < methodDist.length - 1
                      ? "border-b border-gray-100"
                      : ""
                  }`}
                >
                  <span className="w-6 text-right text-sm font-medium text-gray-400">
                    {i + 1}
                  </span>
                  <div className="flex-1">
                    <div className="text-sm font-medium">
                      {METHODOLOGY_LABELS[m.methodology] || m.methodology}
                    </div>
                    <div className="mt-1 h-2 rounded-full bg-gray-100">
                      <div
                        className={`h-2 rounded-full ${BAR_COLORS[i % BAR_COLORS.length]}`}
                        style={{
                          width: `${(m.count / methodMax) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">
                      {m.count.toLocaleString()}
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
      )}

      {/* Journal distribution */}
      <section className="mb-10">
        <h2 className="mb-4 text-xl font-semibold text-navy">
          Journal Distribution
        </h2>
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
          {stats.topJournals.map((j, i) => {
            const pct = (j.count / stats.totalPapers) * 100;
            return (
              <div
                key={j.journal}
                className={`flex items-center gap-4 px-6 py-3 ${
                  i < stats.topJournals.length - 1
                    ? "border-b border-gray-100"
                    : ""
                }`}
              >
                <span className="w-6 text-right text-sm font-medium text-gray-400">
                  {i + 1}
                </span>
                <div className="flex-1">
                  <div className="text-sm font-medium">{j.journal}</div>
                  <div className="mt-1 h-2 rounded-full bg-gray-100">
                    <div
                      className="h-2 rounded-full bg-navy"
                      style={{
                        width: `${(j.count / stats.topJournals[0].count) * 100}%`,
                      }}
                    />
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">
                    {j.count.toLocaleString()}
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
    </div>
  );
}
