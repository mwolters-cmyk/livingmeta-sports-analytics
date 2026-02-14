import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Living Sports Analytics | RSM Erasmus University",
  description:
    "The first living meta-analysis platform for sports analytics research. Continuously monitoring, classifying, and analyzing all sports analytics publications.",
  keywords: [
    "sports analytics",
    "meta-analysis",
    "living review",
    "sports science",
    "research platform",
  ],
};

const navItems = [
  { href: "/", label: "Home" },
  { href: "/explore", label: "Explore Papers" },
  { href: "/trends", label: "Trends" },
  { href: "/gaps", label: "Research Gaps" },
  { href: "/getting-started", label: "Getting Started" },
  { href: "/about", label: "About" },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        {/* Navigation */}
        <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-navy text-sm font-bold text-white">
                LS
              </div>
              <span className="hidden text-lg font-semibold text-navy sm:inline">
                Living Sports Analytics
              </span>
            </Link>
            <div className="flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-md px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-navy"
                >
                  {item.label}
                </Link>
              ))}
              <a
                href="https://github.com/mwolters-cmyk/living-sports-analytics-research"
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 rounded-md px-3 py-2 text-sm font-medium text-gray-500 transition-colors hover:text-navy"
              >
                GitHub
              </a>
            </div>
          </div>
        </nav>

        {/* Main content */}
        <main>{children}</main>

        {/* Footer */}
        <footer className="border-t border-gray-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-8">
            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
              <div className="text-sm text-gray-500">
                Rotterdam School of Management, Erasmus University Rotterdam
              </div>
              <div className="flex gap-4 text-sm text-gray-400">
                <span>Matthijs Wolters &amp; Otto Koppius</span>
                <a
                  href="https://github.com/mwolters-cmyk/living-sports-analytics-research"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-navy"
                >
                  GitHub
                </a>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
