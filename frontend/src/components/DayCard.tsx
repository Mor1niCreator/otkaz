import React from 'react';
import { Calendar, Plus, TrendingUp } from 'lucide-react';
import { useI18nStrict } from '../hooks/useI18nStrict';
import { ComicPanel } from './ComicPanel';
import { clsx } from 'clsx';

interface DayCardProps {
  date: Date;
  entries: Entry[];
  totalSaved: number;
  currency: string;
  onAddEntry: (date: Date) => void;
  onViewEntries: (date: Date) => void;
}

interface Entry {
  id: number;
  title: string;
  unit_price: number;
  quantity: number;
  currency: string;
  category: string;
  note?: string;
  entry_date: string;
}

const CATEGORY_ICONS: Record<string, string> = {
  food: '🍔',
  drinks: '🥤',
  habits: '🚬',
  entertainment: '🎬',
  transport: '🚗',
  shopping: '🛍️',
  other: '📦'
};

export function DayCard({ 
  date, 
  entries, 
  totalSaved, 
  currency, 
  onAddEntry, 
  onViewEntries 
}: DayCardProps) {
  const { t } = useI18nStrict();
  
  const isToday = date.toDateString() === new Date().toDateString();
  const isPast = date < new Date().setHours(0, 0, 0, 0);
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <ComicPanel 
      className={clsx(
        'cursor-pointer transition-all duration-200 hover:scale-105',
        isToday && 'ring-2 ring-green-500',
        isPast && 'opacity-75'
      )}
      onClick={() => onViewEntries(date)}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-muted" />
          <span className="font-medium">{formatDate(date)}</span>
          {isToday && (
              <span className="badge badge-success text-xs">{t('calendar.today')}</span>
          )}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddEntry(date);
          }}
          className="btn btn-sm"
          title={t('entry.add')}
        >
          <Plus size={14} />
        </button>
      </div>

      {entries.length > 0 ? (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted">
              {entries.length} {t('stats.entries_count')}
            </span>
            <div className="flex items-center gap-1 text-green-600">
              <TrendingUp size={14} />
              <span className="font-medium text-sm">
                {formatCurrency(totalSaved)}
              </span>
            </div>
          </div>
          
          <div className="space-y-1">
            {entries.slice(0, 3).map((entry) => (
              <div key={entry.id} className="flex items-center gap-2 text-sm">
                <span>{CATEGORY_ICONS[entry.category] || '📦'}</span>
                <span className="truncate flex-1">{entry.title}</span>
                <span className="text-muted">
                  {entry.quantity}×{entry.unit_price}
                </span>
              </div>
            ))}
            {entries.length > 3 && (
              <div className="text-xs text-muted text-center">
                +{entries.length - 3} {t('common.more')}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center py-4 text-muted">
          <div className="text-2xl mb-2">📝</div>
          <div className="text-sm">{t('calendar.no_entries')}</div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddEntry(date);
            }}
            className="btn btn-sm mt-2"
          >
            <Plus size={14} />
            {t('entry.add')}
          </button>
        </div>
      )}
    </ComicPanel>
  );
}