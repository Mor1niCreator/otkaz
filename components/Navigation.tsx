'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useTranslation } from '@/lib/i18n';

export default function Navigation() {
  const pathname = usePathname();
  const [lang, setLang] = useState<'en' | 'ru'>('en');
  
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      setLang(user.language || 'en');
    }
  }, []);

  // Listen for storage changes to update language
  useEffect(() => {
    const handleStorageChange = () => {
      const userData = localStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        setLang(user.language || 'en');
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);
  
  const { t } = useTranslation(lang);
  
  const navItems = [
    { href: '/calendar', label: t('calendar'), icon: '📅' },
    { href: '/dashboard', label: t('dashboard'), icon: '📊' },
    { href: '/why', label: t('why'), icon: '🤔' },
    { href: '/goals', label: t('goals'), icon: '🎯' },
    { href: '/comparison', label: t('comparison'), icon: '📈' },
    { href: '/leaderboard', label: t('leaderboard'), icon: '🏆' },
  ];

  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 bg-white border-t-4 border-black z-50"
      style={{
        boxShadow: '0 -4px 0px rgba(0,0,0,0.1)',
      }}
    >
      <div className="flex justify-around items-center max-w-screen-lg mx-auto overflow-x-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center py-3 px-3 sm:px-4 transition-all min-w-[70px] sm:min-w-[80px] relative
                ${isActive ? 'bg-white shadow-[0_0_20px_rgba(245,198,26,0.8)_inset]' : 'hover:bg-white hover:shadow-[0_0_15px_rgba(245,198,26,0.5)_inset]'}`}
            >
              {isActive && (
                <div 
                  className="absolute top-0 left-0 right-0 h-2 bg-black"
                  style={{
                    boxShadow: '0 0 10px rgba(245, 198, 26, 0.8)'
                  }}
                />
              )}
              <span 
                className={`text-2xl sm:text-3xl mb-1 transition-transform
                  ${isActive ? 'scale-110' : ''}`}
              >
                {item.icon}
              </span>
              <span 
                className={`text-[10px] sm:text-xs font-black uppercase tracking-wider
                  ${isActive ? 'text-black' : 'text-gray-700'}`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
