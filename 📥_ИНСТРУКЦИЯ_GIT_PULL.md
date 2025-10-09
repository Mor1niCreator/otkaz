# 📥 КАК ПОЛУЧИТЬ ИСПРАВЛЕНИЯ ЧЕРЕЗ GIT

## ✅ ВСЕ ФАЙЛЫ ГОТОВЫ!

Изменения находятся в ветке: `cursor/build-a-gamified-savings-pwa-accd`

---

## ⚡ В PowerShell (C:\otkaznik) ВЫПОЛНИТЕ:

```powershell
# 1. Остановите сервер
Ctrl + C

# 2. Сохраните свои изменения (если есть)
git stash

# 3. Получите последние изменения
git pull origin cursor/build-a-gamified-savings-pwa-accd

# 4. Если были конфликты, примите входящие изменения
git checkout --theirs .

# 5. Удалите старую базу
Remove-Item prisma\dev.db -Force

# 6. Пересоздайте базу
npm run db:init

# 7. Запустите
npm run dev
```

---

## 🎯 КЛЮЧЕВЫЕ ИСПРАВЛЕННЫЕ ФАЙЛЫ:

```
✅ lib/currency-service.ts
   - Правильная формула: amount / rate
   - VND: 50,000 / 24,500 = 2.04 USD

✅ app/calendar/page.tsx
   - State для todayTotal
   - useEffect для автообновления

✅ app/wallet/page.tsx
   - Автообновление при открытии

✅ app/goals/page.tsx
   - Без дублей целей
   - Кликабельный Crypto-ROI

✅ pages/api/entries/create.ts
   - Логирование конвертации
```

---

## 🧪 ПОСЛЕ git pull ТЕСТИРУЙТЕ:

```
1. http://localhost:3000
2. Register: new@test.com / test123 / New
3. Profile → VND → Save
4. Calendar → + Custom: Pho 50000 → Save
5. PowerShell:
   [Currency] Converting 50000 VND to USD: 2.0408 ✅
6. Calendar:
   "Saved Today: ₫50,000" ✅
7. Wallet:
   "Total Savings: ₫50,000" ✅
```

---

## 📝 ЕСЛИ git pull ВЫДАСТ ОШИБКУ:

```powershell
# Сбросьте локальные изменения
git reset --hard origin/cursor/build-a-gamified-savings-pwa-accd

# Затем
npm run db:init
npm run dev
```

---

## 🎉 ВСЁ ГОТОВО!

После `git pull` у вас будут все исправления!

💰✨ Выполните команды выше! ✨💰