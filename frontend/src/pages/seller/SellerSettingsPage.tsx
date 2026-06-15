import { useEffect, useState, type FormEvent } from 'react';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { SellerLayout } from '@/components/seller/SellerLayout';
import { sellerApi, type SellerSettings } from '@/lib/seller-api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function SellerSettingsPage() {
  const [settings, setSettings] = useState<SellerSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ firstName: '', lastName: '', phone: '', avatar: '' });

  useEffect(() => {
    sellerApi.getSettings()
      .then(s => {
        setSettings(s);
        setForm({
          firstName: s.firstName ?? '',
          lastName: s.lastName ?? '',
          phone: s.phone ?? '',
          avatar: s.avatar ?? '',
        });
      })
      .catch(e => toast.error(e.message))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await sellerApi.updateSettings(form);
      setSettings(updated);
      toast.success('Settings saved');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <SellerLayout title="Settings">
        <div className="flex h-48 items-center justify-center">
          <Loader2 className="size-5 animate-spin text-muted-foreground" />
        </div>
      </SellerLayout>
    );
  }

  return (
    <SellerLayout title="Settings">
      <div className="mx-auto max-w-lg space-y-6">

        {/* Account info */}
        <section className="rounded-xl border border-border bg-card p-5">
          <h2 className="mb-4 text-sm font-semibold">Account Information</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label className="text-xs">First name</Label>
                <Input
                  value={form.firstName}
                  onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Last name</Label>
                <Input
                  value={form.lastName}
                  onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Email</Label>
              <Input value={settings?.email ?? ''} disabled className="opacity-60" />
              <p className="text-[11px] text-muted-foreground">Email cannot be changed here</p>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Phone</Label>
              <Input
                type="tel"
                value={form.phone}
                onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                placeholder="+1 (555) 000-0000"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Avatar URL</Label>
              <Input
                value={form.avatar}
                onChange={e => setForm(f => ({ ...f, avatar: e.target.value }))}
                placeholder="https://example.com/avatar.jpg"
              />
              {form.avatar && (
                <img
                  src={form.avatar}
                  alt="Avatar preview"
                  className="mt-2 size-12 rounded-full border border-border object-cover"
                  onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
              )}
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={saving} size="sm">
                {saving && <Loader2 className="mr-1.5 size-3.5 animate-spin" />}
                Save changes
              </Button>
            </div>
          </form>
        </section>

        {/* Role info */}
        <section className="rounded-xl border border-border bg-card p-5">
          <h2 className="mb-3 text-sm font-semibold">Account Role</h2>
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-foreground px-3 py-1 text-xs font-medium text-background capitalize">
              {settings?.role ?? 'vendor'}
            </span>
            <p className="text-xs text-muted-foreground">
              You have seller access to manage products and view orders.
            </p>
          </div>
        </section>
      </div>
    </SellerLayout>
  );
}
