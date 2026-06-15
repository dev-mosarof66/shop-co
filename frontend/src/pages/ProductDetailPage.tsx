import { useState, type FormEvent } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ChevronRight, ShoppingBag, Star, Check, Minus, Plus, ArrowLeft, Loader2, Heart } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { CartDrawer } from '@/components/cart-drawer';
import { AuthModal } from '@/components/auth-modal';
import { ProductCard } from '@/components/product-card';
import { PageNavbar } from '@/components/page-navbar';
import { productIcons } from '@/components/icons';
import { useCart } from '@/lib/cart';
import { useWishlist } from '@/lib/wishlist';
import { useReviews } from '@/lib/reviews';
import { useGetProductQuery, useGetRelatedProductsQuery } from '@/store/api';
import { cn } from '@/lib/utils';

const BADGE_LABELS: Record<string, string> = {
  bestSeller: 'Best Seller',
  new: 'New',
  sale: 'Sale',
};

const CATEGORY_LABELS: Record<string, string> = {
  electronics: 'Electronics',
  fashion: 'Fashion',
  home: 'Home',
  sports: 'Sports',
  books: 'Books',
  beauty: 'Beauty',
};

type Tab = 'description' | 'specs' | 'reviews';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { toggle, has } = useWishlist();
  const { reviews: userReviews, addReview } = useReviews(id ?? '');

  const { data: product, isLoading, isError } = useGetProductQuery(id!, { skip: !id });
  const { data: related = [] } = useGetRelatedProductsQuery(
    { categorySlug: product?.category ?? '', excludeId: id! },
    { skip: !product },
  );

  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState<Tab>('description');
  const [newRating, setNewRating] = useState(5);
  const [authorName, setAuthorName] = useState('');
  const [reviewComment, setReviewComment] = useState('');

  if (isLoading) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center gap-4">
        <p className="text-sm text-muted-foreground">{isError ? 'Failed to load product.' : 'Product not found.'}</p>
        <Button variant="outline" size="sm" onClick={() => navigate('/products')}>
          Back to products
        </Button>
      </div>
    );
  }

  const Icon = productIcons[product.iconKey] ?? ShoppingBag;
  const isWishlisted = has(product.id);
  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;
  const categoryLabel = CATEGORY_LABELS[product.category] ?? product.category;

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        iconKey: product.iconKey,
      });
    }
    toast.success(`${qty > 1 ? `${qty}× ` : ''}${product.name} added to cart`);
  };

  const handleAddReview = (e: FormEvent) => {
    e.preventDefault();
    addReview({ authorName, rating: newRating, comment: reviewComment });
    setAuthorName('');
    setReviewComment('');
    setNewRating(5);
    toast.success('Review submitted!');
  };

  return (
    <div className="min-h-svh bg-background">
      <PageNavbar />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-1 text-xs text-muted-foreground">
          <Link to="/" className="hover:text-foreground">Home</Link>
          <ChevronRight className="size-3" />
          <Link to="/products" className="hover:text-foreground">Products</Link>
          <ChevronRight className="size-3" />
          <Link to={`/products?category=${product.category}`} className="hover:text-foreground capitalize">
            {categoryLabel}
          </Link>
          <ChevronRight className="size-3" />
          <span className="truncate text-foreground">{product.name}</span>
        </nav>

        <button
          onClick={() => navigate(-1)}
          className="mb-4 flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground sm:hidden"
        >
          <ArrowLeft className="size-3.5" /> Back
        </button>

        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Image placeholder */}
          <div className="relative flex aspect-square items-center justify-center rounded-2xl border border-border bg-muted">
            {product.badge && (
              <span className="absolute left-4 top-4 rounded-md border border-border bg-background px-2 py-0.5 text-xs font-medium">
                {BADGE_LABELS[product.badge] ?? product.badge}
              </span>
            )}
            <button
              onClick={() => { toggle(product.id); toast.success(isWishlisted ? 'Removed from wishlist' : 'Saved to wishlist'); }}
              aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
              className="absolute right-4 top-4 flex size-9 items-center justify-center rounded-full border border-border bg-background/90 backdrop-blur-sm transition-colors hover:border-foreground/30"
            >
              <Heart className={cn('size-5', isWishlisted ? 'fill-red-500 text-red-500' : 'text-muted-foreground')} />
            </button>
            <Icon className="size-40 text-muted-foreground/40" />
          </div>

          {/* Info */}
          <div className="flex flex-col gap-5">
            <div>
              <p className="mb-1 text-xs font-medium uppercase tracking-widest text-muted-foreground">
                {categoryLabel}
              </p>
              <h1 className="text-2xl font-semibold leading-tight sm:text-3xl">{product.name}</h1>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      'size-4',
                      i < Math.floor(product.rating)
                        ? 'fill-foreground text-foreground'
                        : i < product.rating
                          ? 'fill-foreground/40 text-foreground/40'
                          : 'fill-muted text-muted-foreground',
                    )}
                  />
                ))}
              </div>
              <span className="text-sm font-medium">{product.rating}</span>
              <span className="text-sm text-muted-foreground">({product.reviews} reviews)</span>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold">${product.price.toFixed(2)}</span>
              {product.originalPrice && (
                <>
                  <span className="text-base text-muted-foreground line-through">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                  <span className="rounded bg-foreground px-1.5 py-0.5 text-xs font-semibold text-background">
                    -{discount}%
                  </span>
                </>
              )}
            </div>

            <p className="text-sm leading-relaxed text-muted-foreground">{product.description}</p>

            <ul className="flex flex-col gap-1.5">
              {product.features.slice(0, 4).map(f => (
                <li key={f} className="flex items-start gap-2 text-sm">
                  <Check className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                  {f}
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-3 pt-2">
              <div className="flex items-center rounded-md border border-border">
                <button
                  className="flex size-9 items-center justify-center rounded-l-md text-muted-foreground hover:text-foreground disabled:opacity-40"
                  onClick={() => setQty(q => Math.max(1, q - 1))}
                  disabled={qty === 1}
                  aria-label="Decrease quantity"
                >
                  <Minus className="size-3.5" />
                </button>
                <span className="w-9 text-center text-sm font-medium tabular-nums">{qty}</span>
                <button
                  className="flex size-9 items-center justify-center rounded-r-md text-muted-foreground hover:text-foreground disabled:opacity-40"
                  onClick={() => setQty(q => Math.min(99, q + 1))}
                  disabled={qty === 99}
                  aria-label="Increase quantity"
                >
                  <Plus className="size-3.5" />
                </button>
              </div>

              <Button className="flex-1 h-10" onClick={handleAddToCart}>
                <ShoppingBag className="size-4" />
                Add to cart
              </Button>
              <button
                onClick={() => { toggle(product.id); toast.success(isWishlisted ? 'Removed from wishlist' : 'Saved to wishlist'); }}
                aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                className="flex size-10 shrink-0 items-center justify-center rounded-md border border-border transition-colors hover:border-foreground/30"
              >
                <Heart className={cn('size-5', isWishlisted ? 'fill-red-500 text-red-500' : 'text-muted-foreground')} />
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-12">
          <div className="flex border-b border-border">
            {(['description', 'specs', 'reviews'] as Tab[]).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  'px-4 py-2.5 text-sm font-medium capitalize transition-colors',
                  activeTab === tab
                    ? 'border-b-2 border-foreground text-foreground'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {tab === 'reviews' ? `Reviews (${product.reviews + userReviews.length})` : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <div className="py-6">
            {activeTab === 'description' && (
              <div className="space-y-4">
                <p className="text-sm leading-relaxed text-muted-foreground">{product.description}</p>
                <ul className="grid gap-2 sm:grid-cols-2">
                  {product.features.map(f => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <Check className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {activeTab === 'specs' && (
              <div className="overflow-hidden rounded-lg border border-border">
                <table className="w-full text-sm">
                  <tbody>
                    {Object.entries(product.specs).map(([key, value], i) => (
                      <tr key={key} className={cn(i % 2 === 0 ? 'bg-muted/40' : '')}>
                        <td className="w-2/5 px-4 py-2.5 font-medium">{key}</td>
                        <td className="px-4 py-2.5 text-muted-foreground">{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-4">
                <div className="flex items-center gap-4 rounded-xl border border-border bg-muted/30 p-5">
                  <div className="text-center">
                    <p className="text-5xl font-bold">{product.rating}</p>
                    <div className="mt-1 flex items-center justify-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={cn('size-3.5', i < Math.floor(product.rating) ? 'fill-foreground text-foreground' : 'fill-muted text-muted-foreground')}
                        />
                      ))}
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{product.reviews} reviews</p>
                  </div>
                  <div className="flex-1 space-y-1.5">
                    {[5, 4, 3, 2, 1].map(star => {
                      const pct = star === 5 ? 65 : star === 4 ? 22 : star === 3 ? 8 : star === 2 ? 3 : 2;
                      return (
                        <div key={star} className="flex items-center gap-2">
                          <span className="w-2 text-xs text-muted-foreground">{star}</span>
                          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                            <div className="h-full rounded-full bg-foreground" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="w-6 text-right text-xs text-muted-foreground">{pct}%</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
                {userReviews.length > 0 && (
                  <div className="space-y-3">
                    {userReviews.map(r => (
                      <div key={r.id} className="rounded-lg border border-border p-4">
                        <div className="mb-2 flex items-center gap-2">
                          <div className="flex gap-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star key={i} className={cn('size-3.5', i < r.rating ? 'fill-foreground text-foreground' : 'fill-muted text-muted-foreground')} />
                            ))}
                          </div>
                          <span className="text-sm font-medium">{r.authorName}</span>
                          <span className="ml-auto text-xs text-muted-foreground">
                            {new Date(r.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{r.comment}</p>
                      </div>
                    ))}
                  </div>
                )}

                <div className="rounded-xl border border-border p-5">
                  <h3 className="mb-4 text-sm font-semibold">Write a review</h3>
                  <form onSubmit={handleAddReview} className="space-y-4">
                    <div>
                      <p className="mb-2 text-xs font-medium text-muted-foreground">Your rating</p>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map(n => (
                          <button key={n} type="button" onClick={() => setNewRating(n)} aria-label={`Rate ${n} star${n > 1 ? 's' : ''}`}>
                            <Star className={cn('size-7', n <= newRating ? 'fill-foreground text-foreground' : 'fill-muted text-muted-foreground')} />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label htmlFor="review-name" className="mb-1.5 block text-xs font-medium text-muted-foreground">Your name</label>
                      <input
                        id="review-name" required placeholder="Jane Smith"
                        value={authorName} onChange={e => setAuthorName(e.target.value)}
                        className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      />
                    </div>
                    <div>
                      <label htmlFor="review-comment" className="mb-1.5 block text-xs font-medium text-muted-foreground">Review</label>
                      <textarea
                        id="review-comment" required rows={3}
                        placeholder="Share your thoughts about this product…"
                        value={reviewComment} onChange={e => setReviewComment(e.target.value)}
                        className="w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      />
                    </div>
                    <Button type="submit" size="sm">Submit review</Button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>

        {related.length > 0 && (
          <div className="mt-10">
            <h2 className="mb-4 text-lg font-semibold">More in {categoryLabel}</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {related.map(p => (
                <ProductCard
                  key={p.id}
                  product={p}
                  badgeLabel={p.badge ? BADGE_LABELS[p.badge] : null}
                />
              ))}
            </div>
          </div>
        )}
      </main>

      <CartDrawer />
      <AuthModal />
    </div>
  );
}
