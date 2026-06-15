import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CartDrawer } from '@/components/cart-drawer';
import { AuthModal } from '@/components/auth-modal';
import { ProductCard } from '@/components/product-card';
import { PageNavbar } from '@/components/page-navbar';
import { useI18n } from '@/lib/i18n';
import { useGetProductsQuery, type ApiProduct, type Pagination } from '@/store/api';
import { cn } from '@/lib/utils';

type SortKey = 'default' | 'price-asc' | 'price-desc' | 'rating' | 'reviews';

const CATEGORIES = [
  { key: 'all',         label: 'All' },
  { key: 'electronics', label: 'Electronics' },
  { key: 'fashion',     label: 'Fashion' },
  { key: 'home',        label: 'Home' },
  { key: 'sports',      label: 'Sports' },
  { key: 'books',       label: 'Books' },
  { key: 'beauty',      label: 'Beauty' },
] as const;

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'default',    label: 'Featured' },
  { value: 'price-asc',  label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating',     label: 'Top Rated' },
  { value: 'reviews',    label: 'Most Reviewed' },
];

const BADGE_LABELS: Record<string, string> = {
  bestSeller: 'Best Seller',
  new: 'New',
  sale: 'Sale',
};

const PAGE_SIZE = 12;

function ProductSkeleton() {
  return (
    <div className="flex flex-col rounded-xl border border-border bg-card animate-pulse">
      <div className="h-44 rounded-t-xl bg-muted" />
      <div className="flex flex-col gap-2 p-4">
        <div className="h-4 w-3/4 rounded bg-muted" />
        <div className="h-3 w-full rounded bg-muted" />
        <div className="h-3 w-1/2 rounded bg-muted" />
        <div className="mt-2 flex justify-between">
          <div className="h-4 w-16 rounded bg-muted" />
          <div className="size-8 rounded bg-muted" />
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  const { t } = useI18n();
  const [searchParams, setSearchParams] = useSearchParams();

  const categoryParam = searchParams.get('category') ?? 'all';
  const pageParam    = Math.max(1, Number(searchParams.get('page') ?? '1'));
  const sortParam    = (searchParams.get('sort') ?? 'default') as SortKey;
  const searchQuery  = searchParams.get('q') ?? '';
  const minPriceParam = searchParams.get('minPrice') ?? '';
  const maxPriceParam = searchParams.get('maxPrice') ?? '';

  // Local state for the price inputs (uncommitted until blur/Enter)
  const [minInput, setMinInput] = useState(minPriceParam);
  const [maxInput, setMaxInput] = useState(maxPriceParam);
  const [showPriceFilter, setShowPriceFilter] = useState(
    minPriceParam !== '' || maxPriceParam !== '',
  );
  const minRef = useRef<HTMLInputElement>(null);
  const maxRef = useRef<HTMLInputElement>(null);

  // Keep local inputs in sync if URL params change externally (e.g. "Clear all")
  useEffect(() => { setMinInput(minPriceParam); }, [minPriceParam]);
  useEffect(() => { setMaxInput(maxPriceParam); }, [maxPriceParam]);

  // Auto-open price panel when URL has price params (e.g. shared link)
  useEffect(() => {
    if (minPriceParam !== '' || maxPriceParam !== '') setShowPriceFilter(true);
  }, [minPriceParam, maxPriceParam]);

  const { data, isFetching, isError, refetch } = useGetProductsQuery({
    page: pageParam,
    limit: PAGE_SIZE,
    category: categoryParam !== 'all' ? categoryParam : undefined,
    sort: sortParam !== 'default' ? sortParam : undefined,
    search: searchQuery || undefined,
    minPrice: minPriceParam !== '' ? Number(minPriceParam) : undefined,
    maxPrice: maxPriceParam !== '' ? Number(maxPriceParam) : undefined,
  });

  const products: ApiProduct[] = data?.data ?? [];
  const pagination: Pagination | null = data?.pagination ?? null;
  const loading = isFetching;
  const error: string | null = isError ? 'Failed to load products' : null;
  const totalPages = pagination?.totalPages ?? 1;
  const total = pagination?.total ?? 0;

  function buildParams(overrides: Record<string, string | undefined> = {}) {
    const next: Record<string, string> = {};
    if (categoryParam !== 'all') next.category = categoryParam;
    if (sortParam !== 'default') next.sort = sortParam;
    if (searchQuery) next.q = searchQuery;
    if (minPriceParam) next.minPrice = minPriceParam;
    if (maxPriceParam) next.maxPrice = maxPriceParam;
    for (const [k, v] of Object.entries(overrides)) {
      if (v === undefined || v === '') delete next[k];
      else next[k] = v;
    }
    return next;
  }

  const setCategory = (cat: string) => {
    setSearchParams(buildParams({ category: cat === 'all' ? undefined : cat, page: undefined }));
  };

  const setSort = (val: SortKey) => {
    setSearchParams(buildParams({ sort: val === 'default' ? undefined : val, page: undefined }));
  };

  const setPage = (p: number) => {
    setSearchParams(buildParams({ page: p === 1 ? undefined : String(p) }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearSearch = () => {
    setSearchParams(buildParams({ q: undefined, page: undefined }));
  };

  const applyPrice = () => {
    const min = minInput.trim();
    const max = maxInput.trim();
    setSearchParams(buildParams({
      minPrice: min || undefined,
      maxPrice: max || undefined,
      page: undefined,
    }));
  };

  const clearPrice = () => {
    setMinInput('');
    setMaxInput('');
    setSearchParams(buildParams({ minPrice: undefined, maxPrice: undefined, page: undefined }));
  };

  const clearAll = () => {
    setMinInput('');
    setMaxInput('');
    setSearchParams({});
  };

  const hasActiveFilters =
    categoryParam !== 'all' || sortParam !== 'default' || searchQuery || minPriceParam || maxPriceParam;

  return (
    <div className="min-h-svh bg-background">
      <PageNavbar />

      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        {/* Page header */}
        <div className="mb-8">
          <p className="mb-1 text-xs font-medium uppercase tracking-widest text-muted-foreground">
            {t.categories.eyebrow}
          </p>
          <h1 className="text-2xl font-semibold sm:text-3xl">
            {searchQuery ? `Results for "${searchQuery}"` : t.nav.products}
          </h1>
        </div>

        {/* Filters row */}
        <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Category chips */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setCategory(key)}
                className={cn(
                  'rounded-full border px-3 py-1 text-sm transition-colors',
                  categoryParam === key
                    ? 'border-foreground bg-foreground text-background'
                    : 'border-border bg-background text-muted-foreground hover:border-foreground/40 hover:text-foreground',
                )}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setShowPriceFilter(v => !v)}
              className={cn(
                'flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs font-medium transition-colors',
                showPriceFilter
                  ? 'border-foreground bg-foreground text-background'
                  : 'border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground',
              )}
              title="Price filter"
            >
              <SlidersHorizontal className="size-3.5" />
              Price
            </button>
            <Select value={sortParam} onValueChange={val => setSort(val as SortKey)}>
              <SelectTrigger className="h-8 w-44 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map(o => (
                  <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Price range filter */}
        {showPriceFilter && (
          <div className="mb-3 flex flex-wrap items-center gap-2 rounded-lg border border-border bg-muted/30 px-3 py-2.5">
            <span className="text-xs font-medium text-muted-foreground">Price range</span>
            <div className="flex items-center gap-1.5">
              <div className="relative">
                <span className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">$</span>
                <Input
                  ref={minRef}
                  type="number"
                  min={0}
                  placeholder="Min"
                  value={minInput}
                  onChange={e => setMinInput(e.target.value)}
                  onBlur={applyPrice}
                  onKeyDown={e => { if (e.key === 'Enter') { applyPrice(); minRef.current?.blur(); } }}
                  className="h-7 w-20 pl-5 text-xs"
                />
              </div>
              <span className="text-xs text-muted-foreground">–</span>
              <div className="relative">
                <span className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">$</span>
                <Input
                  ref={maxRef}
                  type="number"
                  min={0}
                  placeholder="Max"
                  value={maxInput}
                  onChange={e => setMaxInput(e.target.value)}
                  onBlur={applyPrice}
                  onKeyDown={e => { if (e.key === 'Enter') { applyPrice(); maxRef.current?.blur(); } }}
                  className="h-7 w-20 pl-5 text-xs"
                />
              </div>
            </div>
            {(minPriceParam || maxPriceParam) && (
              <button
                onClick={clearPrice}
                className="ml-1 text-xs text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
              >
                Clear
              </button>
            )}
          </div>
        )}

        {/* Active filter chips */}
        {!loading && (
          <div className="mb-4 flex flex-wrap items-center gap-2">
            {searchQuery && (
              <span className="inline-flex items-center gap-1 rounded-full border border-border bg-muted px-2.5 py-0.5 text-xs font-medium">
                <Search className="size-3 text-muted-foreground" />
                {searchQuery}
                <button onClick={clearSearch} aria-label="Clear search"><X className="size-3" /></button>
              </span>
            )}
            {categoryParam !== 'all' && (
              <span className="inline-flex items-center gap-1 rounded-full border border-border bg-muted px-2.5 py-0.5 text-xs font-medium capitalize">
                {categoryParam}
                <button onClick={() => setCategory('all')} aria-label="Clear category"><X className="size-3" /></button>
              </span>
            )}
            {(minPriceParam || maxPriceParam) && (
              <span className="inline-flex items-center gap-1 rounded-full border border-border bg-muted px-2.5 py-0.5 text-xs font-medium">
                {minPriceParam ? `$${minPriceParam}` : ''}
                {minPriceParam && maxPriceParam ? ' – ' : ''}
                {maxPriceParam ? `$${maxPriceParam}` : (minPriceParam ? '+' : '')}
                <button onClick={clearPrice} aria-label="Clear price"><X className="size-3" /></button>
              </span>
            )}
            {total > 0 && (
              <span className="text-sm text-muted-foreground">
                {total} {total === 1 ? 'product' : 'products'}
              </span>
            )}
            {hasActiveFilters && (
              <button
                onClick={clearAll}
                className="text-xs text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
              >
                Clear all
              </button>
            )}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="flex flex-col items-center gap-3 py-24 text-center">
            <p className="text-sm font-medium text-destructive">{error}</p>
            <Button variant="outline" size="sm" onClick={() => void refetch()}>Retry</Button>
          </div>
        )}

        {/* Skeleton */}
        {loading && !error && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: PAGE_SIZE }).map((_, i) => <ProductSkeleton key={i} />)}
          </div>
        )}

        {/* Empty */}
        {!loading && !error && products.length === 0 && (
          <div className="flex flex-col items-center gap-3 py-24 text-center">
            <p className="text-sm font-medium">No products found</p>
            {hasActiveFilters && (
              <Button variant="outline" size="sm" onClick={clearAll}>Clear all filters</Button>
            )}
          </div>
        )}

        {/* Grid */}
        {!loading && !error && products.length > 0 && (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {products.map(p => (
                <ProductCard
                  key={p.id}
                  product={p}
                  badgeLabel={p.badge ? BADGE_LABELS[p.badge] : null}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-10 flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(pageParam - 1)}
                  disabled={pageParam <= 1}
                  aria-label="Previous page"
                >
                  <ChevronLeft className="size-4" />
                </Button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => {
                  if (
                    totalPages > 7 &&
                    p !== 1 &&
                    p !== totalPages &&
                    Math.abs(p - pageParam) > 2
                  ) {
                    if (p === 2 || p === totalPages - 1) {
                      return <span key={p} className="px-1 text-muted-foreground select-none">…</span>;
                    }
                    return null;
                  }
                  return (
                    <Button
                      key={p}
                      variant={p === pageParam ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setPage(p)}
                      className="min-w-9"
                    >
                      {p}
                    </Button>
                  );
                })}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(pageParam + 1)}
                  disabled={pageParam >= totalPages}
                  aria-label="Next page"
                >
                  <ChevronRight className="size-4" />
                </Button>
              </div>
            )}

            <p className="mt-3 text-center text-xs text-muted-foreground">
              Page {pageParam} of {totalPages} · {total} total products
            </p>
          </>
        )}
      </main>

      <CartDrawer />
      <AuthModal />
    </div>
  );
}
