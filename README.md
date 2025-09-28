# Отказник - Refusal Tracker

Полнофункциональное веб-приложение для отслеживания ежедневных "отказов" от трат с системой поинтов, ачивок, рангов и крипто-ROI анализа.

## 🚀 Особенности

- **📅 Календарь отказов**: Добавляйте записи о том, от чего отказались сегодня
- **💰 Мультивалютность**: Поддержка 30+ валют с автоматическим пересчетом
- **🏆 Система достижений**: 8 различных ачивок за разные типы отказов
- **⭐ Ранги**: 5 уровней от "Новичка-эконома" до "Легенды дисциплины"
- **👥 Реферальная система**: Приглашайте друзей и получайте бонусы
- **📈 Crypto-ROI**: Смотрите, что было бы, вложи вы сэкономленные деньги 5 лет назад
- **🌍 Интернационализация**: Полная поддержка RU/EN с переключением языка
- **📱 PWA**: Установка на мобильные устройства с офлайн-функциональностью
- **🔒 Безопасность**: CSP, rate-limiting, валидация данных

## 🛠 Технологический стек

### Backend
- **Python 3.11** + **FastAPI** + **Uvicorn**
- **SQLAlchemy** + **Alembic** для работы с БД
- **SQLite** для хранения данных
- **APScheduler** для фоновых задач
- **httpx** для внешних API

### Frontend
- **React 18** + **TypeScript**
- **Vite** для сборки
- **react-i18next** для интернационализации
- **Lucide React** для иконок
- **CSS Modules** с комикс-стилем

### Внешние API
- **CoinGecko** для криптовалютных данных
- **exchangerate.host** (primary) + **ECB** (fallback) для курсов валют

## 📦 Установка и запуск

### Требования
- Docker и Docker Compose
- Node.js 18+ (для разработки)

### Быстрый старт

1. **Клонируйте репозиторий**
```bash
git clone <repository-url>
cd otkaznik
```

2. **Настройте окружение**
```bash
cp .env.example .env
# Отредактируйте .env при необходимости
```

3. **Запустите приложение**
```bash
docker compose up --build
```

4. **Откройте в браузере**
```
http://localhost:8080
```

### Разработка

1. **Backend разработка**
```bash
cd app
pip install -r requirements.txt
alembic upgrade head
python -m uvicorn main:app --reload
```

2. **Frontend разработка**
```bash
cd frontend
npm install
npm run dev
```

## 🏗 Архитектура

### Структура проекта
```
/app                    # Backend (FastAPI)
  main.py              # Главный файл приложения
  config.py            # Конфигурация
  db.py                # Подключение к БД
  models.py            # SQLAlchemy модели
  schemas.py           # Pydantic схемы
  fx.py                # Система валют и курсов
  crypto.py             # Crypto-ROI функциональность
  points.py             # Система поинтов и ачивок
  referrals.py          # Реферальная система
  routers/              # API роутеры
  middleware.py         # Middleware (CORS, security, etc.)

/frontend              # Frontend (React + TypeScript)
  src/
    pages/             # Страницы приложения
    components/        # React компоненты
    hooks/             # Custom hooks
    i18n/              # Переводы (ru.json, en.json)
    assets/            # Статические ресурсы

/alembic/              # Миграции БД
  versions/            # Файлы миграций
```

### База данных

**Основные таблицы:**
- `users` - пользователи (анонимные, по сессиям)
- `entries` - записи об отказах
- `goals` - цели пользователей
- `presets` - быстрые пресеты для добавления
- `user_achievements` - достижения пользователей
- `referral_events` - события реферальной системы
- `fx_rates` - кеш курсов валют
- `crypto_data` - кеш криптовалютных данных
- `audit_logs` - логи для аудита

## 🔧 Конфигурация

### Переменные окружения (.env)

```env
# Основные настройки
APP_BASE_URL=http://localhost:8080
DEFAULT_TIMEZONE=Asia/Ho_Chi_Minh
DEFAULT_LOCALE=ru
DEFAULT_CURRENCY=VND

# Безопасность
SESSION_SECRET=change_me_in_production
CSP_ENABLED=1
RATE_LIMIT_RPS=5
RATE_LIMIT_BURST=20

# Система поинтов
POINTS_K_USD=1.0
HABIT_BONUS_RATE=0.20
STREAK_MAX_MULT=2.0
MIN_VALID_ENTRY_USD=1.0

# Реферальная система
REF_BONUS_FIRST_ACTION=50
REF_WELCOME_POINTS=20
REF_WEEKLY_ACTIVE_BONUS=25
REF_WEEKLY_ACTIVE_THRESHOLD=5
REF_BONUS_COOLDOWN_DAYS=7

# Валюты и курсы
FX_PRIMARY=exchangerate_host
FX_FALLBACK=ecb
FX_REFRESH_MINUTES=180
FX_CACHE_TTL_HOURS=24
FX_SUPPORTED=USD,EUR,JPY,GBP,AUD,CAD,CHF,CNY,HKD,SGD,SEK,KRW,NOK,NZD,INR,MXN,BRL,ZAR,TRY,PLN,TWD,THB,IDR,MYR,PHP,VND,AED,SAR,DKK,ILS,RUB,BYN,KZT,KGS,TJS,TMT,UZS,AMD,AZN,MDL,UAH

# Криптовалюты
CRYPTO_CACHE_TTL_HOURS=24
CRYPTO_TOP_EXCLUDE=USDT,USDC,BUSD,TUSD,DAI,FDUSD,USDP
```

## 📊 API Документация

После запуска приложения доступна по адресу:
- **Swagger UI**: http://localhost:8080/api/docs
- **ReDoc**: http://localhost:8080/api/redoc

### Основные эндпоинты

- `POST /api/auth/anon` - Создание анонимного пользователя
- `GET /api/users/me` - Профиль текущего пользователя
- `GET/POST/PUT/DELETE /api/entries` - Управление записями
- `GET/POST/PUT/DELETE /api/goals` - Управление целями
- `GET /api/stats` - Статистика пользователя
- `GET /api/referrals` - Реферальная информация
- `POST /api/referrals/claim` - Применение реферального кода
- `GET /api/crypto/roi` - Crypto-ROI данные
- `GET /api/fx/rates` - Курсы валют
- `GET /api/export/csv` - Экспорт данных в CSV

## 🎨 Дизайн и UX

### Комикс-стиль
- Панели с рамками и тенями
- "Speech bubbles" для диалогов
- Пастельные цвета + яркие акценты
- Крупные карточки и кнопки
- Пружинящие анимации

### Цветовая схема
- **Primary**: Зеленый (#4ade80)
- **Secondary**: Оранжевый (#f59e0b)
- **Accent**: Красно-оранжевый (#f97316)
- **Background**: Светло-серый (#fafafa)
- **Surface**: Белый (#ffffff)

## 🔒 Безопасность

### Заголовки безопасности
- **CSP**: Строгая политика контента
- **HSTS**: HTTP Strict Transport Security (в продакшене)
- **X-Content-Type-Options**: nosniff
- **X-Frame-Options**: DENY
- **Referrer-Policy**: strict-origin-when-cross-origin

### Аутентификация
- Сессионные cookies (HttpOnly, SameSite=Lax)
- HMAC подпись сессий
- Rate limiting по IP и сессии

### Валидация
- Pydantic схемы для всех входных данных
- Enum для валют и языков
- Санитизация строк
- Лимиты на размеры полей

## 📱 PWA Функциональность

### Манифест
- Название: "Отказник - Refusal Tracker"
- Короткое имя: "Отказник"
- Иконки: 72x72 до 512x512
- Тема: Зеленая (#4ade80)
- Отображение: standalone

### Service Worker
- Кеширование статических ресурсов
- Офлайн-функциональность
- Background sync для офлайн записей
- Push уведомления (готово к настройке)

## 🌍 Интернационализация

### Поддерживаемые языки
- **Русский** (ru) - по умолчанию
- **Английский** (en)

### Переводы
- Все тексты интерфейса
- Сообщения об ошибках
- CSV заголовки при экспорте
- Валидационные сообщения

### Переключение языка
- Кнопка в навигации
- Сохранение в localStorage
- Мгновенное обновление всего UI

## 📈 Система поинтов и достижений

### Расчет поинтов
```python
base_points = floor(savings_usd / K_USD)
streak_mult = min(1 + 0.05 * (streak_days - 1), 2.0)
habit_bonus = 0.20 if has_habit_category else 0.0
daily_points = floor(base_points * streak_mult * (1 + habit_bonus))
```

### Достижения
1. **Coffee Breaker** - первая запись с кофе
2. **Sugar Free** - 7 дней без сладких напитков
3. **Smoke Out** - 14 дней без курения
4. **Budget Ninja** - накоплено $40+
5. **Momentum** - серия 21 день
6. **Ref Hero** - 3 успешных реферала
7. **Consistency** - 60 дней записей
8. **Iron Will** - 30 дней без пропусков

### Ранги
1. **Novice Saver** (0-99 поинтов)
2. **Habit Hacker** (100-299 поинтов)
3. **Frugal Master** (300-799 поинтов)
4. **Willpower Pro** (800-1999 поинтов)
5. **Discipline Legend** (2000+ поинтов)

## 💰 Реферальная система

### Типы событий
- **FIRST_ACTION** (+50 поинтов) - реферал сделал первую запись
- **WELCOME** (+20 поинтов) - приветственные поинты новому пользователю
- **WEEKLY_ACTIVE** (+25 поинтов) - недельная активность реферала

### Анти-фрод меры
- Кулдаун 7 дней между начислениями
- Запрет саморефералов
- Валидация минимальной суммы записи
- Аудит всех событий

## 🚀 Crypto-ROI

### Алгоритм
1. Получение топ-10 криптовалют (исключая стейблкоины)
2. Исторические цены 5 лет назад
3. Расчет: `coins = saved_usd / price_5y_ago`
4. Текущая стоимость: `coins * price_now`
5. Конвертация в валюту пользователя

### Кеширование
- Данные кешируются на 24 часа
- Exponential backoff при ошибках
- Fallback на старые данные

## 🧪 Тестирование

### Тест-чеклист консистентности

#### Валюты
- [ ] Смена VND→RUB→KZT→USD корректна на всех экранах
- [ ] Экспорт CSV корректен
- [ ] История с `fx_rate_to_usd` согласована

#### Поинты
- [ ] Не меняются от валюты профиля при одинаковых записях
- [ ] Расчет стрика корректен
- [ ] Бонусы за привычки работают

#### Ачивки/Ранги
- [ ] Срабатывают идентично при любой валюте
- [ ] Пороги отображаются в текущей валюте
- [ ] Прогресс к следующему рангу корректен

#### Рефералы
- [ ] `MIN_VALID_ENTRY_USD` работает для любой валюты
- [ ] Недельные бонусы считают дни активности
- [ ] Анти-фрод меры работают

#### Crypto-ROI
- [ ] Исключены стейблкоины
- [ ] Расчет 5 лет назад валиден
- [ ] Кеш/повторы работают
- [ ] Пересчет в валюту UI корректен

#### i18n
- [ ] RU/EN меняют всё (кнопки, подписи, ошибки, CSV)
- [ ] Переключение языка мгновенное
- [ ] Нет "жестких" строк в коде

#### Безопасность
- [ ] CSP/Rate-limit/Session/Headers включены
- [ ] Валидация входных данных
- [ ] Аудит логирование

## 🚀 Деплой в продакшн

### Docker Production
```bash
# Сборка образа
docker build -t otkaznik:latest .

# Запуск с переменными окружения
docker run -d \
  --name otkaznik \
  -p 8080:8080 \
  -v ./data:/data \
  -e SESSION_SECRET=your_strong_secret \
  -e CSP_ENABLED=1 \
  -e APP_BASE_URL=https://yourdomain.com \
  otkaznik:latest
```

### Переменные для продакшна
- `SESSION_SECRET` - сильный случайный ключ
- `APP_BASE_URL` - ваш домен с HTTPS
- `CSP_ENABLED=1` - включить CSP
- `RATE_LIMIT_RPS` - настроить лимиты
- `FX_REFRESH_MINUTES` - частота обновления курсов

### HTTPS и безопасность
- Настройте SSL сертификат
- Обновите CSP для вашего домена
- Включите HSTS заголовки
- Настройте мониторинг и логирование

## 📝 Лицензия

MIT License - см. файл LICENSE

## 🤝 Вклад в проект

1. Fork репозитория
2. Создайте feature branch
3. Commit изменения
4. Push в branch
5. Создайте Pull Request

## 📞 Поддержка

- **Issues**: GitHub Issues
- **Документация**: README.md
- **API Docs**: /api/docs после запуска

---

**Дисклеймер**: Crypto-ROI функциональность предназначена только для развлечения и не является финансовым советом. Прошлые результаты не гарантируют будущих.