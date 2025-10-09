#!/bin/bash

echo "🔧 Initializing database..."

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# Seed database
npx tsx prisma/seed.ts

echo "✅ Database initialized successfully!"