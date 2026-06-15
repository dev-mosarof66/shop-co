import { useState, type FormEvent } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { ShoppingBag, Package, Heart, LogOut, Pencil, Check, X, Store, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ThemeToggle } from '@/components/theme-toggle';
import { CartButton } from '@/components/cart-button';
import { SearchButton } from '@/components/search-button';
import { CartDrawer } from '@/components/cart-drawer';
import { authClient, useSession, signOut } from '@/lib/auth-client';
import { useOrders } from '@/lib/orders';
import { useWishlist } from '@/lib/wishlist';

function Avatar({ name, email }: { name?: string | null; email?: string }) {
  const initials = name
    ? name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : email?.[0]?.toUpperCase() ?? 'U';
  return (
    <div className="flex size-16 items-center justify-center rounded-full border-2 border-border bg-muted text-xl font-semibold">
      {initials}
    </div>
  );
}

export default function ProfilePage() {
  const { data: session, isPending } = useSession();
  const { orders } = useOrders();
  const { count: wishlistCount } = useWishlist();

  const [editing, setEditing] = useState(false);
  const [nameValue, setNameValue] = useState('');
  const [saving, setSaving] = useState(false);

  if (isPending) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <span className="text-sm text-muted-foreground">Loading…</span>
      </div>
    );
  }

  if (!session) return <Navigate to="/" replace />;

  const user = session.user;

  const startEdit = () => {
    setNameValue(user.name ?? '');
    setEditing(true);
  };

  const cancelEdit = () => setEditing(false);

  const role = (user as any).role as string | undefined;

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    if (!nameValue.trim()) return;
    setSaving(true);
    try {
      await authClient.updateUser({ name: nameValue.trim() });
      toast.success('Profile updated');
      setEditing(false);
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

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

      <main className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
        <h1 className="mb-8 text-2xl font-semibold">Account</h1>

        {/* Profile card */}
        <section className="mb-4 rounded-xl border border-border bg-card p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <Avatar name={user.name} email={user.email} />
              <div>
                <p className="font-semibold">{user.name ?? 'Anonymous'}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>
            {!editing && (
              <Button variant="ghost" size="icon-sm" onClick={startEdit} aria-label="Edit profile">
                <Pencil className="size-4" />
              </Button>
            )}
          </div>

          {editing && (
            <form onSubmit={handleSave} className="mt-5 space-y-3 border-t border-border pt-5">
              <div className="space-y-1.5">
                <Label htmlFor="displayName">Display name</Label>
                <Input
                  id="displayName"
                  value={nameValue}
                  onChange={e => setNameValue(e.target.value)}
                  required
                  autoFocus
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" size="sm" disabled={saving}>
                  <Check className="size-3.5" />
                  {saving ? 'Saving…' : 'Save'}
                </Button>
                <Button type="button" variant="ghost" size="sm" onClick={cancelEdit}>
                  <X className="size-3.5" /> Cancel
                </Button>
              </div>
            </form>
          )}
        </section>

        {/* Quick links */}
        <section className="mb-4 overflow-hidden rounded-xl border border-border bg-card">
          <Link
            to="/orders"
            className="flex items-center justify-between px-5 py-4 transition-colors hover:bg-muted/50"
          >
            <div className="flex items-center gap-3">
              <Package className="size-4 text-muted-foreground" />
              <span className="text-sm font-medium">Order history</span>
            </div>
            <div className="flex items-center gap-2">
              {orders.length > 0 && (
                <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium">
                  {orders.length}
                </span>
              )}
              <span className="text-xs text-muted-foreground">›</span>
            </div>
          </Link>

          <div className="border-t border-border" />

          <Link
            to="/wishlist"
            className="flex items-center justify-between px-5 py-4 transition-colors hover:bg-muted/50"
          >
            <div className="flex items-center gap-3">
              <Heart className="size-4 text-muted-foreground" />
              <span className="text-sm font-medium">Wishlist</span>
            </div>
            <div className="flex items-center gap-2">
              {wishlistCount > 0 && (
                <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium">
                  {wishlistCount}
                </span>
              )}
              <span className="text-xs text-muted-foreground">›</span>
            </div>
          </Link>
        </section>

        {/* Account info */}
        <section className="mb-4 rounded-xl border border-border bg-card p-5">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Account details
          </h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Email</span>
              <span className="font-medium">{user.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Member since</span>
              <span className="font-medium">
                {new Date(user.createdAt ?? Date.now()).toLocaleDateString(undefined, {
                  year: 'numeric', month: 'long',
                })}
              </span>
            </div>
          </div>
        </section>

        {/* Seller section — only visible for the store owner */}
        {(role === 'vendor' || role === 'admin') && (
          <section className="mb-4 rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-3">
              <Store className="size-4 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm font-medium">Seller account</p>
                <p className="text-xs text-muted-foreground capitalize">{role}</p>
              </div>
              <Link
                to="/seller/dashboard"
                className="flex items-center gap-1 text-sm font-medium hover:underline"
              >
                Dashboard <ArrowRight className="size-3.5" />
              </Link>
            </div>
          </section>
        )}

        {/* Danger zone */}
        <section className="rounded-xl border border-border bg-card p-5">
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 text-destructive hover:text-destructive"
            onClick={() => void signOut()}
          >
            <LogOut className="size-4" />
            Sign out
          </Button>
        </section>
      </main>

      <CartDrawer />
    </div>
  );
}
