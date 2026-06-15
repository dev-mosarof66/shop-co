import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Loader2, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { SellerLayout } from '@/components/seller/SellerLayout';
import { sellerApi, type SellerProduct, type SellerProductInput } from '@/lib/seller-api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useGetCategoriesQuery } from '@/store/api';

const ICON_KEYS = ['package', 'shirt', 'monitor', 'home', 'dumbbell', 'book-open', 'sparkles', 'box'];
const BADGES = ['', 'bestSeller', 'new', 'sale'];

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium">{label}</Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

export default function SellerProductFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { data: categories = [] } = useGetCategoriesQuery();

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<SellerProductInput>({
    name: '',
    description: '',
    price: 0,
    originalPrice: null,
    stock: 0,
    lowStockThreshold: 5,
    sku: '',
    categoryId: null,
    iconKey: 'package',
    badge: null,
    isFeatured: false,
    isActive: true,
    features: [],
    specs: {},
  });
  const [featuresText, setFeaturesText] = useState('');
  const [errors, setErrors] = useState<Partial<Record<keyof SellerProductInput, string>>>({});

  useEffect(() => {
    if (!isEdit || !id) return;
    sellerApi.getProducts(1, 100)
      .then(res => {
        const p = res.data.find((x: SellerProduct) => x.id === id);
        if (!p) { toast.error('Product not found'); navigate('/seller/products'); return; }
        setForm({
          name: p.name,
          description: p.description,
          price: p.price,
          originalPrice: p.originalPrice,
          stock: p.stock,
          lowStockThreshold: p.lowStockThreshold,
          sku: p.sku,
          categoryId: p.categoryId,
          iconKey: p.iconKey ?? 'package',
          badge: p.badge,
          isFeatured: p.isFeatured,
          isActive: p.isActive,
          features: p.features ?? [],
          specs: p.specs ?? {},
        });
        setFeaturesText((p.features ?? []).join('\n'));
      })
      .catch(e => toast.error(e.message))
      .finally(() => setLoading(false));
  }, [id, isEdit, navigate]);

  const set = <K extends keyof SellerProductInput>(k: K, v: SellerProductInput[K]) =>
    setForm(f => ({ ...f, [k]: v }));

  const validate = () => {
    const e: typeof errors = {};
    if (!form.name.trim()) e.name = 'Required';
    if (!form.sku.trim()) e.sku = 'Required';
    if (form.price <= 0) e.price = 'Must be > 0';
    if (form.stock < 0) e.stock = 'Must be ≥ 0';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    const payload = {
      ...form,
      features: featuresText.split('\n').map(s => s.trim()).filter(Boolean),
    };
    try {
      if (isEdit && id) {
        await sellerApi.updateProduct(id, payload);
        toast.success('Product updated');
      } else {
        await sellerApi.createProduct(payload);
        toast.success('Product created');
      }
      navigate('/seller/products');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <SellerLayout title={isEdit ? 'Edit Product' : 'New Product'}>
        <div className="flex h-48 items-center justify-center">
          <Loader2 className="size-5 animate-spin text-muted-foreground" />
        </div>
      </SellerLayout>
    );
  }

  return (
    <SellerLayout title={isEdit ? 'Edit Product' : 'New Product'}>
      <div className="mb-4">
        <button
          onClick={() => navigate('/seller/products')}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" /> Back to products
        </button>
      </div>

      <form onSubmit={handleSubmit} className="mx-auto max-w-2xl space-y-6">
        {/* Basic info */}
        <section className="rounded-xl border border-border bg-card p-5 space-y-4">
          <h2 className="text-sm font-semibold">Basic Information</h2>
          <Field label="Product name *" error={errors.name}>
            <Input value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Wireless Headphones" />
          </Field>
          <Field label="Description">
            <textarea
              value={form.description}
              onChange={e => set('description', e.target.value)}
              rows={4}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              placeholder="Describe your product…"
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Features (one per line)">
              <textarea
                value={featuresText}
                onChange={e => setFeaturesText(e.target.value)}
                rows={3}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                placeholder="Fast charging&#10;Noise cancellation"
              />
            </Field>
            <Field label="Category">
              <select
                value={form.categoryId ?? ''}
                onChange={e => set('categoryId', e.target.value || null)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="">No category</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </Field>
          </div>
        </section>

        {/* Pricing */}
        <section className="rounded-xl border border-border bg-card p-5 space-y-4">
          <h2 className="text-sm font-semibold">Pricing & Inventory</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Price ($) *" error={errors.price}>
              <Input type="number" min="0" step="0.01" value={form.price}
                onChange={e => set('price', parseFloat(e.target.value) || 0)} />
            </Field>
            <Field label="Original price ($)">
              <Input type="number" min="0" step="0.01" value={form.originalPrice ?? ''}
                onChange={e => set('originalPrice', e.target.value ? parseFloat(e.target.value) : null)}
                placeholder="Leave blank if no discount" />
            </Field>
            <Field label="SKU *" error={errors.sku}>
              <Input value={form.sku} onChange={e => set('sku', e.target.value)} placeholder="PROD-001" />
            </Field>
            <Field label="Stock quantity *" error={errors.stock}>
              <Input type="number" min="0" value={form.stock}
                onChange={e => set('stock', parseInt(e.target.value) || 0)} />
            </Field>
            <Field label="Low stock threshold">
              <Input type="number" min="0" value={form.lowStockThreshold ?? 5}
                onChange={e => set('lowStockThreshold', parseInt(e.target.value) || 0)} />
            </Field>
          </div>
        </section>

        {/* Display */}
        <section className="rounded-xl border border-border bg-card p-5 space-y-4">
          <h2 className="text-sm font-semibold">Display</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Icon">
              <select
                value={form.iconKey ?? 'package'}
                onChange={e => set('iconKey', e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                {ICON_KEYS.map(k => <option key={k} value={k}>{k}</option>)}
              </select>
            </Field>
            <Field label="Badge">
              <select
                value={form.badge ?? ''}
                onChange={e => set('badge', e.target.value || null)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                {BADGES.map(b => <option key={b} value={b}>{b || 'None'}</option>)}
              </select>
            </Field>
          </div>
          <div className="flex flex-wrap gap-6">
            <label className="flex cursor-pointer items-center gap-2 text-sm">
              <input type="checkbox" checked={form.isFeatured ?? false}
                onChange={e => set('isFeatured', e.target.checked)}
                className="size-4 rounded border-border" />
              Featured product
            </label>
            <label className="flex cursor-pointer items-center gap-2 text-sm">
              <input type="checkbox" checked={form.isActive ?? true}
                onChange={e => set('isActive', e.target.checked)}
                className="size-4 rounded border-border" />
              Active (visible in store)
            </label>
          </div>
        </section>

        <div className="flex items-center justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => navigate('/seller/products')}>
            Cancel
          </Button>
          <Button type="submit" disabled={saving}>
            {saving && <Loader2 className="mr-1.5 size-3.5 animate-spin" />}
            {isEdit ? 'Save changes' : 'Create product'}
          </Button>
        </div>
      </form>
    </SellerLayout>
  );
}
