# Database Setup Guide

## 🗄️ Database Architecture

This e-commerce backend uses **PostgreSQL** with **TypeORM** as the ORM. We recommend using **NeonDB** for a serverless PostgreSQL experience.

### Database Schema Overview

The database consists of the following tables:

```
users
├── orders (many-to-many via OrderItem)
├── wishlists
├── reviews
└── addresses

products
├── variants
├── reviews
├── wishlists
├── orders (many-to-many via OrderItem)
└── categories (many-to-one)

categories
└── products

orders
├── items (OrderItem)
├── shipping_address
└── billing_address

carts
├── items (CartItem)
└── products
```

## 🚀 Getting Started with NeonDB

### 1. Create a NeonDB Account

1. Go to [https://console.neon.tech](https://console.neon.tech)
2. Sign up for a free account
3. Create a new project
4. Copy your connection string

### 2. Configure Environment Variables

Create a `.env` file in the `backend` directory:

```bash
cp .env.example .env
```

Update your `.env` with your NeonDB connection string:

```env
DATABASE_URL=postgresql://user:password@ep-xxxx.us-east-1.neon.tech/ecommerce_db?sslmode=require
NODE_ENV=development
PORT=5000
```

## 📦 Dependencies

The database setup requires:

```json
{
  "typeorm": "^0.3.17",
  "pg": "^8.11.3",
  "reflect-metadata": "^0.1.13"
}
```

Install all dependencies:

```bash
npm install
```

## 🏗️ Database Entities

### User Entity
- `id` (UUID, PK)
- `firstName`, `lastName`
- `email` (unique)
- `password` (hashed)
- `phone`, `avatar`
- `role` (customer, admin, vendor)
- `isEmailVerified`
- `resetPasswordToken`, `resetPasswordExpire`

### Category Entity
- `id` (UUID, PK)
- `name`
- `slug` (unique)
- `description`
- `image`
- `isActive`

### Product Entity
- `id` (UUID, PK)
- `name`, `description`
- `price`, `originalPrice`
- `sku` (unique)
- `stock`, `lowStockThreshold`
- `images` (array)
- `tags` (array)
- `rating`, `reviewCount`
- `isActive`
- `weight`, `dimensions`
- `categoryId` (FK)

### ProductVariant Entity
- `id` (UUID, PK)
- `name`
- `values` (JSON object)
- `price`, `stock`
- `images` (array)
- `sku`
- `productId` (FK)

### Order Entity
- `id` (UUID, PK)
- `userId` (FK)
- `status` (pending, processing, shipped, delivered, cancelled, refunded)
- `paymentStatus` (pending, paid, failed, refunded)
- `subtotal`, `tax`, `shippingCost`, `discount`, `total`
- `paymentMethod`, `transactionId`
- `trackingNumber`
- `shippingAddressId`, `billingAddressId` (FK)

### OrderItem Entity
- `id` (UUID, PK)
- `orderId` (FK)
- `productId` (FK)
- `variantId` (FK, nullable)
- `userId` (FK, nullable)
- `quantity`, `price`, `discount`

### Cart Entity
- `id` (UUID, PK)
- `userId` (FK)
- `subtotal`, `tax`, `shippingCost`, `total`
- `couponCode`, `discount`

### CartItem Entity
- `id` (UUID, PK)
- `cartId` (FK)
- `productId` (FK)
- `variantId` (FK, nullable)
- `quantity`, `price`

### Review Entity
- `id` (UUID, PK)
- `productId` (FK)
- `userId` (FK)
- `rating` (1-5)
- `comment`, `images` (array)
- `isVerifiedPurchase`
- `helpfulCount`, `reviewerName`

### Wishlist Entity
- `id` (UUID, PK)
- `userId` (FK)
- `productId` (FK)

### Address Entity
- `id` (UUID, PK)
- `userId` (FK)
- `firstName`, `lastName`, `email`, `phone`
- `street`, `city`, `state`, `postalCode`, `country`
- `type` (billing, shipping)
- `isDefault`

## 🔄 Migrations

### Run Migrations

```bash
npm run db:migrate
```

This will:
1. Build TypeScript files
2. Create all database tables
3. Set up foreign keys
4. Create indexes

### Generate New Migration

If you make changes to entities:

```bash
npm run db:generate -- -n MigrationName
```

This will auto-generate a migration based on entity changes.

### Revert Migrations

To rollback the last migration:

```bash
npm run db:revert
```

## 🌱 Seeding Data

### Run Seeds

Populate the database with sample data:

```bash
npm run db:seed
```

This will create:
- 2 sample users (customer & admin)
- 4 sample product categories
- 4 sample products with images and reviews

### Seed Data Created

**Users:**
- `john@example.com` (password: password123) - Customer
- `admin@example.com` (password: password123) - Admin

**Categories:**
- Electronics
- Clothing
- Home & Garden
- Sports & Outdoors

**Products:**
- Wireless Headphones ($199.99)
- Cotton T-Shirt ($29.99)
- Desk Lamp ($49.99)
- Running Shoes ($129.99)

## 📊 Data Source Configuration

The database connection is configured in [src/database/data-source.ts](src/database/data-source.ts).

Key settings:
- **Type**: postgres
- **Synchronize**: false (use migrations instead)
- **Logging**: true in development, false in production
- **Entities**: All TypeORM entities from `src/database/entities/`
- **Migrations**: From `src/database/migrations/`

## 🔌 Connection String Formats

### Local PostgreSQL
```
postgresql://username:password@localhost:5432/ecommerce_db
```

### NeonDB (Recommended)
```
postgresql://user:password@ep-xxxx.us-east-1.neon.tech/ecommerce_db?sslmode=require
```

### Railway
```
postgresql://user:password@containers.railway.app:7816/railway
```

## 🧪 Testing Database Connection

```bash
npm run dev
```

The server will display:
```
✅ Database connection established
```

If connection fails, check:
1. ✓ DATABASE_URL is set correctly
2. ✓ Database server is running
3. ✓ PostgreSQL credentials are correct
4. ✓ Firewall allows connection

## 🔐 Security Best Practices

1. **Never commit `.env` file** - it contains sensitive credentials
2. **Use environment-specific secrets** - different creds for dev/prod
3. **Encrypt sensitive data** - use bcryptjs for passwords
4. **Validate input** - prevent SQL injection with TypeORM's parameterized queries
5. **Use HTTPS** - enable SSL/TLS in production
6. **Regular backups** - NeonDB provides automated backups

## 📈 Database Optimization Tips

1. **Indexes** - Created on frequently queried columns (userId, productId, status, createdAt)
2. **Pagination** - Always use pagination for list endpoints
3. **Connection pooling** - TypeORM manages this automatically
4. **Query optimization** - Use `.select()` and `.relations()` to limit data

## 🛠️ Common Tasks

### Check Database Size
```sql
SELECT pg_size_pretty(pg_database_size('ecommerce_db'));
```

### List All Tables
```sql
\dt
```

### View Table Schema
```sql
\d table_name
```

### Delete All Data (Development Only)
```bash
npm run db:revert
npm run db:migrate
```

## 📚 Resources

- [TypeORM Documentation](https://typeorm.io/)
- [NeonDB Documentation](https://neon.tech/docs/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [TypeORM Entity Relations](https://typeorm.io/#/relations)
- [TypeORM Migrations](https://typeorm.io/#/migrations)

## 🆘 Troubleshooting

### Connection Timeout
- Check your DATABASE_URL format
- Verify network connectivity to database server
- Check firewall rules for port access

### Table Already Exists
- Run `npm run db:revert` then `npm run db:migrate`
- Or manually drop tables: `DROP TABLE IF EXISTS table_name CASCADE;`

### Migration Not Running
- Ensure `npm run build` completes successfully
- Check migration files are in `src/database/migrations/`
- Verify database credentials are correct

### Data Loss
- Migrations are reversible with `npm run db:revert`
- Always test migrations in development first
- NeonDB provides point-in-time recovery

## 📞 Support

For issues, check:
1. Database logs in NeonDB console
2. Application logs in terminal
3. TypeORM GitHub issues
4. NeonDB support portal

---

**Database Setup Complete! 🎉**

Your e-commerce backend is now ready with a production-grade PostgreSQL database using TypeORM.
