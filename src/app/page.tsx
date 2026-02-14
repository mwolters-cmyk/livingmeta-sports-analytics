import Link from "next/link";
import { getStats } from "@/lib/db";

function StatCard({
  value,
  label,
  accent = false,
}: {
  value: string;
  label: string;
  accent?: boolean;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      <div
        className={`text-3xl font-bold ${accent ? "text-orange" : "text-navy"}`}
      >
        {value}
      </div>
      <div className="mt-1 text-sm text-gray-500">{label}</div>
    </div>
  );
}

export default function Home() {
  const stats = getStats();

  const recentYears = stats.yearlyPapers.filter((y) => y.year >= 2015);

  return (
    <div>
      {/* Hero */}
      <section className="bg-navy px-4 py-20 text-white">
        <div className="mx-auto max-w-5xl">
          <div className="mb-2 text-sm font-medium uppercase tracking-wider text-orange">
            First of its kind
          </div>
          <h1 className="mb-4 text-4xl font-bold leading-tight md:text-5xl">
            Living Sports Analytics
            <br />
            Research Platform
          </h1>
          <p className="mb-8 max-w-2xl text-lg text-gray-300">
            Continuously monitoring, classifying, and analyzing all sports
            analytics research publications. Covering 15+ sports, every
            methodology, every theme.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/explore"
              className="rounded-lg bg-orange px-6 py-3 font-semibold text-white transition-colors hover:bg-orange-light"
            >
              Explore {stats.totalPapers.toLocaleString()} Papers
            </Link>
            <Link
              href="/getting-started"
              className="rounded-lg border border-white/30 px-6 py-3 font-semibold text-white transition-colors hover:bg-white/10"
            >
              Contribute with Claude Code
            </Link>
            <a
              href="https://github.com/mwolters-cmyk/living-sports-analytics-research"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-white/30 px-6 py-3 font-semibold text-white transition-colors hover:bg-white/10"
            >
              View on GitHub
            </a>
          </div>
        </div>
      </section>

      {/* Stats grid */}
      <section className="mx-auto max-w-5xl px-4 py-12">
        <h2 className="mb-6 text-2xl font-bold text-navy">
          Platform at a Glance
        </h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <StatCard
            value={stats.totalPapers.toLocaleString()}
            label="Research papers"
            accent
          />
          <StatCard
            value={stats.totalAuthors.toLocaleString()}
            label="Unique authors"
          />
          <StatCard
            value={`${stats.genderPercentage}%`}
            label="Authors with gender inference"
          />
          <StatCard
            value={stats.journalCount.toString()}
            label="Journals covered"
          />
        </div>
      </section>

      {/* Publication trend mini chart */}
      <section className="mx-auto max-w-5xl px-4 py-8">
        <h2 className="mb-6 text-2xl font-bold text-navy">
          Publication Growth
        </h2>
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-end gap-1" style={{ height: "200px" }}>
            {recentYears.map((y) => {
              const maxCount = Math.max(...recentYears.map((yr) => yr.count));
              const height = (y.count / maxCount) * 100;
              return (
                <div
                  key={y.year}
                  className="group relative flex flex-1 flex-col items-center"
                >
                  <div
                    className="w-full rounded-t bg-navy transition-colors group-hover:bg-orange"
                    style={{ height: `${height}%` }}
                    title={`${y.year}: ${y.count} papers`}
                  />
                  <div className="mt-1 text-xs text-gray-400">
                    {y.year.toString().slice(2)}
                  </div>
                  <div className="absolute -top-6 hidden text-xs font-medium text-navy group-hover:block">
                    {y.count.toLocaleString()}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-4 text-center text-sm text-gray-500">
            Papers per year ({recentYears[0]?.year} &ndash;{" "}
            {recentYears[recentYears.length - 1]?.year})
          </div>
        </div>
      </section>

      {/* Top Journals */}
      <section className="mx-auto max-w-5xl px-4 py-8">
        <h2 className="mb-6 text-2xl font-bold text-navy">Top Journals</h2>
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
          {stats.topJournals.slice(0, 10).map((j, i) => (
            <div
              key={j.journal}
              className={`flex items-center justify-between px-6 py-3 ${
                i < 9 ? "border-b border-gray-100" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-400">
                  {i + 1}
                </span>
                <span className="text-sm font-medium">{j.journal}</span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className="h-2 rounded-full bg-navy"
                  style={{
                    width: `${(j.count / stats.topJournals[0].count) * 120}px`,
                  }}
                />
                <span className="text-sm text-gray-500">
                  {j.count.toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Gender breakdown */}
      <section className="mx-auto max-w-5xl px-4 py-8">
        <h2 className="mb-6 text-2xl font-bold text-navy">
          Author Gender Distribution
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="space-y-3">
              {stats.genderBreakdown.map((g) => {
                const pct = ((g.count / stats.totalAuthors) * 100).toFixed(1);
                const colors: Record<string, string> = {
                  male: "bg-blue-500",
                  mostly_male: "bg-blue-300",
                  female: "bg-pink-500",
                  mostly_female: "bg-pink-300",
                  andy: "bg-gray-400",
                  unknown: "bg-gray-300",
                };
                return (
                  <div key={g.gender}>
                    <div className="mb-1 flex justify-between text-sm">
                      <span className="capitalize">
                        {g.gender.replace("_", " ")}
                      </span>
                      <span className="text-gray-500">
                        {g.count.toLocaleString()} ({pct}%)
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-gray-100">
                      <div
                        className={`h-2 rounded-full ${colors[g.gender] || "bg-gray-400"}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-navy">
              How it works
            </h3>
            <p className="mb-3 text-sm text-gray-600">
              We infer author gender from first names using the{" "}
              <code className="rounded bg-gray-100 px-1 py-0.5 text-xs">
                gender-guesser
              </code>{" "}
              library. This is an automated estimation and may not accurately
              reflect an individual&apos;s gender identity.
            </p>
            <p className="mb-3 text-sm text-gray-600">
              Coverage: {stats.genderPercentage}% of{" "}
              {stats.totalAuthors.toLocaleString()} authors have a gender
              inference. Names that are ambiguous across cultures are marked as
              &quot;andy&quot; (androgynous).
            </p>
            <p className="text-sm text-gray-600">
              Date range: {stats.oldestPaper} to {stats.newestPaper}
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-navy/5 px-4 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-4 text-2xl font-bold text-navy">
            Contribute to Sports Analytics Research
          </h2>
          <p className="mb-6 text-gray-600">
            This platform is open for collaboration. Students can use it for
            thesis projects, researchers can tag papers, and developers can
            contribute scrapers and analyses via Claude Code + GitHub.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/getting-started"
              className="rounded-lg bg-orange px-6 py-3 font-semibold text-white transition-colors hover:bg-orange-light"
            >
              Get Started
            </Link>
            <Link
              href="/about"
              className="rounded-lg border border-navy/20 px-6 py-3 font-semibold text-navy transition-colors hover:bg-navy/5"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
