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
  sitemap_url: string | null;
  sport_focus: string | null;
  category: string;
  description: string | null;
  author_name: string | null;
  active: number;
  last_checked: string | null;
  last_new_item: string | null;
  check_frequency: string | null;
  item_count: number;
  latest_item_date: string | null;
  collection_method: string;
}

const allSources = contentSourcesData as ContentSource[];

// Group by collection method
const METHOD_ORDER = ["rss", "sitemap", "thesis_scraper", "ssac_scraper"];

const METHOD_LABELS: Record<string, string> = {
  rss: "RSS & Atom Feeds",
  sitemap: "Sitemap Scrapers",
  thesis_scraper: "University Thesis Repositories",
  ssac_scraper: "Conference Paper Scrapers",
};

const METHOD_DESCRIPTIONS: Record<string, string> = {
  rss:
    "Blogs, newsletters, and academic portals monitored via RSS/Atom feeds. New posts are discovered automatically within hours of publication.",
  sitemap:
    "Sources monitored by parsing their XML sitemap for new pages. Checked periodically for new content.",
  thesis_scraper:
    "Dutch university thesis repositories scraped via OAI-PMH protocol or HTML parsing. Discovers new sports analytics theses and dissertations.",
  ssac_scraper:
    "Conference paper archives scraped for research papers and competition entries.",
};

const METHOD_ICONS: Record<string, React.ReactNode> = {
  rss: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
      <path d="M3.75 3a.75.75 0 0 0-.75.75v.5c0 .414.336.75.75.75H4c6.075 0 11 4.925 11 11v.25c0 .414.336.75.75.75h.5a.75.75 0 0 0 .75-.75V16C17 8.82 11.18 3 4 3h-.25Z" />
      <path d="M3 8.75A.75.75 0 0 1 3.75 8H4a8 8 0 0 1 8 8v.25a.75.75 0 0 1-.75.75h-.5a.75.75 0 0 1-.75-.75V16a6 6 0 0 0-6-6h-.25A.75.75 0 0 1 3 9.25v-.5ZM7 15a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z" />
    </svg>
  ),
  sitemap: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
      <path fillRule="evenodd" d="M4.25 2A2.25 2.25 0 0 0 2 4.25v2.5A2.25 2.25 0 0 0 4.25 9h2.5A2.25 2.25 0 0 0 9 6.75v-2.5A2.25 2.25 0 0 0 6.75 2h-2.5Zm0 9A2.25 2.25 0 0 0 2 13.25v2.5A2.25 2.25 0 0 0 4.25 18h2.5A2.25 2.25 0 0 0 9 15.75v-2.5A2.25 2.25 0 0 0 6.75 11h-2.5Zm9-9A2.25 2.25 0 0 0 11 4.25v2.5A2.25 2.25 0 0 0 13.25 9h2.5A2.25 2.25 0 0 0 18 6.75v-2.5A2.25 2.25 0 0 0 15.75 2h-2.5Zm0 9A2.25 2.25 0 0 0 11 13.25v2.5A2.25 2.25 0 0 0 13.25 18h2.5A2.25 2.25 0 0 0 18 15.75v-2.5A2.25 2.25 0 0 0 15.75 11h-2.5Z" clipRule="evenodd" />
    </svg>
  ),
  thesis_scraper: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
      <path d="M10.75 16.82A7.462 7.462 0 0 1 15 15.5c.71 0 1.396.098 2.046.282A.75.75 0 0 0 18 15.06v-11a.75.75 0 0 0-.546-.721A9.006 9.006 0 0 0 15 3a8.963 8.963 0 0 0-4.25 1.065V16.82ZM9.25 4.065A8.963 8.963 0 0 0 5 3c-.85 0-1.673.118-2.454.339A.75.75 0 0 0 2 4.06v11a.75.75 0 0 0 .954.721A7.506 7.506 0 0 1 5 15.5c1.579 0 3.042.487 4.25 1.32V4.065Z" />
    </svg>
  ),
  ssac_scraper: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
      <path fillRule="evenodd" d="M2 3.5A1.5 1.5 0 0 1 3.5 2h9A1.5 1.5 0 0 1 14 3.5v11.75A2.75 2.75 0 0 0 16.75 18h-12A2.75 2.75 0 0 1 2 15.25V3.5Zm3.75 7a.75.75 0 0 0 0 1.5h4.5a.75.75 0 0 0 0-1.5h-4.5Zm0 3a.75.75 0 0 0 0 1.5h4.5a.75.75 0 0 0 0-1.5h-4.5ZM5 5.75A.75.75 0 0 1 5.75 5h4.5a.75.75 0 0 1 .75.75v2.5a.75.75 0 0 1-.75.75h-4.5A.75.75 0 0 1 5 8.25v-2.5Z" clipRule="evenodd" />
      <path d="M16.5 6.5h-1v8.75a1.25 1.25 0 1 0 2.5 0V8a1.5 1.5 0 0 0-1.5-1.5Z" />
    </svg>
  ),
};

const CATEGORY_BADGES: Record<string, string> = {
  blog: "Blog",
  newsletter: "Newsletter",
  news: "News",
  thesis_portfolio: "Academic",
  working_paper_repo: "Papers",
};

function formatDate(dateStr: string | null): string | null {
  if (!dateStr) return null;
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  } catch {
    return null;
  }
}

export const metadata = {
  title: "Sources | Living Sports Analytics",
  description:
    "Non-OpenAlex sources monitored by the platform: blogs, newsletters, thesis repositories, and conference papers with automated collection.",
};

export default function SourcesPage() {
  const groupedSources: Record<string, ContentSource[]> = {};
  for (const source of allSources) {
    const method = source.collection_method;
    if (!groupedSources[method]) groupedSources[method] = [];
    groupedSources[method].push(source);
  }

  const totalSources = allSources.length;
  const rssSources = groupedSources["rss"]?.length || 0;
  const scrapedSources = totalSources - rssSources;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-2 text-3xl font-bold text-navy">Non-OpenAlex Sources</h1>
      <p className="mb-6 text-gray-500">
        {totalSources} curated sources with automated collection &middot;{" "}
        {rssSources} RSS feeds &middot; {scrapedSources} scraped repositories.
        These sources complement the{" "}
        <Link href="/explore" className="text-orange hover:underline">
          OpenAlex pipeline
        </Link>{" "}
        for discovering grey literature, theses, and blog posts that traditional academic databases miss.
      </p>

      {/* How it works */}
      <div className="mb-8 rounded-xl border border-navy/10 bg-navy/5 p-5">
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-navy/70">How collection works</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex items-start gap-2">
            <span className="mt-0.5 text-orange">{METHOD_ICONS.rss}</span>
            <div>
              <p className="text-sm font-medium text-navy">RSS/Atom Feeds</p>
              <p className="text-xs text-gray-500">Polled automatically. New posts appear within hours.</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <span className="mt-0.5 text-navy/50">{METHOD_ICONS.sitemap}</span>
            <div>
              <p className="text-sm font-medium text-navy">Sitemap Scrapers</p>
              <p className="text-xs text-gray-500">XML sitemaps parsed periodically for new pages.</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <span className="mt-0.5 text-blue-500">{METHOD_ICONS.thesis_scraper}</span>
            <div>
              <p className="text-sm font-medium text-navy">Thesis Repositories</p>
              <p className="text-xs text-gray-500">OAI-PMH harvesting or HTML scraping of university repos.</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <span className="mt-0.5 text-purple-500">{METHOD_ICONS.ssac_scraper}</span>
            <div>
              <p className="text-sm font-medium text-navy">Conference Scrapers</p>
              <p className="text-xs text-gray-500">Paper archives scraped for competition entries.</p>
            </div>
          </div>
        </div>
      </div>

      {/* RSS subscription box */}
      <div className="mb-8 rounded-xl border border-orange/20 bg-orange/5 p-4">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex-shrink-0 text-orange">{METHOD_ICONS.rss}</span>
          <div>
            <p className="font-medium text-navy">Subscribe to our combined feed</p>
            <p className="mt-1 text-sm text-gray-600">
              All new publications from OpenAlex + these sources in one RSS feed:{" "}
              <a href="/feed.xml" className="font-medium text-orange hover:underline">
                /feed.xml
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Source groups by collection method */}
      <div className="space-y-10">
        {METHOD_ORDER.map((method) => {
          const sources = groupedSources[method];
          if (!sources || sources.length === 0) return null;

          return (
            <section key={method}>
              <div className="mb-4 flex items-center gap-2">
                <span className={
                  method === "rss" ? "text-orange" :
                  method === "thesis_scraper" ? "text-blue-500" :
                  method === "ssac_scraper" ? "text-purple-500" :
                  "text-navy/50"
                }>
                  {METHOD_ICONS[method]}
                </span>
                <div>
                  <h2 className="text-xl font-semibold text-navy">
                    {METHOD_LABELS[method]} ({sources.length})
                  </h2>
                  <p className="text-sm text-gray-500">
                    {METHOD_DESCRIPTIONS[method]}
                  </p>
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                {sources.map((source) => (
                  <div
                    key={source.id}
                    className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
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
                      <div className="flex flex-shrink-0 gap-1.5">
                        {CATEGORY_BADGES[source.category] && (
                          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                            {CATEGORY_BADGES[source.category]}
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
                      <p className="mt-2 line-clamp-2 text-sm text-gray-600">
                        {source.description}
                      </p>
                    )}

                    <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-400">
                      {source.item_count > 0 && (
                        <span className="font-medium text-gray-500">
                          {source.item_count} {source.item_count === 1 ? "item" : "items"} collected
                        </span>
                      )}
                      {source.latest_item_date && (
                        <span>Latest: {formatDate(source.latest_item_date)}</span>
                      )}
                      {source.feed_url && source.feed_type && (
                        <span className="capitalize">{source.feed_type}</span>
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
          We&apos;re always looking for high-quality sources. Suggest a blog, newsletter, or thesis repository on our{" "}
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
