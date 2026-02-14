import Link from "next/link";

export default function GapsPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="mb-2 text-3xl font-bold text-navy">Research Gaps</h1>
      <p className="mb-8 text-gray-500">
        Identify underresearched areas in sports analytics
      </p>

      {/* Knowledge Map placeholder */}
      <section className="mb-10">
        <h2 className="mb-4 text-xl font-semibold text-navy">Knowledge Map</h2>
        <div className="rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center">
          <div className="mb-4 text-4xl">&#128506;</div>
          <h3 className="mb-2 text-lg font-semibold text-navy">
            Interactive Knowledge Map &mdash; Coming Soon
          </h3>
          <p className="mx-auto max-w-lg text-sm text-gray-500">
            A visual heatmap showing which combinations of sport &times; theme &times; methodology
            are well-researched (dark) vs. underexplored (light). This will help identify the most
            promising research opportunities.
          </p>
        </div>
      </section>

      {/* What we know so far */}
      <section className="mb-10">
        <h2 className="mb-4 text-xl font-semibold text-navy">
          What We Already Know
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-green-200 bg-green-50 p-6">
            <h3 className="mb-3 font-semibold text-green-800">
              Well-Researched Areas
            </h3>
            <ul className="space-y-2 text-sm text-green-700">
              <li>&#10003; Football/soccer performance analysis</li>
              <li>&#10003; Injury prediction in team sports</li>
              <li>&#10003; Machine learning for match prediction</li>
              <li>&#10003; GPS/wearable data in football and rugby</li>
              <li>&#10003; Expected goals (xG) models</li>
              <li>&#10003; NBA player tracking analytics</li>
            </ul>
          </div>
          <div className="rounded-xl border border-orange/30 bg-orange/5 p-6">
            <h3 className="mb-3 font-semibold text-orange">
              Potential Research Gaps
            </h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>&#10007; Women&apos;s sport analytics (data + publications)</li>
              <li>&#10007; eSports performance modeling</li>
              <li>&#10007; Speed skating / winter sports analytics</li>
              <li>&#10007; LLM/NLP applications in sport</li>
              <li>&#10007; Cross-sport methodology transfer</li>
              <li>&#10007; Judging bias quantification</li>
              <li>&#10007; Cricket analytics (relative to its audience size)</li>
              <li>&#10007; Fan engagement prediction models</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Research Gap Finder */}
      <section className="mb-10">
        <h2 className="mb-4 text-xl font-semibold text-navy">
          Research Gap Finder
        </h2>
        <div className="rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center">
          <div className="mb-4 text-4xl">&#128269;</div>
          <h3 className="mb-2 text-lg font-semibold text-navy">
            Interactive Gap Finder &mdash; Coming Soon
          </h3>
          <p className="mx-auto max-w-lg text-sm text-gray-500">
            Select a sport and theme to see how many papers exist, which methodologies
            have been used, and what opportunities remain. Powered by AI classification
            of 39,000+ papers.
          </p>
        </div>
      </section>

      {/* Thesis connection */}
      <section className="rounded-xl bg-navy/5 p-8 text-center">
        <h2 className="mb-3 text-xl font-bold text-navy">
          Turn a Research Gap Into a Thesis
        </h2>
        <p className="mb-4 text-gray-600">
          Found an interesting gap? We have data, infrastructure, and supervision available
          for BSc and MSc thesis projects at RSM Erasmus University.
        </p>
        <Link
          href="/getting-started"
          className="inline-block rounded-lg bg-orange px-6 py-3 font-semibold text-white transition-colors hover:bg-orange-light"
        >
          View Thesis Projects
        </Link>
      </section>
    </div>
  );
}
