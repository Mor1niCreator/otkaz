import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: 'ENOUGH - Know When to Stop',
  description: 'Track your savings, build wealth, and reach your financial goals. Simple. Powerful. Effective.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'ENOUGH',
  },
};

export const viewport: Viewport = {
  themeColor: '#FFFFFF',
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
        
        {/* Inter Font - Minimalist & Professional */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
        <style dangerouslySetInnerHTML={{
          __html: `
            @supports (font-variation-settings: normal) {
              * { font-family: 'Inter var', sans-serif; }
            }
          `
        }} />
      </head>
      <body className="bg-comic-bg min-h-screen">
        {children}
        <Toaster 
          position="top-center"
          toastOptions={{
            style: {
              background: '#FFFFFF',
              color: '#000',
              fontWeight: '500',
              border: '1px solid #E5E7EB',
              borderRadius: '0.5rem',
              padding: '1rem 1.5rem',
              fontSize: '0.875rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              fontFamily: "'Inter', sans-serif",
            },
          }}
        />
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