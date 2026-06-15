import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { useCart } from '@/lib/cart';
import { productIcons } from '@/components/icons';
import { useI18n } from '@/lib/i18n';
import { cn } from '@/lib/utils';

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, clearCart, subtotal } = useCart();
  const { t } = useI18n();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeCart(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, closeCart]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const totalItems = items.reduce((s, i) => s + i.quantity, 0);

  return (
    <>
      {/* Backdrop */}
      <div
        aria-hidden
        onClick={closeCart}
        className={cn(
          'fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300',
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
      />

      {/* Panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={t.cart.title}
        className={cn(
          'fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col bg-background shadow-xl transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-4 py-4">
          <div className="flex items-center gap-2">
            <Logo iconOnly />
            <h2 className="font-semibold">{t.cart.title}</h2>
            {totalItems > 0 && (
              <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium">
                {totalItems}
              </span>
            )}
          </div>
          <button
            onClick={closeCart}
            className="rounded-md p-1 text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Close cart"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Body */}
        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
            <div className="flex size-14 items-center justify-center rounded-full border border-border bg-muted">
              <ShoppingBag className="size-6 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium">{t.cart.empty}</p>
            <p className="text-xs text-muted-foreground">{t.cart.emptyDesc}</p>
            <Button variant="outline" size="sm" onClick={closeCart}>
              {t.cart.continueShopping}
            </Button>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-border overflow-y-auto">
              {items.map((item) => {
                const Icon = productIcons[item.iconKey];
                return (
                  <li key={item.id} className="flex gap-3 px-4 py-3">
                    <div className="flex size-16 shrink-0 items-center justify-center rounded-lg border border-border bg-muted">
                      {Icon
                        ? <Icon className="size-7 text-muted-foreground/60" />
                        : <ShoppingBag className="size-7 text-muted-foreground/60" />}
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col gap-1">
                      <p className="line-clamp-2 text-sm font-medium leading-snug">{item.name}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold">${item.price.toFixed(2)}</span>
                        {item.originalPrice && (
                          <span className="text-xs text-muted-foreground line-through">
                            ${item.originalPrice.toFixed(2)}
                          </span>
                        )}
                      </div>
                      <div className="mt-1 flex items-center gap-2">
                        <div className="inline-flex items-center rounded-md border border-border">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="flex size-7 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="size-3" />
                          </button>
                          <span className="w-7 select-none text-center text-sm">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="flex size-7 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
                            aria-label="Increase quantity"
                          >
                            <Plus className="size-3" />
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="ml-auto text-muted-foreground transition-colors hover:text-destructive"
                          aria-label="Remove item"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>

            {/* Footer */}
            <div className="space-y-4 border-t border-border p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{t.cart.subtotal}</span>
                <span className="text-sm font-semibold">${subtotal.toFixed(2)}</span>
              </div>
              <p className="text-xs text-muted-foreground">{t.cart.shippingNote}</p>
              <div className="flex flex-col gap-2">
                <Button
                  className="w-full"
                  onClick={() => { closeCart(); navigate('/checkout'); }}
                >
                  {t.cart.checkout} <ArrowRight className="ml-1 size-4" />
                </Button>
                <Button variant="outline" className="w-full" onClick={closeCart}>
                  {t.cart.continueShopping}
                </Button>
              </div>
              <button
                onClick={clearCart}
                className="w-full text-center text-xs text-muted-foreground transition-colors hover:text-destructive"
              >
                {t.cart.clearCart}
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
