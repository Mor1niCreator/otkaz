# 🪟 Запуск на Windows

## ⚡ Для PowerShell

```powershell
npm install; npm run db:init; npm run dev
```

## ⚡ Или по шагам (рекомендуется)

```powershell
# Шаг 1: Установка зависимостей
npm install

# Шаг 2: Инициализация базы данных
npm run db:init

# Шаг 3: Запуск сервера
npm run dev
```

## 🎯 После запуска

Откройте в браузере: **http://localhost:3000**

---

## 🐛 Если возникают ошибки

### Ошибка: "не является допустимым разделителем"
**Решение:** Используйте `;` вместо `&&` в PowerShell

### Ошибка: "npm не распознается"
**Решение:** Установите Node.js с https://nodejs.org/

### Ошибка: "Prisma migrate failed"
**Решение:** 
```powershell
Remove-Item prisma\dev.db -ErrorAction SilentlyContinue
npm run db:init
```

### Порт 3000 занят
**Решение:**
```powershell
npm run dev -- -p 3001
```

---

## ✅ Готово!

После успешного запуска вы увидите:
```
✓ Ready in 2.3s
○ Local:   http://localhost:3000
```

Откройте браузер и начинайте! 🚀