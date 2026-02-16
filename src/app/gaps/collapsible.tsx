"use client";

import { useState } from "react";

/**
 * A collapsible wrapper that shows a summary header and expands to reveal children.
 * Used on the /gaps page to keep 11+ gap analyses manageable.
 */
export function Collapsible({
  children,
  header,
  defaultOpen = false,
}: {
  children: React.ReactNode;
  header: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full text-left border-b border-gray-100 bg-navy/[0.02] px-6 py-5 hover:bg-navy/[0.04] transition-colors cursor-pointer"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">{header}</div>
          <span
            className={`mt-1 shrink-0 text-gray-400 transition-transform duration-200 ${
              open ? "rotate-180" : ""
            }`}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M5 7.5L10 12.5L15 7.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>
      </button>
      {open && <div>{children}</div>}
    </div>
  );
}
