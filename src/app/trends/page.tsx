import { getStats } from "@/lib/db";

export default function TrendsPage() {
  const stats = getStats();
  const recentYears = stats.yearlyPapers.filter((y) => y.year >= 2010);
  const maxCount = Math.max(...recentYears.map((y) => y.count));

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="mb-2 text-3xl font-bold text-navy">Research Trends</h1>
      <p className="mb-8 text-gray-500">
        How sports analytics research has evolved over time
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
                  <div className="mt-2 text-xs text-gray-400 -rotate-45 origin-top-left">
                    {y.year}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

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
                  <div className="text-xs text-gray-400">{pct.toFixed(1)}%</div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Gender overview */}
      <section className="mb-10">
        <h2 className="mb-4 text-xl font-semibold text-navy">
          Author Gender Distribution
        </h2>
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex h-8 overflow-hidden rounded-full">
            {stats.genderBreakdown.map((g) => {
              const pct = (g.count / stats.totalAuthors) * 100;
              const colors: Record<string, string> = {
                male: "bg-blue-500",
                mostly_male: "bg-blue-300",
                female: "bg-pink-500",
                mostly_female: "bg-pink-300",
                andy: "bg-yellow-400",
                unknown: "bg-gray-300",
              };
              return (
                <div
                  key={g.gender}
                  className={`${colors[g.gender] || "bg-gray-400"} transition-all`}
                  style={{ width: `${pct}%` }}
                  title={`${g.gender}: ${g.count.toLocaleString()} (${pct.toFixed(1)}%)`}
                />
              );
            })}
          </div>
          <div className="flex flex-wrap gap-4 text-sm">
            {stats.genderBreakdown.map((g) => {
              const pct = ((g.count / stats.totalAuthors) * 100).toFixed(1);
              const dots: Record<string, string> = {
                male: "text-blue-500",
                mostly_male: "text-blue-300",
                female: "text-pink-500",
                mostly_female: "text-pink-300",
                andy: "text-yellow-400",
                unknown: "text-gray-300",
              };
              return (
                <div key={g.gender} className="flex items-center gap-1">
                  <span className={`text-lg ${dots[g.gender] || "text-gray-400"}`}>
                    &#9679;
                  </span>
                  <span className="capitalize text-gray-600">
                    {g.gender.replace("_", " ")}
                  </span>
                  <span className="text-gray-400">
                    ({g.count.toLocaleString()}, {pct}%)
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Coming soon */}
      <section className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center">
        <h2 className="mb-2 text-lg font-semibold text-navy">
          More Trends Coming Soon
        </h2>
        <p className="text-sm text-gray-500">
          After the AI classifier is deployed, this page will show methodology evolution
          (statistical &rarr; ML &rarr; deep learning &rarr; LLM), sport-specific trends,
          cross-sport comparisons, and citation impact analysis.
        </p>
      </section>
    </div>
  );
}
