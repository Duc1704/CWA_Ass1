import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      { source: "/api/:path*", destination: "http://localhost:4000/:path*" },
      // Also proxy bare /custom-questions for manual browser testing
      { source: "/custom-questions", destination: "http://localhost:4000/custom-questions" },
    ];
  },
};

export default nextConfig;
