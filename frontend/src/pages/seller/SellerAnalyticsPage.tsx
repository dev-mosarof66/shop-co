import { useEffect, useState } from 'react';
import { Loader2, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';
import { SellerLayout } from '@/components/seller/SellerLayout';
import { StatsCard } from '@/components/seller/StatsCard';
import { sellerApi, type SellerAnalytics, type ChartPoint } from '@/lib/seller-api';
import { cn } from '@/lib/utils';

type Period = '7d' | '30d' | '90d';

function fmt(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
}

function BarChart({ data }: { data: ChartPoint[] }) {
  const maxRev = Math.max(...data.map(d => d.revenue), 1);
  const showEvery = data.length <= 14 ? 1 : data.length <= 30 ? 3 : 7;

  return (
    <div className="flex h-48 items-end gap-px pt-2">
      {data.map((d, i) => {
        const pct = (d.revenue / maxRev) * 100;
        const label = new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        return (
          <div key={d.date} className="group relative flex flex-1 flex-col items-center">
            {/* Tooltip */}
            <div className="pointer-events-none absolute bottom-full mb-1.5 hidden -translate-x-1/2 left-1/2 rounded-md border border-border bg-popover px-2 py-1 text-[10px] shadow-md group-hover:block whitespace-nowrap z-10">
              <p className="font-medium">{label}</p>
              <p>{fmt(d.revenue)}</p>
              <p className="text-muted-foreground">{d.orders} order{d.orders !== 1 ? 's' : ''}</p>
            </div>
            {/* Bar */}
            <div
              className={cn(
                'w-full rounded-t transition-all',
                pct > 0 ? 'bg-foreground' : 'bg-muted',
              )}
              style={{ height: `${Math.max(pct, pct > 0 ? 2 : 0)}%` }}
            />
            {/* X label */}
            {i % showEvery === 0 && (
              <span className="mt-1 text-[9px] text-muted-foreground rotate-0 truncate max-w-full">
                {new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function SellerAnalyticsPage() {
  const [period, setPeriod] = useState<Period>('30d');
  const [data, setData] = useState<SellerAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    sellerApi.getAnalytics(period)
      .then(setData)
      .catch(e => toast.error(e.message))
      .finally(() => setLoading(false));
  }, [period]);

  const PERIODS: { label: string; value: Period }[] = [
    { label: '7 days', value: '7d' },
    { label: '30 days', value: '30d' },
    { label: '90 days', value: '90d' },
  ];

  return (
    <SellerLayout title="Analytics">
      {/* Period picker */}
      <div className="mb-6 flex items-center gap-2">
        {PERIODS.map(p => (
          <button
            key={p.value}
            onClick={() => setPeriod(p.value)}
            className={cn(
              'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
              period === p.value
                ? 'border-foreground bg-foreground text-background'
                : 'border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground',
            )}
          >
            {p.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex h-48 items-center justify-center">
          <Loader2 className="size-5 animate-spin text-muted-foreground" />
        </div>
      ) : data ? (
        <div className="space-y-6">
          {/* Summary cards */}
          <div className="grid gap-4 sm:grid-cols-3">
            <StatsCard
              label="Total revenue"
              value={fmt(data.summary.totalRevenue)}
              icon={<TrendingUp className="size-4" />}
            />
            <StatsCard
              label="Total orders"
              value={String(data.summary.totalOrders)}
              icon={<span className="text-xs font-bold">#</span>}
            />
            <StatsCard
              label="Avg order value"
              value={fmt(data.summary.avgOrderValue)}
              icon={<span className="text-xs font-bold">Ø</span>}
            />
          </div>

          {/* Revenue chart */}
          <div className="rounded-xl border border-border bg-card p-5">
            <h2 className="mb-4 text-sm font-semibold">Revenue — last {period}</h2>
            {data.chart.every(d => d.revenue === 0) ? (
              <div className="flex h-48 flex-col items-center justify-center gap-2 text-muted-foreground">
                <TrendingUp className="size-8 opacity-30" />
                <p className="text-sm">No revenue in this period</p>
              </div>
            ) : (
              <BarChart data={data.chart} />
            )}
          </div>
        </div>
      ) : null}
    </SellerLayout>
  );
}
