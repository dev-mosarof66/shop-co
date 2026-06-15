import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2, Loader2, PackageX, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { SellerLayout } from '@/components/seller/SellerLayout';
import { sellerApi, type SellerProduct } from '@/lib/seller-api';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

function fmt(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);
}

export default function SellerProductsPage() {
  const [products, setProducts] = useState<SellerProduct[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = useCallback((p: number) => {
    setLoading(true);
    sellerApi.getProducts(p)
      .then(res => {
        setProducts(res.data);
        setTotalPages(res.pagination.totalPages);
        setTotal(res.pagination.total);
        setPage(p);
      })
      .catch(e => toast.error(e.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(1); }, [load]);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Remove "${name}" from your store?`)) return;
    setDeletingId(id);
    try {
      await sellerApi.deleteProduct(id);
      toast.success('Product removed');
      load(page);
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <SellerLayout title="Products">
      <div className="mb-5 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{total} product{total !== 1 ? 's' : ''}</p>
        <Link to="/seller/products/new">
          <Button size="sm">
            <Plus className="mr-1.5 size-3.5" /> Add product
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="flex h-48 items-center justify-center">
          <Loader2 className="size-5 animate-spin text-muted-foreground" />
        </div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-24">
          <PackageX className="size-10 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">No products yet</p>
          <Link to="/seller/products/new"><Button size="sm">Add your first product</Button></Link>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Product</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Category</th>
                  <th className="px-4 py-3 text-right font-medium text-muted-foreground">Price</th>
                  <th className="px-4 py-3 text-right font-medium text-muted-foreground">Stock</th>
                  <th className="px-4 py-3 text-center font-medium text-muted-foreground">Status</th>
                  <th className="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {products.map(p => (
                  <tr key={p.id} className="bg-card hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium">{p.name}</p>
                      <p className="text-xs text-muted-foreground">SKU: {p.sku}</p>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground capitalize">
                      {p.category?.name ?? '—'}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="font-medium">{fmt(p.price)}</span>
                      {p.originalPrice && (
                        <span className="ml-1 text-xs text-muted-foreground line-through">{fmt(p.originalPrice)}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className={cn(
                        'font-medium',
                        p.stock === 0 && 'text-red-500',
                        p.stock > 0 && p.lowStockThreshold > 0 && p.stock <= p.lowStockThreshold && 'text-yellow-600 dark:text-yellow-400',
                      )}>
                        {p.stock}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={cn(
                        'rounded-full px-2 py-0.5 text-[10px] font-medium',
                        p.isActive
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-muted text-muted-foreground',
                      )}>
                        {p.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link to={`/seller/products/${p.id}`}>
                          <button className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground" aria-label="Edit">
                            <Pencil className="size-3.5" />
                          </button>
                        </Link>
                        <button
                          onClick={() => handleDelete(p.id, p.name)}
                          disabled={deletingId === p.id}
                          className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-red-50 hover:text-red-500 disabled:opacity-50 dark:hover:bg-red-950/30"
                          aria-label="Delete"
                        >
                          {deletingId === p.id
                            ? <Loader2 className="size-3.5 animate-spin" />
                            : <Trash2 className="size-3.5" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="mt-4 flex items-center justify-center gap-2">
              <button
                onClick={() => load(page - 1)}
                disabled={page <= 1}
                className="rounded-md border border-border p-1.5 text-muted-foreground hover:text-foreground disabled:opacity-40"
              >
                <ChevronLeft className="size-4" />
              </button>
              <span className="text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => load(page + 1)}
                disabled={page >= totalPages}
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
