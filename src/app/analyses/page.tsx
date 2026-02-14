import Link from "next/link";

const analyses = [
  {
    slug: "lane-advantage-1000m",
    title: "Inner Lane Advantage in 1000m Speed Skating",
    subtitle:
      "Does starting in the inner lane give an unfair advantage at the Olympics?",
    status: "active" as const,
    version: "1.0",
    lastUpdated: "2026-02-14",
    dataRange: "2007–2026",
    nObservations: "14,774",
    keyFinding:
      "No significant time advantage for inner lane starters — but inner lane winners are overrepresented (60.2% women, 57.7% men).",
    certainty: "moderate" as const,
    tags: ["Speed Skating", "Natural Experiment", "Fairness", "1000m"],
    context:
      "Replication and extension of Kuper et al. (2012), prompted by NOS coverage ahead of Milano-Cortina 2026.",
    litReviewCount: 15,
  },
];

const statusColors = {
  active: "bg-green-100 text-green-800 border-green-200",
  paused: "bg-yellow-100 text-yellow-800 border-yellow-200",
  concluded: "bg-gray-100 text-gray-600 border-gray-200",
};

const certaintyColors = {
  high: "bg-green-100 text-green-700",
  moderate: "bg-yellow-100 text-yellow-700",
  low: "bg-red-100 text-red-700",
};

export default function AnalysesIndex() {
  return (
    <div>
      {/* Header */}
      <section className="bg-navy px-4 py-16 text-white">
        <div className="mx-auto max-w-5xl">
          <div className="mb-3 inline-block rounded-full border border-orange/40 bg-orange/10 px-4 py-1 text-sm font-medium text-orange">
            Living Evidence
          </div>
          <h1 className="mb-4 text-4xl font-bold">Analyses</h1>
          <p className="max-w-2xl text-lg text-gray-300">
            Each analysis follows a living review protocol: structured question,
            comprehensive literature review, transparent methodology, and results
            that update as new data arrives. Inspired by{" "}
            <a
              href="https://covid-nma.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-white"
            >
              COVID-NMA
            </a>{" "}
            and{" "}
            <a
              href="https://www.cochranelibrary.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-white"
            >
              Cochrane Living Reviews
            </a>
            .
          </p>
        </div>
      </section>

      {/* Protocol description */}
      <section className="mx-auto max-w-5xl px-4 py-10">
        <h2 className="mb-4 text-lg font-semibold text-navy">
          What makes these &ldquo;living&rdquo; analyses?
        </h2>
        <div className="mb-10 grid gap-4 md:grid-cols-4">
          {[
            {
              icon: "\u{1F4DA}",
              title: "Literature Review",
              desc: "Every analysis starts with a comprehensive search for all existing research on the topic.",
            },
            {
              icon: "\u{1F4CA}",
              title: "Open Data & Code",
              desc: "All scrapers, analysis scripts, and datasets are public on GitHub. Fully reproducible.",
            },
            {
              icon: "\u{1F504}",
              title: "Continuously Updated",
              desc: "As new seasons produce new data, analyses are re-run and conclusions updated.",
            },
            {
              icon: "\u{1F50D}",
              title: "Transparent Methods",
              desc: "Statistical approach, covariates, and limitations are documented following Cochrane standards.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-xl border border-gray-200 bg-white p-5"
            >
              <div className="mb-2 text-2xl">{item.icon}</div>
              <h3 className="mb-1 text-sm font-semibold text-navy">
                {item.title}
              </h3>
              <p className="text-xs text-gray-500">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Analysis cards */}
        <h2 className="mb-4 text-lg font-semibold text-navy">
          Published Analyses
        </h2>
        <div className="space-y-4">
          {analyses.map((a) => (
            <Link
              key={a.slug}
              href={`/analyses/${a.slug}`}
              className="block rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span
                  className={`rounded-full border px-2 py-0.5 text-xs font-medium ${statusColors[a.status]}`}
                >
                  {a.status === "active"
                    ? "\u25CF Active"
                    : a.status === "paused"
                      ? "\u25CB Paused"
                      : "\u25A0 Concluded"}
                </span>
                <span className="text-xs text-gray-400">
                  v{a.version} &middot; Updated {a.lastUpdated}
                </span>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${certaintyColors[a.certainty]}`}
                >
                  {a.certainty} certainty
                </span>
              </div>

              <h3 className="mb-1 text-xl font-bold text-navy">{a.title}</h3>
              <p className="mb-3 text-sm text-gray-500">{a.subtitle}</p>

              <div className="mb-4 rounded-lg bg-navy/5 p-4">
                <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-orange">
                  Key Finding
                </div>
                <p className="text-sm text-navy">{a.keyFinding}</p>
              </div>

              <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                <span>
                  <strong className="text-navy">{a.nObservations}</strong> race
                  results
                </span>
                <span>
                  <strong className="text-navy">{a.dataRange}</strong> data
                  range
                </span>
                <span>
                  <strong className="text-navy">{a.litReviewCount}</strong>{" "}
                  papers reviewed
                </span>
              </div>

              <div className="mt-3 flex flex-wrap gap-1">
                {a.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>

        {/* Call to contribute */}
        <div className="mt-10 rounded-xl border-2 border-dashed border-navy/20 bg-navy/5 p-8 text-center">
          <h3 className="mb-2 text-lg font-semibold text-navy">
            Want to add an analysis?
          </h3>
          <p className="mb-4 text-sm text-gray-500">
            Any sports analytics question with publicly available data can
            become a living analysis. Clone the repo, run your analysis, and
            submit a PR.
          </p>
          <Link
            href="/contribute"
            className="inline-block rounded-lg bg-orange px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-orange-light"
          >
            Contribution Guide
          </Link>
        </div>
      </section>
    </div>
  );
}
