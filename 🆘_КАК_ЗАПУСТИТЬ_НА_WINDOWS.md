# 🆘 КАК ЗАПУСТИТЬ ПРОЕКТ НА WINDOWS

## ❌ ПРОБЛЕМА:

В папке `C:\otkaznik` НЕТ файлов проекта!

```
PS C:\otkaznik> npm install
npm error: Could not read package.json ← НЕТ ФАЙЛОВ!
```

---

## ✅ РЕШЕНИЕ:

У вас есть 2 варианта:

---

## ВАРИАНТ 1: НАЙТИ ГДЕ ПРОЕКТ (если вы его скачивали)

### В PowerShell выполните:

```powershell
dir C:\ /s /b | findstr package.json
```

Это найдёт ВСЕ `package.json` на диске C:

**Если найден, например:** `C:\Users\MSI\Projects\otkaznik-pwa\package.json`

**Тогда:**
```powershell
cd "C:\Users\MSI\Projects\otkaznik-pwa"
npm install
npm run db:init
npm run dev
```

---

## ВАРИАНТ 2: СКАЧАТЬ С GITHUB (если есть репозиторий)

```powershell
# Перейдите в нужную папку
cd C:\

# Клонируйте проект (если есть git repo)
git clone https://github.com/ваш-username/otkaznik-pwa.git

# Перейдите в проект
cd otkaznik-pwa

# Установите зависимости
npm install

# Создайте базу
npm run db:init

# Запустите
npm run dev
```

---

## ВАРИАНТ 3: СОЗДАТЬ ПРОЕКТ ЗАНОВО (рекомендую!)

Я создам ВСЕ файлы заново прямо в вашей папке `C:\otkaznik`:

### 1. Убедитесь что вы в правильной папке:

```powershell
cd C:\otkaznik
```

### 2. Проверьте что папка ПУСТАЯ:

```powershell
dir
```

Если там есть файлы, удалите их:

```powershell
Remove-Item * -Recurse -Force
```

### 3. Скажите мне: **"Создай все файлы заново в C:\otkaznik"**

И я создам:
- `package.json` ✅
- `app/` ✅
- `lib/` ✅
- `pages/api/` ✅
- `prisma/` ✅
- `public/` ✅
- Все конфиги ✅
- Все исправленные файлы ✅

---

## 🔍 БЫСТРАЯ ПРОВЕРКА:

В PowerShell выполните:

```powershell
cd C:\otkaznik
dir
```

**Должно быть:**
```
app/
components/
lib/
pages/
prisma/
public/
package.json
tsconfig.json
next.config.js
... и другие файлы
```

**Если этого НЕТ → проект не создан!**

---

## 📝 ЧТО ДЕЛАТЬ ПРЯМО СЕЙЧАС:

### Выполните В PowerShell:

```powershell
dir C:\otkaznik
```

**И напишите мне ЧТО ПОКАЗЫВАЕТ:**

1. Если **ПУСТО** → скажите "Создай заново"
2. Если **ЕСТЬ ФАЙЛЫ** → покажите список
3. Если **package.json в другом месте** → найдите его командой выше

---

## ⚡ БЫСТРОЕ РЕШЕНИЕ:

```powershell
# 1. Проверьте папку
cd C:\otkaznik
dir

# 2. Если пусто, скажите мне и я создам всё
```

---

**НАПИШИТЕ ЧТО ПОКАЗЫВАЕТ `dir` В C:\otkaznik!**