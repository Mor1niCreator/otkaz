# 🚀 START HERE - Отказник PWA

**Welcome!** You have a complete, production-ready gamified savings tracker PWA.

## ⚡ Quick Start (30 seconds)

```bash
npm install && npm run db:init && npm run dev
```

Then open http://localhost:3000 🎉

## 📱 What is Отказник?

A **Progressive Web App** that helps users:
- 📅 Track daily "refusals" (things they didn't buy)
- 💰 Calculate money saved
- 🎮 Earn points, achievements, and ranks
- 🎯 Set savings goals
- 💎 See crypto ROI potential
- 🤝 Invite friends with referral system

## ✨ Features at a Glance

| Feature | Description |
|---------|-------------|
| **Calendar** | Daily refusal tracking with quick presets |
| **Wallet** | Stats: Today/Week/Month/All Time + Charts |
| **Goals** | Set targets, track progress, crypto ROI |
| **Achievements** | 8 unlockable achievements |
| **Ranks** | 5-tier progression system |
| **Referrals** | Earn bonus points by inviting friends |
| **PWA** | Install on mobile, works offline |
| **i18n** | Full RU/EN support |
| **30+ Currencies** | Global + CIS currencies |
| **Comic Style** | Unique cartoon aesthetic |

## 🎨 Tech Stack

- **Next.js 14** - React framework (App Router)
- **TypeScript** - Type safety
- **Prisma** - Database ORM
- **SQLite** - Database (easy to swap to PostgreSQL)
- **Tailwind CSS** - Comic-style UI
- **Framer Motion** - Smooth animations
- **Recharts** - Beautiful charts
- **PWA** - Offline-first with service worker

## 📖 Documentation

| File | Purpose |
|------|---------|
| [README.md](README.md) | Full documentation |
| [QUICKSTART.md](QUICKSTART.md) | User guide & features |
| [INSTALL.md](INSTALL.md) | Installation instructions |
| [DEPLOYMENT.md](DEPLOYMENT.md) | Deploy to production |

## 🎯 First Steps

### 1. Install & Run

```bash
# Install dependencies
npm install

# Setup database
npm run db:init

# Start dev server
npm run dev
```

### 2. Test the App

1. Register a new account
2. Add your first refusal (☕ Coffee)
3. Check your points in Wallet
4. Set a goal (🎯 Goals)
5. View achievements (🏅 Achievements)

### 3. Explore Features

**Calendar Page:**
- Quick add: Coffee, Cigarettes, Soda, Fast Food
- Custom entries with categories
- Earn points with streak multipliers

**Wallet Page:**
- View savings breakdown
- Interactive charts
- Track rank progress

**Goals Page:**
- Create savings goals
- Track progress with visual bars
- **Crypto ROI**: See what your savings would be worth in crypto!

**Achievements Page:**
- 8 unique achievements to unlock
- Beautiful unlock animations
- Track your progress

**Profile Page:**
- Change currency (30+ options)
- Switch language (RU/EN)
- Share referral code
- View your rank

## 🏗️ Project Structure

```
otkaznik-pwa/
├── app/              → Next.js pages (Calendar, Wallet, Goals, etc.)
├── components/       → Reusable UI components
├── lib/              → Business logic & services
├── pages/api/        → API endpoints
├── prisma/           → Database schema & migrations
├── public/           → PWA assets (manifest, icons, service worker)
└── package.json      → Dependencies & scripts
```

## 🛠️ Key Commands

```bash
# Development
npm run dev              # Start dev server
npm run build           # Build for production
npm start               # Run production build

# Database
npm run db:init         # Initialize database (first time)
npm run db:seed         # Seed achievements
npm run db:studio       # Open Prisma Studio

# Other
npm run lint            # Run ESLint
```

## 🎮 Key Mechanics

### Points System
- Base: **1 point = $1 saved**
- Habits category: **+20% bonus**
- Streak multiplier: **up to 2x**

### Ranks (Auto-upgrade)
1. Novice Saver (0 pts)
2. Habit Hacker (50 pts)
3. Frugal Master (150 pts)
4. Willpower Pro (300 pts)
5. Discipline Legend (500 pts)

### Achievements (8 total)
- ☕ Coffee Breaker
- 🥤 Sugar Free (7 days)
- 🚬 Smoke Out (14 days)
- 🥷 Budget Ninja ($40+)
- ⚡ Momentum (21 days)
- 🦸 Ref Hero (3 referrals)
- 👑 Consistency King (60 days)
- 🛡️ Iron Will (30 days)

### Referral Bonuses
- **+20 pts** for new user on signup
- **+50 pts** when they make first entry
- **+25 pts** for active referrals (5+ days/week)

## 💎 Crypto ROI Feature

Shows what your savings would be worth if invested in top 10 cryptocurrencies 5 years ago:
- BTC, ETH, SOL, BNB, ADA, XRP, DOT, DOGE, AVAX, MATIC
- Historical vs current prices
- ROI multipliers
- Projected value

*Not financial advice - just motivation!*

## 📱 PWA Installation

### iOS
1. Open in Safari
2. Tap Share → "Add to Home Screen"

### Android
1. Open in Chrome
2. Tap Menu → "Add to Home Screen"

Works offline with auto-sync! 📶

## 🌐 Internationalization

Full RU/EN support:
- UI elements
- Achievement names
- Error messages
- Date formatting

Switch in Profile → Settings

## 💰 Multi-Currency Support

30+ currencies including:
- **Major**: USD, EUR, GBP, JPY, CHF, CAD, AUD, CNY
- **CIS**: RUB, UAH, BYN, KZT, UZS, AMD, AZN, GEL, KGS, TJS, TMT, MDL
- **Asian**: VND, THB, KRW, SGD, MYR, IDR, PHP, INR
- **Other**: MXN, BRL, ZAR, TRY, PLN, CZK

Exchange rates locked at entry creation.

## 🔧 Configuration

Edit `.env` for:
```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

## 📊 Database Schema

6 main models:
- **User** - Auth, settings, points, rank
- **Entry** - Daily refusals
- **Goal** - Savings targets
- **Achievement** - Predefined achievements
- **UserAchievement** - Unlocked achievements
- **Referral** - Referral relationships

View with: `npm run db:studio`

## 🚀 Deploy to Production

**Vercel (Recommended):**
```bash
vercel
```

**Other platforms:** See [DEPLOYMENT.md](DEPLOYMENT.md)

## 🎨 Comic Style Design

Unique aesthetic:
- Speech bubbles
- Comic panels with black borders
- Bold shadows (`shadow-comic`)
- Pastel colors (yellow, orange, lime, cyan, pink)
- Smooth spring animations
- Cartoon icons & emojis

## 🐛 Common Issues

**Port in use?**
```bash
npm run dev -- -p 3001
```

**Database locked?**
```bash
rm prisma/dev.db && npm run db:init
```

**Module errors?**
```bash
rm -rf node_modules && npm install
```

## ✅ Verification Checklist

After installation:
- [ ] App opens at localhost:3000
- [ ] Can register new user
- [ ] Can add entry and earn points
- [ ] Calendar shows entries
- [ ] Wallet displays stats
- [ ] Can create goals
- [ ] Achievements visible
- [ ] Profile settings work
- [ ] PWA manifest loads
- [ ] Service worker registered

## 🎯 Next Steps

1. **Customize branding** - Update colors in `tailwind.config.js`
2. **Add more achievements** - Edit `lib/achievements.ts`
3. **Connect real currency API** - Update `lib/currency-service.ts`
4. **Deploy to production** - See `DEPLOYMENT.md`
5. **Enable analytics** - Add Google Analytics or similar

## 📞 Support

- 📖 Full docs: [README.md](README.md)
- 🚀 Quick guide: [QUICKSTART.md](QUICKSTART.md)
- 💻 Installation: [INSTALL.md](INSTALL.md)
- 🌐 Deployment: [DEPLOYMENT.md](DEPLOYMENT.md)

## 🎉 Ready to Go!

Your complete PWA is ready. Just run:

```bash
npm install && npm run db:init && npm run dev
```

**Happy saving! 💰✨**

---

*Made with ❤️ and zero coffees ☕ (that I refused!)*