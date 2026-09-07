import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Hoàng Nam & Phương Thanh — Thiệp cưới',
  description: 'Trân trọng kính mời bạn đến chung vui trong ngày cưới của Hoàng Nam và Phương Thanh.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="vi"><body>{children}</body></html>;
}
