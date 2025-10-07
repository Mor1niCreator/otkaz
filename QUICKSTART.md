# 🚀 Quick Start Guide

Get **Отказник** up and running in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

## Installation Steps

### 1. Install Dependencies

```bash
npm install
```

This will install all required packages including Next.js, Prisma, React, and other dependencies.

### 2. Initialize Database

```bash
npm run db:init
```

This command will:
- Generate Prisma client
- Create SQLite database
- Run migrations
- Seed achievements

**Alternative manual setup:**
```bash
npx prisma generate
npx prisma migrate dev --name init
npm run db:seed
```

### 3. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app!

## First Steps

1. **Register an Account**
   - Open the app in your browser
   - Click "Register"
   - Enter your email, password, and name
   - Optionally enter a referral code

2. **Add Your First Refusal**
   - Navigate to the Calendar page
   - Click on a quick preset (Coffee, Cigarettes, etc.) OR
   - Click "+ Custom Entry"
   - Fill in details: name, price, quantity, category
   - Submit to earn points! 🎉

3. **Set a Goal**
   - Go to Goals page
   - Click "+ New"
   - Enter goal name (e.g., "New Phone")
   - Set target amount
   - Track your progress!

4. **Check Achievements**
   - Visit Achievements page
   - See which achievements you've unlocked
   - Track your progress to unlock more!

5. **Share Your Referral Code**
   - Go to Profile page
   - Copy your unique referral link
   - Share with friends to earn bonus points!

## Testing the App

### Sample User Journey

```bash
# 1. Register a new account
Email: test@example.com
Password: password123
Name: Test User

# 2. Add some refusals
☕ Coffee - $3.50
🚬 Cigarettes - $8.00
🥤 Soda - $2.00

# 3. Create a goal
Goal: "AirPods"
Target: $250

# 4. Check your progress
- View wallet stats
- See achievements
- Calculate crypto ROI
```

## Database Management

### View Database Contents

```bash
npm run db:studio
```

This opens Prisma Studio at [http://localhost:5555](http://localhost:5555) where you can:
- View all tables
- Edit records
- Delete test data
- Inspect relationships

### Reset Database

```bash
rm prisma/dev.db
npm run db:init
```

## PWA Installation (Mobile)

### iOS (Safari)

1. Open the app in Safari
2. Tap the Share button
3. Select "Add to Home Screen"
4. Tap "Add"

### Android (Chrome)

1. Open the app in Chrome
2. Tap the three-dot menu
3. Select "Add to Home Screen"
4. Tap "Install"

The app will now work offline and sync when you're back online!

## Configuration

### Change Currency

1. Go to Profile
2. Click "Edit"
3. Select your preferred currency from the dropdown
4. Click "Save"

All new entries will use this currency, and the UI will display amounts converted to your currency.

### Change Language

1. Go to Profile
2. Click "Edit"
3. Select "English 🇬🇧" or "Русский 🇷🇺"
4. Click "Save"

The entire app will instantly switch languages!

## Troubleshooting

### Port already in use

If port 3000 is busy:
```bash
npm run dev -- -p 3001
```

### Database locked error

Close Prisma Studio if it's running, then:
```bash
npx prisma migrate reset
npm run db:seed
```

### Build errors

Clear Next.js cache:
```bash
rm -rf .next
npm run dev
```

### Module not found

Reinstall dependencies:
```bash
rm -rf node_modules package-lock.json
npm install
```

## Production Deployment

### Build for Production

```bash
npm run build
npm start
```

### Environment Variables

For production, update `.env`:
```env
DATABASE_URL="file:./prod.db"
NEXTAUTH_SECRET="your-super-secret-production-key"
NEXTAUTH_URL="https://your-domain.com"
```

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Note: For production, consider using PostgreSQL instead of SQLite.

## Tips & Tricks

1. **Daily Habit**: Add at least one refusal daily to build your streak!
2. **Categories Matter**: Use "Habits" category for +20% point bonus
3. **Streaks**: Consecutive days multiply your points (up to 2x)
4. **Referrals**: Share your code to earn bonus points
5. **Goals**: Set realistic goals to stay motivated
6. **Crypto ROI**: Check regularly to see what you "could have" earned!

## Need Help?

- Check the full [README.md](README.md) for detailed documentation
- Open an issue on GitHub
- Review the API documentation in `/pages/api`

---

**Happy Saving! 💰✨**