from typing import Dict, Any
import json
import os
from pathlib import Path

# Translation dictionaries
TRANSLATIONS = {
    "ru": {
        # Common
        "common.save": "Сохранить",
        "common.cancel": "Отмена",
        "common.delete": "Удалить",
        "common.edit": "Редактировать",
        "common.add": "Добавить",
        "common.close": "Закрыть",
        "common.loading": "Загрузка...",
        "common.error": "Ошибка",
        "common.success": "Успешно",
        "common.confirm": "Подтвердить",
        
        # Navigation
        "nav.calendar": "Календарь",
        "nav.wallet": "Кошелёк",
        "nav.goals": "Цели",
        "nav.referrals": "Рефералы",
        "nav.achievements": "Достижения",
        "nav.ranks": "Ранги",
        "nav.profile": "Профиль",
        
        # Categories
        "categories.food": "Еда",
        "categories.drinks": "Напитки",
        "categories.habits": "Привычки",
        "categories.entertainment": "Развлечения",
        "categories.transport": "Транспорт",
        "categories.shopping": "Покупки",
        "categories.other": "Другое",
        
        # Entry form
        "entry.title": "Название",
        "entry.unit_price": "Цена за единицу",
        "entry.quantity": "Количество",
        "entry.category": "Категория",
        "entry.note": "Заметка",
        "entry.date": "Дата",
        "entry.add": "Добавить отказ",
        "entry.edit": "Редактировать отказ",
        
        # Stats
        "stats.today": "Сегодня",
        "stats.week": "Неделя",
        "stats.month": "Месяц",
        "stats.all_time": "Всего",
        "stats.total_saved": "Сэкономлено",
        "stats.entries_count": "Записей",
        "stats.daily_average": "Среднее в день",
        
        # Goals
        "goals.title": "Цели",
        "goals.add_goal": "Добавить цель",
        "goals.target_amount": "Целевая сумма",
        "goals.progress": "Прогресс",
        "goals.achieved": "Достигнуто",
        
        # Achievements
        "achievements.title": "Достижения",
        "achievements.coffee_breaker": "Кофе-отказник",
        "achievements.sugar_free": "Без сахара",
        "achievements.smoke_out": "Без курения",
        "achievements.budget_ninja": "Бюджетный ниндзя",
        "achievements.momentum": "Импульс",
        "achievements.ref_hero": "Реферальный герой",
        "achievements.consistency": "Постоянство",
        "achievements.iron_will": "Железная воля",
        
        # Ranks
        "ranks.title": "Ранги",
        "ranks.novice_saver": "Новичок-эконом",
        "ranks.habit_hacker": "Взломщик привычек",
        "ranks.frugal_master": "Мастер экономии",
        "ranks.willpower_pro": "Про-сила воли",
        "ranks.discipline_legend": "Легенда дисциплины",
        "ranks.points_to_next": "До следующего ранга",
        
        # Referrals
        "referrals.title": "Рефералы",
        "referrals.your_code": "Ваш код",
        "referrals.invite_link": "Ссылка для приглашения",
        "referrals.total_referrals": "Всего рефералов",
        "referrals.points_earned": "Заработано поинтов",
        "referrals.claim_code": "Применить код",
        "referrals.enter_code": "Введите реферальный код",
        
        # Crypto ROI
        "crypto.title": "Крипто-ROI",
        "crypto.subtitle": "Что было бы, вложи 5 лет назад",
        "crypto.coin": "Монета",
        "crypto.price_5y_ago": "Цена 5 лет назад",
        "crypto.price_now": "Цена сейчас",
        "crypto.growth": "Рост",
        "crypto.coins_owned": "Монет в собственности",
        "crypto.current_value": "Текущая стоимость",
        "crypto.disclaimer": "Это не финансовый совет. Прошлые результаты не гарантируют будущих.",
        
        # Profile
        "profile.title": "Профиль",
        "profile.currency": "Валюта",
        "profile.language": "Язык",
        "profile.timezone": "Часовой пояс",
        "profile.reminder_time": "Время напоминания",
        "profile.export_data": "Экспорт данных",
        "profile.total_points": "Всего поинтов",
        "profile.current_rank": "Текущий ранг",
        
        # Export
        "export.date": "Дата",
        "export.title": "Название",
        "export.unit_price": "Цена за единицу",
        "export.quantity": "Количество",
        "export.currency": "Валюта",
        "export.category": "Категория",
        "export.note": "Заметка",
        "export.total_usd": "Всего (USD)",
        "export.total_currency": "Всего (валюта)",
        
        # Presets
        "presets.title": "Пресеты",
        "presets.add_preset": "Добавить пресет",
        "presets.quick_add": "Быстрое добавление",
        
        # Errors
        "error.invalid_session": "Недействительная сессия",
        "error.rate_limit": "Превышен лимит запросов",
        "error.invalid_currency": "Неподдерживаемая валюта",
        "error.invalid_referral_code": "Недействительный реферальный код",
        "error.entry_not_found": "Запись не найдена",
        "error.goal_not_found": "Цель не найдена",
        "error.preset_not_found": "Пресет не найден",
    },
    
    "en": {
        # Common
        "common.save": "Save",
        "common.cancel": "Cancel",
        "common.delete": "Delete",
        "common.edit": "Edit",
        "common.add": "Add",
        "common.close": "Close",
        "common.loading": "Loading...",
        "common.error": "Error",
        "common.success": "Success",
        "common.confirm": "Confirm",
        
        # Navigation
        "nav.calendar": "Calendar",
        "nav.wallet": "Wallet",
        "nav.goals": "Goals",
        "nav.referrals": "Referrals",
        "nav.achievements": "Achievements",
        "nav.ranks": "Ranks",
        "nav.profile": "Profile",
        
        # Categories
        "categories.food": "Food",
        "categories.drinks": "Drinks",
        "categories.habits": "Habits",
        "categories.entertainment": "Entertainment",
        "categories.transport": "Transport",
        "categories.shopping": "Shopping",
        "categories.other": "Other",
        
        # Entry form
        "entry.title": "Title",
        "entry.unit_price": "Unit Price",
        "entry.quantity": "Quantity",
        "entry.category": "Category",
        "entry.note": "Note",
        "entry.date": "Date",
        "entry.add": "Add Refusal",
        "entry.edit": "Edit Refusal",
        
        # Stats
        "stats.today": "Today",
        "stats.week": "Week",
        "stats.month": "Month",
        "stats.all_time": "All Time",
        "stats.total_saved": "Total Saved",
        "stats.entries_count": "Entries",
        "stats.daily_average": "Daily Average",
        
        # Goals
        "goals.title": "Goals",
        "goals.add_goal": "Add Goal",
        "goals.target_amount": "Target Amount",
        "goals.progress": "Progress",
        "goals.achieved": "Achieved",
        
        # Achievements
        "achievements.title": "Achievements",
        "achievements.coffee_breaker": "Coffee Breaker",
        "achievements.sugar_free": "Sugar Free",
        "achievements.smoke_out": "Smoke Out",
        "achievements.budget_ninja": "Budget Ninja",
        "achievements.momentum": "Momentum",
        "achievements.ref_hero": "Ref Hero",
        "achievements.consistency": "Consistency",
        "achievements.iron_will": "Iron Will",
        
        # Ranks
        "ranks.title": "Ranks",
        "ranks.novice_saver": "Novice Saver",
        "ranks.habit_hacker": "Habit Hacker",
        "ranks.frugal_master": "Frugal Master",
        "ranks.willpower_pro": "Willpower Pro",
        "ranks.discipline_legend": "Discipline Legend",
        "ranks.points_to_next": "Points to Next Rank",
        
        # Referrals
        "referrals.title": "Referrals",
        "referrals.your_code": "Your Code",
        "referrals.invite_link": "Invite Link",
        "referrals.total_referrals": "Total Referrals",
        "referrals.points_earned": "Points Earned",
        "referrals.claim_code": "Claim Code",
        "referrals.enter_code": "Enter Referral Code",
        
        # Crypto ROI
        "crypto.title": "Crypto ROI",
        "crypto.subtitle": "What if invested 5 years ago",
        "crypto.coin": "Coin",
        "crypto.price_5y_ago": "Price 5Y Ago",
        "crypto.price_now": "Price Now",
        "crypto.growth": "Growth",
        "crypto.coins_owned": "Coins Owned",
        "crypto.current_value": "Current Value",
        "crypto.disclaimer": "This is not financial advice. Past performance does not guarantee future results.",
        
        # Profile
        "profile.title": "Profile",
        "profile.currency": "Currency",
        "profile.language": "Language",
        "profile.timezone": "Timezone",
        "profile.reminder_time": "Reminder Time",
        "profile.export_data": "Export Data",
        "profile.total_points": "Total Points",
        "profile.current_rank": "Current Rank",
        
        # Export
        "export.date": "Date",
        "export.title": "Title",
        "export.unit_price": "Unit Price",
        "export.quantity": "Quantity",
        "export.currency": "Currency",
        "export.category": "Category",
        "export.note": "Note",
        "export.total_usd": "Total (USD)",
        "export.total_currency": "Total (Currency)",
        
        # Presets
        "presets.title": "Presets",
        "presets.add_preset": "Add Preset",
        "presets.quick_add": "Quick Add",
        
        # Errors
        "error.invalid_session": "Invalid session",
        "error.rate_limit": "Rate limit exceeded",
        "error.invalid_currency": "Unsupported currency",
        "error.invalid_referral_code": "Invalid referral code",
        "error.entry_not_found": "Entry not found",
        "error.goal_not_found": "Goal not found",
        "error.preset_not_found": "Preset not found",
    }
}


def get_i18n_text(key: str, locale: str = "ru") -> str:
    """Get translated text by key and locale"""
    return TRANSLATIONS.get(locale, TRANSLATIONS["ru"]).get(key, key)


def get_all_translations(locale: str = "ru") -> Dict[str, Any]:
    """Get all translations for a locale"""
    return TRANSLATIONS.get(locale, TRANSLATIONS["ru"])