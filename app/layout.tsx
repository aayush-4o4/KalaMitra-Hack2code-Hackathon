import './globals.css';
import type { Metadata } from 'next';
import localFont from 'next/font/local';

const inter = localFont({
  src: '../public/fonts/inter.css',
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'KalaMitra - AI-Powered Assistant for Indian Artisans',
  description: 'Create marketplace-ready product listings with AI-powered descriptions, pricing, and social media content for Indian handicrafts.',
  keywords: ['Indian handicrafts', 'artisan', 'marketplace', 'AI assistant', 'product listings'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans`}>{children}</body>
    </html>
  );
}