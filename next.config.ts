import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // No incluyas la propiedad turbo
  webpack: (config) => {
    // Aquí puedes personalizar Webpack si es necesario
    return config;
  },
};

export default nextConfig;
