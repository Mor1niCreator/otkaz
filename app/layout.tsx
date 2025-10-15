import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: 'Enough - Gamified Savings PWA',
  description: 'Track your savings, earn achievements, and see crypto ROI',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Enough',
  },
};

export const viewport: Viewport = {
  themeColor: '#F5C61A',
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
        
        {/* Professional Font - Inter */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-comic-bg min-h-screen">
        {children}
        <Toaster 
          position="top-center"
          toastOptions={{
            className: 'enough-toast',
            style: {
              background: '#F5C61A',
              color: '#000',
              fontWeight: '800',
              border: '3px solid #000',
              borderRadius: '0',
              padding: '1rem 1.5rem',
              fontSize: '1rem',
              boxShadow: '0 4px 0px #000',
              fontFamily: 'Inter, sans-serif',
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