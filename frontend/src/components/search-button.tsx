import { useState, useEffect, useRef, useCallback, type KeyboardEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ArrowRight, ShoppingBag } from 'lucide-react';
import { useLazyGetProductsQuery, type ApiProduct } from '@/store/api';
import { productIcons } from '@/components/icons';
import { cn } from '@/lib/utils';

const CATEGORY_QUICK_LINKS = [
  'Electronics', 'Fashion', 'Home', 'Sports', 'Books', 'Beauty',
] as const;

function Highlight({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <>{text}</>;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="rounded-sm bg-foreground/15 text-foreground not-italic">
        {text.slice(idx, idx + query.length)}
      </mark>
      {text.slice(idx + query.length)}
    </>
  );
}

function SearchModal({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState('');
  const [cursor, setCursor] = useState(-1);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [triggerSearch, { data: searchData }] = useLazyGetProductsQuery();
  const results: ApiProduct[] = query.trim() ? (searchData?.data ?? []) : [];

  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 30);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!query.trim()) return;
    debounceRef.current = setTimeout(() => {
      void triggerSearch({ search: query.trim(), limit: 6 });
    }, 250);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query, triggerSearch]);

  const hasViewAll = query.trim().length > 0;
  const totalItems = results.length + (hasViewAll ? 1 : 0);

  const goTo = useCallback((id: string) => {
    onClose();
    navigate(`/products/${id}`);
  }, [onClose, navigate]);

  const viewAll = useCallback(() => {
    onClose();
    navigate(`/products?q=${encodeURIComponent(query.trim())}`);
  }, [onClose, navigate, query]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setCursor(c => Math.min(c + 1, totalItems - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setCursor(c => Math.max(c - 1, 0));
    } else if (e.key === 'Enter') {
      if (cursor >= 0 && cursor < results.length) {
        goTo(results[cursor].id);
      } else if (cursor === results.length && hasViewAll) {
        viewAll();
      } else if (hasViewAll && results.length > 0) {
        viewAll();
      }
    }
  };

  return (
    <>
      <div
        aria-hidden
        onClick={onClose}
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search"
        className="fixed left-1/2 top-[18vh] z-50 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 overflow-hidden rounded-xl border border-border bg-background shadow-2xl"
      >
        <div className="flex items-center gap-3 border-b border-border px-4 py-3">
          <Search className="size-4 shrink-0 text-muted-foreground" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => { setQuery(e.target.value); setCursor(-1); }}
            onKeyDown={handleKeyDown}
            placeholder="Search products, categories…"
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            autoComplete="off"
            spellCheck={false}
          />
          {query ? (
            <button
              onClick={() => { setQuery(''); setCursor(-1); inputRef.current?.focus(); }}
              className="rounded-md p-0.5 text-muted-foreground hover:text-foreground"
              aria-label="Clear"
            >
              <X className="size-4" />
            </button>
          ) : (
            <kbd className="hidden rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground sm:block">
              Esc
            </kbd>
          )}
        </div>

        {query.trim() ? (
          results.length > 0 ? (
            <ul className="max-h-80 overflow-y-auto py-1">
              {results.map((p, i) => {
                const Icon = productIcons[p.iconKey] ?? ShoppingBag;
                const active = cursor === i;
                return (
                  <li key={p.id}>
                    <button
                      onClick={() => goTo(p.id)}
                      onMouseEnter={() => setCursor(i)}
                      className={cn(
                        'flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors',
                        active ? 'bg-muted' : 'hover:bg-muted/50',
                      )}
                    >
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-md border border-border bg-muted">
                        <Icon className="size-4 text-muted-foreground" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">
                          <Highlight text={p.name} query={query} />
                        </p>
                        <p className="text-xs capitalize text-muted-foreground">{p.category}</p>
                      </div>
                      <span className="shrink-0 text-sm font-semibold">${p.price.toFixed(2)}</span>
                    </button>
                  </li>
                );
              })}
              <li className="border-t border-border">
                <button
                  onClick={viewAll}
                  onMouseEnter={() => setCursor(results.length)}
                  className={cn(
                    'flex w-full items-center justify-between px-4 py-2.5 text-sm transition-colors',
                    cursor === results.length
                      ? 'bg-muted text-foreground'
                      : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground',
                  )}
                >
                  <span>
                    View all results for{' '}
                    <span className="font-medium">"{query}"</span>
                  </span>
                  <ArrowRight className="size-4" />
                </button>
              </li>
            </ul>
          ) : (
            <div className="flex flex-col items-center gap-2 py-10 text-center">
              <Search className="size-8 text-muted-foreground/40" />
              <p className="text-sm font-medium">No results for "{query}"</p>
              <p className="text-xs text-muted-foreground">
                Try a different product name or category.
              </p>
            </div>
          )
        ) : (
          <div className="p-4">
            <p className="mb-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Browse categories
            </p>
            <div className="flex flex-wrap gap-2">
              {CATEGORY_QUICK_LINKS.map(cat => (
                <button
                  key={cat}
                  onClick={() => {
                    onClose();
                    navigate(`/products?category=${cat.toLowerCase()}`);
                  }}
                  className="rounded-full border border-border px-3 py-1 text-xs transition-colors hover:bg-muted hover:text-foreground"
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export function SearchButton() {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    const handler = (e: globalThis.KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(prev => !prev);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  useEffect(() => {
    if (!open) return;
    const handler = (e: globalThis.KeyboardEvent) => { if (e.key === 'Escape') close(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, close]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Search (Ctrl+K)"
        title="Search (Ctrl+K)"
        className="rounded-md p-1.5 text-muted-foreground transition-colors hover:text-foreground"
      >
        <Search className="size-5" />
      </button>
      {open && <SearchModal onClose={close} />}
    </>
  );
}
