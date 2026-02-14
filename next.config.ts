import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export for Vercel — no server-side runtime needed
  output: "export",
};

export default nextConfig;
