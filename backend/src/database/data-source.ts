import 'reflect-metadata';
import { DataSource } from 'typeorm';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Import entities
import { User } from './entities/User';
import { Product } from './entities/Product';
import { Category } from './entities/Category';
import { ProductVariant } from './entities/ProductVariant';
import { Order } from './entities/Order';
import { OrderItem } from './entities/OrderItem';
import { Cart } from './entities/Cart';
import { CartItem } from './entities/CartItem';
import { Review } from './entities/Review';
import { Wishlist } from './entities/Wishlist';
import { Address } from './entities/Address';

const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL || 
    `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
  synchronize: process.env.NODE_ENV === 'development',
  logging: process.env.NODE_ENV === 'development',
  entities: [User, Product, Category, ProductVariant, Order, OrderItem, Cart, CartItem, Review, Wishlist, Address],
  migrations: [__dirname + '/migrations/*.js'],
  subscribers: [],
});

export default AppDataSource;
