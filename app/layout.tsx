import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

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
      <body className={inter.className}>{children}</body>
    </html>
  );
}