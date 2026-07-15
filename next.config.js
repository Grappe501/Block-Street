/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    webpackMemoryOptimizations: true,
  },
  outputFileTracingIncludes: {
    "/*": ["./data/**/*"],
  },
};

module.exports = nextConfig;
