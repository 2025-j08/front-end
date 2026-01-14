import type { NextConfig } from 'next';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

const getRemotePatterns = () => {
  if (!supabaseUrl) return [];
  try {
    const url = new URL(supabaseUrl);
    return [
      {
        protocol: url.protocol.replace(':', '') as 'http' | 'https',
        hostname: url.hostname,
        port: url.port || undefined,
        pathname: '/storage/v1/object/public/**',
      },
    ];
  } catch (e) {
    console.error('Invalid NEXT_PUBLIC_SUPABASE_URL:', e);
    return [];
  }
};

const nextConfig: NextConfig = {
  images: {
    remotePatterns: getRemotePatterns(),
  },
};

export default nextConfig;
