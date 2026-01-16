import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v16-appRouter';

import './globals.css';

import { Header } from '@/components/header/header';
import { Footer } from '@/components/footer/footer';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: '近畿児童養護施設一覧',
  description:
    '近畿地方（大阪・京都・兵庫・奈良・滋賀・和歌山）の児童養護施設情報をまとめたポータルサイトです。所在地や連絡先などの基本情報に加え、各施設の特色やこだわりも掲載しています。',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AppRouterCacheProvider>
      <html lang="en">
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
