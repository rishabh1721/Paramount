import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "paramount.t3.storage.dev",
        port: "",
        protocol: 'https',
      }
    ]
  }
  /* config options here */
};

export default nextConfig;
