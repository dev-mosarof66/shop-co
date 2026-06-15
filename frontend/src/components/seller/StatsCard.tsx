import { cn } from '@/lib/utils';

interface StatsCardProps {
  label: string;
  value: string;
  sub?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendLabel?: string;
  icon: React.ReactNode;
  className?: string;
}

export function StatsCard({ label, value, sub, trend, trendLabel, icon, className }: StatsCardProps) {
  return (
    <div className={cn('rounded-xl border border-border bg-card p-5', className)}>
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</span>
        <span className="flex size-8 items-center justify-center rounded-lg bg-muted text-muted-foreground">
          {icon}
        </span>
      </div>
      <p className="text-2xl font-semibold tracking-tight">{value}</p>
      {(sub ?? trendLabel) && (
        <p className="mt-1 text-xs text-muted-foreground">
          {trendLabel && trend && (
            <span
              className={cn(
                'mr-1 font-medium',
                trend === 'up' && 'text-green-600 dark:text-green-400',
                trend === 'down' && 'text-red-500',
              )}
            >
              {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '–'} {trendLabel}
            </span>
          )}
          {sub}
        </p>
      )}
    </div>
  );
}
