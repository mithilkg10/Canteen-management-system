import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // @ts-expect-error - Valid in Next.js 15+ but might be missing from types
  allowedDevOrigins: ['127.0.0.1', 'localhost'],
};

export default nextConfig;
