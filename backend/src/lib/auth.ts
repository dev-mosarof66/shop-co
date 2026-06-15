import { betterAuth } from 'better-auth';
import { Pool } from 'pg';

export const db = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL || `http://localhost:${process.env.PORT || 5001}`,
  secret: process.env.BETTER_AUTH_SECRET,
  database: db,
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          const result = await db.query('SELECT COUNT(*) FROM "user"');
          const count = parseInt(result.rows[0].count, 10);
          if (count === 1) {
            await db.query(`UPDATE "user" SET role = 'vendor' WHERE id = $1`, [user.id]);
          }
        },
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  user: {
    additionalFields: {
      firstName: { type: 'string', required: false, input: true },
      lastName: { type: 'string', required: false, input: true },
      role: { type: 'string', required: false, defaultValue: 'customer', input: false },
      phone: { type: 'string', required: false, input: true },
    },
  },
  trustedOrigins: [
    process.env.CORS_ORIGIN || 'http://localhost:5173',
  ],
});

export type Auth = typeof auth;
