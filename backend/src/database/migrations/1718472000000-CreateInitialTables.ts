import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class CreateInitialTables1718472000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create Users table
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, isGenerated: true, generationStrategy: 'uuid' },
          { name: 'firstName', type: 'varchar', length: '100' },
          { name: 'lastName', type: 'varchar', length: '100' },
          { name: 'email', type: 'varchar', length: '255', isUnique: true },
          { name: 'password', type: 'varchar', length: '255' },
          { name: 'phone', type: 'varchar', length: '20', isNullable: true },
          { name: 'avatar', type: 'text', isNullable: true },
          { name: 'role', type: 'enum', enum: ['customer', 'admin', 'vendor'], default: "'customer'" },
          { name: 'isEmailVerified', type: 'boolean', default: false },
          { name: 'resetPasswordToken', type: 'text', isNullable: true },
          { name: 'resetPasswordExpire', type: 'timestamp', isNullable: true },
          { name: 'createdAt', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
          { name: 'updatedAt', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
        ],
      }),
      true
    );

    // Create Categories table
    await queryRunner.createTable(
      new Table({
        name: 'categories',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, isGenerated: true, generationStrategy: 'uuid' },
          { name: 'name', type: 'varchar', length: '255' },
          { name: 'slug', type: 'varchar', length: '255', isUnique: true },
          { name: 'description', type: 'text', isNullable: true },
          { name: 'image', type: 'text', isNullable: true },
          { name: 'isActive', type: 'boolean', default: true },
          { name: 'createdAt', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
          { name: 'updatedAt', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
        ],
      }),
      true
    );

    // Create Products table
    await queryRunner.createTable(
      new Table({
        name: 'products',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, isGenerated: true, generationStrategy: 'uuid' },
          { name: 'name', type: 'varchar', length: '255' },
          { name: 'description', type: 'text' },
          { name: 'price', type: 'decimal', precision: 10, scale: 2 },
          { name: 'originalPrice', type: 'decimal', precision: 10, scale: 2, isNullable: true },
          { name: 'sku', type: 'varchar', length: '100', isUnique: true },
          { name: 'stock', type: 'integer', default: 0 },
          { name: 'lowStockThreshold', type: 'integer', default: 0 },
          { name: 'images', type: 'text', isNullable: true },
          { name: 'tags', type: 'text', isNullable: true },
          { name: 'rating', type: 'decimal', precision: 3, scale: 2, default: 0 },
          { name: 'reviewCount', type: 'integer', default: 0 },
          { name: 'isActive', type: 'boolean', default: true },
          { name: 'weight', type: 'varchar', length: '100', isNullable: true },
          { name: 'dimensions', type: 'varchar', length: '100', isNullable: true },
          { name: 'categoryId', type: 'uuid', isNullable: true },
          { name: 'createdAt', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
          { name: 'updatedAt', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
        ],
      }),
      true
    );

    // Add foreign key for Products -> Categories
    await queryRunner.createForeignKey(
      'products',
      new TableForeignKey({
        columnNames: ['categoryId'],
        referencedTableName: 'categories',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      })
    );

    // Create Product Variants table
    await queryRunner.createTable(
      new Table({
        name: 'product_variants',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, isGenerated: true, generationStrategy: 'uuid' },
          { name: 'name', type: 'varchar', length: '255' },
          { name: 'values', type: 'jsonb', isNullable: true },
          { name: 'price', type: 'decimal', precision: 10, scale: 2, isNullable: true },
          { name: 'stock', type: 'integer', isNullable: true },
          { name: 'images', type: 'text', isNullable: true },
          { name: 'sku', type: 'varchar', length: '100', isNullable: true },
          { name: 'productId', type: 'uuid' },
          { name: 'createdAt', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
          { name: 'updatedAt', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
        ],
      }),
      true
    );

    // Add foreign key for ProductVariants -> Products
    await queryRunner.createForeignKey(
      'product_variants',
      new TableForeignKey({
        columnNames: ['productId'],
        referencedTableName: 'products',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      })
    );

    // Create Addresses table
    await queryRunner.createTable(
      new Table({
        name: 'addresses',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, isGenerated: true, generationStrategy: 'uuid' },
          { name: 'userId', type: 'uuid' },
          { name: 'firstName', type: 'varchar', length: '100' },
          { name: 'lastName', type: 'varchar', length: '100' },
          { name: 'email', type: 'varchar', length: '255' },
          { name: 'phone', type: 'varchar', length: '20' },
          { name: 'street', type: 'varchar', length: '255' },
          { name: 'city', type: 'varchar', length: '100' },
          { name: 'state', type: 'varchar', length: '100' },
          { name: 'postalCode', type: 'varchar', length: '20' },
          { name: 'country', type: 'varchar', length: '100' },
          { name: 'type', type: 'enum', enum: ['billing', 'shipping'], default: "'shipping'" },
          { name: 'isDefault', type: 'boolean', default: false },
          { name: 'createdAt', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
          { name: 'updatedAt', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
        ],
      }),
      true
    );

    // Create Orders table
    await queryRunner.createTable(
      new Table({
        name: 'orders',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, isGenerated: true, generationStrategy: 'uuid' },
          { name: 'userId', type: 'uuid' },
          { name: 'status', type: 'enum', enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'], default: "'pending'" },
          { name: 'paymentStatus', type: 'enum', enum: ['pending', 'paid', 'failed', 'refunded'], default: "'pending'" },
          { name: 'subtotal', type: 'decimal', precision: 10, scale: 2 },
          { name: 'tax', type: 'decimal', precision: 10, scale: 2, default: 0 },
          { name: 'shippingCost', type: 'decimal', precision: 10, scale: 2, default: 0 },
          { name: 'discount', type: 'decimal', precision: 10, scale: 2, default: 0 },
          { name: 'total', type: 'decimal', precision: 10, scale: 2 },
          { name: 'paymentMethod', type: 'varchar', length: '100', isNullable: true },
          { name: 'transactionId', type: 'varchar', length: '100', isNullable: true },
          { name: 'notes', type: 'text', isNullable: true },
          { name: 'trackingNumber', type: 'varchar', length: '100', isNullable: true },
          { name: 'shippingAddressId', type: 'uuid', isNullable: true },
          { name: 'billingAddressId', type: 'uuid', isNullable: true },
          { name: 'createdAt', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
          { name: 'updatedAt', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
        ],
      }),
      true
    );

    // Create Order Items table
    await queryRunner.createTable(
      new Table({
        name: 'order_items',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, isGenerated: true, generationStrategy: 'uuid' },
          { name: 'orderId', type: 'uuid' },
          { name: 'productId', type: 'uuid' },
          { name: 'variantId', type: 'uuid', isNullable: true },
          { name: 'userId', type: 'uuid', isNullable: true },
          { name: 'quantity', type: 'integer' },
          { name: 'price', type: 'decimal', precision: 10, scale: 2 },
          { name: 'discount', type: 'decimal', precision: 10, scale: 2, default: 0 },
          { name: 'notes', type: 'text', isNullable: true },
          { name: 'createdAt', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
          { name: 'updatedAt', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
        ],
      }),
      true
    );

    // Add foreign keys for Order Items
    await queryRunner.createForeignKey(
      'order_items',
      new TableForeignKey({
        columnNames: ['orderId'],
        referencedTableName: 'orders',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      })
    );

    await queryRunner.createForeignKey(
      'order_items',
      new TableForeignKey({
        columnNames: ['productId'],
        referencedTableName: 'products',
        referencedColumnNames: ['id'],
        onDelete: 'RESTRICT',
      })
    );

    await queryRunner.createForeignKey(
      'order_items',
      new TableForeignKey({
        columnNames: ['userId'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      })
    );

    // Create Carts table
    await queryRunner.createTable(
      new Table({
        name: 'carts',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, isGenerated: true, generationStrategy: 'uuid' },
          { name: 'userId', type: 'uuid' },
          { name: 'subtotal', type: 'decimal', precision: 10, scale: 2, default: 0 },
          { name: 'tax', type: 'decimal', precision: 10, scale: 2, default: 0 },
          { name: 'shippingCost', type: 'decimal', precision: 10, scale: 2, default: 0 },
          { name: 'total', type: 'decimal', precision: 10, scale: 2, default: 0 },
          { name: 'couponCode', type: 'varchar', length: '100', isNullable: true },
          { name: 'discount', type: 'decimal', precision: 10, scale: 2, default: 0 },
          { name: 'createdAt', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
          { name: 'updatedAt', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
        ],
      }),
      true
    );

    // Create Cart Items table
    await queryRunner.createTable(
      new Table({
        name: 'cart_items',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, isGenerated: true, generationStrategy: 'uuid' },
          { name: 'cartId', type: 'uuid' },
          { name: 'productId', type: 'uuid' },
          { name: 'variantId', type: 'uuid', isNullable: true },
          { name: 'quantity', type: 'integer' },
          { name: 'price', type: 'decimal', precision: 10, scale: 2 },
          { name: 'createdAt', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
          { name: 'updatedAt', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
        ],
      }),
      true
    );

    // Add foreign keys for Cart Items
    await queryRunner.createForeignKey(
      'cart_items',
      new TableForeignKey({
        columnNames: ['cartId'],
        referencedTableName: 'carts',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      })
    );

    await queryRunner.createForeignKey(
      'cart_items',
      new TableForeignKey({
        columnNames: ['productId'],
        referencedTableName: 'products',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      })
    );

    // Create Reviews table
    await queryRunner.createTable(
      new Table({
        name: 'reviews',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, isGenerated: true, generationStrategy: 'uuid' },
          { name: 'productId', type: 'uuid' },
          { name: 'userId', type: 'uuid' },
          { name: 'rating', type: 'integer', default: 5 },
          { name: 'comment', type: 'text' },
          { name: 'images', type: 'text', isNullable: true },
          { name: 'isVerifiedPurchase', type: 'boolean', default: true },
          { name: 'helpfulCount', type: 'integer', default: 0 },
          { name: 'reviewerName', type: 'varchar', length: '100', isNullable: true },
          { name: 'createdAt', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
          { name: 'updatedAt', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
        ],
      }),
      true
    );

    // Add foreign keys for Reviews
    await queryRunner.createForeignKey(
      'reviews',
      new TableForeignKey({
        columnNames: ['productId'],
        referencedTableName: 'products',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      })
    );

    await queryRunner.createForeignKey(
      'reviews',
      new TableForeignKey({
        columnNames: ['userId'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      })
    );

    // Create Wishlists table
    await queryRunner.createTable(
      new Table({
        name: 'wishlists',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, isGenerated: true, generationStrategy: 'uuid' },
          { name: 'userId', type: 'uuid' },
          { name: 'productId', type: 'uuid' },
          { name: 'createdAt', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
        ],
      }),
      true
    );

    // Add foreign keys for Wishlists
    await queryRunner.createForeignKey(
      'wishlists',
      new TableForeignKey({
        columnNames: ['userId'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      })
    );

    await queryRunner.createForeignKey(
      'wishlists',
      new TableForeignKey({
        columnNames: ['productId'],
        referencedTableName: 'products',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      })
    );

    // Create indexes
    await queryRunner.createIndex('products', new TableIndex({ columnNames: ['categoryId', 'isActive'] }));
    await queryRunner.createIndex('products', new TableIndex({ columnNames: ['sku'], isUnique: true }));
    await queryRunner.createIndex('orders', new TableIndex({ columnNames: ['userId', 'status'] }));
    await queryRunner.createIndex('orders', new TableIndex({ columnNames: ['createdAt'] }));
    await queryRunner.createIndex('categories', new TableIndex({ columnNames: ['slug'], isUnique: true }));
    await queryRunner.createIndex('reviews', new TableIndex({ columnNames: ['productId', 'userId'], isUnique: true }));
    await queryRunner.createIndex('wishlists', new TableIndex({ columnNames: ['userId', 'productId'], isUnique: true }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop tables in reverse order due to foreign key constraints
    const tables = [
      'wishlists',
      'reviews',
      'cart_items',
      'carts',
      'order_items',
      'orders',
      'addresses',
      'product_variants',
      'products',
      'categories',
      'users',
    ];

    for (const table of tables) {
      await queryRunner.dropTable(table, true);
    }
  }
}
