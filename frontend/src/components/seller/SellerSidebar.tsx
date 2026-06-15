import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  BarChart2,
  Settings,
  X,
  Store,
  ExternalLink,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV = [
  { to: '/seller/dashboard', icon: LayoutDashboard, label: 'Overview' },
  { to: '/seller/products',  icon: Package,         label: 'Products' },
  { to: '/seller/orders',    icon: ShoppingCart,    label: 'Orders' },
  { to: '/seller/analytics', icon: BarChart2,       label: 'Analytics' },
];

interface SellerSidebarProps {
  open: boolean;
  onClose: () => void;
}

export function SellerSidebar({ open, onClose }: SellerSidebarProps) {
  return (
    <>
      {open && (
        <div
          aria-hidden
          onClick={onClose}
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex w-56 flex-col bg-background border-r border-border transition-transform duration-200 lg:static lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        {/* Brand */}
        <div className="flex h-14 items-center justify-between px-4 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="flex size-7 items-center justify-center rounded-lg bg-foreground text-background">
              <Store className="size-3.5" />
            </div>
            <div>
              <p className="text-sm font-semibold leading-none">ShopCo</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">Store Admin</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-muted-foreground hover:text-foreground lg:hidden"
            aria-label="Close"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-2">
          <p className="px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            Manage
          </p>
          <ul className="space-y-0.5 mb-6">
            {NAV.map(({ to, icon: Icon, label }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={to === '/seller/dashboard'}
                  onClick={onClose}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-foreground text-background'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                    )
                  }
                >
                  <Icon className="size-4 shrink-0" />
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>

          <p className="px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            Account
          </p>
          <ul className="space-y-0.5">
            <li>
              <NavLink
                to="/seller/settings"
                onClick={onClose}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-foreground text-background'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                  )
                }
              >
                <Settings className="size-4 shrink-0" />
                Settings
              </NavLink>
            </li>
          </ul>
        </nav>

        {/* Footer */}
        <div className="border-t border-border p-2">
          <Link
            to="/"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <ExternalLink className="size-3.5" />
            View storefront
          </Link>
        </div>
      </aside>
    </>
  );
}
