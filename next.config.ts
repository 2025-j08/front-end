import type { NextConfig } from 'next';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

const getRemotePatterns = () => {
  if (!supabaseUrl) return [];
  try {
    const url = new URL(supabaseUrl);
    const protocol = url.protocol.replace(':', '');
    if (protocol !== 'http' && protocol !== 'https') {
      console.error(`Invalid protocol in NEXT_PUBLIC_SUPABASE_URL: ${protocol}`);
      return [];
    }
    return [
      {
        protocol: protocol as 'http' | 'https',
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
