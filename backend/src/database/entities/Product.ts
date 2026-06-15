import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne, JoinColumn, Index } from 'typeorm';
import { Category } from './Category';
import { ProductVariant } from './ProductVariant';
import { Review } from './Review';
import { Wishlist } from './Wishlist';
import { CartItem } from './CartItem';
import { OrderItem } from './OrderItem';

@Entity('products')
@Index(['category', 'isActive'])
@Index(['sku'], { unique: true })
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  originalPrice: number;

  @Column({ type: 'varchar', length: 100 })
  sku: string;

  @Column({ type: 'integer', default: 0 })
  stock: number;

  @Column({ type: 'integer', default: 0 })
  lowStockThreshold: number;

  @Column({ type: 'simple-array', nullable: true })
  images: string[];

  @Column({ type: 'simple-array', nullable: true })
  tags: string[];

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0 })
  rating: number;

  @Column({ type: 'integer', default: 0 })
  reviewCount: number;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'boolean', default: false })
  isFeatured: boolean;

  @Column({ type: 'varchar', length: 20, nullable: true })
  badge: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  iconKey: string;

  @Column({ type: 'jsonb', nullable: true })
  features: string[];

  @Column({ type: 'jsonb', nullable: true })
  specs: Record<string, string>;

  @Column({ type: 'varchar', length: 100, nullable: true })
  weight: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  dimensions: string;

  @ManyToOne(() => Category, (category) => category.products, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @Column({ type: 'uuid', nullable: true })
  categoryId: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  sellerId: string;

  @OneToMany(() => ProductVariant, (variant) => variant.product, { cascade: true })
  variants: ProductVariant[];

  @OneToMany(() => Review, (review) => review.product, { cascade: true })
  reviews: Review[];

  @OneToMany(() => Wishlist, (wishlist) => wishlist.product, { cascade: true })
  wishlists: Wishlist[];

  @OneToMany(() => CartItem, (cartItem) => cartItem.product, { cascade: true })
  cartItems: CartItem[];

  @OneToMany(() => OrderItem, (orderItem) => orderItem.product, { cascade: true })
  orderItems: OrderItem[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
