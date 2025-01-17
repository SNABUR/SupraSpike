import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['ipfs.io', 's2.coinmarketcap.com'],
  },
  webpack: (config) => {
    // Aquí puedes personalizar Webpack si es necesario
    return config;
  },
};

export default nextConfig;