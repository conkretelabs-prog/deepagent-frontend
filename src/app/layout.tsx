// src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'DeepAgent - Autonomous Deployment Manager',
  description: 'Intelligent deployment monitoring and management system with automated issue resolution',
  keywords: ['deployment', 'monitoring', 'automation', 'devops', 'railway', 'vercel'],
  authors: [{ name: 'DeepAgent Team' }],
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#2563eb',
  openGraph: {
    title: 'DeepAgent - Autonomous Deployment Manager',
    description: 'Intelligent deployment monitoring and management system',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DeepAgent - Autonomous Deployment Manager',
    description: 'Intelligent deployment monitoring and management system',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#2563eb" />
      </head>
      <body className={inter.className}>
        <div id="root">
          {children}
        </div>
        {/* Global error boundary and analytics can be added here */}
      </body>
    </html>
  );
}