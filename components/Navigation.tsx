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
    <nav className="fixed bottom-0 left-0 right-0 border-t-6 border-black z-50"
      style={{
        background: 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        boxShadow: '0 -8px 0px #000, 0 -10px 0px rgba(0,0,0,0.1)',
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
                ${isActive ? '-mt-2' : 'hover:bg-white/40'}`}
              style={{
                fontFamily: "'Lilita One', 'Russo One', cursive",
              }}
            >
              {isActive && (
                <div 
                  className="absolute inset-0 border-4 border-black"
                  style={{
                    background: 'linear-gradient(135deg, #FFE030 0%, #FF6B35 100%)',
                    borderRadius: '20px 18px 22px 19px / 19px 22px 18px 20px',
                    boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.5)',
                  }}
                />
              )}
              <span 
                className={`text-2xl sm:text-3xl mb-1 relative z-10 ${isActive ? 'animate-bounce-comic' : ''}`}
                style={{
                  filter: 'drop-shadow(2px 2px 0px rgba(0,0,0,0.3))',
                }}
              >
                {item.icon}
              </span>
              <span 
                className={`text-[11px] sm:text-xs font-black uppercase relative z-10
                  ${isActive ? 'text-white' : 'text-gray-700'}`}
                style={{
                  textShadow: isActive ? '1px 1px 0px rgba(0,0,0,0.3)' : 'none',
                }}
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