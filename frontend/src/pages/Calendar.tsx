import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Plus } from 'lucide-react';
import { useI18nStrict } from '../hooks/useI18nStrict';
import { ComicPanel } from '../components/ComicPanel';
import { DayCard } from '../components/DayCard';
import { EntryForm, EntryFormData } from '../components/EntryForm';
import axios from 'axios';

interface Entry {
  id: number;
  title: string;
  unit_price: number;
  quantity: number;
  currency: string;
  category: string;
  note?: string;
  entry_date: string;
  fx_rate_to_usd: number;
}

interface DayData {
  date: string;
  entries: Entry[];
  total_saved_usd: number;
  total_saved_currency: number;
}

export function Calendar() {
  const { t } = useI18nStrict();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showEntryForm, setShowEntryForm] = useState(false);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [userCurrency, setUserCurrency] = useState('VND');

  useEffect(() => {
    fetchEntries();
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get('/api/users/me');
      setUserCurrency(response.data.user.currency);
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
    }
  };

  const fetchEntries = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/entries');
      setEntries(response.data.entries);
    } catch (error) {
      console.error('Failed to fetch entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddEntry = (date: Date) => {
    setSelectedDate(date);
    setShowEntryForm(true);
  };

  const handleViewEntries = (date: Date) => {
    setSelectedDate(date);
    // Could show a modal with all entries for that day
  };

  const handleEntrySubmit = async (data: EntryFormData) => {
    try {
      await axios.post('/api/entries', data);
      await fetchEntries();
      setShowEntryForm(false);
      setSelectedDate(null);
    } catch (error) {
      console.error('Failed to create entry:', error);
    }
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const getEntriesForDate = (date: Date): Entry[] => {
    const dateStr = date.toISOString().split('T')[0];
    return entries.filter(entry => entry.entry_date.startsWith(dateStr));
  };

  const getTotalSavedForDate = (date: Date): number => {
    const dayEntries = getEntriesForDate(date);
    return dayEntries.reduce((total, entry) => {
      const amountUSD = entry.unit_price * entry.quantity * entry.fx_rate_to_usd;
      return total + amountUSD;
    }, 0);
  };

  const formatCurrency = (amountUSD: number) => {
    // Convert USD to user currency (simplified - in real app use FX rates)
    const rate = userCurrency === 'VND' ? 24000 : 1; // Simplified conversion
    const amount = amountUSD * rate;
    
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: userCurrency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
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

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <CalendarIcon size={32} />
          {t('calendar.title')}
        </h1>
        <button
          onClick={() => handleAddEntry(new Date())}
          className="btn btn-primary"
        >
          <Plus size={20} />
          {t('entry.add')}
        </button>
      </div>

      <ComicPanel className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">
            {currentMonth.toLocaleDateString('ru-RU', { 
              month: 'long', 
              year: 'numeric' 
            })}
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => navigateMonth('prev')}
              className="btn btn-sm"
            >
              ←
            </button>
            <button
              onClick={() => setCurrentMonth(new Date())}
              className="btn btn-sm"
            >
              {t('calendar.today')}
            </button>
            <button
              onClick={() => navigateMonth('next')}
              className="btn btn-sm"
            >
              →
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2 mb-4">
          {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map(day => (
            <div key={day} className="text-center text-sm font-medium text-muted p-2">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {getDaysInMonth(currentMonth).map((day, index) => {
            if (!day) {
              return <div key={index} className="h-20"></div>;
            }

            const dayEntries = getEntriesForDate(day);
            const totalSaved = getTotalSavedForDate(day);

            return (
              <DayCard
                key={day.toISOString()}
                date={day}
                entries={dayEntries}
                totalSaved={totalSaved}
                currency={userCurrency}
                onAddEntry={handleAddEntry}
                onViewEntries={handleViewEntries}
              />
            );
          })}
        </div>
      </ComicPanel>

      {showEntryForm && selectedDate && (
        <EntryForm
          onSubmit={handleEntrySubmit}
          onCancel={() => {
            setShowEntryForm(false);
            setSelectedDate(null);
          }}
          initialData={{
            entry_date: selectedDate.toISOString().split('T')[0]
          }}
        />
      )}
    </div>
  );
}