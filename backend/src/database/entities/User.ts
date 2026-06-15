import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { OrderItem } from './OrderItem';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  firstName: string;

  @Column({ type: 'varchar', length: 100 })
  lastName: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone: string;

  @Column({ type: 'text', nullable: true })
  avatar: string;

  @Column({ type: 'enum', enum: ['customer', 'admin', 'vendor'], default: 'customer' })
  role: 'customer' | 'admin' | 'vendor';

  @Column({ type: 'boolean', default: false })
  isEmailVerified: boolean;

  @Column({ type: 'text', nullable: true })
  resetPasswordToken: string;

  @Column({ type: 'timestamp', nullable: true })
  resetPasswordExpire: Date;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.user, { cascade: true })
  orders: OrderItem[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
