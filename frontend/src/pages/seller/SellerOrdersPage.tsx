import { useEffect, useState, useCallback } from 'react';
import { Loader2, ShoppingBag, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { SellerLayout } from '@/components/seller/SellerLayout';
import { sellerApi, type SellerOrder } from '@/lib/seller-api';
import { cn } from '@/lib/utils';

const STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'];

const STATUS_COLORS: Record<string, string> = {
  pending:    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  processing: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  shipped:    'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
  delivered:  'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  cancelled:  'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  refunded:   'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400',
};

function fmt(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);
}

export default function SellerOrdersPage() {
  const [orders, setOrders] = useState<SellerOrder[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const load = useCallback((p: number) => {
    setLoading(true);
    sellerApi.getOrders(p)
      .then(res => {
        setOrders(res.data);
        setTotalPages(res.pagination.totalPages);
        setTotal(res.pagination.total);
        setPage(p);
      })
      .catch(e => toast.error(e.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(1); }, [load]);

  const handleStatusChange = async (orderId: string, status: string) => {
    setUpdatingId(orderId);
    try {
      await sellerApi.updateOrderStatus(orderId, status);
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
      toast.success('Status updated');
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <SellerLayout title="Orders">
      <div className="mb-5">
        <p className="text-sm text-muted-foreground">{total} order{total !== 1 ? 's' : ''}</p>
      </div>

      {loading ? (
        <div className="flex h-48 items-center justify-center">
          <Loader2 className="size-5 animate-spin text-muted-foreground" />
        </div>
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-24">
          <ShoppingBag className="size-10 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">No orders yet</p>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {orders.map(order => (
              <div key={order.id} className="rounded-xl border border-border bg-card p-4 sm:p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-mono text-xs font-semibold text-muted-foreground">
                      #{order.id.slice(0, 8).toUpperCase()}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric', month: 'short', day: 'numeric',
                      })}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-base font-semibold">{fmt(order.total)}</span>
                    {updatingId === order.id ? (
                      <Loader2 className="size-4 animate-spin text-muted-foreground" />
                    ) : (
                      <select
                        value={order.status}
                        onChange={e => handleStatusChange(order.id, e.target.value)}
                        className={cn(
                          'rounded-full border-0 px-2.5 py-1 text-[11px] font-medium capitalize focus:outline-none focus:ring-1 focus:ring-ring',
                          STATUS_COLORS[order.status] ?? '',
                        )}
                      >
                        {STATUSES.map(s => (
                          <option key={s} value={s} className="bg-background text-foreground capitalize">{s}</option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>

                {order.items.length > 0 && (
                  <ul className="mt-3 divide-y divide-border rounded-lg border border-border">
                    {order.items.map(item => (
                      <li key={item.id} className="flex items-center justify-between px-3 py-2 text-sm">
                        <span className="truncate font-medium">{item.productName}</span>
                        <span className="ml-4 shrink-0 text-muted-foreground">
                          {item.quantity} × {fmt(item.price)}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-4 flex items-center justify-center gap-2">
              <button
                onClick={() => load(page - 1)} disabled={page <= 1}
                className="rounded-md border border-border p-1.5 text-muted-foreground hover:text-foreground disabled:opacity-40"
              >
                <ChevronLeft className="size-4" />
              </button>
              <span className="text-sm text-muted-foreground">Page {page} of {totalPages}</span>
              <button
                onClick={() => load(page + 1)} disabled={page >= totalPages}
                className="rounded-md border border-border p-1.5 text-muted-foreground hover:text-foreground disabled:opacity-40"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
          )}
        </>
      )}
    </SellerLayout>
  );
}
