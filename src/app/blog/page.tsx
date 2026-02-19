import Link from "next/link";
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

export default function BlogPage() {
  const sortedPosts = [...posts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="mb-10">
        <h1 className="mb-3 text-3xl font-bold text-navy">Blog</h1>
        <p className="text-gray-600 leading-relaxed">
          Commentary and analysis on sports analytics research &mdash; written
          for humans, powered by data. We dig into the questions that matter,
          check what the evidence actually says, and point out what nobody has
          studied yet.
        </p>
      </div>

      <div className="space-y-6">
        {sortedPosts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group block rounded-xl border border-gray-200 bg-white p-6 transition-all hover:border-orange/30 hover:shadow-md"
          >
            <div className="flex gap-5">
              {/* Emoji thumbnail */}
              <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-lg bg-navy/5 text-3xl">
                {post.image_emoji}
              </div>

              <div className="min-w-0 flex-1">
                {/* Title */}
                <h2 className="mb-1 text-xl font-semibold text-navy group-hover:text-orange transition-colors">
                  {post.title}
                </h2>

                {/* Subtitle */}
                <p className="mb-3 text-sm text-gray-500 leading-relaxed">
                  {post.subtitle}
                </p>

                {/* Meta row */}
                <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400">
                  <span>{formatDate(post.date)}</span>
                  <span>&middot;</span>
                  <span>{post.author}</span>
                  <span>&middot;</span>
                  <span>{post.reading_time_min} min read</span>
                  {post.related_gap_slug && (
                    <>
                      <span>&middot;</span>
                      <span className="rounded-full bg-purple-100 px-2 py-0.5 text-purple-700">
                        Gap Analysis
                      </span>
                    </>
                  )}
                </div>

                {/* Tags */}
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Empty state for when we have few posts */}
      {sortedPosts.length <= 2 && (
        <div className="mt-10 rounded-lg border border-dashed border-gray-300 bg-gray-50 p-6 text-center text-sm text-gray-500">
          <p className="mb-1">More posts coming soon.</p>
          <p>
            We write about sports analytics research &mdash; the kind of analysis
            you can share on Mastodon or Bluesky without needing a PhD to follow it.
          </p>
        </div>
      )}
    </div>
  );
}
