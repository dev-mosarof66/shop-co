import { ShoppingBag, Star, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { productIcons } from '@/components/icons';
import { useCart } from '@/lib/cart';
import { useWishlist } from '@/lib/wishlist';
import { type ApiProduct } from '@/store/api';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: ApiProduct;
  badgeLabel?: string | null;
}

export function ProductCard({ product, badgeLabel }: ProductCardProps) {
  const { addItem } = useCart();
  const { toggle, has } = useWishlist();
  const navigate = useNavigate();
  const Icon = productIcons[product.iconKey] ?? ShoppingBag;
  const isWishlisted = has(product.id);
  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      iconKey: product.iconKey,
    });
    toast.success(`${product.name} added to cart`);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggle(product.id);
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => navigate(`/products/${product.id}`)}
      onKeyDown={e => e.key === 'Enter' && navigate(`/products/${product.id}`)}
      className="group relative flex cursor-pointer flex-col rounded-xl border border-border bg-card transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      {badgeLabel && (
        <span className="absolute left-3 top-3 z-10 rounded-md border border-border bg-background px-2 py-0.5 text-xs font-medium">
          {badgeLabel}
        </span>
      )}
      <button
        onClick={handleWishlist}
        aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        className="absolute right-3 top-3 z-10 flex size-7 items-center justify-center rounded-full border border-border bg-background/90 backdrop-blur-sm transition-colors hover:border-foreground/30"
      >
        <Heart className={cn('size-3.5', isWishlisted ? 'fill-red-500 text-red-500' : 'text-muted-foreground')} />
      </button>
      <div className="flex h-44 items-center justify-center rounded-t-xl bg-muted">
        <Icon className="size-20 text-muted-foreground/50 transition-transform group-hover:scale-105" />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="line-clamp-2 text-sm font-medium leading-snug">{product.name}</p>
        <p className="line-clamp-2 text-xs text-muted-foreground">{product.description}</p>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={cn(
                  'size-3',
                  i < Math.floor(product.rating)
                    ? 'fill-foreground text-foreground'
                    : 'fill-muted text-muted-foreground',
                )}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">({product.reviews})</span>
        </div>
        <div className="mt-auto flex items-center justify-between pt-1">
          <div className="flex items-baseline gap-1.5">
            <span className="text-sm font-semibold">${product.price.toFixed(2)}</span>
            {product.originalPrice && (
              <span className="text-xs text-muted-foreground line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
            {discount && <span className="text-xs font-medium">−{discount}%</span>}
          </div>
          <Button
            size="icon-sm"
            variant="outline"
            aria-label="Add to cart"
            onClick={handleAddToCart}
          >
            <ShoppingBag />
          </Button>
        </div>
      </div>
    </div>
  );
}
