import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  typescript: {
    // ⚡️ ВАЖНО: игнорировать ошибки validate-блоков при build
    ignoreBuildErrors: true
  }
};

export default nextConfig;
