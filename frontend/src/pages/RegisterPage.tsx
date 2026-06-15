import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { Logo } from '@/components/logo';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { LanguageSwitcher } from '@/components/language-switcher';
import { signUp } from '@/lib/auth-client';
import { useI18n } from '@/lib/i18n';

export default function RegisterPage() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setLoading(true);
    const { error: err } = await signUp.email({
      email: form.email, password: form.password,
      name: `${form.firstName} ${form.lastName}`.trim(),
      firstName: form.firstName, lastName: form.lastName,
    });
    if (err) { setError(err.message || 'Registration failed'); setLoading(false); return; }
    navigate('/');
  };

  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center bg-muted/30 p-4">
      <div className="absolute right-4 top-4 flex items-center gap-2">
        <LanguageSwitcher />
        <ThemeToggle />
      </div>

      <Link to="/" className="mb-8 text-foreground">
        <Logo />
      </Link>

      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">{t.register.title}</CardTitle>
          <CardDescription>{t.register.sub}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="firstName">{t.register.firstName}</Label>
                <Input id="firstName" type="text" required value={form.firstName} onChange={set('firstName')} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="lastName">{t.register.lastName}</Label>
                <Input id="lastName" type="text" required value={form.lastName} onChange={set('lastName')} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">{t.register.email}</Label>
              <Input id="email" type="email" placeholder="you@example.com" required
                value={form.email} onChange={set('email')} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">{t.register.password}</Label>
              <div className="relative">
                <Input id="password" type={showPassword ? 'text' : 'password'} placeholder="••••••••"
                  minLength={8} required className="pr-9"
                  value={form.password} onChange={set('password')} />
                <button type="button" onClick={() => setShowPassword(p => !p)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}>
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? t.register.loading : t.register.submit}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            {t.register.hasAccount}{' '}
            <Link to="/login" className="font-medium text-foreground underline-offset-4 hover:underline">
              {t.register.signIn}
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
