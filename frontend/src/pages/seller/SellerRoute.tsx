import { Navigate } from 'react-router-dom';
import { useSession } from '@/lib/auth-client';
import { Loader2 } from 'lucide-react';

export function SellerRoute({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!session) return <Navigate to="/login" replace />;

  const role = (session.user as any).role;
  if (role !== 'vendor' && role !== 'admin') return <Navigate to="/" replace />;

  return <>{children}</>;
}
