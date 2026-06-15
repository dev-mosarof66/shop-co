/**
 * Environment Configuration
 */

interface IConfig {
  port: number;
  nodeEnv: string;
  dbHost: string;
  dbPort: number;
  dbUser: string;
  dbPassword: string;
  dbName: string;
  jwtSecret: string;
  jwtExpire: string;
  corsOrigin: string;
}

const config: IConfig = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  dbHost: process.env.DB_HOST || 'localhost',
  dbPort: parseInt(process.env.DB_PORT || '5432', 10),
  dbUser: process.env.DB_USER || 'postgres',
  dbPassword: process.env.DB_PASSWORD || '',
  dbName: process.env.DB_NAME || 'ecommerce_db',
  jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret_key',
  jwtExpire: process.env.JWT_EXPIRE || '7d',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
};

export default config;
