import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  Calendar, 
  Wallet, 
  Target, 
  Users, 
  Award, 
  Trophy, 
  User,
  Globe,
  Moon
} from 'lucide-react';
import { useI18nStrict } from './hooks/useI18nStrict';
import { Calendar as CalendarPage } from './pages/Calendar';
import { Wallet as WalletPage } from './pages/Wallet';
import { Goals as GoalsPage } from './pages/Goals';
import { Referrals as ReferralsPage } from './pages/Referrals';
import { Achievements as AchievementsPage } from './pages/Achievements';
import { Ranks as RanksPage } from './pages/Ranks';
import { Profile as ProfilePage } from './pages/Profile';
import axios from 'axios';

interface User {
  id: number;
  currency: string;
  locale: string;
  timezone: string;
  ref_code: string;
  total_points: number;
  current_rank: string;
}

function App() {
  const { t, i18n, changeLanguage } = useI18nStrict();
  const location = useLocation();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeApp();
  }, []);

  useEffect(() => {
    if (user?.locale) {
      changeLanguage(user.locale);
    }
  }, [user?.locale, changeLanguage]);

  const initializeApp = async () => {
    try {
      // Try to get existing user
      const response = await axios.get('/api/users/me');
      setUser(response.data.user);
    } catch (error) {
      // If no user exists, create anonymous user
      try {
        const response = await axios.post('/api/auth/anon');
        setUser(response.data.user);
      } catch (createError) {
        console.error('Failed to create user:', createError);
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleLanguage = () => {
    const newLang = i18n.language === 'ru' ? 'en' : 'ru';
    changeLanguage(newLang);
    
    if (user) {
      axios.post('/api/users/locale', { locale: newLang })
        .then(() => {
          return axios.get('/api/users/me').then(r => setUser(r.data.user));
        })
        .catch(error => {
          console.error('Failed to update locale:', error);
        });
    }
  };

  const navigation = [
    { path: '/', icon: Calendar, label: 'nav.calendar' },
    { path: '/wallet', icon: Wallet, label: 'nav.wallet' },
    { path: '/goals', icon: Target, label: 'nav.goals' },
    { path: '/referrals', icon: Users, label: 'nav.referrals' },
    { path: '/achievements', icon: Award, label: 'nav.achievements' },
    { path: '/ranks', icon: Trophy, label: 'nav.ranks' },
    { path: '/profile', icon: User, label: 'nav.profile' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="loading mx-auto mb-4"></div>
          <p className="text-muted">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="nav sticky top-0 z-40">
        <div className="container flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2 font-bold text-xl">
              <span className="text-2xl">🚫</span>
              Отказник
            </Link>
            
            <div className="hidden md:flex gap-2">
              {navigation.map(({ path, icon: Icon, label }) => (
                <Link
                  key={path}
                  to={path}
                  className={`nav-item ${location.pathname === path ? 'active' : ''}`}
                >
                  <Icon size={16} />
                  {t(label)}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {user && (
              <div className="hidden sm:flex items-center gap-2 text-sm">
                <span className="text-muted">{t('ranks.total_points')}:</span>
                <span className="font-medium">{user.total_points}</span>
                <span className="badge badge-primary text-xs">{user.current_rank}</span>
              </div>
            )}
            
            <button
              onClick={toggleLanguage}
              className="btn btn-sm"
              title={t('profile.language')}
            >
              <Globe size={16} />
              {i18n.language === 'ru' ? 'RU' : 'EN'}
            </button>
          </div>
        </div>

        {/* Mobile navigation */}
        <div className="md:hidden mt-2">
          <div className="flex gap-1 overflow-x-auto">
            {navigation.map(({ path, icon: Icon, label }) => (
              <Link
                key={path}
                to={path}
                className={`nav-item text-sm ${location.pathname === path ? 'active' : ''}`}
              >
                <Icon size={14} />
                {t(label)}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="min-h-screen">
        <Routes>
          <Route path="/" element={<CalendarPage />} />
          <Route path="/wallet" element={<WalletPage />} />
          <Route path="/goals" element={<GoalsPage />} />
          <Route path="/referrals" element={<ReferralsPage />} />
          <Route path="/achievements" element={<AchievementsPage />} />
          <Route path="/ranks" element={<RanksPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-surface py-6 mt-12">
        <div className="container text-center text-sm text-muted">
          <p>Отказник - Track your daily refusals and see crypto ROI potential</p>
          <p className="mt-2">
            <span className="text-xs">
              {t('crypto.disclaimer')}
            </span>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;