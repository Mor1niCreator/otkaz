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
  themeColor: '#FFB74D',
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
        
        {/* Hand-Drawn Comic Fonts - That's All Folks Style! */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Bangers&family=Luckiest+Guy&family=Titan+One&family=Carter+One&family=Lilita+One&family=Bungee+Shade&family=Shrikhand&family=Chewy&family=Kavoon&family=Righteous&family=Russo+One&family=Rubik+Mono+One&family=Bungee+Inline&family=Sigmar+One&family=Fontdiner+Swanky&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-comic-bg min-h-screen">
        {children}
        <Toaster 
          position="top-center"
          toastOptions={{
            className: 'comic-toast',
            style: {
              background: 'linear-gradient(135deg, #FFE030 0%, #FF6B35 100%)',
              color: '#000',
              fontWeight: '900',
              border: '4px solid #000',
              borderRadius: '1rem',
              padding: '1rem 1.5rem',
              fontSize: '1rem',
              boxShadow: '6px 6px 0px #000',
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