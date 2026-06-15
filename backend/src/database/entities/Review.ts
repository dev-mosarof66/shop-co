import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { Product } from './Product';
import { User } from './User';

@Entity('reviews')
@Index(['productId', 'userId'], { unique: true })
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  productId: string;

  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'integer', default: 5 })
  rating: number;

  @Column({ type: 'text' })
  comment: string;

  @Column({ type: 'simple-array', nullable: true })
  images: string[];

  @Column({ type: 'boolean', default: true })
  isVerifiedPurchase: boolean;

  @Column({ type: 'integer', default: 0 })
  helpfulCount: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  reviewerName: string;

  @ManyToOne(() => Product, (product) => product.reviews, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'productId' })
  product: Product;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
