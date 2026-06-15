# Database Setup Guide

Your development server is ready, but needs a PostgreSQL database connection. Choose one of the options below:

## Option 1: Use NeonDB (Recommended for Quick Start)

Neon is a serverless PostgreSQL database - perfect for development.

### Steps:
1. Go to [https://console.neon.tech](https://console.neon.tech)
2. Sign up for a free account
3. Create a new project
4. Get your connection string (looks like: `postgresql://user:password@ep-xxxxx.us-east-1.neon.tech/dbname?sslmode=require`)
5. Update `.env` file:
   ```
   DATABASE_URL=postgresql://user:password@ep-xxxxx.us-east-1.neon.tech/dbname?sslmode=require
   ```
6. Restart the server: Press `rs` in the terminal

## Option 2: Use Local PostgreSQL

### Windows:
1. Download from [https://www.postgresql.org/download/windows/](https://www.postgresql.org/download/windows/)
2. Run installer, remember the password you set for `postgres` user
3. Create a database:
   ```bash
   createdb ecommerce_db
   ```
4. Update `.env` file:
   ```
   DATABASE_URL=postgresql://postgres:your_password@localhost:5432/ecommerce_db
   ```
5. Make sure PostgreSQL service is running
6. Restart the server: Press `rs` in the terminal

### Mac (using Homebrew):
```bash
brew install postgresql
brew services start postgresql
createdb ecommerce_db
```

Then update `.env`:
```
DATABASE_URL=postgresql://postgres:password@localhost:5432/ecommerce_db
```

### Linux (Ubuntu/Debian):
```bash
sudo apt-get install postgresql postgresql-contrib
sudo service postgresql start
sudo -u postgres createdb ecommerce_db
```

Then update `.env`:
```
DATABASE_URL=postgresql://postgres:password@localhost:5432/ecommerce_db
```

## Verify Connection

Once you've updated `.env` with your database connection string:

1. Press `rs` in the terminal to restart the server
2. You should see:
   ```
   ✅ Database connection established
   ✅ E-Commerce API Server Started
   ```
3. Visit http://localhost:5000/api/v1/health in your browser

## Next Steps

After the server starts successfully:

```bash
# Run migrations to create tables
npm run db:migrate

# Seed sample data
npm run db:seed
```

## Troubleshooting

- **"ECONNREFUSED"**: PostgreSQL is not running or not at the expected address
- **"Invalid URL"**: Check your DATABASE_URL format in .env file
- **"permission denied"**: Check your database username/password

For questions about NeonDB, visit: https://neon.tech/docs/
