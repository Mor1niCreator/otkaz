# 🚀 Deployment Guide

Deploy **Отказник** to various platforms.

## Vercel (Recommended)

### Prerequisites
- GitHub account
- Vercel account

### Steps

1. **Push to GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/otkaznik.git
git push -u origin main
```

2. **Import to Vercel**
- Go to [vercel.com](https://vercel.com)
- Click "New Project"
- Import your GitHub repository
- Configure:
  - Framework Preset: Next.js
  - Build Command: `npm run build`
  - Output Directory: `.next`

3. **Environment Variables**
Add these in Vercel dashboard:
```
DATABASE_URL=postgresql://user:password@host:5432/dbname
NEXTAUTH_SECRET=your-random-secret-key
NEXTAUTH_URL=https://your-app.vercel.app
```

4. **Database**
Use Vercel Postgres or external PostgreSQL:
```bash
# Update prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

5. **Deploy**
- Click "Deploy"
- Vercel will build and deploy automatically

### Post-Deployment

```bash
# Run migrations on production database
npx prisma migrate deploy
npx prisma db seed
```

## Netlify

### Steps

1. **Build Settings**
```
Build command: npm run build
Publish directory: .next
```

2. **Environment Variables**
Same as Vercel configuration

3. **Netlify Functions**
API routes will automatically work as Netlify Functions

## Railway

### Steps

1. **Create New Project**
- Connect GitHub repository
- Railway auto-detects Next.js

2. **Add PostgreSQL**
- Click "New" → "Database" → "PostgreSQL"
- Railway will automatically set `DATABASE_URL`

3. **Environment Variables**
```
NEXTAUTH_SECRET=your-secret
NEXTAUTH_URL=${{RAILWAY_PUBLIC_DOMAIN}}
```

4. **Deploy**
- Push to GitHub
- Railway auto-deploys

## Self-Hosted (VPS)

### Requirements
- Ubuntu 20.04+ server
- Node.js 18+
- Nginx
- PM2

### Setup

1. **Install Dependencies**
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2
sudo npm install -g pm2

# Install Nginx
sudo apt install -y nginx
```

2. **Clone Repository**
```bash
cd /var/www
git clone https://github.com/yourusername/otkaznik.git
cd otkaznik
```

3. **Install & Build**
```bash
npm install
npm run build
```

4. **Environment**
```bash
cp .env.example .env
nano .env
# Update with production values
```

5. **Database**
```bash
# For SQLite
npm run db:init

# For PostgreSQL
# Install PostgreSQL first
sudo apt install postgresql postgresql-contrib
# Create database
sudo -u postgres createdb otkaznik
# Update .env with connection string
# Run migrations
npx prisma migrate deploy
npx prisma db seed
```

6. **Start with PM2**
```bash
pm2 start npm --name "otkaznik" -- start
pm2 save
pm2 startup
```

7. **Configure Nginx**
```bash
sudo nano /etc/nginx/sites-available/otkaznik
```

Add:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable:
```bash
sudo ln -s /etc/nginx/sites-available/otkaznik /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

8. **SSL with Let's Encrypt**
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

## Docker

### Dockerfile

Create `Dockerfile`:
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npx prisma generate
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

### docker-compose.yml

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/otkaznik
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
      - NEXTAUTH_URL=${NEXTAUTH_URL}
    depends_on:
      - db

  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=otkaznik
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

### Deploy

```bash
docker-compose up -d
docker-compose exec app npx prisma migrate deploy
docker-compose exec app npx prisma db seed
```

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| DATABASE_URL | Database connection string | `postgresql://...` or `file:./dev.db` |
| NEXTAUTH_SECRET | Secret for auth sessions | `random-32-char-string` |
| NEXTAUTH_URL | Public URL of your app | `https://otkaznik.app` |

## Database Migration

### SQLite → PostgreSQL

1. **Export data**
```bash
npx prisma db pull
```

2. **Update schema**
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

3. **Migrate**
```bash
npx prisma migrate dev
npx prisma db seed
```

## Performance Optimization

### 1. Enable Caching
```typescript
// next.config.js
module.exports = {
  swcMinify: true,
  compress: true,
  images: {
    unoptimized: false,
  },
}
```

### 2. CDN for Static Assets
Use Vercel CDN or Cloudflare

### 3. Database Indexing
Already configured in Prisma schema

### 4. Service Worker Caching
Already implemented in `public/sw.js`

## Monitoring

### Setup PM2 Monitoring
```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

### Health Check Endpoint
Create `pages/api/health.ts`:
```typescript
export default function handler(req, res) {
  res.status(200).json({ status: 'ok', timestamp: new Date() });
}
```

## Backup Strategy

### Database Backup
```bash
# SQLite
cp prisma/prod.db backups/prod-$(date +%Y%m%d).db

# PostgreSQL
pg_dump -U postgres otkaznik > backup-$(date +%Y%m%d).sql
```

### Automated Backups
```bash
# Add to crontab
0 2 * * * /path/to/backup-script.sh
```

## Troubleshooting

### Build Fails
```bash
# Clear cache
rm -rf .next node_modules
npm install
npm run build
```

### Database Connection Issues
```bash
# Test connection
npx prisma db pull
```

### Memory Issues
```bash
# Increase Node memory
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build
```

## Security Checklist

- [ ] HTTPS enabled
- [ ] Environment variables secured
- [ ] Database credentials rotated
- [ ] CORS configured
- [ ] Rate limiting enabled
- [ ] SQL injection protection (Prisma handles this)
- [ ] XSS protection (React handles this)
- [ ] CSRF tokens implemented

---

**Happy Deploying! 🚀**