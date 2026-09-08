import type { Metadata } from 'next';
import './globals.css';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://small-disk-c43d.phuongdang200x.workers.dev';
const title = 'Hoàng Nam & Phương Thanh — Thiệp cưới';
const description = 'Trân trọng kính mời bạn đến chung vui trong ngày cưới của Hoàng Nam và Phương Thanh.';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    url: '/',
    title,
    description,
    images: [{
      url: '/og.png',
      width: 1200,
      height: 630,
      alt: 'Thiệp cưới Hoàng Nam và Phương Thanh',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['/og.png'],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="vi"><body>{children}</body></html>;
}
