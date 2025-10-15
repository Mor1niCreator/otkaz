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
    { href: '/why', label: t('why'), icon: '💡' },
    { href: '/goals', label: t('goals'), icon: '🎯' },
    { href: '/comparison', label: t('comparison'), icon: '📈' },
    { href: '/leaderboard', label: t('leaderboard'), icon: '🏆' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 shadow-lg">
      <div className="flex justify-around items-center max-w-screen-lg mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center py-3 px-3 sm:px-4 transition-all min-w-[70px] sm:min-w-[80px] relative group
                ${isActive ? '' : 'hover:bg-gray-50'}`}
              style={{
                fontFamily: "'Inter', -apple-system, sans-serif",
              }}
            >
              {isActive && (
                <div 
                  className="absolute top-0 left-1/2 transform -translate-x-1/2 w-12 h-1 rounded-full transition-all"
                  style={{ background: '#FFC107' }}
                />
              )}
              <span 
                className={`text-2xl mb-1 transition-transform ${isActive ? 'scale-110' : 'group-hover:scale-105'}`}
              >
                {item.icon}
              </span>
              <span 
                className={`text-[10px] sm:text-xs font-semibold transition-colors
                  ${isActive ? 'text-gray-900' : 'text-gray-500 group-hover:text-gray-700'}`}
                style={{ fontWeight: 600 }}
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
