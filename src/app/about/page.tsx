import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold text-navy">About This Platform</h1>

      <section className="mb-10">
        <h2 className="mb-4 text-xl font-semibold text-navy">What is a Living Meta-Analysis?</h2>
        <p className="mb-3 text-gray-600 leading-relaxed">
          A <strong>living systematic review</strong> is a research synthesis that is continuously
          updated as new evidence becomes available. Unlike traditional reviews that become outdated
          within months, living reviews maintain an always-current picture of the research landscape.
        </p>
        <p className="text-gray-600 leading-relaxed">
          This is the <strong>first living review platform in sports analytics</strong>. It
          automatically monitors academic databases, classifies new publications, and updates
          trend analyses &mdash; all without manual intervention.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="mb-4 text-xl font-semibold text-navy">How It Works</h2>
        <div className="space-y-4">
          {[
            {
              step: "1",
              title: "Monitor",
              desc: "Every week, we poll the OpenAlex API for new papers across 13 target journals and 60+ keyword queries spanning 15+ sports.",
            },
            {
              step: "2",
              title: "Enrich",
              desc: "We fetch abstracts, infer author gender using the gender-guesser library, and normalize metadata (institutions, countries, concepts).",
            },
            {
              step: "3",
              title: "Classify",
              desc: "AI-powered classification assigns each paper a sport, methodology type, research theme, and relevance scores. (Coming soon)",
            },
            {
              step: "4",
              title: "Analyze",
              desc: "Automated meta-analysis computes publication trends, methodology evolution, gender ratios, citation networks, and identifies research gaps.",
            },
            {
              step: "5",
              title: "Publish",
              desc: "Results are published on this website and the interactive dashboard, updated automatically after each sync cycle.",
            },
          ].map((s) => (
            <div key={s.step} className="flex gap-4 rounded-lg border border-gray-200 bg-white p-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-navy text-sm font-bold text-white">
                {s.step}
              </div>
              <div>
                <h3 className="font-semibold text-navy">{s.title}</h3>
                <p className="text-sm text-gray-600">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-10">
        <h2 className="mb-4 text-xl font-semibold text-navy">Team</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h3 className="text-lg font-semibold text-navy">Matthijs Wolters</h3>
            <p className="text-sm text-gray-500">Rotterdam School of Management</p>
            <p className="mt-2 text-sm text-gray-600">
              Research platform development, data engineering, sports analytics pipeline.
              8+ years supervising 100+ theses in sports analytics across 15+ sports.
            </p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h3 className="text-lg font-semibold text-navy">Otto Koppius</h3>
            <p className="text-sm text-gray-500">Rotterdam School of Management</p>
            <p className="mt-2 text-sm text-gray-600">
              Academic supervision, research direction, EUR board liaison.
              Leading the GenAI Learning Line initiative at RSM.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="mb-4 text-xl font-semibold text-navy">Technology Stack</h2>
        <div className="grid gap-3 md:grid-cols-3">
          {[
            { cat: "Data Pipeline", items: "Python, SQLite, OpenAlex API, gender-guesser" },
            { cat: "AI Classification", items: "Claude API (Anthropic), batch processing" },
            { cat: "Website", items: "Next.js, Tailwind CSS, Vercel" },
            { cat: "Dashboard", items: "Streamlit, Plotly" },
            { cat: "Automation", items: "GitHub Actions (weekly sync)" },
            { cat: "Collaboration", items: "Claude Code, GitHub PRs, CLAUDE.md" },
          ].map((t) => (
            <div key={t.cat} className="rounded-lg border border-gray-200 bg-white p-4">
              <h3 className="text-sm font-semibold text-orange">{t.cat}</h3>
              <p className="mt-1 text-sm text-gray-600">{t.items}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-10">
        <h2 className="mb-4 text-xl font-semibold text-navy">Sports Covered</h2>
        <div className="flex flex-wrap gap-2">
          {[
            "Football/Soccer", "Tennis", "Basketball (NBA/WNBA)", "Ice Hockey (NHL)",
            "Baseball (MLB)", "Cricket", "Cycling", "Speed Skating", "Athletics/Track & Field",
            "Swimming", "Rugby", "Volleyball", "eSports", "Judged Sports", "Horse Racing",
          ].map((sport) => (
            <span
              key={sport}
              className="rounded-full border border-navy/20 bg-navy/5 px-3 py-1 text-sm text-navy"
            >
              {sport}
            </span>
          ))}
        </div>
      </section>

      <section className="rounded-xl bg-navy/5 p-8 text-center">
        <h2 className="mb-3 text-xl font-bold text-navy">Want to contribute?</h2>
        <p className="mb-4 text-gray-600">
          This platform is designed for collaboration. Students, researchers, and developers are welcome.
        </p>
        <Link
          href="/getting-started"
          className="inline-block rounded-lg bg-orange px-6 py-3 font-semibold text-white transition-colors hover:bg-orange-light"
        >
          Getting Started Guide
        </Link>
      </section>
    </div>
  );
}
