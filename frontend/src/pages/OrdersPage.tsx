import { Link } from 'react-router-dom';
import { ShoppingBag, Package, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { CartButton } from '@/components/cart-button';
import { SearchButton } from '@/components/search-button';
import { CartDrawer } from '@/components/cart-drawer';
import { productIcons } from '@/components/icons';
import { useOrders, type OrderStatus } from '@/lib/orders';
import { cn } from '@/lib/utils';

const STATUS_CONFIG: Record<OrderStatus, { label: string; className: string }> = {
  processing: { label: 'Processing',  className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' },
  shipped:    { label: 'Shipped',     className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
  delivered:  { label: 'Delivered',   className: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    year: 'numeric', month: 'short', day: 'numeric',
  });
}

export default function OrdersPage() {
  const { orders } = useOrders();

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

      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <div className="mb-8 flex items-center gap-3">
          <Package className="size-5 text-muted-foreground" />
          <div>
            <h1 className="text-2xl font-semibold">Order history</h1>
            {orders.length > 0 && (
              <p className="mt-0.5 text-sm text-muted-foreground">
                {orders.length} order{orders.length !== 1 ? 's' : ''}
              </p>
            )}
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-28 text-center">
            <div className="flex size-16 items-center justify-center rounded-full border border-border bg-muted">
              <Package className="size-7 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium">No orders yet</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Your orders will appear here after checkout.
              </p>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link to="/products">Start shopping</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => {
              const cfg = STATUS_CONFIG[order.status];
              return (
                <div
                  key={order.id}
                  className="overflow-hidden rounded-xl border border-border bg-card"
                >
                  {/* Order header */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-muted/30 px-4 py-3">
                    <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                      <span>
                        <span className="font-medium text-foreground">Order</span>{' '}
                        <span className="font-mono">{order.id}</span>
                      </span>
                      <span>{formatDate(order.date)}</span>
                    </div>
                    <span className={cn('rounded-full px-2.5 py-0.5 text-xs font-medium', cfg.className)}>
                      {cfg.label}
                    </span>
                  </div>

                  {/* Items */}
                  <ul className="divide-y divide-border">
                    {order.items.map(item => {
                      const Icon = productIcons[item.iconKey] ?? ShoppingBag;
                      return (
                        <li key={item.id} className="flex items-center gap-3 px-4 py-3">
                          <div className="flex size-11 shrink-0 items-center justify-center rounded-md border border-border bg-muted">
                            <Icon className="size-5 text-muted-foreground/60" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <Link
                              to={`/products/${item.id}`}
                              className="truncate text-sm font-medium hover:underline"
                            >
                              {item.name}
                            </Link>
                            <p className="text-xs text-muted-foreground">Qty {item.quantity}</p>
                          </div>
                          <span className="shrink-0 text-sm font-medium">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </li>
                      );
                    })}
                  </ul>

                  {/* Footer */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border px-4 py-3">
                    <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                      <span>Subtotal <span className="font-medium text-foreground">${order.subtotal.toFixed(2)}</span></span>
                      <span>Shipping <span className="font-medium text-foreground">{order.shipping === 0 ? 'Free' : `$${order.shipping.toFixed(2)}`}</span></span>
                      <span>Tax <span className="font-medium text-foreground">${order.tax.toFixed(2)}</span></span>
                    </div>
                    <span className="text-sm font-semibold">
                      Total ${order.total.toFixed(2)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-8">
          <Link
            to="/products"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            Continue shopping <ChevronRight className="size-4" />
          </Link>
        </div>
      </main>

      <CartDrawer />
    </div>
  );
}
