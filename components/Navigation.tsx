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
  
  const { t } = useTranslation(lang);
  
  const navItems = [
    { href: '/calendar', label: t('calendar'), icon: '📅' },
    { href: '/wallet', label: t('wallet'), icon: '💰' },
    { href: '/goals', label: t('goals'), icon: '🎯' },
    { href: '/achievements', label: t('achievements'), icon: '🏅' },
    { href: '/profile', label: t('profile'), icon: '👤' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t-4 border-black shadow-comic-lg z-50">
      <div className="flex justify-around items-center max-w-screen-lg mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center py-3 px-4 transition-all ${
                isActive
                  ? 'bg-comic-orange border-t-4 border-black -mt-1'
                  : 'hover:bg-gray-100'
              }`}
            >
              <span className="text-2xl mb-1">{item.icon}</span>
              <span className={`text-xs font-bold ${isActive ? 'text-black' : 'text-gray-600'}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}