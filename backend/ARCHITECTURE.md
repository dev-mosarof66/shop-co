# Database Architecture Diagram

## 📊 Entity Relationship Diagram (ERD)

```
┌────────────────────────────────────────────────────────────────────┐
│                  E-COMMERCE DATABASE SCHEMA                        │
│                   (11 Tables, TypeORM + PostgreSQL)                │
└────────────────────────────────────────────────────────────────────┘


                          ╔═══════════════╗
                          ║     USERS     ║
                          ║───────────────║
                          ║ • id (UUID)   ║
                          ║ • email*      ║
                          ║ • firstName   ║
                          ║ • lastName    ║
                          ║ • password    ║
                          ║ • role        ║ (customer/admin/vendor)
                          ║ • phone       ║
                          ║ • avatar      ║
                          ║ • isEmailVerif║
                          ╚═══════════════╝
                                  │
                    ┌─────────────┼─────────────┐
                    │             │             │
          ╔════════════════╗  ╔════════════╗  ╔════════════════╗
          ║  ADDRESSES    ║  ║   CARTS    ║  ║    REVIEWS     ║
          ║───────────────║  ║────────────║  ║────────────────║
          ║ • id (UUID)   ║  ║ • id       ║  ║ • id (UUID)    ║
          ║ • userId*     ║  ║ • userId*  ║  ║ • productId*   ║
          ║ • firstName   ║  ║ • subtotal ║  ║ • userId*      ║
          ║ • lastName    ║  ║ • tax      ║  ║ • rating (1-5) ║
          ║ • email       ║  ║ • shipping ║  ║ • comment      ║
          ║ • street      ║  ║ • total    ║  ║ • images       ║
          ║ • city        ║  ║ • discount ║  ║ • isVerified   ║
          ║ • state       ║  ║ • coupon   ║  ║ • helpfulCount ║
          ║ • postalCode  ║  ║ • createdAt║  ║ • createdAt    ║
          ║ • country     ║  ║ • updatedAt║  ╚════════════════╝
          ║ • type        ║  ╚════════════╝         │
          ║ • isDefault   ║         │               │
          ║ • createdAt   ║         │ 1:N           │ N:1
          ║ • updatedAt   ║         │               │
          ╚════════════════╝  ╔═════════════════╗   │
                  │           ║  CART_ITEMS    ║   │
                  │           ║──────────────────║   │
                  │           ║ • id (UUID)    ║   │
                  │           ║ • cartId*      ║   │
                  │           ║ • productId*   ║   │
                  │           ║ • variantId*   ║   │
                  │           ║ • quantity     ║   │
                  │           ║ • price        ║   │
                  │           ║ • createdAt    ║   │
                  │           ║ • updatedAt    ║   │
                  │           ╚═════════════════╝   │
                  │                   │             │
                  │                   └─────────────┤
                  │                                 │
                  │         ╔═══════════════════╗  │
                  │         ║    PRODUCTS       ║◄─┘
                  │         ║───────────────────║
                  │         ║ • id (UUID)       ║
                  │         ║ • name*           ║
                  │         ║ • description    ║
                  │         ║ • price*          ║
                  │         ║ • originalPrice   ║
                  │         ║ • sku* (unique)   ║
                  │         ║ • stock           ║
                  │         ║ • lowStockThresh  ║
                  │         ║ • images[]        ║
                  │         ║ • tags[]          ║
                  │         ║ • rating          ║
                  │         ║ • reviewCount     ║
                  │         ║ • isActive        ║
                  │         ║ • weight          ║
                  │         ║ • dimensions      ║
                  │         ║ • categoryId*     ║
                  │         ║ • createdAt       ║
                  │         ║ • updatedAt       ║
                  │         ╚═══════════════════╝
                  │                   │
                  │         ┌─────────┼─────────┐
                  │         │         │         │
        ╔══════════════════╗ │ ╔══════════════╗ │ ╔═══════════════╗
        ║   CATEGORIES     ║ │ ║   VARIANTS   ║ │ ║   WISHLISTS   ║
        ║──────────────────║ │ ║──────────────║ │ ║───────────────║
        ║ • id (UUID)      ║ │ ║ • id (UUID)  ║ │ ║ • id (UUID)   ║
        ║ • name*          ║◄─┤ ║ • name       ║ │ ║ • userId*     ║
        ║ • slug* (unique) ║   ║ • values     ║ │ ║ • productId*  ║
        ║ • description    ║   ║ • price      ║ │ ║ • createdAt   ║
        ║ • image          ║   ║ • stock      ║ │ ╚═══════════════╝
        ║ • isActive       ║   ║ • images     ║ │
        ║ • createdAt      ║   ║ • sku        ║ │
        ║ • updatedAt      ║   ║ • productId* ◄─┤
        ╚══════════════════╝   ║ • createdAt  ║
                               ║ • updatedAt  ║
                               ╚══════════════╝


                        ╔═════════════════════╗
                        ║      ORDERS         ║
                        ║─────────────────────║
                        ║ • id (UUID)         ║
                        ║ • userId*           ║
                        ║ • status*           ║ (pending/processing/shipped/delivered/cancelled/refunded)
                        ║ • paymentStatus*    ║ (pending/paid/failed/refunded)
                        ║ • subtotal          ║
                        ║ • tax               ║
                        ║ • shippingCost      ║
                        ║ • discount          ║
                        ║ • total*            ║
                        ║ • paymentMethod     ║
                        ║ • transactionId     ║
                        ║ • notes             ║
                        ║ • trackingNumber    ║
                        ║ • shippingAddressId*║
                        ║ • billingAddressId* ║
                        ║ • createdAt         ║
                        ║ • updatedAt         ║
                        ╚═════════════════════╝
                                  │
                                  │ 1:N
                                  │
                        ╔═════════════════════╗
                        ║    ORDER_ITEMS      ║
                        ║─────────────────────║
                        ║ • id (UUID)         ║
                        ║ • orderId*          ║
                        ║ • productId*        ║
                        ║ • variantId*        ║
                        ║ • userId*           ║
                        ║ • quantity*         ║
                        ║ • price*            ║
                        ║ • discount          ║
                        ║ • notes             ║
                        ║ • createdAt         ║
                        ║ • updatedAt         ║
                        ╚═════════════════════╝


Key Indicators:
  * = Required field
  [] = Array type
  PK = Primary Key (UUID)
  FK = Foreign Key
  1:N = One-to-Many relationship
  N:1 = Many-to-One relationship
```

## 🔗 Relationships Map

```
USERS (1) ──────┬─────── (N) ADDRESSES
                ├─────── (N) ORDERS → ORDER_ITEMS → PRODUCTS
                ├─────── (N) REVIEWS → PRODUCTS
                ├─────── (N) WISHLISTS → PRODUCTS
                └─────── (N) CARTS → CART_ITEMS → PRODUCTS

PRODUCTS (1) ───┬─────── (N) PRODUCT_VARIANTS
                ├─────── (N) REVIEWS
                ├─────── (N) WISHLISTS
                ├─────── (N) CART_ITEMS
                ├─────── (N) ORDER_ITEMS
                └─────── (1) CATEGORY

CATEGORIES (1) ─────── (N) PRODUCTS

ORDERS (1) ─────────── (N) ORDER_ITEMS
           ├─────────── (1) SHIPPING_ADDRESS
           └─────────── (1) BILLING_ADDRESS

CARTS (1) ──────────── (N) CART_ITEMS
```

## 📈 Data Flow Diagram

```
┌─────────┐
│  USER   │
└────┬────┘
     │
     ├─ Browses Products (SELECT)
     ├─ Adds to Cart (CREATE CART_ITEM)
     ├─ Applies Coupon (UPDATE CART)
     ├─ Saves to Wishlist (CREATE WISHLIST)
     ├─ Reads Reviews (SELECT REVIEW)
     ├─ Writes Review (CREATE REVIEW)
     └─ Checkout (CREATE ORDER, ORDER_ITEMS)
           │
           ├─ Payment Processing
           │   └─ UPDATE ORDER (paymentStatus)
           │
           └─ Shipping
               ├─ UPDATE ORDER (status)
               ├─ UPDATE ORDER (trackingNumber)
               └─ DELETE CART_ITEMS
```

## 🔐 Cascade Rules

```
DELETE USER
  ├─ CASCADE → Delete ADDRESSES
  ├─ CASCADE → Delete ORDERS
  │            └─ CASCADE → Delete ORDER_ITEMS
  ├─ CASCADE → Delete REVIEWS
  ├─ CASCADE → Delete WISHLISTS
  └─ CASCADE → Delete CARTS
               └─ CASCADE → Delete CART_ITEMS

DELETE PRODUCT
  ├─ CASCADE → Delete PRODUCT_VARIANTS
  ├─ CASCADE → Delete REVIEWS
  ├─ CASCADE → Delete WISHLISTS
  ├─ CASCADE → Delete CART_ITEMS
  ├─ RESTRICT → Prevent delete if ORDER_ITEMS exist
  └─ Product kept in ORDER_ITEMS for order history

DELETE CATEGORY
  └─ CASCADE → Delete PRODUCTS
               └─ Cascades as above

DELETE CART
  └─ CASCADE → Delete CART_ITEMS

DELETE CART_ITEM
  └─ VARIANT → SET NULL (if variant deleted)
```

## 📊 Index Strategy

```
Indexes for Performance:

1. PRIMARY KEYS (UUID)
   - users.id
   - products.id
   - orders.id
   - etc.

2. UNIQUE CONSTRAINTS
   - users.email
   - products.sku
   - categories.slug
   - reviews (productId, userId)
   - wishlists (userId, productId)
   - cart_items (cartId, productId)

3. FOREIGN KEYS
   - products.categoryId
   - orders.userId
   - order_items.orderId
   - reviews.productId
   - etc.

4. COMPOSITE INDEXES
   - orders (userId, status)
   - products (categoryId, isActive)
   - orders (createdAt) [for sorting]

Total: 15+ Indexes for optimal query performance
```

---

**This architecture supports:**
- ✅ Scalability to millions of products & orders
- ✅ Complex queries with efficient joins
- ✅ Data integrity via constraints
- ✅ Fast searches via indexes
- ✅ Clean data on cascades
- ✅ Full audit trail with timestamps
