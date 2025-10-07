# 💻 Installation Instructions

Complete installation guide for **Отказник** PWA.

## 📋 Prerequisites

Before you begin, ensure you have:

- **Node.js** version 18.0 or higher
  ```bash
  node --version  # Should show v18.0.0 or higher
  ```

- **npm** (comes with Node.js) or **yarn**
  ```bash
  npm --version   # Should show 9.0.0 or higher
  ```

- **Git** (optional, for version control)
  ```bash
  git --version
  ```

## 🚀 Quick Install (Recommended)

```bash
# 1. Install dependencies
npm install

# 2. Initialize database (one command does it all!)
npm run db:init

# 3. Start development server
npm run dev
```

**That's it!** Open http://localhost:3000 🎉

## 📦 Step-by-Step Installation

### Step 1: Install Dependencies

```bash
npm install
```

This installs:
- Next.js 14 (React framework)
- Prisma (Database ORM)
- Tailwind CSS (Styling)
- Framer Motion (Animations)
- Recharts (Charts)
- i18next (Internationalization)
- And more...

### Step 2: Configure Environment

The `.env` file is already created with sensible defaults:

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="otkaznik-super-secret-key-2024"
NEXTAUTH_URL="http://localhost:3000"
```

**For production**, change `NEXTAUTH_SECRET` to a random string:
```bash
# Generate a secure secret
openssl rand -base64 32
```

### Step 3: Initialize Database

#### Option A: One Command (Recommended)
```bash
npm run db:init
```

This will:
1. Generate Prisma client
2. Create SQLite database file
3. Run database migrations
4. Seed 8 achievements into the database

#### Option B: Manual Steps
```bash
# Generate Prisma client
npx prisma generate

# Create database and run migrations
npx prisma migrate dev --name init

# Seed achievements
npm run db:seed
```

### Step 4: Start Development Server

```bash
npm run dev
```

The app will be available at:
- **Local**: http://localhost:3000
- **Network**: http://192.168.x.x:3000 (for testing on mobile)

### Step 5: Open in Browser

1. Navigate to http://localhost:3000
2. Click "Register" to create an account
3. Start tracking your refusals!

## 🔍 Verification

Check if everything is working:

1. **Database Created**
   ```bash
   ls -la prisma/
   # Should show: dev.db, dev.db-journal
   ```

2. **Achievements Seeded**
   ```bash
   npm run db:studio
   # Opens Prisma Studio at http://localhost:5555
   # Check "Achievement" table - should have 8 records
   ```

3. **Server Running**
   ```
   ✓ Ready in 2.3s
   ○ Local:   http://localhost:3000
   ```

## 📱 Mobile Testing

### Test on Your Phone

1. **Find your local IP address**
   ```bash
   # macOS/Linux
   ifconfig | grep "inet "
   
   # Windows
   ipconfig
   ```

2. **Connect phone to same WiFi network**

3. **Open browser on phone**
   ```
   http://YOUR_IP_ADDRESS:3000
   ```

4. **Install as PWA**
   - Tap "Add to Home Screen"
   - App now works offline!

## 🗄️ Database Management

### View Database Contents

```bash
npm run db:studio
```

Opens Prisma Studio where you can:
- Browse all tables
- View user data
- Check entries and goals
- Inspect achievements

### Reset Database

If you want to start fresh:

```bash
# Delete database
rm prisma/dev.db

# Reinitialize
npm run db:init
```

### Backup Database

```bash
# SQLite is just a file, copy it!
cp prisma/dev.db prisma/backup-$(date +%Y%m%d).db
```

## 🛠️ Development Tools

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run db:init` | Initialize database (first time) |
| `npm run db:seed` | Seed achievements |
| `npm run db:studio` | Open Prisma Studio |

### IDE Setup

**VS Code Extensions (Recommended):**
- Prisma
- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- ESLint
- Prettier

## 🎨 Project Structure

```
otkaznik-pwa/
├── app/                    # Next.js 14 App Router
│   ├── page.tsx           # Login/Register page
│   ├── calendar/          # Calendar page
│   ├── wallet/            # Wallet stats
│   ├── goals/             # Goals + Crypto ROI
│   ├── achievements/      # Achievements list
│   └── profile/           # User profile
├── components/            # Reusable React components
├── lib/                   # Utilities and services
│   ├── prisma.ts         # Database client
│   ├── auth.ts           # Authentication
│   ├── currencies.ts     # Currency data
│   ├── achievements.ts   # Achievement definitions
│   ├── ranks.ts          # Rank system
│   ├── crypto-service.ts # Crypto ROI calculator
│   └── points-service.ts # Points calculation
├── pages/api/             # API routes
│   ├── auth/             # Login/Register
│   ├── entries/          # CRUD entries
│   ├── goals/            # CRUD goals
│   ├── achievements/     # List achievements
│   └── crypto/           # Crypto ROI endpoint
├── prisma/
│   ├── schema.prisma     # Database schema
│   └── seed.ts           # Database seeder
├── public/
│   ├── manifest.json     # PWA manifest
│   ├── sw.js             # Service worker
│   └── icon-*.png        # PWA icons
└── package.json          # Dependencies
```

## 🐛 Troubleshooting

### Issue: Port 3000 already in use

**Solution:**
```bash
# Use different port
npm run dev -- -p 3001
```

### Issue: Database locked

**Solution:**
```bash
# Close Prisma Studio if running
# Then reset database
rm prisma/dev.db
npm run db:init
```

### Issue: Module not found

**Solution:**
```bash
# Clear and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue: Prisma Client not generated

**Solution:**
```bash
npx prisma generate
```

### Issue: Build fails

**Solution:**
```bash
# Clear Next.js cache
rm -rf .next
npm run dev
```

### Issue: TypeScript errors

**Solution:**
```bash
# Restart TypeScript server in VS Code
# Or check tsconfig.json paths
```

## 🔐 Security Notes

### Development
- Default `.env` is fine for local development
- SQLite database is stored locally
- No external API keys required (CoinGecko is public)

### Production
- **Change `NEXTAUTH_SECRET`** to a random string
- Use PostgreSQL instead of SQLite
- Enable HTTPS
- Set secure CORS policies
- Use environment variables for secrets

## 📖 Next Steps

After installation:

1. **Read the [QUICKSTART.md](QUICKSTART.md)** for usage guide
2. **Explore the [README.md](README.md)** for full documentation
3. **Check [DEPLOYMENT.md](DEPLOYMENT.md)** for production deployment
4. **Create your first user** and start tracking!

## 🆘 Need Help?

- **Documentation**: See README.md
- **Quick Start**: See QUICKSTART.md
- **Deployment**: See DEPLOYMENT.md
- **API Reference**: Check `/pages/api` folder
- **Issues**: Open a GitHub issue

## ✅ Installation Checklist

- [ ] Node.js 18+ installed
- [ ] Dependencies installed (`npm install`)
- [ ] Database initialized (`npm run db:init`)
- [ ] Development server running (`npm run dev`)
- [ ] App opens in browser (http://localhost:3000)
- [ ] Can register a new user
- [ ] Can add an entry
- [ ] Achievements visible in database

If all checked, you're ready to go! 🎉

---

**Happy Coding! 💻✨**