import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    domains: ['api.dicebear.com'], // ✅ allow external avatar images
  },
};

export default nextConfig;
