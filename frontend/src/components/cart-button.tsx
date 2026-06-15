import { ShoppingBag } from 'lucide-react';
import { useCart } from '@/lib/cart';

export function CartButton() {
  const { itemCount, openCart } = useCart();
  return (
    <button
      onClick={openCart}
      aria-label={`Cart (${itemCount} items)`}
      className="relative rounded-md p-1.5 text-muted-foreground hover:text-foreground"
    >
      <ShoppingBag className="size-5" />
      {itemCount > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-foreground text-[10px] font-bold text-background">
          {itemCount > 9 ? '9+' : itemCount}
        </span>
      )}
    </button>
  );
}
