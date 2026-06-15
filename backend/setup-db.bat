@echo off
REM E-Commerce Database Setup Script for Windows
REM Run this script to set up the database

echo.
echo ╔════════════════════════════════════════╗
echo ║   E-Commerce Database Setup Script     ║
echo ╚════════════════════════════════════════╝
echo.

REM Check if .env file exists
if not exist .env (
    echo ❌ .env file not found!
    echo 📝 Creating .env from .env.example...
    copy .env.example .env
    echo ✅ .env created. Please update it with your NeonDB credentials.
    echo.
    echo 📝 Edit the following in .env:
    echo    DATABASE_URL=postgresql://user:password@host/dbname
    echo.
    exit /b 1
)

echo 📦 Installing dependencies...
call npm install

if %errorlevel% neq 0 (
    echo ❌ npm install failed!
    exit /b 1
)

echo ✅ Dependencies installed
echo.

echo 🏗️  Running database migrations...
call npm run db:migrate

if %errorlevel% neq 0 (
    echo ❌ Database migration failed!
    echo 💡 Tips:
    echo    - Check your DATABASE_URL in .env
    echo    - Ensure PostgreSQL/NeonDB is accessible
    echo    - Verify your network connection
    exit /b 1
)

echo ✅ Database migrations completed
echo.

echo 🌱 Seeding sample data...
call npm run db:seed

if %errorlevel% neq 0 (
    echo ⚠️  Database seeding failed ^(optional^)
    echo 💡 You can seed later with: npm run db:seed
) else (
    echo ✅ Sample data seeded
)

echo.
echo ╔════════════════════════════════════════╗
echo ║   ✅ Database Setup Complete!          ║
echo ╚════════════════════════════════════════╝
echo.
echo 🚀 Start the development server:
echo    npm run dev
echo.
echo 📚 Documentation:
echo    - Database Setup: DATABASE.md
echo    - Tables Schema: TABLES.md
echo    - API Routes: README.md
echo.
pause
