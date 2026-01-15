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
    // 開発環境ではプライベートIPへのアクセスが制限されるため、画像最適化を無効化
    unoptimized: process.env.NODE_ENV === 'development',
  },
};

export default nextConfig;
