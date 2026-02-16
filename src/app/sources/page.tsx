import Link from "next/link";
import contentSourcesData from "@/data/content-sources.json";
import { SPORT_LABELS } from "@/lib/db";

interface ContentSource {
  id: number;
  name: string;
  platform: string | null;
  url: string;
  feed_url: string | null;
  feed_type: string | null;
  sport_focus: string | null;
  category: string;
  description: string | null;
  author_name: string | null;
  active: number;
  last_checked: string | null;
  last_new_item: string | null;
  check_frequency: string | null;
  item_count: number;
}

const allSources = contentSourcesData as ContentSource[];

const CATEGORY_LABELS: Record<string, string> = {
  blog: "Blogs",
  corporate_blog: "Corporate Blogs",
  newsletter: "Newsletters",
  thesis_portfolio: "Thesis Portfolios",
  conference: "Conferences",
  news: "News",
};

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  blog: "Independent sports analytics blogs by researchers and analysts.",
  corporate_blog: "Analytics content published by sports data companies.",
  newsletter: "Regular email newsletters covering sports analytics.",
  thesis_portfolio: "University thesis collections on sports analytics topics.",
  conference: "Academic and industry conferences featuring sports analytics.",
  news: "Data-driven sports journalism and news outlets.",
};

const CATEGORY_ORDER = ["blog", "corporate_blog", "newsletter", "thesis_portfolio", "conference", "news"];

export const metadata = {
  title: "Sources | Living Sports Analytics",
  description: "Directory of sports analytics blogs, newsletters, thesis portfolios, conferences, and corporate blogs monitored by the platform.",
};

export default function SourcesPage() {
  const groupedSources: Record<string, ContentSource[]> = {};
  for (const source of allSources) {
    const cat = source.category || "blog";
    if (!groupedSources[cat]) groupedSources[cat] = [];
    groupedSources[cat].push(source);
  }

  const totalSources = allSources.length;
  const withFeed = allSources.filter((s) => s.feed_url).length;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-2 text-3xl font-bold text-navy">Sources</h1>
      <p className="mb-8 text-gray-500">
        {totalSources} curated sources &middot; {withFeed} with RSS monitoring &middot; The sports analytics blogosphere, mapped and monitored.
        New items from these sources appear automatically on the{" "}
        <Link href="/explore" className="text-orange hover:underline">
          Explore
        </Link>{" "}
        page.
      </p>

      {/* RSS info box */}
      <div className="mb-8 rounded-xl border border-orange/20 bg-orange/5 p-4">
        <div className="flex items-start gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="mt-0.5 h-5 w-5 flex-shrink-0 text-orange">
            <path d="M3.75 3a.75.75 0 0 0-.75.75v.5c0 .414.336.75.75.75H4c6.075 0 11 4.925 11 11v.25c0 .414.336.75.75.75h.5a.75.75 0 0 0 .75-.75V16C17 8.82 11.18 3 4 3h-.25Z" />
            <path d="M3 8.75A.75.75 0 0 1 3.75 8H4a8 8 0 0 1 8 8v.25a.75.75 0 0 1-.75.75h-.5a.75.75 0 0 1-.75-.75V16a6 6 0 0 0-6-6h-.25A.75.75 0 0 1 3 9.25v-.5ZM7 15a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z" />
          </svg>
          <div>
            <p className="font-medium text-navy">Subscribe via RSS</p>
            <p className="mt-1 text-sm text-gray-600">
              Get the latest sports analytics publications, blog posts, and grey literature in your feed reader:{" "}
              <a href="/feed.xml" className="font-medium text-orange hover:underline">
                /feed.xml
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Source categories */}
      <div className="space-y-10">
        {CATEGORY_ORDER.map((cat) => {
          const sources = groupedSources[cat];
          if (!sources || sources.length === 0) return null;

          return (
            <section key={cat}>
              <h2 className="mb-1 text-xl font-semibold text-navy">
                {CATEGORY_LABELS[cat] || cat} ({sources.length})
              </h2>
              <p className="mb-4 text-sm text-gray-500">
                {CATEGORY_DESCRIPTIONS[cat] || ""}
              </p>

              <div className="grid gap-4 md:grid-cols-2">
                {sources.map((source) => (
                  <div
                    key={source.id}
                    className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-navy">
                          <a
                            href={source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-orange hover:underline"
                          >
                            {source.name}
                            <span className="ml-1 inline-block text-gray-400">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="inline h-3 w-3">
                                <path fillRule="evenodd" d="M4.22 11.78a.75.75 0 0 1 0-1.06L9.44 5.5H5.75a.75.75 0 0 1 0-1.5h5.5a.75.75 0 0 1 .75.75v5.5a.75.75 0 0 1-1.5 0V6.56l-5.22 5.22a.75.75 0 0 1-1.06 0Z" clipRule="evenodd" />
                              </svg>
                            </span>
                          </a>
                        </h3>
                        {source.author_name && (
                          <p className="text-sm text-gray-500">by {source.author_name}</p>
                        )}
                      </div>
                      <div className="flex gap-1.5">
                        {source.feed_url ? (
                          <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700" title="RSS feed monitored">
                            RSS
                          </span>
                        ) : (
                          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500" title="No RSS feed">
                            Manual
                          </span>
                        )}
                        {source.sport_focus && (
                          <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
                            {SPORT_LABELS[source.sport_focus] || source.sport_focus}
                          </span>
                        )}
                      </div>
                    </div>

                    {source.description && (
                      <p className="mt-2 text-sm text-gray-600">{source.description}</p>
                    )}

                    <div className="mt-3 flex items-center gap-3 text-xs text-gray-400">
                      {source.platform && (
                        <span className="capitalize">{source.platform}</span>
                      )}
                      {source.last_checked && (
                        <span>Last checked: {source.last_checked}</span>
                      )}
                      {source.item_count > 0 && (
                        <span className="font-medium text-gray-500">
                          {source.item_count} items on platform
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      {/* Suggest a source */}
      <div className="mt-12 rounded-xl border border-dashed border-gray-300 bg-gray-50 p-6 text-center">
        <h3 className="font-semibold text-navy">Know a sports analytics blog or resource we should track?</h3>
        <p className="mt-2 text-sm text-gray-500">
          We&apos;re always looking for high-quality sources. Suggest a blog, newsletter, conference, or thesis portfolio on our{" "}
          <Link href="/contribute" className="text-orange hover:underline">
            contribute page
          </Link>{" "}
          or open an issue on{" "}
          <a
            href="https://github.com/mwolters-cmyk/living-sports-analytics-research/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange hover:underline"
          >
            GitHub
          </a>
          .
        </p>
      </div>
    </div>
  );
}
