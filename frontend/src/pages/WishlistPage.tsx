import { Link } from 'react-router-dom';
import { ShoppingBag, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { CartButton } from '@/components/cart-button';
import { SearchButton } from '@/components/search-button';
import { CartDrawer } from '@/components/cart-drawer';
import { AuthModal } from '@/components/auth-modal';
import { ProductCard } from '@/components/product-card';
import { useWishlist } from '@/lib/wishlist';
import { useGetProductQuery, type ApiProduct } from '@/store/api';

const BADGE_LABELS: Record<string, string> = {
  bestSeller: 'Best Seller',
  new: 'New',
  sale: 'Sale',
};

function ProductSkeleton() {
  return (
    <div className="flex flex-col rounded-xl border border-border bg-card animate-pulse">
      <div className="h-44 rounded-t-xl bg-muted" />
      <div className="flex flex-col gap-2 p-4">
        <div className="h-4 w-3/4 rounded bg-muted" />
        <div className="h-3 w-full rounded bg-muted" />
        <div className="mt-2 flex justify-between">
          <div className="h-4 w-16 rounded bg-muted" />
          <div className="size-8 rounded bg-muted" />
        </div>
      </div>
    </div>
  );
}

function WishlistItem({ id }: { id: string }) {
  const { data: product, isLoading } = useGetProductQuery(id);
  if (isLoading) return <ProductSkeleton />;
  if (!product) return null;
  return (
    <ProductCard
      product={product as ApiProduct}
      badgeLabel={product.badge ? (BADGE_LABELS[product.badge] ?? null) : null}
    />
  );
}

export default function WishlistPage() {
  const { ids } = useWishlist();

  return (
    <div className="min-h-svh bg-background">
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2 font-semibold text-foreground">
            <ShoppingBag className="size-5" /> ShopCo
          </Link>
          <div className="flex items-center gap-2">
            <SearchButton />
            <ThemeToggle />
            <CartButton />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="mb-8 flex items-center gap-3">
          <Heart className="size-5 text-muted-foreground" />
          <div>
            <h1 className="text-2xl font-semibold">Wishlist</h1>
            {ids.length > 0 && (
              <p className="mt-0.5 text-sm text-muted-foreground">
                {ids.length} saved item{ids.length !== 1 ? 's' : ''}
              </p>
            )}
          </div>
        </div>

        {ids.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-28 text-center">
            <div className="flex size-16 items-center justify-center rounded-full border border-border bg-muted">
              <Heart className="size-7 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium">Your wishlist is empty</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Tap the heart icon on any product to save it here.
              </p>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link to="/products">Browse products</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {ids.map(id => <WishlistItem key={id} id={id} />)}
          </div>
        )}
      </main>

      <CartDrawer />
      <AuthModal />
    </div>
  );
}
