import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'sudcraagkywggftvljta.supabase.co',
      },
    ],
  },
};

export default nextConfig;
