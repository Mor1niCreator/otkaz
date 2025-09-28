import React, { useState, useEffect } from 'react';
import { User, Globe, Download, Settings } from 'lucide-react';
import { useI18nStrict } from '../hooks/useI18nStrict';
import { ComicPanel } from '../components/ComicPanel';
import axios from 'axios';

interface UserProfile {
  id: number;
  currency: string;
  locale: string;
  timezone: string;
  reminder_time?: string;
  ref_code: string;
  total_points: number;
  current_rank: string;
  created_at: string;
}

const CURRENCIES = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'VND', name: 'Vietnamese Dong', symbol: '₫' },
  { code: 'RUB', name: 'Russian Ruble', symbol: '₽' },
  { code: 'KZT', name: 'Kazakhstani Tenge', symbol: '₸' },
  { code: 'BYN', name: 'Belarusian Ruble', symbol: 'Br' }
];

const TIMEZONES = [
  'Asia/Ho_Chi_Minh',
  'Europe/Moscow',
  'Europe/Minsk',
  'Asia/Almaty',
  'America/New_York',
  'Europe/London',
  'Asia/Tokyo'
];

export function Profile() {
  const { t, i18n, changeLanguage } = useI18nStrict();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/users/me');
      setProfile(response.data.user);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateCurrency = async (currency: string) => {
    try {
      setSaving(true);
      await axios.put('/api/users/currency', { currency });
      await fetchProfile();
    } catch (error) {
      console.error('Failed to update currency:', error);
    } finally {
      setSaving(false);
    }
  };

  const updateLocale = async (locale: string) => {
    try {
      setSaving(true);
      await axios.put('/api/users/locale', { locale });
      changeLanguage(locale);
      await fetchProfile();
    } catch (error) {
      console.error('Failed to update locale:', error);
    } finally {
      setSaving(false);
    }
  };

  const updateTimezone = async (timezone: string) => {
    try {
      setSaving(true);
      await axios.put('/api/users/timezone', { timezone });
      await fetchProfile();
    } catch (error) {
      console.error('Failed to update timezone:', error);
    } finally {
      setSaving(false);
    }
  };

  const updateReminderTime = async (time: string) => {
    try {
      setSaving(true);
      await axios.put('/api/users/reminder', { reminder_time: time });
      await fetchProfile();
    } catch (error) {
      console.error('Failed to update reminder time:', error);
    } finally {
      setSaving(false);
    }
  };

  const exportData = async () => {
    try {
      const response = await axios.get('/api/export/csv', {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `otkaznik_export_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export data:', error);
    }
  };

  if (loading) {
    return (
      <div className="container py-8">
        <div className="flex items-center justify-center">
          <div className="loading"></div>
          <span className="ml-2">{t('common.loading')}</span>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <p className="text-muted">{t('common.error')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="flex items-center gap-2 mb-6">
        <User size={32} />
        <h1 className="text-3xl font-bold">{t('profile.title')}</h1>
      </div>

      {/* Profile Overview */}
      <ComicPanel className="mb-6">
        <div className="text-center">
          <div className="text-6xl mb-4">👤</div>
          <h2 className="text-xl font-bold mb-2">{t('profile.title')}</h2>
          <div className="space-y-1 text-sm text-muted">
            <div>{t('ranks.total_points')}: {profile.total_points}</div>
            <div>{t('ranks.current_rank')}: {profile.current_rank}</div>
            <div>{t('profile.ref_code')}: {profile.ref_code}</div>
          </div>
        </div>
      </ComicPanel>

      {/* Settings */}
      <ComicPanel className="mb-6">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Settings size={20} />
          {t('profile.settings')}
        </h3>
        
        <div className="space-y-4">
          {/* Currency */}
          <div className="form-group">
            <label className="form-label">{t('profile.currency')}</label>
            <select
              className="form-input form-select"
              value={profile.currency}
              onChange={(e) => updateCurrency(e.target.value)}
              disabled={saving}
            >
              {CURRENCIES.map(currency => (
                <option key={currency.code} value={currency.code}>
                  {currency.symbol} {currency.name} ({currency.code})
                </option>
              ))}
            </select>
          </div>

          {/* Language */}
          <div className="form-group">
            <label className="form-label">{t('profile.language')}</label>
            <select
              className="form-input form-select"
              value={profile.locale}
              onChange={(e) => updateLocale(e.target.value)}
              disabled={saving}
            >
              <option value="ru">Русский</option>
              <option value="en">English</option>
            </select>
          </div>

          {/* Timezone */}
          <div className="form-group">
            <label className="form-label">{t('profile.timezone')}</label>
            <select
              className="form-input form-select"
              value={profile.timezone}
              onChange={(e) => updateTimezone(e.target.value)}
              disabled={saving}
            >
              {TIMEZONES.map(timezone => (
                <option key={timezone} value={timezone}>
                  {timezone}
                </option>
              ))}
            </select>
          </div>

          {/* Reminder Time */}
          <div className="form-group">
            <label className="form-label">{t('profile.reminder_time')}</label>
            <input
              type="time"
              className="form-input"
              value={profile.reminder_time || ''}
              onChange={(e) => updateReminderTime(e.target.value)}
              disabled={saving}
            />
          </div>
        </div>
      </ComicPanel>

      {/* Data Export */}
      <ComicPanel>
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Download size={20} />
          {t('profile.data_export')}
        </h3>
        
        <div className="space-y-3">
          <p className="text-sm text-muted">
            {t('profile.export_description')}
          </p>
          
          <button
            onClick={exportData}
            className="btn btn-primary"
          >
            <Download size={16} />
            {t('profile.export_csv')}
          </button>
        </div>
      </ComicPanel>

      {/* App Info */}
      <ComicPanel className="mt-6">
        <h3 className="text-lg font-bold mb-4">{t('profile.app_info')}</h3>
        <div className="space-y-2 text-sm text-muted">
          <div>{t('profile.version')}: 1.0.0</div>
          <div>{t('profile.created')}: {new Date(profile.created_at).toLocaleDateString()}</div>
          <div>{t('profile.last_updated')}: {new Date().toLocaleDateString()}</div>
        </div>
      </ComicPanel>
    </div>
  );
}