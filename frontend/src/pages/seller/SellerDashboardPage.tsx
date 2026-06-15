import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  DollarSign, ShoppingCart, Package, AlertTriangle,
  Loader2, Plus, ArrowRight, TrendingUp, TrendingDown,
  ChevronRight, Users,
} from 'lucide-react';
import { SellerLayout } from '@/components/seller/SellerLayout';
import { sellerApi, type SellerStats, type ChartDataPoint } from '@/lib/seller-api';
import { Button } from '@/components/ui/button';
import { useSession } from '@/lib/auth-client';
import { cn } from '@/lib/utils';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_COLORS: Record<string, string> = {
  pending:    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  processing: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  shipped:    'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
  delivered:  'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  cancelled:  'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  refunded:   'bg-muted text-muted-foreground',
};

function fmtCurrency(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function pct(current: number, prev: number) {
  if (prev === 0) return null;
  return Math.round(((current - prev) / prev) * 100);
}

// ─── Area chart ───────────────────────────────────────────────────────────────

function AreaChart({
  data,
  formatValue,
  emptyLabel = 'No data',
}: {
  data: ChartDataPoint[];
  formatValue: (n: number) => string;
  emptyLabel?: string;
}) {
  const [active, setActive] = useState<number | null>(null);

  const nonEmpty = data.some(d => d.value > 0);
  const max = Math.max(...data.map(d => d.value), 1);
  const W = 600;
  const H = 90;
  const PAD_X = 0;
  const PAD_Y = 8;

  const pts = data.map((d, i) => ({
    x: PAD_X + (i / Math.max(data.length - 1, 1)) * (W - PAD_X * 2),
    y: PAD_Y + (1 - d.value / max) * (H - PAD_Y * 2),
  }));

  const linePath = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join('');
  const areaPath = pts.length > 0
    ? `${linePath}L${pts[pts.length - 1].x.toFixed(1)},${H}L${pts[0].x.toFixed(1)},${H}Z`
    : '';

  const sliceW = W / Math.max(data.length, 1);
  const hovered = active !== null ? data[active] : null;

  return (
    <div className="select-none">
      {/* Hover readout */}
      <div className="mb-3 h-8 flex items-end gap-2">
        {hovered ? (
          <>
            <span className="text-xl font-semibold tabular-nums leading-none">
              {formatValue(hovered.value)}
            </span>
            <span className="text-xs text-muted-foreground mb-0.5">{fmtDate(hovered.date)}</span>
          </>
        ) : (
          <span className="text-xl font-semibold tabular-nums leading-none text-muted-foreground/40">
            —
          </span>
        )}
      </div>

      {!nonEmpty ? (
        <div className="flex h-22.5 items-center justify-center text-sm text-muted-foreground/50">
          {emptyLabel}
        </div>
      ) : (
        <svg
          viewBox={`0 0 ${W} ${H}`}
          preserveAspectRatio="none"
          className="h-22.5 w-full text-foreground"
          onMouseLeave={() => setActive(null)}
        >
          <defs>
            <linearGradient id={`ag-${formatValue.toString().length}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="currentColor" stopOpacity="0.12" />
              <stop offset="100%" stopColor="currentColor" stopOpacity="0.01" />
            </linearGradient>
          </defs>

          {/* Area fill */}
          <path d={areaPath} fill={`url(#ag-${formatValue.toString().length})`} />

          {/* Line */}
          <path
            d={linePath}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            vectorEffect="non-scaling-stroke"
          />

          {/* Hover hairline + dot */}
          {active !== null && pts[active] && (
            <>
              <line
                x1={pts[active].x} y1={PAD_Y}
                x2={pts[active].x} y2={H}
                stroke="currentColor"
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
                strokeDasharray="3 2"
                opacity="0.35"
              />
              <circle
                cx={pts[active].x}
                cy={pts[active].y}
                r="3"
                fill="currentColor"
                vectorEffect="non-scaling-stroke"
              />
            </>
          )}

          {/* Invisible hover strips */}
          {data.map((_, i) => (
            <rect
              key={i}
              x={i * sliceW}
              y={0}
              width={sliceW}
              height={H}
              fill="transparent"
              style={{ cursor: 'crosshair' }}
              onMouseEnter={() => setActive(i)}
            />
          ))}
        </svg>
      )}

      {/* X-axis labels */}
      <div className="mt-1 flex justify-between text-[10px] text-muted-foreground/60">
        <span>{data[0] ? fmtDate(data[0].date) : ''}</span>
        <span>{data[Math.floor(data.length / 2)] ? fmtDate(data[Math.floor(data.length / 2)].date) : ''}</span>
        <span>{data[data.length - 1] ? fmtDate(data[data.length - 1].date) : ''}</span>
      </div>
    </div>
  );
}

// ─── Stat card ────────────────────────────────────────────────────────────────

function StatCard({
  label, value, sub, icon, trend,
}: {
  label: string; value: string; sub?: string; icon: React.ReactNode; trend?: number | null;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs font-medium text-muted-foreground">{label}</p>
          <p className="mt-1.5 text-2xl font-semibold tracking-tight">{value}</p>
        </div>
        <span className="flex size-9 items-center justify-center rounded-lg bg-muted text-muted-foreground shrink-0">
          {icon}
        </span>
      </div>
      {(sub || trend != null) && (
        <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
          {trend != null && (
            <>
              {trend >= 0
                ? <TrendingUp className="size-3 text-green-500" />
                : <TrendingDown className="size-3 text-red-500" />}
              <span className={trend >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-500'}>
                {trend >= 0 ? '+' : ''}{trend}%
              </span>
            </>
          )}
          {sub && <span>{sub}</span>}
        </div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SellerDashboardPage() {
  const [stats, setStats] = useState<SellerStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();

  const firstName = (session?.user as any)?.firstName
    || session?.user?.name?.split(' ')[0]
    || 'there';

  useEffect(() => {
    sellerApi.getDashboard()
      .then(setStats)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const revTrend = stats ? pct(stats.revenue.thisMonth, stats.revenue.lastMonth) : null;
  const totalUsers = stats?.userGrowth.reduce((s, d) => s + d.value, 0) ?? 0;

  if (loading) {
    return (
      <SellerLayout title="Overview">
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="size-5 animate-spin text-muted-foreground" />
        </div>
      </SellerLayout>
    );
  }

  if (error) {
    return (
      <SellerLayout title="Overview">
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">{error}</div>
      </SellerLayout>
    );
  }

  return (
    <SellerLayout title="Overview">

      {/* Greeting */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Hey, {firstName} 👋</h2>
          <p className="text-sm text-muted-foreground">Here's what's happening in your store.</p>
        </div>
        <Link to="/seller/products/new">
          <Button size="sm">
            <Plus className="mr-1.5 size-3.5" /> New product
          </Button>
        </Link>
      </div>

      {stats && (
        <div className="space-y-6">

          {/* Stats row */}
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              label="Revenue this month"
              value={fmtCurrency(stats.revenue.thisMonth)}
              icon={<DollarSign className="size-4" />}
              trend={revTrend}
              sub="vs last month"
            />
            <StatCard
              label="Orders this month"
              value={String(stats.orders.thisMonth)}
              icon={<ShoppingCart className="size-4" />}
            />
            <StatCard
              label="Active products"
              value={String(stats.products.total)}
              icon={<Package className="size-4" />}
            />
            <StatCard
              label="Low stock alerts"
              value={String(stats.products.lowStock)}
              icon={<AlertTriangle className="size-4" />}
              sub={stats.products.lowStock > 0 ? 'need restocking' : 'all good'}
            />
          </div>

          {/* Charts */}
          <div className="grid gap-6 lg:grid-cols-2">

            {/* Revenue chart */}
            <div className="rounded-xl border border-border bg-card p-5">
              <div className="mb-1 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <DollarSign className="size-4 text-muted-foreground" />
                  Revenue
                </div>
                <span className="text-xs text-muted-foreground">Last 30 days</span>
              </div>
              <p className="mb-4 text-2xl font-semibold tabular-nums">
                {fmtCurrency(stats.revenueChart.reduce((s, d) => s + d.value, 0))}
                <span className="ml-2 text-sm font-normal text-muted-foreground">total</span>
              </p>
              <AreaChart
                data={stats.revenueChart}
                formatValue={fmtCurrency}
                emptyLabel="No sales in the last 30 days"
              />
            </div>

            {/* New customers chart */}
            <div className="rounded-xl border border-border bg-card p-5">
              <div className="mb-1 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <Users className="size-4 text-muted-foreground" />
                  New Customers
                </div>
                <span className="text-xs text-muted-foreground">Last 30 days</span>
              </div>
              <p className="mb-4 text-2xl font-semibold tabular-nums">
                {totalUsers}
                <span className="ml-2 text-sm font-normal text-muted-foreground">
                  {totalUsers === 1 ? 'signup' : 'signups'}
                </span>
              </p>
              <AreaChart
                data={stats.userGrowth}
                formatValue={n => `${n} ${n === 1 ? 'signup' : 'signups'}`}
                emptyLabel="No new signups in the last 30 days"
              />
            </div>
          </div>

          {/* Lower grid */}
          <div className="grid gap-6 lg:grid-cols-5">

            {/* Recent orders */}
            <div className="lg:col-span-3 rounded-xl border border-border bg-card">
              <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
                <h3 className="text-sm font-semibold">Recent Orders</h3>
                <Link
                  to="/seller/orders"
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                >
                  View all <ChevronRight className="size-3" />
                </Link>
              </div>
              {stats.recentOrders.length === 0 ? (
                <div className="flex flex-col items-center gap-2 py-12 text-center">
                  <ShoppingCart className="size-8 text-muted-foreground/30" />
                  <p className="text-sm text-muted-foreground">No orders yet</p>
                </div>
              ) : (
                <ul className="divide-y divide-border">
                  {stats.recentOrders.map(order => (
                    <li key={order.id} className="flex items-center justify-between px-5 py-3.5 gap-4">
                      <div className="min-w-0">
                        <p className="font-mono text-xs font-semibold text-foreground">
                          #{order.id.slice(0, 8).toUpperCase()}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {new Date(order.createdAt).toLocaleDateString('en-US', {
                            month: 'short', day: 'numeric', year: 'numeric',
                          })}
                          {' · '}{order.itemCount} item{order.itemCount !== 1 ? 's' : ''}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className={cn(
                          'rounded-full px-2 py-0.5 text-[10px] font-medium capitalize',
                          STATUS_COLORS[order.status] ?? 'bg-muted text-muted-foreground',
                        )}>
                          {order.status}
                        </span>
                        <span className="text-sm font-semibold tabular-nums">{fmtCurrency(order.total)}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Right column */}
            <div className="lg:col-span-2 space-y-6">

              {/* Stock alerts */}
              <div className="rounded-xl border border-border bg-card">
                <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
                  <h3 className="text-sm font-semibold flex items-center gap-2">
                    <AlertTriangle className="size-3.5 text-amber-500" />
                    Stock Alerts
                  </h3>
                  <Link
                    to="/seller/products"
                    className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                  >
                    Manage <ChevronRight className="size-3" />
                  </Link>
                </div>
                {stats.products.lowStockItems.length === 0 ? (
                  <div className="flex items-center gap-2 px-5 py-4 text-sm text-muted-foreground">
                    <span className="text-green-500">✓</span> All products are well stocked
                  </div>
                ) : (
                  <ul className="divide-y divide-border">
                    {stats.products.lowStockItems.map(item => (
                      <li key={item.id} className="flex items-center justify-between px-5 py-3 gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">{item.name}</p>
                          <p className="text-xs text-muted-foreground">SKU: {item.sku}</p>
                        </div>
                        <span className={cn(
                          'shrink-0 rounded-md px-2 py-0.5 text-xs font-semibold tabular-nums',
                          item.stock === 0
                            ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                            : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
                        )}>
                          {item.stock === 0 ? 'Out of stock' : `${item.stock} left`}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Top products */}
              <div className="rounded-xl border border-border bg-card">
                <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
                  <h3 className="text-sm font-semibold">Top Products</h3>
                  <Link
                    to="/seller/analytics"
                    className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                  >
                    Analytics <ArrowRight className="size-3" />
                  </Link>
                </div>
                {stats.topProducts.length === 0 ? (
                  <div className="flex flex-col items-center gap-2 py-8">
                    <p className="text-sm text-muted-foreground">No sales data yet</p>
                    <Link to="/seller/products/new">
                      <Button size="sm" variant="outline">Add a product</Button>
                    </Link>
                  </div>
                ) : (
                  <ul className="divide-y divide-border">
                    {stats.topProducts.map((p, i) => (
                      <li key={p.id} className="flex items-center gap-3 px-5 py-3">
                        <span className="w-4 text-xs font-bold text-muted-foreground tabular-nums">{i + 1}</span>
                        <div className="flex-1 min-w-0">
                          <p className="truncate text-sm font-medium">{p.name}</p>
                          <p className="text-xs text-muted-foreground">{p.unitsSold} sold</p>
                        </div>
                        <span className="text-sm font-semibold tabular-nums shrink-0">{fmtCurrency(p.revenue)}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>

        </div>
      )}
    </SellerLayout>
  );
}
