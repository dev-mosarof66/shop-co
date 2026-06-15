#!/bin/bash

# E-Commerce Database Setup Script
# Run this script to set up the database

echo "╔════════════════════════════════════════╗"
echo "║   E-Commerce Database Setup Script     ║"
echo "╚════════════════════════════════════════╝"
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ .env file not found!"
    echo "📝 Creating .env from .env.example..."
    cp .env.example .env
    echo "✅ .env created. Please update it with your NeonDB credentials."
    echo ""
    echo "📝 Edit the following in .env:"
    echo "   DATABASE_URL=postgresql://user:password@host/dbname"
    echo ""
    exit 1
fi

echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ npm install failed!"
    exit 1
fi

echo "✅ Dependencies installed"
echo ""

echo "🏗️  Running database migrations..."
npm run db:migrate

if [ $? -ne 0 ]; then
    echo "❌ Database migration failed!"
    echo "💡 Tips:"
    echo "   - Check your DATABASE_URL in .env"
    echo "   - Ensure PostgreSQL/NeonDB is accessible"
    echo "   - Verify your network connection"
    exit 1
fi

echo "✅ Database migrations completed"
echo ""

echo "🌱 Seeding sample data..."
npm run db:seed

if [ $? -ne 0 ]; then
    echo "⚠️  Database seeding failed (optional)"
    echo "💡 You can seed later with: npm run db:seed"
else
    echo "✅ Sample data seeded"
fi

echo ""
echo "╔════════════════════════════════════════╗"
echo "║   ✅ Database Setup Complete!          ║"
echo "╚════════════════════════════════════════╝"
echo ""
echo "🚀 Start the development server:"
echo "   npm run dev"
echo ""
echo "📚 Documentation:"
echo "   - Database Setup: DATABASE.md"
echo "   - Tables Schema: TABLES.md"
echo "   - API Routes: README.md"
echo ""
