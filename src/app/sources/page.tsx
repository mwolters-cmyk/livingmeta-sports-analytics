"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import feedItemsData from "@/data/feed-items.json";
import {
  SPORT_LABELS,
  CONTENT_TYPE_BADGE,
  type FeedItem,
} from "@/lib/db";

const allItems = feedItemsData as FeedItem[];

// ── Content type filter options ──
const CONTENT_TYPES = [
  { key: "all", label: "All" },
  { key: "journal_article", label: "Journal" },
  { key: "blog_post", label: "Blog" },
  { key: "thesis", label: "Thesis" },
  { key: "conference_paper", label: "Conference" },
  { key: "working_paper", label: "Preprint" },
  { key: "news_article", label: "News" },
];

// ── Sport options (only sports present in feed) ──
function buildSportOptions(items: FeedItem[]) {
  const counts: Record<string, number> = {};
  for (const item of items) {
    counts[item.sport] = (counts[item.sport] || 0) + 1;
  }
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .map(([sport, count]) => ({
      key: sport,
      label: SPORT_LABELS[sport] || sport,
      count,
    }));
}

// ── Time grouping ──
function getTimeGroup(dateStr: string | null): string {
  if (!dateStr) return "Earlier";
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  if (diffDays < 1) return "Today";
  if (diffDays < 7) return "This Week";
  if (diffDays < 30) return "This Month";
  return "Earlier";
}

// ── Relative date formatting ──
function relativeDate(dateStr: string | null): string {
  if (!dateStr) return "";
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 365) return `${Math.floor(diffDays / 365)}y ago`;
  if (diffDays > 30) return `${Math.floor(diffDays / 30)}mo ago`;
  if (diffDays > 0) return diffDays === 1 ? "yesterday" : `${diffDays}d ago`;
  if (diffHours > 0) return `${diffHours}h ago`;
  if (diffMins > 0) return `${diffMins}m ago`;
  return "just now";
}

// ── Unique source count ──
const uniqueSourceCount = new Set(allItems.map((i) => i.source_name).filter(Boolean)).size;

// ── Badge component ──
function ContentTypeBadge({ type }: { type: string }) {
  const badge = CONTENT_TYPE_BADGE[type] || {
    letter: "?",
    label: type,
    color: "bg-gray-500 text-white",
  };
  return (
    <span
      className={`inline-flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg text-xs font-bold ${badge.color}`}
      title={badge.label}
    >
      {badge.letter}
    </span>
  );
}

export default function SourcesFeedPage() {
  const [contentFilter, setContentFilter] = useState("all");
  const [sportFilter, setSportFilter] = useState("all");
  const [showCount, setShowCount] = useState(30);

  const sportOptions = useMemo(() => buildSportOptions(allItems), []);

  // Filter items
  const filtered = useMemo(() => {
    return allItems.filter((item) => {
      if (contentFilter !== "all" && item.content_type !== contentFilter) return false;
      if (sportFilter !== "all" && item.sport !== sportFilter) return false;
      return true;
    });
  }, [contentFilter, sportFilter]);

  // Group by time period
  const visible = filtered.slice(0, showCount);
  const groups: { label: string; items: FeedItem[] }[] = [];
  const ORDER = ["Today", "This Week", "This Month", "Earlier"];

  for (const label of ORDER) {
    const items = visible.filter((i) => getTimeGroup(i.pub_date) === label);
    if (items.length > 0) groups.push({ label, items });
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* Header */}
      <h1 className="mb-2 text-3xl font-bold text-navy">
        What&apos;s New in Sports Analytics
      </h1>
      <p className="mb-6 text-gray-500">
        Latest from {uniqueSourceCount}+ journals, blogs &amp; preprints &middot; Updated:{" "}
        {allItems[0]?.created_at
          ? relativeDate(allItems[0].created_at)
          : "recently"}{" "}
        &middot;{" "}
        <a
          href="/feed.xml"
          className="text-orange hover:underline"
          title="Subscribe via RSS"
        >
          RSS Feed
        </a>
      </p>

      {/* Filters */}
      <div className="mb-6 space-y-3">
        {/* Content type pills */}
        <div className="flex flex-wrap gap-2">
          {CONTENT_TYPES.map((ct) => {
            const isActive = contentFilter === ct.key;
            return (
              <button
                key={ct.key}
                onClick={() => {
                  setContentFilter(ct.key);
                  setShowCount(30);
                }}
                className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-navy text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {ct.label}
              </button>
            );
          })}
        </div>

        {/* Sport dropdown */}
        <div className="flex items-center gap-2">
          <label htmlFor="sport-filter" className="text-sm font-medium text-gray-500">
            Sport:
          </label>
          <select
            id="sport-filter"
            value={sportFilter}
            onChange={(e) => {
              setSportFilter(e.target.value);
              setShowCount(30);
            }}
            className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy"
          >
            <option value="all">All Sports ({allItems.length})</option>
            {sportOptions.map((s) => (
              <option key={s.key} value={s.key}>
                {s.label} ({s.count})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Result count */}
      {filtered.length !== allItems.length && (
        <p className="mb-4 text-sm text-gray-400">
          Showing {Math.min(showCount, filtered.length)} of {filtered.length} results
        </p>
      )}

      {/* Feed items grouped by time */}
      <div className="space-y-6">
        {groups.map((group) => (
          <section key={group.label}>
            <h2 className="mb-3 border-b border-gray-200 pb-1 text-sm font-semibold uppercase tracking-wide text-gray-400">
              {group.label}
            </h2>
            <div className="space-y-1">
              {group.items.map((item) => (
                <FeedCard key={item.work_id} item={item} />
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="py-16 text-center">
          <p className="text-gray-400">No items match your filters.</p>
          <button
            onClick={() => {
              setContentFilter("all");
              setSportFilter("all");
            }}
            className="mt-2 text-sm text-orange hover:underline"
          >
            Clear filters
          </button>
        </div>
      )}

      {/* Show more */}
      {showCount < filtered.length && (
        <div className="mt-6 text-center">
          <button
            onClick={() => setShowCount((c) => c + 30)}
            className="rounded-lg bg-gray-100 px-6 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200"
          >
            Show more ({filtered.length - showCount} remaining)
          </button>
        </div>
      )}

      {/* Footer CTA */}
      <div className="mt-10 rounded-xl border border-gray-200 bg-gray-50 p-5 text-center">
        <p className="text-sm text-gray-500">
          Browse all 40,000+ indexed papers on the{" "}
          <Link href="/explore" className="font-medium text-orange hover:underline">
            Explore page
          </Link>
          {" "}&middot;{" "}
          <a
            href="/feed.xml"
            className="font-medium text-orange hover:underline"
          >
            Subscribe via RSS
          </a>
        </p>
      </div>
    </div>
  );
}

// ── Individual feed card ──
function FeedCard({ item }: { item: FeedItem }) {
  const sportLabel = SPORT_LABELS[item.sport] || item.sport;
  const itemLink =
    item.link || `/explore?paper=${encodeURIComponent(item.work_id)}`;
  const isExternal = item.link?.startsWith("http");

  return (
    <div className="group flex gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-gray-50">
      {/* Content type badge */}
      <div className="pt-0.5">
        <ContentTypeBadge type={item.content_type} />
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        {/* Title */}
        <h3 className="text-[15px] font-semibold leading-snug text-navy group-hover:text-orange">
          {isExternal ? (
            <a
              href={itemLink}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              {item.title}
              <span className="ml-1 inline-block text-gray-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="inline h-3 w-3"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.22 11.78a.75.75 0 0 1 0-1.06L9.44 5.5H5.75a.75.75 0 0 1 0-1.5h5.5a.75.75 0 0 1 .75.75v5.5a.75.75 0 0 1-1.5 0V6.56l-5.22 5.22a.75.75 0 0 1-1.06 0Z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
            </a>
          ) : (
            <Link href={itemLink} className="hover:underline">
              {item.title}
            </Link>
          )}
        </h3>

        {/* Metadata row */}
        <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-gray-400">
          {item.source_name && (
            <span className="text-gray-500">{item.source_name}</span>
          )}
          <span className="rounded-full bg-blue-50 px-1.5 py-0.5 text-blue-700">
            {sportLabel}
          </span>
          {item.pub_date && (
            <span title={item.pub_date}>{relativeDate(item.pub_date)}</span>
          )}
        </div>

        {/* Summary (if available) */}
        {item.summary && (
          <p className="mt-1 line-clamp-1 text-xs text-gray-400">
            {item.summary}
          </p>
        )}
      </div>
    </div>
  );
}
