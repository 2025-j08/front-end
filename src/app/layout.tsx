import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v16-appRouter';

import './globals.css';

import { Header } from '@/components/header/header';
import { Footer } from '@/components/footer/footer';
import { siteMetadata } from '@/lib/metadata';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = siteMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AppRouterCacheProvider>
      <html lang="ja">
        <body className={`${geistSans.variable} ${geistMono.variable}`}>
          {/* ヘッダー 一番上固定 */}
          <Header />

          {/* メインコンテンツ */}
          <main className="main-content">{children}</main>

          {/* フッター 一番下固定 */}
          <Footer />
        </body>
      </html>
    </AppRouterCacheProvider>
  );
}
