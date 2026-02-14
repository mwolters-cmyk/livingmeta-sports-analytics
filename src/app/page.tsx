import Link from "next/link";
import { getStats } from "@/lib/db";

export default function Home() {
  const stats = getStats();

  const recentYears = stats.yearlyPapers.filter((y) => y.year >= 2015);

  return (
    <div>
      {/* Hero — the living concept */}
      <section className="bg-navy px-4 py-20 text-white">
        <div className="mx-auto max-w-5xl">
          <div className="mb-3 inline-block rounded-full border border-orange/40 bg-orange/10 px-4 py-1 text-sm font-medium text-orange">
            First of its kind &mdash; continuously updated
          </div>
          <h1 className="mb-5 text-4xl font-bold leading-tight md:text-5xl">
            A Living Meta-Analysis
            <br />
            <span className="text-orange">of Sports Analytics Research</span>
          </h1>
          <p className="mb-4 max-w-2xl text-lg text-gray-300">
            Traditional reviews are outdated the moment they&apos;re published.
            This platform <strong className="text-white">automatically monitors, classifies, and
            analyzes</strong> every new sports analytics publication &mdash; every week, across
            15+ sports and every methodology.
          </p>
          <p className="mb-8 max-w-2xl text-gray-400">
            Built at Rotterdam School of Management, Erasmus University Rotterdam.
            Open for collaboration by students and researchers.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/about"
              className="rounded-lg bg-orange px-6 py-3 font-semibold text-white transition-colors hover:bg-orange-light"
            >
              How It Works
            </Link>
            <Link
              href="/contribute"
              className="rounded-lg border border-white/30 px-6 py-3 font-semibold text-white transition-colors hover:bg-white/10"
            >
              Contribute
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

      {/* What makes it "living" */}
      <section className="mx-auto max-w-5xl px-4 py-16">
        <div className="mb-2 text-sm font-semibold uppercase tracking-wider text-orange">
          The living pipeline
        </div>
        <h2 className="mb-3 text-2xl font-bold text-navy">
          Traditional Review vs. Living Meta-Analysis
        </h2>
        <p className="mb-8 max-w-2xl text-gray-500">
          Living systematic reviews exist in clinical medicine (Cochrane, COVID-NMA,
          Australian Living Evidence Collaboration). This is the first in sports analytics.
        </p>

        <div className="mb-10 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-6">
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-gray-400">
              Traditional review
            </h3>
            <ul className="space-y-3 text-sm text-gray-500">
              <li className="flex gap-2">
                <span className="text-gray-300">&times;</span>
                Published once, outdated in months
              </li>
              <li className="flex gap-2">
                <span className="text-gray-300">&times;</span>
                3&ndash;6 months manual screening
              </li>
              <li className="flex gap-2">
                <span className="text-gray-300">&times;</span>
                Static PDF document
              </li>
              <li className="flex gap-2">
                <span className="text-gray-300">&times;</span>
                Results not reusable
              </li>
              <li className="flex gap-2">
                <span className="text-gray-300">&times;</span>
                Closed, single-team effort
              </li>
            </ul>
          </div>
          <div className="rounded-xl border-2 border-navy bg-white p-6">
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-orange">
              Living meta-analysis
            </h3>
            <ul className="space-y-3 text-sm text-gray-700">
              <li className="flex gap-2">
                <span className="text-green-500">&#10003;</span>
                Automatically updated every week
              </li>
              <li className="flex gap-2">
                <span className="text-green-500">&#10003;</span>
                AI screens papers in minutes
              </li>
              <li className="flex gap-2">
                <span className="text-green-500">&#10003;</span>
                Interactive dashboard with filters
              </li>
              <li className="flex gap-2">
                <span className="text-green-500">&#10003;</span>
                Open database as public resource
              </li>
              <li className="flex gap-2">
                <span className="text-green-500">&#10003;</span>
                Anyone can contribute via GitHub
              </li>
            </ul>
          </div>
        </div>

        {/* The 5-step pipeline */}
        <div className="grid gap-4 md:grid-cols-5">
          {[
            {
              step: "1",
              title: "Monitor",
              desc: "OpenAlex API scans 25 journals + 90+ keywords weekly",
              icon: "&#128225;",
            },
            {
              step: "2",
              title: "Enrich",
              desc: "Fetch abstracts, normalize metadata, link to datasets",
              icon: "&#128269;",
            },
            {
              step: "3",
              title: "Classify",
              desc: "AI reads each paper → sport, method, theme, relevance",
              icon: "&#129302;",
            },
            {
              step: "4",
              title: "Analyze",
              desc: "Publication trends, hot topics, research gaps detected",
              icon: "&#128200;",
            },
            {
              step: "5",
              title: "Publish",
              desc: "Dashboard updated, database open, insights available",
              icon: "&#127760;",
            },
          ].map((s, i) => (
            <div key={s.step} className="relative">
              {i < 4 && (
                <div className="absolute right-0 top-8 hidden text-gray-300 md:block">
                  &rarr;
                </div>
              )}
              <div className="rounded-xl border border-gray-200 bg-white p-4 text-center shadow-sm">
                <div
                  className="mb-2 text-2xl"
                  dangerouslySetInnerHTML={{ __html: s.icon }}
                />
                <div className="mb-1 text-xs font-bold uppercase tracking-wider text-orange">
                  Step {s.step}
                </div>
                <h3 className="mb-1 font-semibold text-navy">{s.title}</h3>
                <p className="text-xs text-gray-500">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Analysis */}
      <section className="bg-orange/5 px-4 py-16">
        <div className="mx-auto max-w-5xl">
          <div className="mb-2 text-sm font-semibold uppercase tracking-wider text-orange">
            Featured Analysis
          </div>
          <h2 className="mb-3 text-2xl font-bold text-navy">
            Living Evidence in Action
          </h2>
          <p className="mb-6 max-w-2xl text-gray-500">
            Each analysis follows a living review protocol: literature review,
            open data, transparent methods, and results that update as new
            data arrives.
          </p>

          <Link
            href="/analyses/lane-advantage-1000m"
            className="block rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-green-300 bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                &#9679; Active
              </span>
              <span className="text-xs text-gray-400">
                v1.0 &middot; 15 papers reviewed &middot; 14,774 observations
              </span>
            </div>
            <h3 className="mb-1 text-lg font-bold text-navy">
              Inner Lane Advantage in 1000m Speed Skating
            </h3>
            <p className="mb-3 text-sm text-gray-500">
              Does starting in the inner lane give an unfair advantage at the
              Olympics? A replication of Kuper et al. (2012) with 18 seasons of ISU data.
            </p>
            <div className="rounded-lg bg-navy/5 p-3 text-sm text-navy">
              <strong>Key finding:</strong> No significant time advantage &mdash; but
              inner lane winners are overrepresented (60% women, 58% men).
            </div>
          </Link>

          <div className="mt-4 text-center">
            <Link
              href="/analyses"
              className="text-sm font-medium text-orange hover:underline"
            >
              View all analyses &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* Current status — proof it works */}
      <section className="bg-gray-50 px-4 py-16">
        <div className="mx-auto max-w-5xl">
          <div className="mb-2 text-sm font-semibold uppercase tracking-wider text-orange">
            Platform status
          </div>
          <h2 className="mb-2 text-2xl font-bold text-navy">
            The prototype is running
          </h2>
          <p className="mb-8 text-gray-500">
            Live data from our automated pipeline &mdash; updated after each sync cycle.
          </p>

          <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-5">
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="text-3xl font-bold text-orange">
                {stats.totalPapers.toLocaleString()}
              </div>
              <div className="mt-1 text-sm text-gray-500">Papers indexed</div>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="text-3xl font-bold text-navy">
                {(stats.classifiedRelevant || 0).toLocaleString()}
              </div>
              <div className="mt-1 text-sm text-gray-500">AI-classified</div>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="text-3xl font-bold text-navy">
                {stats.totalAuthors.toLocaleString()}
              </div>
              <div className="mt-1 text-sm text-gray-500">Authors tracked</div>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="text-3xl font-bold text-navy">
                {(stats.sportDistribution || []).length}
              </div>
              <div className="mt-1 text-sm text-gray-500">Sports covered</div>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="text-3xl font-bold text-navy">
                {stats.journalCount.toLocaleString()}
              </div>
              <div className="mt-1 text-sm text-gray-500">Journals indexed</div>
            </div>
          </div>

          {/* Publication growth chart */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-sm font-semibold text-gray-500">
              Publication volume ({recentYears[0]?.year}&ndash;
              {recentYears[recentYears.length - 1]?.year})
            </h3>
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
          </div>
        </div>
      </section>

      {/* Contribute — the collaborative aspect */}
      <section className="mx-auto max-w-5xl px-4 py-16">
        <div className="mb-2 text-sm font-semibold uppercase tracking-wider text-orange">
          Open collaboration
        </div>
        <h2 className="mb-3 text-2xl font-bold text-navy">
          Built for Researchers, Students &amp; Developers
        </h2>
        <p className="mb-8 max-w-2xl text-gray-500">
          This isn&apos;t a closed project. Every student thesis, every pull request,
          every tagged paper makes the platform better. Contributions go through GitHub
          and are powered by Claude Code.
        </p>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Path 1 */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-navy text-lg text-white">
              &#128187;
            </div>
            <h3 className="mb-2 font-semibold text-navy">Code via Claude Code</h3>
            <p className="mb-3 text-sm text-gray-500">
              Clone the repo, start Claude Code. The <code className="rounded bg-gray-100 px-1 text-xs">CLAUDE.md</code> gives
              your AI agent full project context. Build scrapers, analyses, or visualizations.
            </p>
            <span className="text-xs font-medium text-orange">Technical &bull; GitHub PRs</span>
          </div>

          {/* Path 2 */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-navy text-lg text-white">
              &#127891;
            </div>
            <h3 className="mb-2 font-semibold text-navy">Thesis Projects</h3>
            <p className="mb-3 text-sm text-gray-500">
              BSc/MSc students at RSM build on the platform &mdash; real data, real impact.
              Topics: AI classifiers, topic modeling, Elo systems, betting efficiency, and more.
            </p>
            <span className="text-xs font-medium text-orange">BSc &amp; MSc &bull; RSM EUR</span>
          </div>

          {/* Path 3 */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-navy text-lg text-white">
              &#128196;
            </div>
            <h3 className="mb-2 font-semibold text-navy">Tag Papers</h3>
            <p className="mb-3 text-sm text-gray-500">
              Help train the AI classifier by manually tagging papers with sport,
              methodology, and theme. No coding required &mdash; just domain expertise.
            </p>
            <span className="text-xs font-medium text-orange">Non-technical &bull; Coming soon</span>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/contribute"
            className="inline-block rounded-lg bg-orange px-6 py-3 font-semibold text-white transition-colors hover:bg-orange-light"
          >
            View Contribution Guide &amp; Thesis Projects
          </Link>
        </div>
      </section>

      {/* Context — 8 years of domain expertise */}
      <section className="bg-navy/5 px-4 py-16">
        <div className="mx-auto max-w-5xl">
          <div className="mb-2 text-sm font-semibold uppercase tracking-wider text-orange">
            Background
          </div>
          <h2 className="mb-3 text-2xl font-bold text-navy">
            8+ Years of Sports Analytics Research
          </h2>
          <p className="mb-8 max-w-2xl text-gray-500">
            This platform builds on the largest sports analytics thesis programme at
            a European business school.
          </p>

          <div className="grid gap-4 md:grid-cols-4">
            <div className="rounded-xl bg-white p-5 shadow-sm">
              <div className="text-2xl font-bold text-navy">100+</div>
              <div className="text-sm text-gray-500">Theses supervised (2017&ndash;2024)</div>
            </div>
            <div className="rounded-xl bg-white p-5 shadow-sm">
              <div className="text-2xl font-bold text-navy">15+</div>
              <div className="text-sm text-gray-500">Sports with active data</div>
            </div>
            <div className="rounded-xl bg-white p-5 shadow-sm">
              <div className="text-2xl font-bold text-navy">297K</div>
              <div className="text-sm text-gray-500">Football matches in database</div>
            </div>
            <div className="rounded-xl bg-white p-5 shadow-sm">
              <div className="text-2xl font-bold text-navy">18</div>
              <div className="text-sm text-gray-500">Operational sport datasets</div>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-2">
            {[
              "Football/Soccer", "Tennis", "Basketball", "Ice Hockey",
              "Baseball", "Cricket", "Cycling", "Speed Skating", "Athletics",
              "Swimming", "Rugby", "eSports", "Judged Sports", "Horse Racing",
              "Volleyball",
            ].map((sport) => (
              <span
                key={sport}
                className="rounded-full border border-navy/20 bg-white px-3 py-1 text-sm text-navy"
              >
                {sport}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Browse papers CTA */}
      <section className="mx-auto max-w-5xl px-4 py-16 text-center">
        <h2 className="mb-3 text-2xl font-bold text-navy">
          Explore the Database
        </h2>
        <p className="mb-6 mx-auto max-w-lg text-gray-500">
          Browse {(stats.classifiedRelevant || 0).toLocaleString()} classified
          papers. Filter by sport, methodology, theme, or keyword. Every paper
          links to its DOI. Download as JSON for your own research.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/explore"
            className="rounded-lg bg-navy px-6 py-3 font-semibold text-white transition-colors hover:bg-navy-light"
          >
            Explore Papers
          </Link>
          <Link
            href="/trends"
            className="rounded-lg border border-navy/20 px-6 py-3 font-semibold text-navy transition-colors hover:bg-navy/5"
          >
            View Trends
          </Link>
          <a
            href="/api/classifications.json"
            className="rounded-lg border border-navy/20 px-6 py-3 font-semibold text-navy transition-colors hover:bg-navy/5"
          >
            Download JSON
          </a>
        </div>
      </section>
    </div>
  );
}
