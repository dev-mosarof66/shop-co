import { useState, type FormEvent } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { ShoppingBag, ArrowLeft, CreditCard, Lock, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ThemeToggle } from '@/components/theme-toggle';
import { CartButton } from '@/components/cart-button';
import { CartDrawer } from '@/components/cart-drawer';
import { productIcons } from '@/components/icons';
import { useCart } from '@/lib/cart';
import { useOrders } from '@/lib/orders';
import { cn } from '@/lib/utils';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const COUNTRIES = [
  'United States', 'United Kingdom', 'Canada', 'Australia',
  'Germany', 'France', 'India', 'Bangladesh', 'Spain', 'Brazil', 'Japan', 'Other',
];

function genOrderId() {
  return 'ORD-' + Math.random().toString(36).slice(2, 8).toUpperCase();
}

// ─── Order summary ─────────────────────────────────────────────────────────────

function OrderSummary({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  const { items, subtotal } = useCart();
  const shipping = subtotal >= 50 ? 0 : 4.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  return (
    <aside className="lg:border-l lg:border-border">
      {/* Mobile toggle header */}
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between border-b border-border bg-muted/40 px-4 py-3 text-sm font-medium lg:hidden"
      >
        <span className="flex items-center gap-2">
          <ShoppingBag className="size-4" />
          {collapsed ? 'Show order summary' : 'Hide order summary'}
        </span>
        <span className="flex items-center gap-2">
          <span className="font-semibold">${total.toFixed(2)}</span>
          {collapsed ? <ChevronDown className="size-4" /> : <ChevronUp className="size-4" />}
        </span>
      </button>

      <div className={cn('lg:block', collapsed ? 'hidden' : 'block')}>
        <div className="px-4 py-6 lg:px-8">
          <h2 className="mb-4 hidden text-base font-semibold lg:block">Order summary</h2>

          {/* Items */}
          <ul className="divide-y divide-border">
            {items.map(item => {
              const Icon = productIcons[item.iconKey] ?? ShoppingBag;
              return (
                <li key={item.id} className="flex items-center gap-3 py-3">
                  <div className="relative flex size-14 shrink-0 items-center justify-center rounded-lg border border-border bg-muted">
                    <Icon className="size-6 text-muted-foreground/60" />
                    <span className="absolute -right-2 -top-2 flex size-5 items-center justify-center rounded-full bg-muted-foreground text-[10px] font-bold text-background">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <p className="truncate text-sm font-medium">{item.name}</p>
                    {item.originalPrice && (
                      <p className="text-xs text-muted-foreground line-through">${item.originalPrice.toFixed(2)}</p>
                    )}
                  </div>
                  <span className="shrink-0 text-sm font-medium">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </li>
              );
            })}
          </ul>

          {/* Totals */}
          <div className="mt-4 space-y-2 border-t border-border pt-4 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping</span>
              <span>{shipping === 0 ? <span className="text-green-600 dark:text-green-400">Free</span> : `$${shipping.toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tax (8%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between border-t border-border pt-2 text-base font-semibold">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          {subtotal < 50 && (
            <p className="mt-3 text-xs text-muted-foreground">
              Add <span className="font-medium">${(50 - subtotal).toFixed(2)}</span> more to get free shipping.
            </p>
          )}
        </div>
      </div>
    </aside>
  );
}

// ─── Success view ──────────────────────────────────────────────────────────────

function SuccessView({ orderId }: { orderId: string }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4 py-16 text-center">
      <div className="flex size-16 items-center justify-center rounded-full border-2 border-foreground bg-foreground/5">
        <Check className="size-8 text-foreground" />
      </div>
      <div>
        <h1 className="mb-1 text-2xl font-semibold">Order placed!</h1>
        <p className="text-sm text-muted-foreground">
          Thank you for your order. We'll send a confirmation email shortly.
        </p>
      </div>
      <div className="rounded-lg border border-border bg-muted/30 px-6 py-3 text-sm">
        <span className="text-muted-foreground">Order ID: </span>
        <span className="font-mono font-medium">{orderId}</span>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button asChild>
          <Link to="/orders">View my orders</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link to="/products">Continue shopping</Link>
        </Button>
      </div>
    </div>
  );
}

// ─── Section heading ───────────────────────────────────────────────────────────

function SectionHeading({ step, title }: { step: number; title: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <span className="flex size-6 items-center justify-center rounded-full border border-border bg-muted text-xs font-semibold">
        {step}
      </span>
      <h2 className="text-sm font-semibold uppercase tracking-wide">{title}</h2>
    </div>
  );
}

// ─── Checkout form ─────────────────────────────────────────────────────────────

function CheckoutForm({ onSuccess }: { onSuccess: (orderId: string, address: string) => void }) {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    email: '',
    firstName: '', lastName: '',
    address: '', address2: '',
    city: '', state: '', zip: '', country: 'United States',
    cardNumber: '', nameOnCard: '', expiry: '', cvv: '',
  });

  const set = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success('Order placed successfully!');
      const address = [
        `${form.firstName} ${form.lastName}`,
        form.address,
        form.address2,
        `${form.city}, ${form.state} ${form.zip}`,
        form.country,
      ].filter(Boolean).join(', ');
      onSuccess(genOrderId(), address);
    }, 1400);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 px-4 py-8 lg:px-8">
      {/* Contact */}
      <section>
        <SectionHeading step={1} title="Contact" />
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email" type="email" required autoComplete="email"
              placeholder="you@example.com"
              value={form.email} onChange={set('email')}
            />
          </div>
        </div>
      </section>

      {/* Delivery */}
      <section>
        <SectionHeading step={2} title="Delivery" />
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="firstName">First name</Label>
              <Input
                id="firstName" required autoComplete="given-name"
                placeholder="Jane"
                value={form.firstName} onChange={set('firstName')}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="lastName">Last name</Label>
              <Input
                id="lastName" required autoComplete="family-name"
                placeholder="Smith"
                value={form.lastName} onChange={set('lastName')}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address" required autoComplete="address-line1"
              placeholder="123 Main Street"
              value={form.address} onChange={set('address')}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="address2">
              Apartment, suite, etc. <span className="text-muted-foreground">(optional)</span>
            </Label>
            <Input
              id="address2" autoComplete="address-line2"
              placeholder="Apt 4B"
              value={form.address2} onChange={set('address2')}
            />
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div className="space-y-1.5 sm:col-span-1">
              <Label htmlFor="city">City</Label>
              <Input
                id="city" required autoComplete="address-level2"
                placeholder="New York"
                value={form.city} onChange={set('city')}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="state">State / Region</Label>
              <Input
                id="state" required autoComplete="address-level1"
                placeholder="NY"
                value={form.state} onChange={set('state')}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="zip">ZIP / Postal</Label>
              <Input
                id="zip" required autoComplete="postal-code"
                placeholder="10001"
                value={form.zip} onChange={set('zip')}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="country">Country</Label>
            <select
              id="country" required autoComplete="country-name"
              value={form.country} onChange={set('country')}
              className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
      </section>

      {/* Payment */}
      <section>
        <SectionHeading step={3} title="Payment" />
        <div className="space-y-3">
          <div className="flex items-center gap-2 rounded-md border border-border bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
            <Lock className="size-3.5 shrink-0" />
            All transactions are encrypted and secure. This is a demo — no real charges.
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="cardNumber">Card number</Label>
            <div className="relative">
              <Input
                id="cardNumber" required
                placeholder="1234 5678 9012 3456"
                maxLength={19}
                value={form.cardNumber}
                onChange={e => {
                  const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
                  const fmt = raw.replace(/(.{4})/g, '$1 ').trim();
                  setForm(prev => ({ ...prev, cardNumber: fmt }));
                }}
                className="pr-10"
              />
              <CreditCard className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="nameOnCard">Name on card</Label>
            <Input
              id="nameOnCard" required autoComplete="cc-name"
              placeholder="Jane Smith"
              value={form.nameOnCard} onChange={set('nameOnCard')}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="expiry">Expiry date</Label>
              <Input
                id="expiry" required placeholder="MM / YY"
                maxLength={7}
                value={form.expiry}
                onChange={e => {
                  const raw = e.target.value.replace(/\D/g, '').slice(0, 4);
                  const fmt = raw.length > 2 ? `${raw.slice(0, 2)} / ${raw.slice(2)}` : raw;
                  setForm(prev => ({ ...prev, expiry: fmt }));
                }}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="cvv">CVV</Label>
              <Input
                id="cvv" required placeholder="123" maxLength={4}
                value={form.cvv}
                onChange={e => setForm(prev => ({ ...prev, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) }))}
              />
            </div>
          </div>
        </div>
      </section>

      <Button type="submit" className="w-full" size="lg" disabled={loading}>
        {loading ? 'Placing order…' : 'Place order'}
      </Button>
    </form>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function CheckoutPage() {
  const { items, clearCart, subtotal } = useCart();
  const { addOrder } = useOrders();
  const [orderId, setOrderId] = useState<string | null>(null);
  const [summaryCollapsed, setSummaryCollapsed] = useState(true);

  if (items.length === 0 && !orderId) {
    return <Navigate to="/products" replace />;
  }

  const handleSuccess = (id: string, shippingAddress: string) => {
    const shipping = subtotal >= 50 ? 0 : 4.99;
    const tax = subtotal * 0.08;
    addOrder({
      id,
      items,
      subtotal,
      shipping,
      tax,
      total: subtotal + shipping + tax,
      date: new Date().toISOString(),
      shippingAddress,
    });
    clearCart();
    setOrderId(id);
  };

  return (
    <div className="min-h-svh bg-background">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2 font-semibold text-foreground">
            <ShoppingBag className="size-5" /> ShopCo
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <CartButton />
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl">
        {orderId ? (
          <SuccessView orderId={orderId} />
        ) : (
          <>
            {/* Back link + page title */}
            <div className="flex items-center gap-3 border-b border-border px-4 py-4 sm:px-6 lg:px-8">
              <Link
                to="/products"
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="size-3.5" /> Back to shopping
              </Link>
              <span className="text-muted-foreground/40">|</span>
              <h1 className="text-sm font-semibold">Checkout</h1>
            </div>

            {/* Mobile order summary toggle + Desktop two-column layout */}
            <div className="lg:grid lg:grid-cols-[1fr_380px]">
              {/* Mobile: summary on top (collapsible) */}
              <div className="lg:hidden">
                <OrderSummary
                  collapsed={summaryCollapsed}
                  onToggle={() => setSummaryCollapsed(c => !c)}
                />
              </div>

              {/* Form */}
              <CheckoutForm onSuccess={handleSuccess} />

              {/* Desktop: summary sidebar */}
              <div className="hidden lg:block">
                <OrderSummary collapsed={false} onToggle={() => {}} />
              </div>
            </div>
          </>
        )}
      </div>

      <CartDrawer />
    </div>
  );
}
