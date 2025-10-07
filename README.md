# 💰 Отказник - Gamified Savings PWA

**Отказник** is a full-featured Progressive Web App (PWA) that helps users track daily refusals, save money, earn achievements, and visualize crypto ROI potential.

## ✨ Features

### 📅 Calendar
- Track daily refusals with name, price, quantity, category
- Quick presets for common items (coffee, cigarettes, soda, fast food)
- Category-based bonuses (+20% for habits)
- Real-time points calculation with streak multipliers

### 💰 Wallet
- View savings: Today / Week / Month / All Time
- Interactive charts and statistics
- Points tracking and rank progression
- Beautiful comic-style UI

### 🎯 Goals
- Set personal savings goals (e.g., "AirPods - $250")
- Visual progress bars showing completion percentage
- **Crypto-ROI Calculator**: See what your savings would be worth if invested in top 10 cryptocurrencies 5 years ago
- Historical price comparisons and multipliers

### 🏅 Achievements
8 unique achievements with unlock animations:
- ☕ Coffee Breaker
- 🥤 Sugar Free (7 days)
- 🚬 Smoke Out (14 days)
- 🥷 Budget Ninja ($40+)
- ⚡ Momentum (21 day streak)
- 🦸 Ref Hero (3 referrals)
- 👑 Consistency King/Queen (60 days)
- 🛡️ Iron Will (30 days)

### 🤝 Referral System
- Unique referral code for each user
- Bonus points:
  - +50 pts when referral makes first entry
  - +20 pts for new user on signup
  - +25 pts for active referrals (5+ days/week)
- Anti-fraud protection

### 🧩 Ranks
Progressive rank system based on total points:
- Novice Saver (0 pts)
- Habit Hacker (50 pts)
- Frugal Master (150 pts)
- Willpower Pro (300 pts)
- Discipline Legend (500 pts)

### 👤 Profile
- 30+ world currencies + all CIS currencies
- Language switcher (RU/EN)
- Timezone settings
- Referral link sharing
- CSV export (future)

## 🚀 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: Prisma + SQLite
- **Styling**: Tailwind CSS (Comic-style theme)
- **Animations**: Framer Motion
- **Charts**: Recharts
- **i18n**: i18next
- **State**: SWR for data fetching
- **Validation**: Zod
- **PWA**: Service Worker, Web Manifest

## 📦 Installation

```bash
# Install dependencies
npm install

# Initialize database
chmod +x scripts/init-db.sh
./scripts/init-db.sh

# Or manually:
npx prisma generate
npx prisma migrate dev --name init
npx tsx prisma/seed.ts

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📱 PWA Installation

The app can be installed as a PWA on mobile devices:

1. Open the app in your mobile browser
2. Tap "Add to Home Screen"
3. The app will work offline and sync when online

## 🎨 Design

The app features a unique **comic-style aesthetic**:
- Speech bubbles and comic panels
- Bold black borders and shadows
- Pastel backgrounds with vibrant accents (lime, orange, cyan)
- Smooth animations (spring/ease-out)
- Mobile-first responsive design (9:16 ratio)
- Cartoon-style icons and mascots

## 🌐 Internationalization

Full RU/EN support for:
- All UI elements
- Error messages
- Achievement names/descriptions
- Charts and tables
- Date/time formatting

## 💸 Currency System

- Supports 30+ global currencies
- Exchange rates locked at entry creation
- All calculations in USD backend
- UI displays in user's selected currency
- Real-time conversion on currency change

## 💎 Crypto ROI

Integration with CoinGecko API:
- Top 10 cryptocurrencies (excluding stablecoins)
- Historical prices (5 years ago)
- Current prices
- ROI multipliers
- Projected value of savings

**Disclaimer**: Not financial advice. Past performance doesn't guarantee future results.

## 🔧 Configuration

### Environment Variables

Create a `.env` file:

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

### Prisma

Database schema is in `prisma/schema.prisma`. After changes:

```bash
npx prisma migrate dev --name your_migration_name
npx prisma generate
```

## 📊 Database Schema

- **User**: Auth, settings, points, rank, referral code
- **Entry**: Daily refusals with price, category, USD conversion
- **Goal**: Savings goals with progress tracking
- **Achievement**: 8 predefined achievements
- **UserAchievement**: User unlock history
- **Referral**: Referral relationships and bonuses

## 🧪 Development

```bash
# Run dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint
npm run lint
```

## 🎯 Points System

Points calculation:
- Base: 1 point = $1 saved
- Category bonus: +20% for "habits"
- Streak multiplier: Up to 2x based on consecutive days
- Referral bonuses: +20/+25/+50 pts

## 🔒 Security

- Passwords hashed with bcrypt (12 rounds)
- Client-side session management
- Anti-fraud referral system
- Input validation with Zod schemas

## 📈 Future Enhancements

- [ ] Push notifications for daily reminders
- [ ] CSV/PDF export functionality
- [ ] Social sharing features
- [ ] Leaderboards
- [ ] More achievements
- [ ] Real-time currency API integration
- [ ] Backup/restore functionality
- [ ] Dark mode

## 📄 License

MIT License - feel free to use for personal or commercial projects!

## 🤝 Contributing

Contributions welcome! Please open an issue or PR.

---

**Made with 💪 and ☕ (that I refused!)**