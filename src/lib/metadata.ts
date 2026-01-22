import type { Metadata } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL;

export const siteMetadata: Metadata = {
  title: '近畿児童養護施設一覧',
  description:
    '近畿地方（大阪・京都・兵庫・奈良・滋賀・和歌山）の児童養護施設情報をまとめたポータルサイトです。所在地や連絡先などの基本情報に加え、各施設の特色やこだわりも掲載しています。',
  applicationName: '近畿児童養護施設一覧',
  keywords: ['児童養護施設', '近畿', '大阪', '京都', '兵庫', '奈良', '滋賀', '和歌山', '施設一覧'],
  authors: [{ name: '近畿施設ポータル' }],
  themeColor: [{ media: '(prefers-color-scheme: light)', color: '#ffffff' }],
  icons: {
    icon: '/icons/logo.webp',
    apple: '/icons/logo.webp',
  },
  openGraph: {
    title: '近畿児童養護施設一覧',
    description:
      '近畿地方の児童養護施設情報をまとめたポータルサイトです。所在地や連絡先、施設の特色を確認できます。',
    siteName: '近畿児童養護施設一覧',
    type: 'website',
    url: SITE_URL,
    images: [
      {
        url: `${SITE_URL}/images/herotest.webp`,
        width: 1200,
        height: 630,
        alt: '近畿児童養護施設一覧',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '近畿児童養護施設一覧',
    description:
      '近畿地方の児童養護施設情報をまとめたポータルサイトです。所在地や連絡先、施設の特色を確認できます。',
    images: [`${SITE_URL}/images/herotest.webp`],
  },
  alternates: {
    canonical: SITE_URL,
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default siteMetadata;
