import Link from "next/link";
import { notFound } from "next/navigation";
import blogPosts from "@/data/blog-posts.json";

interface BlogPost {
  slug: string;
  title: string;
  subtitle: string;
  date: string;
  author: string;
  tags: string[];
  related_gap_slug?: string;
  image_emoji: string;
  reading_time_min: number;
  body: { type: string; text?: string; items?: string[] }[];
}

const posts: BlogPost[] = blogPosts as BlogPost[];

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/**
 * Generate all blog post paths at build time for static export.
 */
export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      {/* Back link */}
      <Link
        href="/blog"
        className="mb-8 inline-flex items-center gap-1 text-sm text-gray-400 transition-colors hover:text-navy"
      >
        &larr; All posts
      </Link>

      {/* Header */}
      <header className="mb-10">
        <div className="mb-4 flex flex-wrap items-center gap-3 text-sm text-gray-400">
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <span>&middot;</span>
          <span>{post.author}</span>
          <span>&middot;</span>
          <span>{post.reading_time_min} min read</span>
        </div>

        <h1 className="mb-3 text-3xl font-bold leading-tight text-navy sm:text-4xl">
          {post.title}
        </h1>

        <p className="text-lg text-gray-500 leading-relaxed">
          {post.subtitle}
        </p>

        {/* Tags */}
        <div className="mt-4 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-500"
            >
              {tag}
            </span>
          ))}
        </div>
      </header>

      {/* Body */}
      <article className="prose-custom">
        {post.body.map((block, i) => {
          if (block.type === "heading") {
            return (
              <h2
                key={i}
                className="mb-3 mt-8 text-xl font-semibold text-navy"
              >
                {block.text}
              </h2>
            );
          }

          if (block.type === "paragraph") {
            return (
              <p key={i} className="mb-4 text-gray-700 leading-relaxed">
                {block.text}
              </p>
            );
          }

          if (block.type === "list" && block.items) {
            return (
              <ul key={i} className="mb-4 ml-1 space-y-3">
                {block.items.map((item, j) => (
                  <li
                    key={j}
                    className="flex gap-3 text-gray-700 leading-relaxed"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-orange" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            );
          }

          return null;
        })}
      </article>

      {/* Related gap analysis CTA */}
      {post.related_gap_slug && (
        <div className="mt-10 rounded-xl border border-purple-200 bg-purple-50 p-6">
          <div className="flex items-start gap-3">
            <span className="text-2xl">🔬</span>
            <div>
              <h3 className="mb-1 font-semibold text-purple-900">
                Read the full gap analysis
              </h3>
              <p className="mb-3 text-sm text-purple-700">
                This post is based on an AI-powered gap analysis of 449 papers.
                The full analysis includes 9 identified research gaps, 4
                proposed studies, and references to 41 papers in our database.
              </p>
              <Link
                href="/gaps"
                className="inline-flex items-center gap-1 rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-purple-700"
              >
                View on Find the Gap &rarr;
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Share / bottom nav */}
      <div className="mt-10 flex items-center justify-between border-t border-gray-200 pt-6">
        <Link
          href="/blog"
          className="text-sm text-gray-400 transition-colors hover:text-navy"
        >
          &larr; All posts
        </Link>
        <div className="text-xs text-gray-400">
          Living Sports Analytics &middot; RSM Erasmus University
        </div>
      </div>
    </div>
  );
}
