import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: 'Отказник - Gamified Savings PWA',
  description: 'Track your savings, earn achievements, and see crypto ROI',
  manifest: '/manifest.json',
  themeColor: '#FFB74D',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Отказник',
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
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body className="bg-comic-bg min-h-screen">
        {children}
        <Toaster position="top-center" />
        <script dangerouslySetInnerHTML={{
          __html: `
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js');
              });
            }
          `
        }} />
      </body>
    </html>
  );
}