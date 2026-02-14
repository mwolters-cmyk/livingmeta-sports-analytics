export default function GettingStartedPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="mb-2 text-3xl font-bold text-navy">Getting Started</h1>
      <p className="mb-8 text-gray-500">
        Three ways to contribute to the Living Sports Analytics platform
      </p>

      {/* Path 1: Claude Code */}
      <section className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange text-sm font-bold text-white">
            1
          </div>
          <h2 className="text-xl font-semibold text-navy">
            Contribute Code via Claude Code + GitHub
          </h2>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="mb-4 text-sm text-gray-600">
            This is the primary way to contribute. You use Claude Code (Anthropic&apos;s AI coding
            agent) on your own machine. The <code className="rounded bg-gray-100 px-1 py-0.5 text-xs">CLAUDE.md</code> file
            in the repository root automatically gives Claude full project context.
          </p>

          <h3 className="mb-2 font-semibold text-navy">Setup (one-time, ~10 minutes)</h3>
          <ol className="mb-6 space-y-3 text-sm text-gray-600">
            <li className="flex gap-2">
              <span className="font-mono text-orange">1.</span>
              <div>
                <strong>Install Claude Code:</strong>{" "}
                <code className="rounded bg-gray-100 px-2 py-0.5 text-xs">npm install -g @anthropic-ai/claude-code</code>
              </div>
            </li>
            <li className="flex gap-2">
              <span className="font-mono text-orange">2.</span>
              <div>
                <strong>Clone the repository:</strong>{" "}
                <code className="rounded bg-gray-100 px-2 py-0.5 text-xs">
                  git clone https://github.com/mwolters-cmyk/living-sports-analytics-research.git
                </code>
              </div>
            </li>
            <li className="flex gap-2">
              <span className="font-mono text-orange">3.</span>
              <div>
                <strong>Install Python dependencies:</strong>{" "}
                <code className="rounded bg-gray-100 px-2 py-0.5 text-xs">pip install -r requirements.txt</code>
              </div>
            </li>
            <li className="flex gap-2">
              <span className="font-mono text-orange">4.</span>
              <div>
                <strong>Create <code className="text-xs">.env</code> file:</strong>{" "}
                <code className="rounded bg-gray-100 px-2 py-0.5 text-xs">
                  OPENALEX_EMAIL=your@email.com
                </code>
              </div>
            </li>
            <li className="flex gap-2">
              <span className="font-mono text-orange">5.</span>
              <div>
                <strong>Build the database:</strong>{" "}
                <code className="rounded bg-gray-100 px-2 py-0.5 text-xs">python -m living_meta.migrate_existing</code>
              </div>
            </li>
            <li className="flex gap-2">
              <span className="font-mono text-orange">6.</span>
              <div>
                <strong>Start Claude Code:</strong> Open terminal in the repo directory and type{" "}
                <code className="rounded bg-gray-100 px-2 py-0.5 text-xs">claude</code>
              </div>
            </li>
          </ol>

          <h3 className="mb-2 font-semibold text-navy">How the workflow works</h3>
          <div className="rounded-lg bg-gray-50 p-4 text-sm text-gray-600">
            <p className="mb-2">
              When you start Claude Code in this project, it automatically reads <code className="text-xs">CLAUDE.md</code> and
              understands the entire project: database schema, available datasets, coding conventions,
              and current status.
            </p>
            <p className="mb-2">
              You can ask it to: &quot;Add a new scraper for handball data&quot;, &quot;Analyze citation
              trends for football papers&quot;, or &quot;Build a visualization of methodology
              evolution&quot;. It will write the code, test it, and prepare a pull request.
            </p>
            <p>
              All contributions go through GitHub pull requests for review before merging.
            </p>
          </div>
        </div>
      </section>

      {/* Path 2: Paper Tagging */}
      <section className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange text-sm font-bold text-white">
            2
          </div>
          <h2 className="text-xl font-semibold text-navy">
            Tag Papers (No Coding Required)
          </h2>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="mb-4 text-sm text-gray-600">
            Help improve our AI classifier by manually tagging papers with their correct sport,
            methodology, and research theme. Your tags serve as ground truth for training.
          </p>
          <div className="rounded-lg bg-amber-50 border border-amber-200 p-4 text-sm text-amber-800">
            The paper tagging interface is coming soon. It will be available through the
            interactive dashboard.
          </div>
        </div>
      </section>

      {/* Path 3: Thesis Projects */}
      <section className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange text-sm font-bold text-white">
            3
          </div>
          <h2 className="text-xl font-semibold text-navy">
            Thesis Projects
          </h2>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="mb-4 text-sm text-gray-600">
            Students at RSM can use this platform as the foundation for their thesis. Each project
            has a clear scope, available data, and expected deliverables.
          </p>

          <div className="space-y-3">
            {[
              {
                title: "AI Paper Classifier for Sports Analytics",
                level: "MSc",
                desc: "Build a classifier that can replicate Jan Van Haaren's annual soccer analytics categorization, extended to all sports.",
              },
              {
                title: "Topic Modeling Pipeline",
                level: "MSc",
                desc: "Apply NLP topic modeling (LDA, BERTopic) to 39K+ paper abstracts to discover emerging research themes.",
              },
              {
                title: "Citation Network Gender Analysis",
                level: "BSc/MSc",
                desc: "Do papers about women's sport receive fewer citations? Analyze 125K+ author records with citation data.",
              },
              {
                title: "Generic Elo Rating Framework",
                level: "BSc",
                desc: "Build a sport-agnostic Elo rating system that can be configured for any competitive sport.",
              },
              {
                title: "Betting Market Efficiency",
                level: "MSc",
                desc: "Cross-sport comparison of betting market efficiency using our odds data + academic literature.",
              },
              {
                title: "Injury Prediction Literature Synthesis",
                level: "BSc/MSc",
                desc: "Systematic analysis of injury prediction papers: which methods work best for which sports?",
              },
            ].map((proj) => (
              <div
                key={proj.title}
                className="rounded-lg border border-gray-100 bg-gray-50 p-4"
              >
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-navy">{proj.title}</h3>
                  <span className="rounded bg-navy/10 px-2 py-0.5 text-xs font-medium text-navy">
                    {proj.level}
                  </span>
                </div>
                <p className="mt-1 text-sm text-gray-600">{proj.desc}</p>
              </div>
            ))}
          </div>

          <p className="mt-4 text-sm text-gray-500">
            Interested? Contact Matthijs Wolters or Otto Koppius at RSM.
          </p>
        </div>
      </section>

      {/* What you can do */}
      <section className="rounded-xl border border-orange/30 bg-orange/5 p-6">
        <h2 className="mb-3 text-lg font-semibold text-navy">
          Example Tasks for Contributors
        </h2>
        <div className="grid gap-2 md:grid-cols-2 text-sm text-gray-600">
          <div className="flex gap-2">
            <span className="text-orange">&#9679;</span>
            Add a new sport scraper (e.g., handball, boxing)
          </div>
          <div className="flex gap-2">
            <span className="text-orange">&#9679;</span>
            Build a new dashboard visualization
          </div>
          <div className="flex gap-2">
            <span className="text-orange">&#9679;</span>
            Improve the AI paper classifier prompt
          </div>
          <div className="flex gap-2">
            <span className="text-orange">&#9679;</span>
            Add more journals to the watcher
          </div>
          <div className="flex gap-2">
            <span className="text-orange">&#9679;</span>
            Analyze methodology trends per sport
          </div>
          <div className="flex gap-2">
            <span className="text-orange">&#9679;</span>
            Create a citation network visualization
          </div>
        </div>
      </section>
    </div>
  );
}
