import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Next writes an AGENTS.md on `next dev` unless this is off. The repo already has CLAUDE.md.
  agentRules: false,
};

export default nextConfig;
