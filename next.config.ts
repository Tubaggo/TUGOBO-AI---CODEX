import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.cache = false;
    return config;
  },
  turbopack: {
    resolveAlias: {},
  },
};

export default nextConfig;
