/** @type {import('next').NextConfig} */
const { securityHeaderConfig } = require("./src/lib/security/headers-runtime.cjs");

const nextConfig = {
  reactStrictMode: true,
  experimental: {
    webpackMemoryOptimizations: true,
  },
  outputFileTracingIncludes: {
    "/*": ["./data/**/*"],
  },
  async headers() {
    return securityHeaderConfig();
  },
};

module.exports = nextConfig;
