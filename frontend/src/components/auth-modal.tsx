import { useState } from 'react';
import { ShoppingBag, Eye, EyeOff } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { signIn, signUp } from '@/lib/auth-client';
import { useAuthModal } from '@/lib/auth-modal';
import { useI18n } from '@/lib/i18n';

export function AuthModal() {
  const { isOpen, tab, setTab, close } = useAuthModal();
  const { t } = useI18n();

  const [siForm,    setSiForm]    = useState({ email: '', password: '' });
  const [siError,   setSiError]   = useState('');
  const [siLoading, setSiLoading] = useState(false);
  const [siShowPw,  setSiShowPw]  = useState(false);

  const [regForm,    setRegForm]    = useState({ firstName: '', lastName: '', email: '', password: '' });
  const [regError,   setRegError]   = useState('');
  const [regLoading, setRegLoading] = useState(false);
  const [regShowPw,  setRegShowPw]  = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setSiError(''); setSiLoading(true);
    const { error } = await signIn.email({ email: siForm.email, password: siForm.password });
    if (error) { setSiError(error.message || 'Authentication failed'); setSiLoading(false); return; }
    close();
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(''); setRegLoading(true);
    const { error } = await signUp.email({
      email: regForm.email, password: regForm.password,
      name: `${regForm.firstName} ${regForm.lastName}`.trim(),
      firstName: regForm.firstName, lastName: regForm.lastName,
    });
    if (error) { setRegError(error.message || 'Registration failed'); setRegLoading(false); return; }
    close();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && close()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="items-center text-center">
          <div className="mb-1 flex size-10 items-center justify-center rounded-xl bg-foreground">
            <ShoppingBag className="size-5 text-background" />
          </div>
          <DialogTitle className="text-xl">ShopCo</DialogTitle>
          <DialogDescription>
            {tab === 'signIn' ? t.login.sub : t.register.sub}
          </DialogDescription>
        </DialogHeader>

        <Tabs value={tab} onValueChange={(v) => setTab(v as 'signIn' | 'register')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signIn">{t.login.title}</TabsTrigger>
            <TabsTrigger value="register">{t.register.title}</TabsTrigger>
          </TabsList>

          {/* ── Sign in ── */}
          <TabsContent value="signIn" className="mt-0">
            <form onSubmit={handleSignIn} className="space-y-4 pt-4">
              <div className="space-y-1.5">
                <Label htmlFor="si-email">{t.login.email}</Label>
                <Input id="si-email" type="email" placeholder="you@example.com" required
                  value={siForm.email} onChange={(e) => setSiForm(p => ({ ...p, email: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="si-password">{t.login.password}</Label>
                <div className="relative">
                  <Input id="si-password" type={siShowPw ? 'text' : 'password'} placeholder="••••••••"
                    required className="pr-9"
                    value={siForm.password} onChange={(e) => setSiForm(p => ({ ...p, password: e.target.value }))} />
                  <button type="button" onClick={() => setSiShowPw(p => !p)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label={siShowPw ? 'Hide password' : 'Show password'}>
                    {siShowPw ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>
              {siError && <p className="text-sm text-destructive">{siError}</p>}
              <Button type="submit" className="w-full" disabled={siLoading}>
                {siLoading ? t.login.loading : t.login.submit}
              </Button>
            </form>
            <p className="mt-4 text-center text-sm text-muted-foreground">
              {t.login.noAccount}{' '}
              <button type="button" onClick={() => setTab('register')}
                className="font-medium text-foreground underline-offset-4 hover:underline">
                {t.login.register}
              </button>
            </p>
          </TabsContent>

          {/* ── Register ── */}
          <TabsContent value="register" className="mt-0">
            <form onSubmit={handleRegister} className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="r-first">{t.register.firstName}</Label>
                  <Input id="r-first" type="text" required
                    value={regForm.firstName} onChange={(e) => setRegForm(p => ({ ...p, firstName: e.target.value }))} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="r-last">{t.register.lastName}</Label>
                  <Input id="r-last" type="text" required
                    value={regForm.lastName} onChange={(e) => setRegForm(p => ({ ...p, lastName: e.target.value }))} />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="r-email">{t.register.email}</Label>
                <Input id="r-email" type="email" placeholder="you@example.com" required
                  value={regForm.email} onChange={(e) => setRegForm(p => ({ ...p, email: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="r-password">{t.register.password}</Label>
                <div className="relative">
                  <Input id="r-password" type={regShowPw ? 'text' : 'password'} placeholder="••••••••"
                    minLength={8} required className="pr-9"
                    value={regForm.password} onChange={(e) => setRegForm(p => ({ ...p, password: e.target.value }))} />
                  <button type="button" onClick={() => setRegShowPw(p => !p)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label={regShowPw ? 'Hide password' : 'Show password'}>
                    {regShowPw ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>
              {regError && <p className="text-sm text-destructive">{regError}</p>}
              <Button type="submit" className="w-full" disabled={regLoading}>
                {regLoading ? t.register.loading : t.register.submit}
              </Button>
            </form>
            <p className="mt-4 text-center text-sm text-muted-foreground">
              {t.register.hasAccount}{' '}
              <button type="button" onClick={() => setTab('signIn')}
                className="font-medium text-foreground underline-offset-4 hover:underline">
                {t.register.signIn}
              </button>
            </p>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
