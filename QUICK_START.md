# 🚀 Быстрый старт - Отказник

## 📋 Команды запуска

### 1. Подготовка
```bash
# Клонируйте репозиторий
git clone <repository-url>
cd otkaznik

# Скопируйте конфигурацию
cp .env.example .env
```

### 2. Запуск приложения
```bash
# Запустите Docker Compose
docker compose up --build

# Приложение будет доступно по адресу:
# http://localhost:8080
```

### 3. Проверка работы
```bash
# Проверьте статус контейнера
docker compose ps

# Посмотрите логи
docker compose logs -f app

# Проверьте API документацию
open http://localhost:8080/api/docs
```

## 🔧 Разработка

### Backend разработка
```bash
# Установите зависимости
cd app
pip install -r requirements.txt

# Запустите миграции
alembic upgrade head

# Запустите сервер разработки
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8080
```

### Frontend разработка
```bash
# Установите зависимости
cd frontend
npm install

# Запустите dev сервер
npm run dev

# Соберите для продакшна
npm run build
```

## 📱 PWA установка

1. Откройте http://localhost:8080 в браузере
2. Нажмите на иконку "Установить" в адресной строке
3. Или используйте меню браузера "Установить приложение"

## 🌍 Тестирование функций

### Валюты
- Перейдите в Профиль → Валюта
- Попробуйте VND → RUB → KZT → USD
- Проверьте пересчет на всех экранах

### Языки
- Нажмите кнопку RU/EN в навигации
- Проверьте перевод всех элементов

### Рефералы
- Перейдите в Рефералы
- Скопируйте реферальную ссылку
- Откройте в приватном окне и примените код

### Crypto-ROI
- Перейдите в Цели
- Прокрутите вниз до блока Crypto-ROI
- Проверьте расчеты и дисклеймер

## 🐛 Отладка

### Проблемы с Docker
```bash
# Пересоберите образ
docker compose build --no-cache

# Очистите volumes
docker compose down -v

# Запустите заново
docker compose up --build
```

### Проблемы с базой данных
```bash
# Запустите миграции вручную
docker compose exec app alembic upgrade head

# Сбросьте базу данных
rm -rf data/
docker compose up --build
```

### Проблемы с frontend
```bash
# Очистите кеш
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run build
```

## 📊 Мониторинг

### Логи приложения
```bash
# Следите за логами в реальном времени
docker compose logs -f app

# Логи только ошибок
docker compose logs app | grep ERROR
```

### Статус сервисов
```bash
# Проверьте здоровье API
curl http://localhost:8080/api/health

# Детальная проверка
curl http://localhost:8080/api/health/detailed
```

### Использование ресурсов
```bash
# Статистика Docker
docker stats

# Использование диска
docker system df
```

## 🔒 Безопасность

### Настройка для продакшна
```bash
# Сгенерируйте сильный секрет
openssl rand -hex 32

# Обновите .env
SESSION_SECRET=your_generated_secret_here
APP_BASE_URL=https://yourdomain.com
CSP_ENABLED=1
```

### Проверка безопасности
```bash
# Проверьте заголовки безопасности
curl -I http://localhost:8080

# Проверьте CSP
curl -H "Accept: text/html" http://localhost:8080 | grep -i "content-security-policy"
```

## 📈 Производительность

### Оптимизация Docker
```bash
# Используйте multi-stage build
docker build --target production -t otkaznik:prod .

# Оптимизируйте размер образа
docker images | grep otkaznik
```

### Кеширование
- FX курсы кешируются на 24 часа
- Crypto данные кешируются на 24 часа
- Статические файлы кешируются в браузере

## 🚀 Деплой

### Docker Swarm
```bash
# Инициализируйте swarm
docker swarm init

# Деплой стека
docker stack deploy -c docker-compose.yml otkaznik
```

### Kubernetes
```bash
# Создайте namespace
kubectl create namespace otkaznik

# Примените манифесты
kubectl apply -f k8s/
```

## 📝 Полезные команды

```bash
# Остановить все сервисы
docker compose down

# Остановить и удалить volumes
docker compose down -v

# Перезапустить только один сервис
docker compose restart app

# Выполнить команду в контейнере
docker compose exec app python -c "print('Hello from container')"

# Просмотреть переменные окружения
docker compose exec app env | grep APP_
```

## 🆘 Поддержка

Если что-то не работает:

1. **Проверьте логи**: `docker compose logs app`
2. **Проверьте статус**: `docker compose ps`
3. **Перезапустите**: `docker compose restart`
4. **Пересоберите**: `docker compose up --build`
5. **Очистите все**: `docker compose down -v && docker compose up --build`

---

**Готово!** 🎉 Ваше приложение "Отказник" запущено и готово к использованию!