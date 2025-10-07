# 🚀 How to Run - Отказник PWA

## ✨ What Was Created

A **complete Next.js 14 PWA** with all requested features:
- 📅 Calendar with entry tracking
- 💰 Wallet with statistics
- 🎯 Goals with Crypto ROI
- 🏅 8 Achievements
- 🧩 5 Rank system
- 🤝 Referral system
- 👤 Profile with 30+ currencies
- 🌐 Full RU/EN support
- 🎨 Comic-style design
- 📱 PWA with offline mode

---

## 📦 Installation & Setup

### Step 1: Install Dependencies

```bash
npm install
```

This installs all required packages (Next.js, Prisma, React, Tailwind, etc.)

### Step 2: Initialize Database

```bash
npm run db:init
```

This will:
1. Generate Prisma client
2. Create SQLite database
3. Run migrations
4. Seed 8 achievements

**Alternative (manual):**
```bash
npx prisma generate
npx prisma migrate dev --name init
npm run db:seed
```

### Step 3: Start Development Server

```bash
npm run dev
```

The app will be available at **http://localhost:3000**

---

## 🎯 First Steps

1. **Register Account**
   - Open http://localhost:3000
   - Click "Register"
   - Enter email, password, name
   - (Optional) Enter referral code

2. **Add First Refusal**
   - Go to Calendar page
   - Tap "☕ Coffee" preset OR
   - Click "+ Custom Entry"
   - Submit to earn points! 🎉

3. **Explore Features**
   - **Wallet** - View your savings stats
   - **Goals** - Create a savings goal
   - **Achievements** - See what you've unlocked
   - **Profile** - Change currency/language

---

## 📁 Project Structure

```
otkaznik-pwa/
├── app/                    ← Next.js pages (Calendar, Wallet, Goals, etc.)
├── components/             ← UI components (Navigation, ComicPanel, etc.)
├── lib/                    ← Business logic (auth, crypto, points, etc.)
├── pages/api/              ← API endpoints (13 total)
├── prisma/                 ← Database schema & seed
├── public/                 ← PWA assets (manifest, icons, service worker)
└── package.json            ← Dependencies
```

---

## 🛠️ Available Commands

| Command | Description |
|---------|-------------|
| `npm install` | Install dependencies |
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run db:init` | Initialize database (first time) |
| `npm run db:seed` | Seed achievements |
| `npm run db:studio` | Open Prisma Studio |
| `npm run lint` | Run ESLint |

---

## 🗄️ Database

### View Database Contents

```bash
npm run db:studio
```

Opens Prisma Studio at http://localhost:5555 where you can:
- Browse all tables (User, Entry, Goal, Achievement, etc.)
- View/edit records
- Inspect relationships

### Reset Database

```bash
rm prisma/dev.db
npm run db:init
```

---

## 📱 Install as PWA

### On Mobile

**iOS:**
1. Open in Safari
2. Tap Share → "Add to Home Screen"

**Android:**
1. Open in Chrome
2. Tap menu → "Install app"

**Desktop:**
1. Chrome: Click install icon in address bar
2. Edge: Same as Chrome

The app will work offline! 📶

---

## 🔧 Configuration

### Environment Variables

Already configured in `.env`:
```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="otkaznik-super-secret-key-2024"
NEXTAUTH_URL="http://localhost:3000"
```

**For production**, change `NEXTAUTH_SECRET` to a random string:
```bash
openssl rand -base64 32
```

### Change Port

If port 3000 is busy:
```bash
npm run dev -- -p 3001
```

---

## 🌐 Features Overview

### 1. Calendar 📅
- Quick presets (Coffee, Cigarettes, Soda, Fast Food)
- Custom entries with categories
- Real-time points calculation
- Category bonuses (+20% for Habits)

### 2. Wallet 💰
- Multi-period stats (Today/Week/Month/All Time)
- Interactive bar charts
- Points & rank display
- Beautiful gradient cards

### 3. Goals 🎯
- Create custom savings goals
- Visual progress bars
- **Crypto ROI Calculator** (Top 10 cryptos, 5-year comparison)

### 4. Achievements 🏅
8 unlockable achievements:
- ☕ Coffee Breaker
- 🥤 Sugar Free (7 days)
- 🚬 Smoke Out (14 days)
- 🥷 Budget Ninja ($40+)
- ⚡ Momentum (21 days)
- 🦸 Ref Hero (3 referrals)
- 👑 Consistency King (60 days)
- 🛡️ Iron Will (30 days)

### 5. Ranks 🧩
- Novice Saver (0 pts)
- Habit Hacker (50 pts)
- Frugal Master (150 pts)
- Willpower Pro (300 pts)
- Discipline Legend (500 pts)

### 6. Referrals 🤝
- Unique referral code
- Bonus points system
- Copy referral link

### 7. Profile 👤
- 30+ currencies (USD, EUR, RUB, VND, etc.)
- Language switch (RU/EN)
- Rank progress
- Settings management

---

## 🎨 Design

**Comic-Style Theme:**
- Bold black borders
- Pastel colors (yellow, orange, lime, cyan)
- Speech bubbles
- Smooth animations
- Cartoon icons

All configured in:
- `tailwind.config.js`
- `app/globals.css`

---

## 🐛 Troubleshooting

### Database Locked
```bash
# Close Prisma Studio if open, then:
rm prisma/dev.db
npm run db:init
```

### Module Not Found
```bash
rm -rf node_modules package-lock.json
npm install
```

### Build Fails
```bash
rm -rf .next
npm run dev
```

### Prisma Client Not Generated
```bash
npx prisma generate
```

---

## 🚀 Deploy to Production

### Vercel (Recommended)

1. Push to GitHub
2. Import to Vercel
3. Add environment variables:
   ```
   DATABASE_URL=postgresql://...
   NEXTAUTH_SECRET=your-random-secret
   NEXTAUTH_URL=https://your-app.vercel.app
   ```
4. Deploy!

See [DEPLOYMENT.md](DEPLOYMENT.md) for full guide.

---

## 📚 Documentation

| File | Purpose |
|------|---------|
| [START_HERE.md](START_HERE.md) | Quick overview |
| [README.md](README.md) | Full documentation |
| [QUICKSTART.md](QUICKSTART.md) | User guide |
| [INSTALL.md](INSTALL.md) | Installation |
| [DEPLOYMENT.md](DEPLOYMENT.md) | Production deployment |
| [FEATURES.md](FEATURES.md) | Feature details |
| [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) | What was created |

---

## ✅ Quick Verification

After running `npm run dev`, check:

1. ✅ App opens at http://localhost:3000
2. ✅ Can register new user
3. ✅ Can add entry and earn points
4. ✅ Calendar shows entries
5. ✅ Wallet displays stats
6. ✅ Can create goals
7. ✅ Achievements visible
8. ✅ Profile settings work

If all ✅, you're good to go! 🎉

---

## 🆘 Need Help?

1. Check [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
2. Review [README.md](README.md)
3. Open database in Prisma Studio
4. Check browser console for errors

---

## 🎯 Next Steps

After getting it running:

1. **Test all features** - Register, add entries, create goals
2. **Customize branding** - Update colors in `tailwind.config.js`
3. **Add more achievements** - Edit `lib/achievements.ts`
4. **Connect real APIs** - Currency & crypto services
5. **Deploy to production** - See `DEPLOYMENT.md`

---

## 🎉 You're Ready!

Run this:
```bash
npm install && npm run db:init && npm run dev
```

Then open: **http://localhost:3000**

**Happy saving! 💰✨**